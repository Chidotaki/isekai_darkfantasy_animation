import {endpoint, type Point} from '../components/characterMotion';

/** Local feet-origin puppet channels. Angles are degrees; y increases downward. */
export type CombatPose = {
  pelvisX:number; pelvisY:number; torso:number; hips:number; head:number;
  backUpper:number; backLower:number; frontUpper:number; frontLower:number;
  wrist:number; leftX:number; leftY:number; rightX:number; rightY:number;
  ankleL:number; ankleR:number; draw:number; fall:number; roar:number; width:number;
};
export type Fighter = {x:number;y:number;scale:number;facing:number;pose:CombatPose};
export type Species = 'human'|'goblin';
export const anatomy = {
  human:{shoulder:[29,-145] as Point,upper:34,lower:30,pivot:-88,blade:103},
  goblin:{shoulder:[33,-117] as Point,upper:33,lower:29,pivot:-62,blade:84},
};
export const rotate = (p:Point, angle:number, origin:Point=[0,0]):Point => {
  const a=angle*Math.PI/180,c=Math.cos(a),s=Math.sin(a),x=p[0]-origin[0],y=p[1]-origin[1];
  return [origin[0]+x*c-y*s,origin[1]+x*s+y*c];
};
export const torsoPoint = (p:Point,pose:CombatPose,species:Species):Point => {
  const r=rotate(p,pose.torso,[0,anatomy[species].pivot]);
  return [r[0]*pose.width+pose.pelvisX,r[1]+pose.pelvisY];
};
export const toWorld = (p:Point,f:Fighter):Point => [f.x+p[0]*f.scale*f.facing,f.y+p[1]*f.scale];
export const gripPoint = (pose:CombatPose,species:Species):Point => {
  const a=anatomy[species];
  return endpoint(endpoint(a.shoulder,a.upper,pose.frontUpper),a.lower+6,pose.frontLower);
};
export const weaponPoint = (f:Fighter,species:Species,distance:number):Point => {
  const grip=gripPoint(f.pose,species),a=f.pose.wrist*Math.PI/180;
  return toWorld(torsoPoint([grip[0]+Math.sin(a)*distance,grip[1]-Math.cos(a)*distance],f.pose,species),f);
};

/** Fixed-length arm IK, used to author contact poses, never a runtime simulation. */
export const aimContact = (f:Fighter,species:Species,target:Point,distance:number,angle:number):CombatPose => {
  const p={...f.pose},a=anatomy[species];
  const local:Point=[((target[0]-f.x)/(f.scale*f.facing)-p.pelvisX)/p.width,(target[1]-f.y)/f.scale-p.pelvisY];
  const contact=rotate(local,-p.torso,[0,a.pivot]);
  const radians=angle*Math.PI/180;
  const hand:Point=[contact[0]-Math.sin(radians)*distance,contact[1]+Math.cos(radians)*distance];
  const dx=hand[0]-a.shoulder[0],dy=hand[1]-a.shoulder[1];
  const length=Math.hypot(dx,dy),reach=Math.min(a.upper+a.lower+5.99,Math.max(2.01,length));
  const direction=Math.atan2(dx,dy),bend=Math.acos(Math.max(-1,Math.min(1,(a.upper*a.upper+reach*reach-(a.lower+6)**2)/(2*a.upper*reach))));
  const near=(angle:number,reference:number)=>reference+((angle-reference+540)%360)-180;
  const first=near((direction-bend)*180/Math.PI,p.frontUpper),second=near((direction+bend)*180/Math.PI,p.frontUpper);
  p.frontUpper=Math.abs(first-p.frontUpper)<Math.abs(second-p.frontUpper)?first:second;
  const elbow=endpoint(a.shoulder,a.upper,p.frontUpper);
  p.frontLower=near(Math.atan2(hand[0]-elbow[0],hand[1]-elbow[1])*180/Math.PI,p.frontLower);
  p.wrist=angle;
  return p;
};

/** Two unequal bones with a chosen bend side. */
export const jointBetween = (a:Point,b:Point,l1:number,l2:number,side:number):Point => {
  const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.max(.001,Math.hypot(dx,dy));
  const reach=Math.min(l1+l2-.001,Math.max(Math.abs(l1-l2)+.001,d));
  const along=(l1*l1-l2*l2+reach*reach)/(2*reach),h=Math.sqrt(Math.max(0,l1*l1-along*along));
  return [a[0]+dx/d*along+dy/d*h*side,a[1]+dy/d*along-dx/d*h*side];
};
