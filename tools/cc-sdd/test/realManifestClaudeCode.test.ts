import { describe, it, expect } from 'vitest';
import { runCli } from '../src/index';
import { mkdtemp, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const runtime = { platform: 'darwin' } as const;

const makeIO = () => {
  const logs: string[] = [];
  const errs: string[] = [];
  return {
    io: {
      log: (m: string) => logs.push(m),
      error: (m: string) => errs.push(m),
      exit: (_c: number) => {},
    },
    get logs() {
      return logs;
    },
    get errs() {
      return errs;
    },
  };
};

const mkTmp = async () => mkdtemp(join(tmpdir(), 'ccsdd-real-manifest-'));
const exists = async (p: string) => { try { await stat(p); return true; } catch { return false; } };

// vitest runs in tools/cc-sdd; repoRoot is two levels up
const repoRoot = join(process.cwd(), '..', '..');
const manifestPath = join(repoRoot, 'tools/cc-sdd/templates/manifests/claude-code.json');

describe('real claude-code manifest', () => {
  it('dry-run prints plan for claude-code.json with placeholders applied', async () => {
    const ctx = makeIO();
    const code = await runCli(['--dry-run', '--lang', 'en', '--manifest', manifestPath], runtime, ctx.io, {});
    expect(code).toBe(0);
    const out = ctx.logs.join('\n');
    expect(out).toMatch(/Plan \(dry-run\)/);
    expect(out).toContain('[templateDir] commands_os_mac: templates/agents/claude-code/commands/os-mac -> .claude/commands/kiro');
    expect(out).toContain('[templateFile] doc_main: templates/agents/claude-code/docs/CLAUDE/CLAUDE.en.tpl.md -> ./CLAUDE.md');
  });

  it('apply writes CLAUDE.md and command files to cwd', async () => {
    const cwd = await mkTmp();
    const ctx = makeIO();
    const code = await runCli(['--lang', 'en', '--manifest', manifestPath, '--overwrite=force'], runtime, ctx.io, {}, { cwd, templatesRoot: process.cwd() });
    expect(code).toBe(0);

    const doc = join(cwd, 'CLAUDE.md');
    expect(await exists(doc)).toBe(true);
    const text = await readFile(doc, 'utf8');
    expect(text).toMatch(/Claude Code Spec-Driven Development/);
    expect(text).toContain('Steering: `.kiro/steering/`');

    const cmd = join(cwd, '.claude/commands/kiro/spec-init.md');
    expect(await exists(cmd)).toBe(true);

    expect(ctx.logs.join('\n')).toMatch(/Setup completed ✅/);
  });
});

describe('real claude-code manifest (linux)', () => {
  const runtimeLinux = { platform: 'linux' } as const;

  it('dry-run prints plan including commands for linux via mac template', async () => {
    const ctx = makeIO();
    const code = await runCli(['--dry-run', '--lang', 'en', '--manifest', manifestPath], runtimeLinux, ctx.io, {});
    expect(code).toBe(0);
    const out = ctx.logs.join('\n');
    expect(out).toMatch(/Plan \(dry-run\)/);
    expect(out).toContain('[templateDir] commands_os_mac: templates/agents/claude-code/commands/os-mac -> .claude/commands/kiro');
    expect(out).toContain('[templateFile] doc_main: templates/agents/claude-code/docs/CLAUDE/CLAUDE.en.tpl.md -> ./CLAUDE.md');
  });

  it('apply writes CLAUDE.md and command files to cwd on linux', async () => {
    const cwd = await mkTmp();
    const ctx = makeIO();
    const code = await runCli(['--lang', 'en', '--manifest', manifestPath, '--overwrite=force'], runtimeLinux, ctx.io, {}, { cwd, templatesRoot: process.cwd() });
    expect(code).toBe(0);

    const doc = join(cwd, 'CLAUDE.md');
    expect(await exists(doc)).toBe(true);
    const text = await readFile(doc, 'utf8');
    expect(text).toMatch(/Claude Code Spec-Driven Development/);
    expect(text).toContain('Steering: `.kiro/steering/`');

    const cmd = join(cwd, '.claude/commands/kiro/spec-init.md');
    expect(await exists(cmd)).toBe(true);

    expect(ctx.logs.join('\n')).toMatch(/Setup completed ✅/);
  });
});
