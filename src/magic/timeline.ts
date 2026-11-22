import {blendPose,neutral,sampleClip,smooth} from '../combat/animations';
import {aimContact,weaponPoint,gripPoint,rotate,torsoPoint,toWorld,type CombatPose,type Fighter} from '../combat/rig';
import {rootAt,plant,type RootKey} from '../combat/timeline';
import type {Point} from '../components/characterMotion';
import {mix} from '../motion';
import {fireCast,spellConfigs} from './spells';
export const magicCues={launch:fireCast.release,pillar:fireCast.release+spellConfigs.fireProjectile.travel,shield:375,disarm:420,staffLands:445} as const;
export const pillarContact:Point=[916,740];
export const barrierContact:Point=[1330,650];
const guard={...sampleClip('battleIdle',0),draw:0};
const mageGuard={...neutral,draw:0,pelvisY:10,frontUpper:30,frontLower:125,wrist:4,backUpper:-25,backLower:35};
type Key=readonly [number,CombatPose];
const h=(p:Partial<CombatPose>={}):CombatPose=>({...guard,...p});
const m=(p:Partial<CombatPose>={}):CombatPose=>({...mageGuard,...p});
const heroKeys:Key[]=[
  [0,h({frontUpper:10,frontLower:10,wrist:0})],[68,h({head:-5})],
  [82,h({pelvisY:28,torso:-16,hips:8,head:8})],
  [106,h({pelvisY:49,torso:28,hips:-14,head:-20,frontUpper:-20,frontLower:55,backUpper:-65,backLower:20})],
  [132,h({pelvisY:41,torso:19,head:-16})],[153,h({pelvisY:17,torso:4,head:9,frontUpper:8,frontLower:12})],
  // Reach to the belt pouch, lift the physical roll, then open it at chest height.
  [171,h({torso:8,head:12,frontUpper:-38,frontLower:-25,wrist:-25})],
  [185,h({torso:4,head:5,frontUpper:90,frontLower:145,wrist:0,backUpper:85,backLower:145})],
  [209,h({torso:8,head:3,frontUpper:95,frontLower:145,wrist:0,backUpper:85,backLower:135})],
  [226,h({torso:15,head:3,frontUpper:110,frontLower:145,wrist:25,backUpper:80,backLower:130})],
  [256,h({torso:12,head:3,frontUpper:105,frontLower:145,wrist:25,backUpper:75,backLower:130})],
  [276,h({frontUpper:18,frontLower:35,wrist:30,head:8})],
  [292,h({frontUpper:12,frontLower:10,wrist:35})],
  [310,{...sampleClip('drawSword',.32),draw:0}],[330,{...sampleClip('drawSword',1),draw:1}],
  [350,{...sampleClip('forwardDash',.6),draw:1}],
  [365,{...sampleClip('horizontalSlash',.28),draw:1}],
  [375,{...sampleClip('horizontalSlash',.43),draw:1}],
  [390,{...sampleClip('swordBlock',.5),draw:1}],
  [404,{...sampleClip('horizontalSlash',.28),draw:1}],
  [420,{...sampleClip('horizontalSlash',.43),draw:1}],
  [434,h({draw:1,torso:12,frontUpper:55,frontLower:110,wrist:80})],
  [457,h({draw:1,head:-5,frontUpper:28,frontLower:75,wrist:65})],
  [539,h({draw:1,head:0,frontUpper:30,frontLower:80,wrist:65})],
];
const mageKeys:Key[]=[
  [0,m()],[30,m({head:-6})],
  [54,m({torso:-12,hips:6,frontUpper:40,frontLower:145,wrist:-14,backUpper:60,backLower:140})],
  [85,m({torso:-15,head:8,frontUpper:65,frontLower:155,wrist:5,backUpper:75,backLower:155})],
  [94,m({torso:18,hips:-9,head:-9,frontUpper:75,frontLower:110,wrist:48,backUpper:60,backLower:95})],
  [110,m({torso:23,hips:-12,head:-12,frontUpper:68,frontLower:105,wrist:53})],
  [144,m()],[270,m({head:9,backUpper:20,backLower:85})],
  [310,m({torso:-7,head:-8,backUpper:70,backLower:140})],
  [347,m({torso:-10,head:6,frontUpper:55,frontLower:150,wrist:-8})],
  [367,m({torso:-8,frontUpper:55,frontLower:125,wrist:10,backUpper:80,backLower:120})],
  [375,m({torso:-17,hips:9,pelvisY:20,head:12,frontUpper:40,frontLower:135,wrist:-7,backUpper:70,backLower:130})],
  [390,m({torso:-3,frontUpper:50,frontLower:140,wrist:5})],
  [410,m({torso:-8,frontUpper:55,frontLower:140,wrist:8,backUpper:65,backLower:140})],
  [420,m({torso:-8,frontUpper:55,frontLower:140,wrist:8,backUpper:65,backLower:140})],
  [432,m({torso:-25,hips:13,pelvisY:28,head:19,frontUpper:75,frontLower:170,wrist:-20,backUpper:-35,backLower:10})],
  [457,m({torso:-12,hips:8,pelvisY:20,head:8,frontUpper:40,frontLower:105,backUpper:40,backLower:100})],
  [539,m({torso:-8,hips:5,pelvisY:15,head:9,frontUpper:45,frontLower:110,backUpper:35,backLower:95})],
];
const heroRoot:RootKey[]=[[0,1040,895],[76,1040,895],[112,695,885],[153,650,885],[292,650,885],[330,920,930],[360,1040,905],[381,1040,905],[394,1010,905],[420,1155,895],[441,1180,895],[539,1180,895]];
const mageRoot:RootKey[]=[[0,1510,885],[367,1510,885],[387,1540,885],[420,1540,885],[444,1610,885],[539,1610,885]];
const poseAt=(keys:Key[],f:number)=>{
  for(let i=1;i<keys.length;i++)if(f<=keys[i][0])return blendPose(keys[i-1][1],keys[i][1],smooth((f-keys[i-1][0])/(keys[i][0]-keys[i-1][0])));
  return {...keys[keys.length-1][1]};
};
const baseActor=(f:number,who:'ren'|'mage'):Fighter=>{
  const ren=who==='ren',roots=ren?heroRoot:mageRoot,[x,y]=rootAt(roots,f);
  const actor={x,y,scale:2.05,facing:ren?1:-1,pose:poseAt(ren?heroKeys:mageKeys,f)};
  plant(actor,roots,f,'human');
  if(f<65||f>460){actor.pose.head+=Math.sin(f*.065)*1.3;actor.pose.torso+=Math.sin(f*.08)*.6;}
  return actor;
};
export const disarmContact=()=>weaponPoint(baseActor(420,'mage'),'human',-24);
export const magicActor=(f:number,who:'ren'|'mage'):Fighter=>{
  const actor=baseActor(f,who);
  if(who==='ren')for(const c of [{at:375,target:barrierContact,distance:92,angle:45},{at:420,target:disarmContact(),distance:88,angle:25}]){
    const weight=smooth((f-c.at+9)/9)*(1-smooth((f-c.at-1)/12));
    if(weight<=0)continue;
    const base=baseActor(c.at,who),solved=aimContact(base,'human',c.target,c.distance,c.angle);
    for(const channel of ['frontUpper','frontLower','wrist'] as const){const a=base.pose[channel],b=a+((solved[channel]-a+540)%360)-180;actor.pose[channel]=mix(actor.pose[channel],b,weight);}
  }
  return actor;
};
export const staffPoint=(f:number,distance=112)=>weaponPoint(magicActor(f,'mage'),'human',distance);
export const scrollPoint=(f:number,offset:Point=[0,0])=>{
  const actor=magicActor(f,'ren'),grip=gripPoint(actor.pose,'human'),d=rotate(offset,actor.pose.wrist);
  return toWorld(torsoPoint([grip[0]+d[0],grip[1]+d[1]],actor.pose,'human'),actor);
};
export const projectilePoint=(f:number):Point=>{
  const origin=staffPoint(magicCues.launch),p=Math.max(0,Math.min(1,(f-magicCues.launch)/(magicCues.pillar-magicCues.launch)));
  return [mix(origin[0],pillarContact[0],p),mix(origin[1],pillarContact[1],p)-Math.sin(p*Math.PI)*26];
};
