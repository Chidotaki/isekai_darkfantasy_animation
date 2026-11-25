import {endpoint, type Point} from '../components/characterMotion';
import {jointBetween, rotate} from '../combat/rig';
import type {Bone, CharacterPerformance, CharacterRig} from './types';
export type Matrix = readonly [number, number, number, number, number, number];
export const identity: Matrix = [1, 0, 0, 1, 0, 0];
export const multiply = (a: Matrix, b: Matrix): Matrix => [
  a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1],
  a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3],
  a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5],
];
export const translate = (x: number, y: number): Matrix => [1,0,0,1,x,y];
export const inverse = (m:Matrix):Matrix => {
  const d=m[0]*m[3]-m[1]*m[2];
  if(Math.abs(d)<1e-9)throw Error('Cannot bind a singular rig matrix');
  return [m[3]/d,-m[1]/d,-m[2]/d,m[0]/d,(m[2]*m[5]-m[3]*m[4])/d,(m[1]*m[4]-m[0]*m[5])/d];
};
export const scale = (x: number, y = x): Matrix => [x,0,0,y,0,0];
export const rotation = (angle: number): Matrix => {
  const r=angle*Math.PI/180,c=Math.cos(r),s=Math.sin(r); return [c,s,-s,c,0,0];
};
const pivot = (point: Point, transform: Matrix) => multiply(multiply(translate(...point),transform),translate(-point[0],-point[1]));
export const transformPoint = (m: Matrix, p: Point): Point => [m[0]*p[0]+m[2]*p[1]+m[4],m[1]*p[0]+m[3]*p[1]+m[5]];

/** Matches the current human rig's feet-origin coordinates; other artwork can supply its own measurements. */
export const provisionalRig: CharacterRig = {
  id:'human-cutout',version:'1.0.0',torsoPivot:[0,-88],neck:[0,-162],
  shoulders:[[-29,-145],[29,-145]],upperArm:34,forearm:30,handOffset:6,
  hips:[[-16,-85],[16,-85]],thigh:40,shin:40,feet:[[-23,-7],[23,-7]],
  eyes:[[-13,-31],[13,-31]],mouth:[0,-13.5],
  hairPivot:[0,-53],scarfPivot:[14,-147],
};

/** FK arms share the old angle convention. Legs reuse the existing unequal-bone IK solver. */
export const solveRig = (rig: CharacterRig, performance: CharacterPerformance): Record<Bone, Matrix> => {
  const p=performance.body,f=performance.face;
  const root=translate(p.pelvisX,p.pelvisY);
  const torso=multiply(root,multiply(scale(p.width,1),pivot(rig.torsoPivot,
    multiply(rotation(p.torso),scale(1+performance.breath*.003,1+performance.breath*.005)))));
  const head=multiply(torso,multiply(translate(rig.neck[0]+performance.headOffset[0],rig.neck[1]+performance.headOffset[1]),rotation(p.head+f.headTilt)));
  const hipPivot:Point=[(rig.hips[0][0]+rig.hips[1][0])/2,(rig.hips[0][1]+rig.hips[1][1])/2];
  const map = {hips:multiply(root,pivot(hipPivot,rotation(p.hips))),torso,head,
    backHair:head,frontHair:multiply(head,pivot(rig.hairPivot??[0,0],rotation(performance.secondary*.7))),
    scarf:multiply(torso,pivot(rig.scarfPivot??[0,0],rotation(performance.secondary*1.4))),
  } as Record<Bone, Matrix>;
  for (const [i,suffix] of (['L','R'] as const).entries()) {
    const upper=i===0?p.backUpper:p.frontUpper,lower=i===0?p.backLower:p.frontLower;
    const shoulder=rig.shoulders[i],elbow=endpoint(shoulder,rig.upperArm,upper);
    const wrist=endpoint(elbow,rig.forearm,lower),hand=endpoint(wrist,rig.handOffset,lower);
    map[`upperArm${suffix}`]=multiply(torso,multiply(translate(...shoulder),rotation(-upper)));
    map[`forearm${suffix}`]=multiply(torso,multiply(translate(...elbow),rotation(-lower)));
    map[`hand${suffix}`]=multiply(torso,multiply(translate(...hand),rotation(i===1?p.wrist:-lower*.3)));
    const hip=rotate(rig.hips[i],p.hips,hipPivot);
    const h:Point=[hip[0]+p.pelvisX,hip[1]+p.pelvisY];
    const ankle:Point=i===0?[p.leftX,p.leftY]:[p.rightX,p.rightY];
    // Clamp unreachable ankles to the limb length; never stretch bones or detach a joint.
    const d=Math.hypot(ankle[0]-h[0],ankle[1]-h[1]);
    const reach=Math.max(Math.abs(rig.thigh-rig.shin)+.001,Math.min(d,rig.thigh+rig.shin-.001));
    const foot:Point=d<.00001?[h[0],h[1]+reach]:[h[0]+(ankle[0]-h[0])*reach/d,h[1]+(ankle[1]-h[1])*reach/d];
    const knee=jointBetween(h,foot,rig.thigh,rig.shin,i===0?-1:1);
    const segment=(a:Point,b:Point)=>multiply(translate(...a),rotation(-Math.atan2(b[0]-a[0],b[1]-a[1])*180/Math.PI));
    map[`thigh${suffix}`]=segment(h,knee); map[`shin${suffix}`]=segment(knee,foot);
    map[`foot${suffix}`]=multiply(translate(...foot),rotation(i===0?p.ankleL:p.ankleR));
    const eye=rig.eyes[i],eyeFrame=multiply(head,translate(eye[0]+f.headYaw*4,eye[1]));
    map[`eye${suffix}`]=multiply(eyeFrame,scale(1,Math.max(.035,(i===0?f.lidL:f.lidR)*(1-f.blink))));
    map[`brow${suffix}`]=multiply(eyeFrame,multiply(translate(0,-12-(i===0?f.browLiftL:f.browLiftR)),rotation(i===0?f.browAngleL:f.browAngleR)));
  }
  map.mouth=multiply(head,multiply(translate(rig.mouth[0]+f.mouthSkew*.4+f.headYaw*4,rig.mouth[1]),rotation(f.mouthSkew*2)));
  return map;
};
