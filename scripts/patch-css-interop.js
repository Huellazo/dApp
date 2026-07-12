const fs = require('node:fs');
const path = require('node:path');

const packageRoot = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-css-interop',
);
const packageJsonPath = path.join(packageRoot, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.warn('[css-interop patch] Package not installed; skipping.');
  process.exit(0);
}

const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
if (version !== '0.2.6') {
  console.log(`[css-interop patch] Version ${version} does not need this 0.2.6 workaround.`);
  process.exit(0);
}

const filePath = path.join(packageRoot, 'dist', 'css-to-rn', 'parseDeclaration.js');
let source = fs.readFileSync(filePath, 'utf8');

if (source.includes('!aspectRatio || (!aspectRatio.auto && !aspectRatio.ratio)')) {
  console.log('[css-interop patch] Already applied.');
  process.exit(0);
}

const target = 'function parseAspectRatio(aspectRatio) {\n    if (aspectRatio.auto) {';
const replacement = [
  'function parseAspectRatio(aspectRatio) {',
  '    // LightningCSS can emit an aspect-ratio declaration without a ratio.',
  '    // Ignore that malformed declaration instead of terminating Metro.',
  '    if (!aspectRatio || (!aspectRatio.auto && !aspectRatio.ratio)) {',
  '        return 1;',
  '    }',
  '    if (aspectRatio.auto) {',
].join('\n');

if (!source.includes(target)) {
  throw new Error('[css-interop patch] Expected parseAspectRatio implementation was not found.');
}

source = source.replace(target, replacement);
fs.writeFileSync(filePath, source);
console.log('[css-interop patch] Applied workaround for invalid aspect-ratio declarations.');
