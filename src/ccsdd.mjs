#!/usr/bin/env node

/**
 * CCSDD (Claude Code SDD) - Cross-platform CLI for Claude Code Spec-Driven Development
 * 
 * Provides unified file system operations for Windows, Linux, and macOS
 * Used by Claude Code's /kiro:* commands for spec-driven development workflows
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Version info
const VERSION = '0.0.1';

// ============================================================================
// Command Functions
// ============================================================================

/**
 * Check if a file exists
 */
export function checkFile(filePath) {
  if (fs.existsSync(filePath)) {
    console.log('✅ EXISTS - Will be updated preserving custom content');
  } else {
    console.log('📝 Not found - Will be created');
  }
}

/**
 * Count custom steering files (excluding default ones)
 */
export function countCustomSteering() {
  const steeringDir = '.kiro/steering';
  if (!fs.existsSync(steeringDir)) {
    console.log('📋 No steering directory yet');
    return;
  }

  const excludeFiles = ['product.md', 'tech.md', 'structure.md'];
  const files = fs.readdirSync(steeringDir)
    .filter(file => file.endsWith('.md'))
    .filter(file => !excludeFiles.includes(file));

  if (files.length > 0) {
    console.log(`🔧 ${files.length} custom file(s) found - Will be preserved`);
  } else {
    console.log('📋 No custom files');
  }
}

/**
 * Count custom steering files and return number only
 */
export function countCustomSteeringNumber() {
  const steeringDir = '.kiro/steering';
  if (!fs.existsSync(steeringDir)) {
    console.log('0');
    return;
  }

  const excludeFiles = ['product.md', 'tech.md', 'structure.md'];
  const files = fs.readdirSync(steeringDir)
    .filter(file => file.endsWith('.md'))
    .filter(file => !excludeFiles.includes(file));

  console.log(files.length.toString());
}

/**
 * Find project source files
 */
export function findProjectFiles() {
  const extensions = ['.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.go', '.rs', '.c', '.cpp', '.h', '.html', '.css', '.md', ".cs"];
  const excludeDirs = ['node_modules', '.git', 'dist'];

  function findFiles(dir, files = []) {
    if (excludeDirs.includes(path.basename(dir))) return files;

    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !excludeDirs.includes(item)) {
          findFiles(fullPath, files);
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath.replace(/\\/g, '/'));
        }
      }
    } catch (err) {
      // Ignore directory read errors
    }
    return files;
  }

  const files = findFiles('.');
  if (files.length > 0) {
    console.log(files.join('\n'));
  } else {
    console.log('No source files found');
  }
}

/**
 * Find configuration files
 */
export function findConfigFiles() {
  const configFiles = [
    'package.json', 'requirements.txt', 'pom.xml',
    'Cargo.toml', 'go.mod', 'pyproject.toml', 'tsconfig.json'
  ];

  function findConfigs(dir, depth = 0, maxDepth = 3, files = []) {
    if (depth > maxDepth) return files;

    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') {
          findConfigs(fullPath, depth + 1, maxDepth, files);
        } else if (stat.isFile() && configFiles.includes(item)) {
          files.push(fullPath.replace(/\\/g, '/'));
        }
      }
    } catch (err) {
      // Ignore errors
    }
    return files;
  }

  const files = findConfigs('.');
  if (files.length > 0) {
    console.log(files.join('\n'));
  } else {
    console.log('No config files found');
  }
}

/**
 * Find documentation files
 */
export function findDocs() {
  const docPatterns = ['README', 'CHANGELOG', 'LICENSE'];
  const excludeDirs = ['node_modules', '.git', '.kiro'];

  function findDocFiles(dir, depth = 0, maxDepth = 3, files = []) {
    if (depth > maxDepth) return files;

    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !excludeDirs.includes(item)) {
          findDocFiles(fullPath, depth + 1, maxDepth, files);
        } else if (stat.isFile()) {
          if (item.endsWith('.md') || docPatterns.some(p => item.startsWith(p))) {
            files.push(fullPath.replace(/\\/g, '/'));
          }
        }
      }
    } catch (err) {
      // Ignore errors
    }
    return files;
  }

  const files = findDocFiles('.');
  if (files.length > 0) {
    console.log(files.join('\n'));
  } else {
    console.log('No documentation files found');
  }
}

/**
 * List contents of a spec directory
 */
export function listSpecDir(specName) {
  const specDir = path.join('.kiro/specs', specName);
  if (!fs.existsSync(specDir)) {
    console.log(`Directory not found: ${specDir}`);
    return;
  }

  const items = fs.readdirSync(specDir);
  for (const item of items) {
    const fullPath = path.join(specDir, item);
    const stat = fs.statSync(fullPath);
    const type = stat.isDirectory() ? 'd' : '-';
    const size = stat.isDirectory() ? '-' : stat.size;
    const date = stat.mtime.toISOString().split('T')[0];
    console.log(`${type}rw-rw-rw- 1 user user ${size} ${date} ${item}`);
  }
}

/**
 * List all spec directories
 */
export function listAllSpecs() {
  const specsDir = '.kiro/specs';
  if (!fs.existsSync(specsDir)) {
    console.log('No specs directory found');
    return;
  }

  const items = fs.readdirSync(specsDir);
  for (const item of items) {
    const fullPath = path.join(specsDir, item);
    const stat = fs.statSync(fullPath);
    const type = stat.isDirectory() ? 'd' : '-';
    const size = stat.isDirectory() ? '-' : stat.size;
    const date = stat.mtime.toISOString().split('T')[0];
    console.log(`${type}rw-rw-rw- 1 user user ${size} ${date} ${item}`);
  }
}

/**
 * Find specs that are ready for implementation
 */
export function findActiveSpecs() {
  const specsDir = '.kiro/specs';
  if (!fs.existsSync(specsDir)) {
    return;
  }

  function findSpecs(dir, files = []) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        findSpecs(fullPath, files);
      } else if (item === 'spec.json') {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('"implementation_ready": true') ||
            content.includes('"implementation_ready":true')) {
            files.push(fullPath.replace(/\\/g, '/'));
          }
        } catch (err) {
          // Ignore errors
        }
      }
    }
    return files;
  }

  const files = findSpecs(specsDir);
  if (files.length > 0) {
    console.log(files.join('\n'));
  }
}

/**
 * List all steering files
 */
export function listSteeringFiles() {
  const steeringDir = '.kiro/steering';
  if (!fs.existsSync(steeringDir)) {
    console.log('No steering directory found');
    return;
  }

  const files = fs.readdirSync(steeringDir)
    .filter(file => file.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(steeringDir, file);
    const stat = fs.statSync(fullPath);
    const date = stat.mtime.toISOString().split('T')[0];
    console.log(`-rw-rw-rw- 1 user user ${stat.size} ${date} ${file}`);
  }
}

/**
 * Get last steering commit info (cross-platform)
 */
export function getLastSteeringCommit() {
  try {
    const result = execSync('git log -1 --oneline -- .kiro/steering/', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    process.stdout.write(result.trim() + '\n');
  } catch (error) {
    process.stdout.write('No previous steering commits\n');
  }
}

/**
 * Get commits since last steering update (cross-platform)
 */
export function getCommitsSinceLastSteering() {
  try {
    // Get last steering commit hash
    let lastCommit;
    try {
      lastCommit = execSync('git log -1 --format=%H -- .kiro/steering/', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();
    } catch {
      process.stdout.write('No previous steering update found\n');
      return;
    }

    if (!lastCommit) {
      process.stdout.write('No previous steering update found\n');
      return;
    }

    // Get commits since last steering update
    try {
      const commits = execSync(`git log --oneline ${lastCommit}..HEAD --max-count=20`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      if (commits.trim()) {
        process.stdout.write(commits.trim() + '\n');
      } else {
        process.stdout.write('No commits since last steering update\n');
      }
    } catch {
      process.stdout.write('Not a git repository\n');
    }
  } catch (error) {
    process.stdout.write('Not a git repository\n');
  }
}

/**
 * Get git working tree status (cross-platform)
 */
export function getGitStatus() {
  try {
    const result = execSync('git status --porcelain', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    if (result.trim()) {
      process.stdout.write(result.trim() + '\n');
    } else {
      process.stdout.write('Working tree clean\n');
    }
  } catch (error) {
    process.stdout.write('Not a git repository\n');
  }
}

/**
 * List directory contents (ls -la replacement for cross-platform)
 */
export function lsDir(dirPath = '.') {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory not found: ${dirPath}`);
      return;
    }

    const items = fs.readdirSync(dirPath);

    // Include . and .. for compatibility
    const allItems = ['.', '..', ...items];

    for (const item of allItems) {
      const fullPath = path.join(dirPath, item);
      let stat;

      try {
        // Handle . and .. specially
        if (item === '.') {
          stat = fs.statSync(dirPath);
        } else if (item === '..') {
          stat = fs.statSync(path.dirname(dirPath));
        } else {
          stat = fs.statSync(fullPath);
        }

        const type = stat.isDirectory() ? 'd' : '-';
        const perms = 'rwxrwxrwx';
        const size = stat.isDirectory() ? 4096 : stat.size;
        const date = stat.mtime.toISOString().split('T')[0];
        const time = stat.mtime.toTimeString().slice(0, 5);

        console.log(`${type}${perms} 1 user user ${size} ${date} ${time} ${item}`);
      } catch (err) {
        // If can't stat, show basic info
        console.log(`-????????? ? ? ? ? ? ${item}`);
      }
    }
  } catch (error) {
    console.log(`Error reading directory: ${error.message}`);
  }
}

/**
 * Find special directories (test, api, auth, etc.)
 */
export function findSpecialDirs() {
  const patterns = ['test', 'spec', 'api', 'auth', 'security'];
  const excludeDirs = ['node_modules', '.git'];

  function findDirs(dir, files = []) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (excludeDirs.includes(item)) continue;

        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          if (patterns.some(p => item.toLowerCase().includes(p))) {
            files.push(fullPath.replace(/\\/g, '/'));
          }
          findDirs(fullPath, files);
        }
      }
    } catch (err) {
      // Ignore errors
    }
    return files;
  }

  const dirs = findDirs('.');
  if (dirs.length > 0) {
    console.log(dirs.join('\n'));
  } else {
    console.log('No specialized directories found');
  }
}

/**
 * Find configuration pattern files (.rc, .config, etc.)
 */
export function findConfigPatterns() {
  const excludeDirs = ['node_modules'];

  function findConfigs(dir, files = []) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (excludeDirs.includes(item)) continue;

        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          findConfigs(fullPath, files);
        } else if (stat.isFile()) {
          if (item.includes('.config.') ||
            item.includes('rc.') ||
            item.startsWith('.') && item.endsWith('rc')) {
            files.push(fullPath.replace(/\\/g, '/'));
          }
        }
      }
    } catch (err) {
      // Ignore errors
    }
    return files;
  }

  const files = findConfigs('.');
  if (files.length > 0) {
    console.log(files.join('\n'));
  } else {
    console.log('No config files found');
  }
}

/**
 * Show help message
 */
export function showHelp() {
  console.log(`CCSDD v${VERSION}`);
  console.log('Cross-platform helper for Kiro spec-driven development\n');
  console.log('USAGE:');
  console.log('  ccsdd <command> [arguments]\n');
  console.log('COMMANDS:');
  console.log('  check-file <path>              Check if file exists');
  console.log('  count-custom-steering          Count custom steering files');
  console.log('  count-custom-steering-number   Count custom steering files (number only)');
  console.log('  find-project-files             Find source code files');
  console.log('  find-config-files              Find configuration files');
  console.log('  find-docs                      Find documentation files');
  console.log('  find-special-dirs              Find specialized directories');
  console.log('  find-config-patterns           Find config pattern files');
  console.log('  list-spec-dir <name>           List spec directory contents');
  console.log('  list-all-specs                 List all spec directories');
  console.log('  list-steering-files            List steering files');
  console.log('  find-active-specs              Find active specifications');
  console.log('');
  console.log('OPTIONS:');
  console.log('  --version, -v                  Show version');
  console.log('  --help, -h                     Show this help');
}

/**
 * Show version
 */
export function showVersion() {
  console.log(VERSION);
}

// ============================================================================
// Command Mapping
// ============================================================================

const helpers = {
  'check-file': checkFile,
  'count-custom-steering': countCustomSteering,
  'count-custom-steering-number': countCustomSteeringNumber,
  'find-project-files': findProjectFiles,
  'find-config-files': findConfigFiles,
  'find-docs': findDocs,
  'list-spec-dir': listSpecDir,
  'list-all-specs': listAllSpecs,
  'find-active-specs': findActiveSpecs,
  'list-steering-files': listSteeringFiles,
  'find-special-dirs': findSpecialDirs,
  'find-config-patterns': findConfigPatterns,
  'get-last-steering-commit': getLastSteeringCommit,
  'get-commits-since-steering': getCommitsSinceLastSteering,
  'get-git-status': getGitStatus,
  'ls-dir': lsDir
};

// ============================================================================
// CLI Entry Point
// ============================================================================

// Only run CLI if this is the main module
// Handle both direct execution and npm run/link scenarios
const isMainModule = import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === `file://${process.argv[1]}.mjs` ||
  process.argv[1].endsWith('ccsdd.mjs');

if (isMainModule) {
  const args = process.argv.slice(2);
  const command = args[0];
  const params = args.slice(1);

  if (!command || command === '--help' || command === '-h') {
    showHelp();
  } else if (command === '--version' || command === '-v') {
    showVersion();
  } else if (helpers[command]) {
    try {
      helpers[command](...params);
    } catch (error) {
      console.error(`Error executing ${command}:`, error.message);
      process.exit(1);
    }
  } else {
    console.error(`Unknown command: ${command}`);
    console.error('Run "ccsdd --help" for available commands');
    process.exit(1);
  }
}
