import { readFile, writeFile, mkdir, readdir, stat, copyFile } from 'node:fs/promises';
import path from 'node:path';
import type { ProcessedArtifact } from '../manifest/processor.js';
import type { ResolvedConfig } from '../cli/config.js';
import { contextFromResolved } from '../template/fromResolved.js';
import type { TemplateContext } from '../template/context.js';
import { renderTemplateString, renderJsonTemplate } from '../template/renderer.js';

export type ExecOptions = {
  cwd?: string;
  templatesRoot?: string;
  log?: (msg: string) => void;
  onConflict?: (relTargetPath: string) => Promise<'overwrite' | 'skip'> | 'overwrite' | 'skip';
};

const ensureDir = async (p: string) => {
  await mkdir(p, { recursive: true });
};

const fileExists = async (p: string) => {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
};

const backupIfNeeded = async (
  target: string,
  cwd: string,
  resolved: ResolvedConfig,
): Promise<void> => {
  if (!resolved.backupEnabled) return;
  if (!(await fileExists(target))) return;
  const rel = path.relative(cwd, target);
  const backupPath = path.resolve(cwd, resolved.backupDir, rel);
  await ensureDir(path.dirname(backupPath));
  await copyFile(target, backupPath);
};

const writeTextFile = async (
  target: string,
  content: string,
  cwd: string,
  resolved: ResolvedConfig,
  policy: ResolvedConfig['effectiveOverwrite'],
  opts: ExecOptions,
): Promise<'written' | 'skipped'> => {
  const exists = await fileExists(target);
  if (exists && policy === 'skip') return 'skipped';
  if (exists && policy === 'prompt') {
    const rel = path.relative(cwd, target);
    const decision = opts.onConflict ? await opts.onConflict(rel) : 'skip';
    if (decision === 'skip') return 'skipped';
    // else 'overwrite'
  }
  if (exists) await backupIfNeeded(target, cwd, resolved);
  await ensureDir(path.dirname(target));
  await writeFile(target, content, 'utf8');
  return 'written';
};

const copyStaticFile = async (
  src: string,
  dest: string,
  cwd: string,
  resolved: ResolvedConfig,
  policy: ResolvedConfig['effectiveOverwrite'],
  opts: ExecOptions,
): Promise<'written' | 'skipped'> => {
  const exists = await fileExists(dest);
  if (exists && policy === 'skip') return 'skipped';
  if (exists && policy === 'prompt') {
    const rel = path.relative(cwd, dest);
    const decision = opts.onConflict ? await opts.onConflict(rel) : 'skip';
    if (decision === 'skip') return 'skipped';
  }
  if (exists) await backupIfNeeded(dest, cwd, resolved);
  await ensureDir(path.dirname(dest));
  await copyFile(src, dest);
  return 'written';
};

const processTemplateFile = async (
  srcAbs: string,
  outAbs: string,
  resolved: ResolvedConfig,
  ctx: TemplateContext,
  cwd: string,
): Promise<string> => {
  const raw = await readFile(srcAbs, 'utf8');
  if (outAbs.endsWith('.json')) {
    const obj = renderJsonTemplate(raw, resolved.agent, ctx);
    const text = JSON.stringify(obj, null, 2) + '\n';
    return text;
  }
  // default: treat as text/markdown
  return renderTemplateString(raw, resolved.agent, ctx);
};

const walkDir = async (dir: string): Promise<string[]> => {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await walkDir(full);
      out.push(...sub);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
};

const transformTplOut = (relPath: string): { outName: string; mode: 'json' | 'text' } => {
  const dir = path.dirname(relPath);
  const base = path.basename(relPath);
  if (base.endsWith('.tpl.json')) {
    const replaced = base.slice(0, -('.tpl.json'.length)) + '.json';
    return { outName: dir === '.' ? replaced : path.join(dir, replaced), mode: 'json' };
  }
  if (base.endsWith('.tpl.md')) {
    const replaced = base.slice(0, -('.tpl.md'.length)) + '.md';
    return { outName: dir === '.' ? replaced : path.join(dir, replaced), mode: 'text' };
  }
  if (base.endsWith('.tpl.toml')) {
    const replaced = base.slice(0, -('.tpl.toml'.length)) + '.toml';
    return { outName: dir === '.' ? replaced : path.join(dir, replaced), mode: 'text' };
  }
  return { outName: relPath, mode: 'text' };
};

export const executeProcessedArtifacts = async (
  items: ProcessedArtifact[],
  resolved: ResolvedConfig,
  opts: ExecOptions = {},
): Promise<{ written: number; skipped: number }> => {
  const cwd = opts.cwd ?? process.cwd();
  const templatesRoot = opts.templatesRoot ?? cwd;
  const policy = resolved.effectiveOverwrite;
  const ctx = contextFromResolved(resolved);
  let written = 0;
  let skipped = 0;

  for (const it of items) {
    if (it.source.type === 'staticDir') {
      const srcDir = path.resolve(templatesRoot, it.source.from);
      const dstDir = path.resolve(cwd, it.source.toDir);
      const files = await walkDir(srcDir);
      for (const f of files) {
        const rel = path.relative(srcDir, f);
        const destFile = path.join(dstDir, rel);
        const res = await copyStaticFile(f, destFile, cwd, resolved, policy, opts);
        if (res === 'written') written++; else skipped++;
      }
      continue;
    }

    if (it.source.type === 'templateFile') {
      const srcAbs = path.resolve(templatesRoot, it.source.from);
      const dstDir = path.resolve(cwd, it.source.toDir);
      const outAbs = path.join(dstDir, it.source.outFile);
      const content = await processTemplateFile(srcAbs, outAbs, resolved, ctx, cwd);
      const res = await writeTextFile(outAbs, content, cwd, resolved, policy, opts);
      if (res === 'written') written++; else skipped++;
      continue;
    }

    if (it.source.type === 'templateDir') {
      const fromDir = path.resolve(templatesRoot, it.source.fromDir);
      const toDir = path.resolve(cwd, it.source.toDir);
      const files = await walkDir(fromDir);
      for (const src of files) {
        const rel = path.relative(fromDir, src);
        const { outName, mode } = transformTplOut(rel);
        const outAbs = path.join(toDir, outName);
        if (mode === 'json') {
          const raw = await readFile(src, 'utf8');
          const obj = renderJsonTemplate(raw, resolved.agent, ctx);
          const text = JSON.stringify(obj, null, 2) + '\n';
          const res = await writeTextFile(outAbs, text, cwd, resolved, policy, opts);
          if (res === 'written') written++; else skipped++;
        } else {
          const raw = await readFile(src, 'utf8');
          const text = renderTemplateString(raw, resolved.agent, ctx);
          const res = await writeTextFile(outAbs, text, cwd, resolved, policy, opts);
          if (res === 'written') written++; else skipped++;
        }
      }
      continue;
    }
  }

  return { written, skipped };
};
