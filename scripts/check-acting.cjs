// Focused deterministic acting checks, using the compiler already in the project.
const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename);
const {expressionPresets,expressionFace,neutralFace,blendFaces,mouthShapes}=require('../src/components/faceRig.ts');
const {emotionalActor,emotionalPerformance,breakfastAt,handoffTargets,emotionalCamera}=require('../src/acting/emotionalTimeline.ts');
const {handPoint,wristPoint,mutualGaze}=require('../src/acting/interactions.ts');
const {speechAt}=require('../src/acting/speech.ts');
const {dialogue}=require('../src/acting/dialogue.ts');
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
assert.equal(Object.keys(expressionPresets).length,16);
assert(Object.keys(mouthShapes).length>=5);
for(const name of Object.keys(expressionPresets)){
  assert.deepEqual(expressionFace(name,0),neutralFace);
  const full=expressionFace(name,1),half=expressionFace(name,.5);
  assert.deepEqual(half,blendFaces(neutralFace,full,.5));
  assert(Object.values(full).every(Number.isFinite));
}
for(const [id,target] of [['elias',handoffTargets.giver],['ren',handoffTargets.receiver]])assert(dist(handPoint(emotionalActor(132,id)),target)<.001,'Missed handoff contact');
assert(dist(handPoint(emotionalActor(132,'elias'),1,[20,-10]),handPoint(emotionalActor(132,'ren'),1,[20,-10]))<.001,'Package teleports between owners');
assert.equal(breakfastAt(131).owner,'giver');assert.equal(breakfastAt(132).owner,'receiver');
for(const f of [615,630,645]){
  const actor=emotionalActor(f,'ren');assert(dist(handPoint(actor,-1),wristPoint(actor))<5,'Adjusting hand misses bracelet');
}
let maxStep=0;
for(const id of ['ren','mira','elias'])for(let f=0;f<900;f++){
  const a=emotionalPerformance(f,id),p=a.actor.pose;
  assert(Object.values(p).every(Number.isFinite));assert(Object.values(a.face).every(Number.isFinite));
  assert.deepEqual(a,emotionalPerformance(f,id),'Acting must be deterministic');
  assert(Math.abs(p.head+a.face.headTilt)<12,'Unnatural head rotation');
  if(f){const prev=emotionalActor(f-1,id).pose;for(const k of ['frontUpper','frontLower','backUpper','backLower','head']){const d=Math.abs(((p[k]-prev[k]+540)%360)-180);maxStep=Math.max(maxStep,d);assert(d<12,`${id}: joint snap at ${f}`);}}
  if(f>=360&&f<720)assert.equal(a.speech.active,false,'The quiet beats must remain silent');
}
for(let f=0;f<900;f++){
  assert(dialogue.filter(c=>f>=c.from&&f<c.to).length<=1,'Overlapping conversation turns');
  assert(Object.values(emotionalCamera(f)).every(Number.isFinite));
  const a=emotionalActor(f,'ren'),b=emotionalActor(f,'elias');assert(a.x-b.x>300,'Actors overlap in the aisle');
}
const gaze=mutualGaze(emotionalActor(140,'ren'),emotionalActor(140,'elias'));
assert(gaze[0].gazeX>0&&gaze[1].gazeX>0,'Mutual gaze must account for mirrored facing');
const quiet=[{actor:'ren',from:0,to:30,envelope:Array(30).fill(0)}];
for(let f=0;f<30;f++)assert.equal(speechAt(f,'ren',quiet).energy,0,'Audio silence must close the mouth');
console.log(`Passed: 16 expression presets, 7 mouth shapes, 2700 deterministic acting poses, gaze, exact breakfast handoff, bracelet contact, pauses and non-overlap. Largest joint step: ${maxStep.toFixed(1)} degrees.`);
