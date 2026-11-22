import {endpoint,type Point} from '../components/characterMotion';
import {gripPoint,jointBetween,rotate,torsoPoint,toWorld,type Fighter} from '../combat/rig';
import {smooth} from '../combat/animations';
import {mix} from '../motion';
export const gazeAt=(actor:Fighter,target:Point)=>({gazeX:Math.max(-1,Math.min(1,(target[0]-actor.x)*actor.facing/330)),gazeY:Math.max(-.6,Math.min(.6,(target[1]-(actor.y-190*actor.scale))/250))});
export const mutualGaze=(a:Fighter,b:Fighter)=>[gazeAt(a,[b.x,b.y-190*b.scale]),gazeAt(b,[a.x,a.y-190*a.scale])] as const;
export const handPoint=(actor:Fighter,side:1|-1=1,offset:Point=[0,0]):Point=>{
  const p=actor.pose,grip=side===1?gripPoint(p,'human'):endpoint(endpoint([-29,-145],34,p.backUpper),36,p.backLower),d=rotate(offset,side===1?p.wrist:0);
  return toWorld(torsoPoint([grip[0]+d[0],grip[1]+d[1]],p,'human'),actor);
};
export const wristPoint=(actor:Fighter):Point=>{
  const p=actor.pose,wrist=endpoint(endpoint([29,-145],34,p.frontUpper),30,p.frontLower);
  return toWorld(torsoPoint(wrist,p,'human'),actor);
};
/** Shared two-bone rig; a stable elbow side avoids flipping during a small reach. */
export const reachHand=(actor:Fighter,target:Point,side:1|-1=1,weight=1)=>{
  const p=actor.pose,local=rotate([((target[0]-actor.x)/(actor.scale*actor.facing)-p.pelvisX)/p.width,(target[1]-actor.y)/actor.scale-p.pelvisY],-p.torso,[0,-88]);
  const shoulder:Point=[side*29,-145],elbow=jointBetween(shoulder,local,34,36,side);
  const upper=Math.atan2(elbow[0]-shoulder[0],elbow[1]-shoulder[1])*180/Math.PI,lower=Math.atan2(local[0]-elbow[0],local[1]-elbow[1])*180/Math.PI;
  for(const [key,angle] of [[side===1?'frontUpper':'backUpper',upper],[side===1?'frontLower':'backLower',lower]] as const){const v=p[key];p[key]=mix(v,v+((angle-v+540)%360)-180,weight);}
};
export const objectHandoff=(f:number,at:number,giver:Fighter,receiver:Fighter,offset:Point=[20,-10])=>({owner:f<at?'giver':'receiver',point:handPoint(f<at?giver:receiver,1,offset)});
export const reactionAfter=(f:number,event:number,delay=9,duration=18)=>smooth((f-event-delay)/duration);
