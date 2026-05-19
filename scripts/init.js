#!/usr/bin/env node
const { readFileSync, writeFileSync, renameSync, existsSync } = require('fs');
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

/** "my-app" → "MyApp" */
function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
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
  const pascal = toPascalCase(name); // "MyApp"

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

  // 5. StarterLogo component — CSS classes, gradient IDs, aria-label, wordmark, type name
  replaceInFile('client/src/components/StarterLogo.tsx', [
    ['StarterLogoProps', `${pascal}LogoProps`],
    ['StarterLogo', `${pascal}Logo`],
    ['starter-ring', `${name}-ring`],
    ['starter-flame', `${name}-flame`],
    ['starter-logo', `${name}-logo`],
    ['"Starter logo"', `"${title} logo"`],
    ['>Starter<', `>${title}<`],
  ]);

  // Rename the component file
  const oldLogoFile = resolve(ROOT, 'client/src/components/StarterLogo.tsx');
  const newLogoFile = resolve(ROOT, `client/src/components/${pascal}Logo.tsx`);
  if (existsSync(oldLogoFile) && oldLogoFile !== newLogoFile) {
    renameSync(oldLogoFile, newLogoFile);
    console.log(`  ✓  Renamed StarterLogo.tsx → ${pascal}Logo.tsx`);
  }

  // 6. Update all files that import StarterLogo
  const logoImporters = [
    'client/src/routes/public/Landing.tsx',
    'client/src/routes/public/Login.tsx',
    'client/src/routes/public/Register.tsx',
    'client/src/routes/public/AuthCallback.tsx',
    'client/src/routes/protected/Dashboard.tsx',
  ];
  for (const f of logoImporters) {
    replaceInFile(f, [
      [`@/components/StarterLogo`, `@/components/${pascal}Logo`],
      [`StarterLogo`, `${pascal}Logo`],
    ]);
  }

  // 7. index.css — logo CSS classes
  replaceInFile('client/src/index.css', [['starter-logo', `${name}-logo`]]);

  // 8. README.md — top heading
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
