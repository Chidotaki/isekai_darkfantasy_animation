// Read-only local asset preflight. No network requests or asset generation.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(
  fs.readFileSync(filename, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}},
).outputText, filename);
const {assetRegistry, isPublicAssetPath} = require('../src/production/assetRegistry.ts');
const publicRoot = path.resolve(__dirname, '../public');

const checkFileAssets = (registry) => {
  const errors = [], planned = [];
  for (const [id, asset] of Object.entries(registry)) {
    if (asset.source.kind === 'planned') {planned.push(id); continue;}
    if (asset.source.kind !== 'file') continue;
    const file = asset.source.path;
    if (!isPublicAssetPath(file)) {errors.push(`${id}: unsafe public-relative path`); continue;}
    const target = path.resolve(publicRoot, file);
    try {
      // Reject links escaping public/ as well as missing files and directory entries.
      const relative = path.relative(fs.realpathSync(publicRoot), fs.realpathSync(target));
      if (relative.startsWith('..' + path.sep) || relative === '..' || path.isAbsolute(relative)) {
        errors.push(`${id}: file resolves outside public/`);
      } else if (!fs.statSync(target).isFile()) errors.push(`${id}: not a file`);
    } catch {errors.push(`${id}: missing or unreadable public/${file}`);}
  }
  return {errors, planned};
};
module.exports = {checkFileAssets};
if (require.main === module) {
  const {errors, planned} = checkFileAssets(assetRegistry);
  for (const error of errors) console.error(error);
  if (planned.length) console.log(`Planned, not render-ready: ${planned.join(', ')}`);
  if (errors.length) process.exitCode = 1;
  else console.log('Passed: registered file-backed assets exist inside public/.');
}
