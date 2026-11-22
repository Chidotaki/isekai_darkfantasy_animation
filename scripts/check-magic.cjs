// Focused choreography/story checks using the already-installed compiler. No services.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename);
const {magicActor,magicCues,disarmContact,barrierContact,pillarContact,projectilePoint,staffPoint}=require('../src/magic/timeline.ts');
const {weaponPoint,rotate}=require('../src/combat/rig.ts');
const {canDirectCast,scrollState,waterScroll,spellConfigs}=require('../src/magic/spells.ts');
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
assert(!canDirectCast('ren','fireProjectile'));
assert(!canDirectCast('ren','magicShield'));
assert(!canDirectCast('ren','createWater'));
assert(canDirectCast('enemy-mage','fireProjectile'));
assert(canDirectCast('enemy-mage','magicShield'));
assert.equal(spellConfigs.createWater.offensive,false);
assert.equal(spellConfigs.createWater.charges,1);
assert.equal(scrollState(waterScroll.retrieve-1,waterScroll),'stored');
assert.equal(scrollState(waterScroll.activate-1,waterScroll),'ready');
assert.equal(scrollState(waterScroll.activate,waterScroll),'active');
for(let f=waterScroll.spent;f<540;f++)assert.equal(scrollState(f,waterScroll),'spent');
assert(distance(projectilePoint(magicCues.launch),staffPoint(magicCues.launch))<.001,'Projectile must leave the staff');
assert(distance(projectilePoint(magicCues.pillar),pillarContact)<.001,'Projectile must meet the pillar');
for(let f=magicCues.launch+1;f<=magicCues.pillar;f++)assert(projectilePoint(f)[0]<projectilePoint(f-1)[0],'Projectile must move across the scene');
for(const [at,point,length] of [[375,barrierContact,92],[420,disarmContact(),88]])assert(distance(weaponPoint(magicActor(at,'ren'),'human',length),point)<.001,`Missed physical contact at ${at}`);
let maxStep=0;
for(const who of ['ren','mage'])for(let f=0;f<540;f++){
  const actor=magicActor(f,who),p=actor.pose;
  assert(Object.values(p).every(Number.isFinite));
  assert.deepEqual(actor,magicActor(f,who));
  if(who==='ren'&&p.draw>.99)assert(weaponPoint(actor,'human',103)[1]<=actor.y+10,`Sword below ground at ${f}`);
  for(const side of [-1,1]){
    const hip=rotate([side*16,-85],p.hips,[0,-85]);
    assert(Math.hypot((side<0?p.leftX:p.rightX)-p.pelvisX-hip[0],(side<0?p.leftY:p.rightY)-p.pelvisY-hip[1])<=80,`Overextended leg at ${f}`);
  }
  if(f>0){const prev=magicActor(f-1,who).pose;for(const k of ['frontUpper','frontLower','backUpper','backLower','wrist','torso']){const delta=Math.abs(((p[k]-prev[k]+540)%360)-180);maxStep=Math.max(maxStep,delta);assert(delta<40,`Joint snap at ${who} ${f} ${k}`);}}
}
console.log(`Passed: story permissions, one-use scroll, projectile flight, 2 exact contacts, 1080 deterministic poses, limb reach and sword clearance. Largest joint step: ${maxStep.toFixed(1)} degrees.`);
