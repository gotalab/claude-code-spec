import { test, expect } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Point to the ccsdd.mjs in src directory
const helperPath = path.resolve(__dirname, '../src/ccsdd.mjs');

/**
 * Generate unique test directory name
 */
const createTestDir = (testName) => {
  const timestamp = Date.now();
  const random = randomBytes(4).toString('hex');
  return path.join(__dirname, `test-${testName}-${timestamp}-${random}`);
};

/**
 * Create a minimal test directory with basic files
 */
const createMinimalTestEnv = (testDir) => {
  mkdirSync(testDir, { recursive: true });
  writeFileSync(path.join(testDir, 'package.json'), '{"name": "test-project"}');
  return testDir;
};

/**
 * Create test environment with kiro directories
 */
const createKiroTestEnv = (testDir) => {
  mkdirSync(path.join(testDir, '.kiro', 'steering'), { recursive: true });
  mkdirSync(path.join(testDir, '.kiro', 'specs', 'feature1'), { recursive: true });
  mkdirSync(path.join(testDir, '.kiro', 'specs', 'feature2'), { recursive: true });

  // Default steering files
  writeFileSync(path.join(testDir, '.kiro', 'steering', 'product.md'), '# Product');
  writeFileSync(path.join(testDir, '.kiro', 'steering', 'tech.md'), '# Tech');
  writeFileSync(path.join(testDir, '.kiro', 'steering', 'structure.md'), '# Structure');

  return testDir;
};

/**
 * Create comprehensive test environment
 */
const createFullTestEnv = (testDir) => {
  createMinimalTestEnv(testDir);
  createKiroTestEnv(testDir);

  // Create project structure
  mkdirSync(path.join(testDir, 'src', 'api'), { recursive: true });
  mkdirSync(path.join(testDir, 'src', 'auth'), { recursive: true });
  mkdirSync(path.join(testDir, 'test', 'unit'), { recursive: true });
  mkdirSync(path.join(testDir, 'docs'), { recursive: true });

  // Create source files
  writeFileSync(path.join(testDir, 'README.md'), '# Test Project');
  writeFileSync(path.join(testDir, 'app.js'), 'console.log("app");');
  writeFileSync(path.join(testDir, '.eslintrc'), '{}');
  writeFileSync(path.join(testDir, 'jest.config.js'), 'module.exports = {};');

  writeFileSync(path.join(testDir, 'src', 'index.ts'), 'export default {};');
  writeFileSync(path.join(testDir, 'src', 'utils.py'), 'def util(): pass');
  writeFileSync(path.join(testDir, 'src', 'api', 'routes.js'), '// routes');
  writeFileSync(path.join(testDir, 'src', 'babel.config.js'), 'module.exports = {};');

  writeFileSync(path.join(testDir, 'test', 'app.test.js'), '// tests');
  writeFileSync(path.join(testDir, 'docs', 'API.md'), '# API Docs');

  // Custom steering files
  writeFileSync(path.join(testDir, '.kiro', 'steering', 'custom1.md'), '# Custom 1');
  writeFileSync(path.join(testDir, '.kiro', 'steering', 'custom2.md'), '# Custom 2');

  // Spec files
  writeFileSync(path.join(testDir, '.kiro', 'specs', 'feature1', 'spec.json'),
    '{"implementation_ready": true, "name": "Feature 1"}');
  writeFileSync(path.join(testDir, '.kiro', 'specs', 'feature1', 'requirements.md'),
    '# Requirements');
  writeFileSync(path.join(testDir, '.kiro', 'specs', 'feature2', 'spec.json'),
    '{"implementation_ready": false, "name": "Feature 2"}');

  return testDir;
};

/**
 * Run ccsdd command
 */
const runHelper = (args = [], cwd = process.cwd()) => {
  return new Promise((resolve) => {
    const child = spawn('node', [helperPath, ...args], { cwd });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({ stdout, stderr, code });
    });
  });
};

/**
 * Cleanup test directory
 */
const cleanup = (testDir) => {
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true, force: true });
  }
};

// ============================================================================
// Version and Help Tests
// ============================================================================

test('ccsdd --version shows version', async () => {
  const { stdout } = await runHelper(['--version']);
  expect(stdout.trim()).toBe('0.0.1');
});

test('ccsdd -v shows version', async () => {
  const { stdout } = await runHelper(['-v']);
  expect(stdout.trim()).toBe('0.0.1');
});

test('ccsdd --help shows help', async () => {
  const { stdout } = await runHelper(['--help']);
  expect(stdout).toContain('CCSDD');
  expect(stdout).toContain('COMMANDS:');
  expect(stdout).toContain('check-file');
});

test('ccsdd with no command shows help', async () => {
  const { stdout } = await runHelper([]);
  expect(stdout).toContain('CCSDD');
});

test('ccsdd unknown-command reports error', async () => {
  const { stderr, code } = await runHelper(['unknown-command']);
  expect(stderr).toContain('Unknown command: unknown-command');
  expect(code).toBe(1);
});

// ============================================================================
// Check File Tests
// ============================================================================

test('ccsdd check-file with existing file', async () => {
  const testDir = createTestDir('check-file-exists');

  try {
    createMinimalTestEnv(testDir);
    const { stdout } = await runHelper(['check-file', 'package.json'], testDir);
    expect(stdout).toContain('✅ EXISTS');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd check-file with non-existing file', async () => {
  const testDir = createTestDir('check-file-missing');

  try {
    createMinimalTestEnv(testDir);
    const { stdout } = await runHelper(['check-file', 'non-existing.txt'], testDir);
    expect(stdout).toContain('📝 Not found');
  } finally {
    cleanup(testDir);
  }
});

// ============================================================================
// Custom Steering Tests
// ============================================================================

test('ccsdd count-custom-steering when no directory', async () => {
  const testDir = createTestDir('no-steering');

  try {
    createMinimalTestEnv(testDir);
    const { stdout } = await runHelper(['count-custom-steering'], testDir);
    expect(stdout).toContain('📋 No steering directory yet');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd count-custom-steering with only default files', async () => {
  const testDir = createTestDir('default-steering');

  try {
    createMinimalTestEnv(testDir);
    createKiroTestEnv(testDir);
    const { stdout } = await runHelper(['count-custom-steering'], testDir);
    expect(stdout).toContain('📋 No custom files');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd count-custom-steering finds 2 custom files', async () => {
  const testDir = createTestDir('custom-steering');

  try {
    createMinimalTestEnv(testDir);
    createKiroTestEnv(testDir);

    // Add custom files
    writeFileSync(path.join(testDir, '.kiro', 'steering', 'api.md'), '# API');
    writeFileSync(path.join(testDir, '.kiro', 'steering', 'security.md'), '# Security');

    const { stdout } = await runHelper(['count-custom-steering'], testDir);
    expect(stdout).toContain('🔧 2 custom file(s) found');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd count-custom-steering-number returns 0 when no directory', async () => {
  const testDir = createTestDir('no-steering-number');

  try {
    createMinimalTestEnv(testDir);
    const { stdout } = await runHelper(['count-custom-steering-number'], testDir);
    expect(stdout.trim()).toBe('0');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd count-custom-steering-number returns exact count', async () => {
  const testDir = createTestDir('steering-number');

  try {
    createMinimalTestEnv(testDir);
    createKiroTestEnv(testDir);

    // Add 3 custom files
    writeFileSync(path.join(testDir, '.kiro', 'steering', 'api.md'), '# API');
    writeFileSync(path.join(testDir, '.kiro', 'steering', 'security.md'), '# Security');
    writeFileSync(path.join(testDir, '.kiro', 'steering', 'performance.md'), '# Performance');

    const { stdout } = await runHelper(['count-custom-steering-number'], testDir);
    expect(stdout.trim()).toBe('3');
  } finally {
    cleanup(testDir);
  }
});

// ============================================================================
// Find Files Tests
// ============================================================================

test('ccsdd find-project-files finds source files', async () => {
  const testDir = createTestDir('project-files');

  try {
    createFullTestEnv(testDir);
    const { stdout } = await runHelper(['find-project-files'], testDir);
    expect(stdout).toContain('app.js');
    expect(stdout).toContain('src/index.ts');
    expect(stdout).toContain('src/utils.py');
    expect(stdout).toContain('src/api/routes.js');
    expect(stdout).toContain('test/app.test.js');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd find-project-files reports no files when empty', async () => {
  const testDir = createTestDir('empty-project');

  try {
    createMinimalTestEnv(testDir);
    const { stdout } = await runHelper(['find-project-files'], testDir);
    expect(stdout.trim()).toBe('No source files found');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd find-config-files finds configuration files', async () => {
  const testDir = createTestDir('config-files');

  try {
    createMinimalTestEnv(testDir);
    mkdirSync(path.join(testDir, 'src'), { recursive: true });
    writeFileSync(path.join(testDir, 'tsconfig.json'), '{}');
    writeFileSync(path.join(testDir, 'src', 'tsconfig.json'), '{}');

    const { stdout } = await runHelper(['find-config-files'], testDir);
    expect(stdout).toContain('package.json');
    expect(stdout).toContain('tsconfig.json');
    expect(stdout).toContain('src/tsconfig.json');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd find-docs finds documentation files', async () => {
  const testDir = createTestDir('docs');

  try {
    createMinimalTestEnv(testDir);
    mkdirSync(path.join(testDir, 'docs'), { recursive: true });
    writeFileSync(path.join(testDir, 'README.md'), '# Project');
    writeFileSync(path.join(testDir, 'CHANGELOG.md'), '# Changes');
    writeFileSync(path.join(testDir, 'docs', 'API.md'), '# API');

    const { stdout } = await runHelper(['find-docs'], testDir);
    expect(stdout).toContain('README.md');
    expect(stdout).toContain('CHANGELOG.md');
    expect(stdout).toContain('docs/API.md');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd find-special-dirs finds special directories', async () => {
  const testDir = createTestDir('special-dirs');

  try {
    createMinimalTestEnv(testDir);
    mkdirSync(path.join(testDir, 'src', 'api'), { recursive: true });
    mkdirSync(path.join(testDir, 'src', 'auth'), { recursive: true });
    mkdirSync(path.join(testDir, 'test', 'unit'), { recursive: true });

    const { stdout } = await runHelper(['find-special-dirs'], testDir);
    expect(stdout).toContain('test');
    expect(stdout).toContain('src/api');
    expect(stdout).toContain('src/auth');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd find-config-patterns finds config pattern files', async () => {
  const testDir = createTestDir('config-patterns');

  try {
    createMinimalTestEnv(testDir);
    mkdirSync(path.join(testDir, 'src'), { recursive: true });
    writeFileSync(path.join(testDir, '.eslintrc'), '{}');
    writeFileSync(path.join(testDir, 'jest.config.js'), '{}');
    writeFileSync(path.join(testDir, 'src', 'babel.config.js'), '{}');

    const { stdout } = await runHelper(['find-config-patterns'], testDir);
    expect(stdout).toContain('.eslintrc');
    expect(stdout).toContain('jest.config.js');
    expect(stdout).toContain('src/babel.config.js');
  } finally {
    cleanup(testDir);
  }
});

// ============================================================================
// Spec Directory Tests
// ============================================================================

test('ccsdd list-spec-dir with non-existing spec', async () => {
  const testDir = createTestDir('no-spec');

  try {
    createMinimalTestEnv(testDir);
    const { stdout } = await runHelper(['list-spec-dir', 'non-existing'], testDir);
    expect(stdout).toContain('Directory not found');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd list-spec-dir lists spec contents', async () => {
  const testDir = createTestDir('spec-contents');

  try {
    createMinimalTestEnv(testDir);
    mkdirSync(path.join(testDir, '.kiro', 'specs', 'feature1'), { recursive: true });
    writeFileSync(path.join(testDir, '.kiro', 'specs', 'feature1', 'spec.json'), '{}');
    writeFileSync(path.join(testDir, '.kiro', 'specs', 'feature1', 'requirements.md'), '# Reqs');
    mkdirSync(path.join(testDir, '.kiro', 'specs', 'feature1', 'tasks'), { recursive: true });

    const { stdout } = await runHelper(['list-spec-dir', 'feature1'], testDir);
    expect(stdout).toContain('spec.json');
    expect(stdout).toContain('requirements.md');
    expect(stdout).toContain('tasks');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd list-all-specs when no specs directory', async () => {
  const testDir = createTestDir('no-all-specs');

  try {
    createMinimalTestEnv(testDir);
    const { stdout } = await runHelper(['list-all-specs'], testDir);
    expect(stdout).toContain('No specs directory found');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd list-all-specs lists all specs', async () => {
  const testDir = createTestDir('all-specs');

  try {
    createMinimalTestEnv(testDir);
    mkdirSync(path.join(testDir, '.kiro', 'specs', 'feature1'), { recursive: true });
    mkdirSync(path.join(testDir, '.kiro', 'specs', 'feature2'), { recursive: true });
    writeFileSync(path.join(testDir, '.kiro', 'specs', 'readme.md'), '# Specs');

    const { stdout } = await runHelper(['list-all-specs'], testDir);
    expect(stdout).toContain('feature1');
    expect(stdout).toContain('feature2');
    expect(stdout).toContain('readme.md');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd find-active-specs finds specs with implementation_ready true', async () => {
  const testDir = createTestDir('active-specs');

  try {
    createMinimalTestEnv(testDir);
    mkdirSync(path.join(testDir, '.kiro', 'specs', 'feature1'), { recursive: true });
    mkdirSync(path.join(testDir, '.kiro', 'specs', 'feature2'), { recursive: true });

    writeFileSync(path.join(testDir, '.kiro', 'specs', 'feature1', 'spec.json'),
      '{"implementation_ready": true, "name": "Feature 1"}');
    writeFileSync(path.join(testDir, '.kiro', 'specs', 'feature2', 'spec.json'),
      '{"implementation_ready": false, "name": "Feature 2"}');

    const { stdout } = await runHelper(['find-active-specs'], testDir);
    expect(stdout).toContain('feature1/spec.json');
    expect(stdout).not.toContain('feature2/spec.json');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd find-active-specs returns nothing when no active specs', async () => {
  const testDir = createTestDir('no-active');

  try {
    createMinimalTestEnv(testDir);
    mkdirSync(path.join(testDir, '.kiro', 'specs', 'feature1'), { recursive: true });
    writeFileSync(path.join(testDir, '.kiro', 'specs', 'feature1', 'spec.json'),
      '{"implementation_ready": false}');

    const { stdout } = await runHelper(['find-active-specs'], testDir);
    expect(stdout.trim()).toBe('');
  } finally {
    cleanup(testDir);
  }
});

// ============================================================================
// Steering Files Tests
// ============================================================================

test('ccsdd list-steering-files when no steering directory', async () => {
  const testDir = createTestDir('no-steering-list');

  try {
    createMinimalTestEnv(testDir);
    const { stdout } = await runHelper(['list-steering-files'], testDir);
    expect(stdout).toContain('No steering directory found');
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd list-steering-files lists all md files', async () => {
  const testDir = createTestDir('steering-list');

  try {
    createFullTestEnv(testDir);
    const { stdout } = await runHelper(['list-steering-files'], testDir);
    expect(stdout).toContain('product.md');
    expect(stdout).toContain('tech.md');
    expect(stdout).toContain('structure.md');
    expect(stdout).toContain('custom1.md');
    expect(stdout).toContain('custom2.md');
  } finally {
    cleanup(testDir);
  }
});

// ============================================================================
// Git Command Tests
// ============================================================================

test('ccsdd git commands are available', async () => {
  const testDir = createTestDir('git-commands');

  try {
    createMinimalTestEnv(testDir);

    // Test that git commands exist and don't error
    const { code: code1 } = await runHelper(['get-last-steering-commit'], testDir);
    const { code: code2 } = await runHelper(['get-commits-since-steering'], testDir);
    const { code: code3 } = await runHelper(['get-git-status'], testDir);

    // Git commands should complete successfully (exit code 0)
    expect(code1).toBe(0);
    expect(code2).toBe(0);
    expect(code3).toBe(0);
  } finally {
    cleanup(testDir);
  }
});

// ============================================================================
// ls-dir Command Test
// ============================================================================

test('ccsdd ls-dir lists directory contents', async () => {
  const testDir = createTestDir('ls-dir');

  try {
    createMinimalTestEnv(testDir);
    mkdirSync(path.join(testDir, 'subdir'), { recursive: true });
    writeFileSync(path.join(testDir, 'file1.txt'), 'content1');
    writeFileSync(path.join(testDir, 'file2.js'), 'content2');

    const { stdout } = await runHelper(['ls-dir', testDir], testDir);

    // Should show . and .. entries
    expect(stdout).toContain('.');
    expect(stdout).toContain('..');

    // Should show files and directories
    expect(stdout).toContain('package.json');
    expect(stdout).toContain('file1.txt');
    expect(stdout).toContain('file2.js');
    expect(stdout).toContain('subdir');

    // Should indicate directories with 'd' prefix
    expect(stdout).toMatch(/d.*subdir/);
    expect(stdout).toMatch(/-.*file1\.txt/);
  } finally {
    cleanup(testDir);
  }
});

test('ccsdd ls-dir handles non-existing directory', async () => {
  const testDir = createTestDir('ls-dir-missing');

  try {
    createMinimalTestEnv(testDir);
    const nonExistingDir = path.join(testDir, 'non-existing');

    const { stdout } = await runHelper(['ls-dir', nonExistingDir], testDir);
    expect(stdout).toContain('Directory not found');
  } finally {
    cleanup(testDir);
  }
});
