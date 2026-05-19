#!/usr/bin/env node
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { resolve } = require('path');
const { createInterface } = require('readline');

const ROOT = resolve(__dirname, '..');

// ─── Helpers ────────────────────────────────────────────────────────────────

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim());
    });
  });
}

/** "my-app" → "My App" */
function toTitleCase(kebab) {
  return kebab
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * @param {string} relPath
 * @param {[string, string][]} replacements
 */
function replaceInFile(relPath, replacements) {
  const absPath = resolve(ROOT, relPath);
  if (!existsSync(absPath)) {
    console.warn(`  ⚠  Skipped (not found): ${relPath}`);
    return;
  }
  let content = readFileSync(absPath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  writeFileSync(absPath, content, 'utf8');
  console.log(`  ✓  ${relPath}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\nTypeScript Fullstack Starter — Project Initializer\n');

  let name = process.argv[2];

  if (!name) {
    name = await ask('Project name (kebab-case, e.g. my-app): ');
  }

  name = name.trim().toLowerCase();

  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    console.error(
      '\nInvalid project name. Use lowercase letters, numbers, and hyphens only (must start with a letter).\n',
    );
    process.exit(1);
  }

  const title = toTitleCase(name); // "My App"

  console.log(`\nInitializing "${title}"...\n`);

  // 1. Root package.json
  replaceInFile('package.json', [
    ['"ts-api-starter"', `"${name}"`],
    ['"Bulletproof TypeScript REST API starter"', `"${title}"`],
  ]);

  // 2. shared/package.json
  replaceInFile('shared/package.json', [['@starter/shared', `@${name}/shared`]]);

  // 3. client/package.json
  replaceInFile('client/package.json', [['@starter/shared', `@${name}/shared`]]);

  // 4. client/index.html — page title
  replaceInFile('client/index.html', [['<title>Starter</title>', `<title>${title}</title>`]]);

  // 5. README.md — top heading
  replaceInFile('README.md', [['# TypeScript Fullstack Starter', `# ${title}`]]);

  console.log(`
Done! Next steps:

  npm install
  cp .env.example .env
  docker compose up -d
  npm run db:migrate
  npm run db:generate
`);
}

main().catch((err) => {
  console.error('\nError:', err.message);
  process.exit(1);
});
