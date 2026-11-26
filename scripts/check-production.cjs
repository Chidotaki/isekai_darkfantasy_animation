// Focused manifest/compatibility checks using the existing compiler, no test framework.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const Module = require('node:module');
const ts = require('typescript');
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === '@remotion/media') return {Audio: () => null};
  return originalLoad.call(this, request, parent, isMain);
};
const compile = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true},
}).outputText, filename);
require.extensions['.ts'] = compile;
require.extensions['.tsx'] = compile;
const {buildTimeline} = require('../src/production/timeline.ts');
const {secondsToFrames, framesToSeconds, productionConfig} = require('../src/production/config.ts');
const {assetRegistry, audioAssetPath} = require('../src/production/assetRegistry.ts');
const {characterRegistry, characterAssetId} = require('../src/production/characterRegistry.ts');
const {episodeRegistry} = require('../src/production/episodeRegistry.ts');
const {developmentManifest} = require('../src/episodes/developmentManifest.ts');
const {checkFileAssets} = require('./check-assets.cjs');

const schedule = buildTimeline(developmentManifest);
assert.equal(schedule.durationInFrames, 120);
assert.deepEqual(schedule.scenes.map(s => [s.from, s.durationInFrames]), [[0, 90], [90, 30]]);
assert.deepEqual(schedule.scenes.flatMap(s => s.shots.map(v => [v.from, v.episodeFrom])), [[0, 0], [30, 30], [0, 90]]);
assert.deepEqual(schedule, buildTimeline(developmentManifest));
for (const [frame, expected] of [[0,'shot-a'],[29,'shot-a'],[30,'shot-b'],[89,'shot-b'],[90,'shot-c'],[119,'shot-c']]) {
  const active = schedule.scenes.flatMap(s => s.shots).filter(s => frame >= s.episodeFrom && frame < s.episodeFrom + s.durationInFrames);
  assert.equal(active.length, 1); assert.equal(active[0].shot.id, expected);
}
const changed = structuredClone(developmentManifest);
changed.scenes[0].shots[0].durationInFrames = 45;
const shifted = buildTimeline(changed);
assert.equal(shifted.scenes[0].shots[1].from, 45);
assert.equal(shifted.scenes[1].from, 105);
assert.equal(shifted.durationInFrames, 135);

const invalid = (edit, message) => {
  const input = structuredClone(developmentManifest); edit(input);
  assert.throws(() => buildTimeline(input), message);
};
invalid(m => m.scenes[0].shots[0].durationInFrames = 0, /positive integer/);
invalid(m => m.scenes[0].shots[0].durationInFrames = 1.5, /integer/);
invalid(m => m.scenes[0].shots[1].id = 'shot-a', /duplicate/);
invalid(m => m.scenes[1].id = 'scene-a', /duplicate/);
invalid(m => m.scenes[0].shots = [], /no shots/);
invalid(m => m.scenes = [], /at least one/);
invalid(m => m.fps = 24, /30 FPS/);
invalid(m => m.scenes[0].characters = ['not-a-character'], /Unknown character/);
invalid(m => m.scenes[0].shots[0].assets = ['not-an-asset'], /Unknown asset/);
invalid(m => m.scenes[0].shots[0].characters = [{character:'asakura-yuu',x:1,y:1}], /missing from scene/);
const cue = {id:'audio-check',asset:'audio.prototype-score',from:20,durationInFrames:10,trimBefore:60,volume:0.5};
const withAudio = structuredClone(developmentManifest);
withAudio.scenes[0].shots[0].audio = [cue];
withAudio.scenes[0].audio = [{...cue, from:60, durationInFrames:30}];
assert.equal(buildTimeline(withAudio).durationInFrames, 120);
invalid(m => m.scenes[0].shots[0].audio = [{...cue, durationInFrames:11}], /exceeds/);
invalid(m => m.scenes[0].audio = [{...cue, from:89}], /exceeds/);
invalid(m => m.scenes[0].audio = [{...cue, trimBefore:-1}], /nonnegative/);
assert.throws(() => buildTimeline(developmentManifest, []), /Missing shot renderer/);
assert.equal(secondsToFrames(0.5), 15);
assert.equal(framesToSeconds(120), 4);
assert.throws(() => secondsToFrames(NaN));
assert.throws(() => framesToSeconds(1.5));
assert.equal(characterAssetId('asakura-yuu'), 'ren');
assert.equal(characterAssetId('tachibana-kairyu'), 'elias');
assert.equal(characterAssetId('minase-shiori'), 'mira');
assert.deepEqual(Object.values(characterRegistry).map(c => c.assetAlias).sort(), ['elias','lina','mira','ren','toma']);
assert.equal(audioAssetPath('audio.prototype-score'), 'audio/isekai-score.wav');
assert.deepEqual(checkFileAssets(assetRegistry).errors, []);
for (const file of ['../outside.wav', 'C:/outside.wav', 'https://example.com/audio.wav', 'audio/does-not-exist.wav']) {
  assert.equal(checkFileAssets({test:{source:{kind:'file',path:file}}}).errors.length, 1);
}
assert.deepEqual(checkFileAssets({planned:{source:{kind:'planned',note:'Awaiting approved asset'}}}), {errors:[],planned:['planned']});

// Production registration stays opt-in. Future approved entries must pass these checks too.
const ids = new Set(['IsekaiDemo','CombatDemo','MagicCombatDemo','EmotionalDemo','CharacterVisualTest']);
for (const definition of episodeRegistry) {
  assert.equal(definition.manifest.kind, 'production');
  assert(!ids.has(definition.manifest.id)); ids.add(definition.manifest.id);
  assert.equal(definition.timeline.durationInFrames, buildTimeline(definition.manifest).durationInFrames);
}
// Inspect authored JSX without importing the Root or altering its preview props.
const rootPath = path.join(__dirname, '../src/Root.tsx');
const root = ts.createSourceFile(rootPath, fs.readFileSync(rootPath,'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const found = {};
const visit = node => {
  if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(root) === 'Composition') {
    const props = {};
    for (const p of node.attributes.properties) if (ts.isJsxAttribute(p) && p.initializer) {
      props[p.name.getText(root)] = ts.isStringLiteral(p.initializer) ? p.initializer.text : Number(p.initializer.expression?.getText(root));
    }
    found[props.id] = [props.durationInFrames, props.width, props.height, props.fps];
  }
  ts.forEachChild(node, visit);
};
visit(root);
for (const [id, frames] of Object.entries({IsekaiDemo:1200,CombatDemo:450,MagicCombatDemo:540,EmotionalDemo:900,CharacterVisualTest:720})) {
  assert.deepEqual(found[id], [frames, productionConfig.width, productionConfig.height, productionConfig.fps]);
}
assert.match(require('../package.json').scripts.render, /src\/index.ts IsekaiDemo out\/isekai-demo.mp4/);
console.log('Passed: derived durations, nested offsets/cuts, audio bounds, reference validation, asset preflight, canonical aliases and four unchanged prototype registrations.');
