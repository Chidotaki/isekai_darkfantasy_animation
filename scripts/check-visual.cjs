// Focused rig/contact, artwork contract and manifest-pin checks; no test framework.
const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},
}).outputText,filename);
const {samplePerformance,withExistingPose}=require('../src/visual/performance.ts');
const {solveRig,provisionalRig,transformPoint}=require('../src/visual/rig.ts');
const {provisionalAppearances}=require('../src/visual/provisionalArtwork.ts');
const {prepareAppearance,selectLayerSources,layerSources}=require('../src/visual/assets.ts');
const {gripPoint,torsoPoint}=require('../src/combat/rig.ts');
const {buildTimeline}=require('../src/production/timeline.ts');
const {developmentManifest}=require('../src/episodes/developmentManifest.ts');
const {assetRegistry}=require('../src/production/assetRegistry.ts');
const {CharacterRenderer}=require('../src/visual/CharacterRenderer.tsx');
const {createElement:h}=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const near=(a,b,tolerance=.0001)=>assert(Math.hypot(a[0]-b[0],a[1]-b[1])<tolerance,`${a} != ${b}`);
for(const pose of ['idle','walk','sit','talk'])for(let frame=0;frame<720;frame++){
  const p=samplePerformance(frame,{pose}),bones=solveRig(provisionalRig,p);
  assert.deepEqual(p,samplePerformance(frame,{pose}));
  for(const matrix of Object.values(bones))assert(matrix.every(Number.isFinite));
  for(const side of ['L','R']){
    near(transformPoint(bones[`upperArm${side}`],[0,34]),transformPoint(bones[`forearm${side}`],[0,0]));
    near(transformPoint(bones[`thigh${side}`],[0,40]),transformPoint(bones[`shin${side}`],[0,0]));
    near(transformPoint(bones[`shin${side}`],[0,40]),transformPoint(bones[`foot${side}`],[0,0]));
  }
  const authored=withExistingPose(p,{...p.body,torso:12,frontUpper:78,frontLower:119,wrist:-24});
  near(transformPoint(solveRig(provisionalRig,authored).handR,[0,0]),torsoPoint(gripPoint(authored.body,'human'),authored.body,'human'));
}
// Unequal lengths including a target too close to reach still form connected, rigid segments.
const custom={...provisionalRig,upperArm:39,forearm:28,thigh:46,shin:32};
const customPose=samplePerformance(90,{rig:custom,body:{leftX:-16,leftY:-85}});
const customBones=solveRig(custom,customPose);
near(transformPoint(customBones.upperArmL,[0,39]),transformPoint(customBones.forearmL,[0,0]));
near(transformPoint(customBones.thighL,[0,46]),transformPoint(customBones.shinL,[0,0]));
near(transformPoint(customBones.shinL,[0,32]),transformPoint(customBones.footL,[0,0]));
// World-space left stance holds while the root travels at the authored gait speed.
const planted=[];
for(let frame=66;frame<=76;frame++){
  const foot=transformPoint(solveRig(provisionalRig,samplePerformance(frame,{pose:'walk'})).footL,[0,0]);
  planted.push([foot[0]+frame/30*27.2727272727,foot[1]]);
}
planted.forEach(p=>near(p,planted[0]));
const formats=new Set();
for(const art of Object.values(provisionalAppearances)){
  assert.equal(art.status,'provisional');
  assert.deepEqual(art.layers.map(l=>l.order),art.layers.map(l=>l.order).sort((a,b)=>a-b));
  for(const layer of art.layers)for(const source of layerSources(layer))if(source.kind==='file'){
    formats.add(source.format);assert(fs.statSync(`public/${source.path}`).isFile());
    assert(Object.values(assetRegistry).some(a=>a.source.kind==='file'&&a.source.path===source.path));
  }
}
assert.deepEqual([...formats].sort(),['png','svg','webp']);
const art=provisionalAppearances.ren,layer=art.layers.find(l=>l.id==='mouth');
let p=samplePerformance(10,{expression:'neutral',nextExpression:'fear',expressionMix:.5});
assert.equal(selectLayerSources(layer,p,'student').length,2);
assert.equal(selectLayerSources(layer,samplePerformance(0,{expression:'fear',intensity:0}),'student')[0].source,layer.expressions.neutral);
assert.equal(selectLayerSources({...layer,visible:false},p,'student').length,0);
assert.equal(selectLayerSources({...layer,costumes:{hidden:null}},p,'hidden').length,0);
for(const mouth of ['A','E','O','U','F','closed'])assert.equal(selectLayerSources(layer,samplePerformance(0,{mouth}),'student')[0].source,layer.mouths[mouth]);
assert.throws(()=>prepareAppearance({...art,layers:[{...layer,source:{kind:'file',path:'../outside.png',format:'png'}}]}),/Invalid layer file/);
const legacyMarkup=renderToStaticMarkup(h('svg',null,h(CharacterRenderer,{character:'asakura-yuu',mode:'procedural',performance:p,frame:10,x:0,y:0,heldItem:h('rect',{'data-held-item':'yes',width:10,height:10})})));
assert(legacyMarkup.includes('data-held-item="yes"'));
const pinned=structuredClone(developmentManifest);
pinned.assetPins=[{id:'art.layered-students',version:'1.0.0'},{id:'rig.layered-human',version:'1.0.0'}];
assert.equal(buildTimeline(pinned).durationInFrames,120);
pinned.assetPins[0].version='2.0.0';assert.throws(()=>buildTimeline(pinned),/version mismatch/);
console.log('Passed: 2880 deterministic hybrid poses, connected joints, authored grip parity, unequal proportions, planted stance, PNG/WebP/SVG files, facial swaps, visibility/costumes and version locks.');
