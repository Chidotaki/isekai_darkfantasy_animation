// Small, local choreography check. Uses the project's existing TypeScript compiler.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020},
  }).outputText, filename);
};
const {contacts, contactError, sampleFighter, impacts} = require(path.join(__dirname, '../src/combat/timeline.ts'));
const {rotate, weaponPoint, anatomy} = require(path.join(__dirname, '../src/combat/rig.ts'));
for (const contact of contacts) {
  const error = contactError(contact.at, contact.who, contact.point, contact.distance);
  assert(error < 0.01, `Missed ${contact.who} contact at frame ${contact.at}: ${error}px`);
}
let largestJointStep = 0;
for (const species of ['human', 'goblin']) {
  for (let frame = 0; frame < 450; frame++) {
    const actor = sampleFighter(frame, species), p = actor.pose;
    assert(Object.values(p).every(Number.isFinite), `Invalid pose at ${frame}`);
    assert.deepEqual(actor, sampleFighter(frame, species), 'Pose must be deterministic');
    if ((species === 'human' && p.draw > 0.99) || (species === 'goblin' && frame < 338)) {
      const tip = weaponPoint(actor, species, anatomy[species].blade);
      assert(tip[1] <= actor.y + 10, `Weapon buried below the ground: ${species}, frame ${frame}`);
    }
    const height = species === 'human' ? 85 : 58;
    const width = species === 'human' ? 16 : 20;
    const reach = species === 'human' ? 80 : 59;
    for (const side of [-1, 1]) {
      const hip = rotate([side * width, -height], p.hips, [0, -height]);
      const dx = (side < 0 ? p.leftX : p.rightX) - p.pelvisX - hip[0];
      const dy = (side < 0 ? p.leftY : p.rightY) - p.pelvisY - hip[1];
      assert(Math.hypot(dx, dy) <= reach, `Overextended ${species} leg at ${frame}`);
    }
    if (frame > 0) {
      const previous = sampleFighter(frame - 1, species).pose;
      for (const channel of ['frontUpper', 'frontLower', 'wrist', 'torso', 'hips']) {
        const step = Math.abs(((p[channel] - previous[channel] + 540) % 360) - 180);
        largestJointStep = Math.max(largestJointStep, step);
        assert(step < 65, `Snapping ${species} ${channel} at frame ${frame}: ${step}`);
      }
    }
  }
  for (const at of [impacts.clash, impacts.block, impacts.finish]) {
    assert.deepEqual(sampleFighter(at, species), sampleFighter(at + 1, species), 'Hit-stop must hold both fighters');
  }
}
const first = sampleFighter(65, 'human'), last = sampleFighter(70, 'human');
assert.equal(first.x + first.pose.leftX * first.scale, last.x + last.pose.leftX * last.scale, 'Resting foot must remain planted');
assert.deepEqual(sampleFighter(370, 'goblin'), sampleFighter(449, 'goblin'), 'Defeated goblin must remain still');
console.log(`Passed: 6 exact contacts, 900 deterministic poses, limb reach, grounded stance, synchronized hit-stops and defeated hold. Largest joint step: ${largestJointStep.toFixed(1)} degrees.`);
