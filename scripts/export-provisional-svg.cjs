// Export only original project vectors. No external code, downloads, or input paths.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  }}).outputText, filename);
const {createElement: h} = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const {provisionalAppearance} = require('../src/visual/provisionalArtwork.ts');
const art = provisionalAppearance('ren', false).layers.find(layer => layer.id === 'jacket');
const directory = path.resolve(__dirname, '../public/assets/characters/provisional-v1');
fs.mkdirSync(directory, {recursive: true});
fs.writeFileSync(path.join(directory, 'yuu-jacket.svg'), renderToStaticMarkup(h('svg', {
  xmlns: 'http://www.w3.org/2000/svg', viewBox: art.source.viewBox.join(' '),
  width: art.size[0]*8, height: art.size[1]*8,
}, art.source.shapes.map((shape, i) => h(shape.tag, {...shape.props, key:i})))));
console.log('Exported original provisional jacket SVG.');
