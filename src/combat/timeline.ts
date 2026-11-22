import {mix,clamp} from '../motion';
import {blendPose,sampleClip,smooth,type CombatAction} from './animations';
import {aimContact,rotate,weaponPoint,type Fighter,type CombatPose,type Species} from './rig';
import type {Point} from '../components/characterMotion';

export const impacts={ground:108,clash:147,block:216,finish:330,fall:356} as const;
/** A two-frame hold with an eight-frame catch-up keeps subsequent cues on time. */
export const fightFrame=(frame:number)=>{
  for(const at of [impacts.clash,impacts.block,impacts.finish]){
    if(frame>=at&&frame<at+2)return at;
    if(frame>=at+2&&frame<at+10)return at+(frame-at-2)*1.25;
  }
  return frame;
};
type Cue={from:number;to:number;action:CombatAction};
export const heroCues:Cue[]=[
  {from:0,to:15,action:'battleIdle'},{from:15,to:58,action:'drawSword'},
  {from:58,to:88,action:'battleIdle'},{from:88,to:120,action:'sideDodge'},
  {from:120,to:135,action:'forwardDash'},{from:135,to:163,action:'horizontalSlash'},
  {from:163,to:183,action:'backstep'},{from:183,to:202,action:'battleIdle'},
  {from:202,to:237,action:'swordBlock'},{from:237,to:273,action:'recovery'},
  {from:273,to:302,action:'sideDodge'},{from:302,to:316,action:'forwardDash'},
  {from:316,to:351,action:'verticalSlash'},{from:351,to:385,action:'recovery'},
  {from:385,to:422,action:'sheathe'},{from:422,to:450,action:'battleIdle'},
];
export const goblinCues:Cue[]=[
  {from:0,to:24,action:'aggressiveIdle'},{from:24,to:61,action:'roar'},
  {from:61,to:88,action:'charge'},{from:88,to:124,action:'heavySwing'},
  {from:124,to:163,action:'blockReaction'},{from:163,to:185,action:'aggressiveIdle'},
  {from:185,to:201,action:'charge'},{from:201,to:237,action:'heavySwing'},
  {from:237,to:271,action:'aggressiveIdle'},{from:271,to:306,action:'charge'},
  {from:306,to:330,action:'heavySwing'},{from:330,to:344,action:'stagger'},
  {from:344,to:362,action:'fall'},{from:362,to:450,action:'fall'},
];
export type RootKey=readonly [number,number,number];
const heroRoot:RootKey[]=[[0,560,880],[88,560,880],[108,460,800],[120,460,800],[139,670,880],[147,670,880],[161,610,880],[180,590,880],[215,590,880],[226,550,880],[273,550,880],[293,490,790],[313,1080,825],[325,1080,880],[423,1080,880],[449,1320,880]];
const goblinRoot:RootKey[]=[[0,1580,880],[58,1350,880],[66,1350,880],[91,1050,880],[153,1050,880],[179,1140,880],[192,1140,880],[213,940,880],[242,940,880],[270,1000,880],[303,760,880],[330,760,880],[346,780,880],[449,780,880]];
export const rootAt=(keys:RootKey[],f:number):Point=>{
  for(let i=1;i<keys.length;i++)if(f<=keys[i][0]){const a=keys[i-1],b=keys[i],p=smooth((f-a[0])/(b[0]-a[0]));return [mix(a[1],b[1],p),mix(a[2],b[2],p)];}
  return [keys[keys.length-1][1],keys[keys.length-1][2]];
};
const poseAt=(cues:Cue[],f:number):CombatPose=>{
  const index=Math.max(0,cues.findIndex(c=>f<c.to)),cue=cues[index],p=clamp((f-cue.from)/(cue.to-cue.from));
  let pose=sampleClip(cue.action,p);
  if(index>0&&f<cue.from+5){const previous=cues[index-1];pose=blendPose(sampleClip(previous.action,1),pose,smooth((f-cue.from)/5));}
  return pose;
};

/** Alternating world-space footprints stay fixed through stance, lift only during transfer. */
const footAt=(roots:RootKey[],f:number,side:number,species:Species,fast=false):{point:Point;angle:number}=>{
  const period=species==='human'?(fast?6:10):12,phase=side<0?0:period/2;
  const cycle=Math.floor((f+phase)/period)*period-phase,within=f-cycle;
  const a=rootAt(roots,Math.max(0,cycle)),b=rootAt(roots,Math.max(0,cycle+period));
  const offset=side*(species==='human'?48:51),p=smooth((within-period*.4)/(period*.6));
  const travel=Math.hypot(b[0]-a[0],b[1]-a[1]),lift=Math.sin(p*Math.PI)*Math.min(species==='human'?26:20,travel*.5);
  return {point:[mix(a[0],b[0],p)+offset,mix(a[1],b[1],p)-15-lift],angle:-Math.sin(p*Math.PI)*Math.min(12,travel*.2)};
};
export const plant=(fighter:Fighter,roots:RootKey[],f:number,species:Species)=>{
  const p=fighter.pose;
  for(const side of [-1,1]){
    const slow=footAt(roots,f,side,species),fast=footAt(roots,f,side,species,true);
    const pace=species==='human'?smooth((f-290)/5)*(1-smooth((f-315)/6)):0;
    const foot={point:[mix(slow.point[0],fast.point[0],pace),mix(slow.point[1],fast.point[1],pace)] as Point,angle:mix(slow.angle,fast.angle,pace)};
    const local:Point=[(foot.point[0]-fighter.x)/(fighter.scale*fighter.facing),(foot.point[1]-fighter.y)/fighter.scale];
    // Swap anatomical feet when facing reverses; their world positions do not jump.
    const left=side*fighter.facing<0;
    if(left){p.leftX=local[0];p.leftY=local[1];p.ankleL=foot.angle;}else{p.rightX=local[0];p.rightY=local[1];p.ankleR=foot.angle;}
  }
  const h=species==='human'?85:58,width=species==='human'?16:20,reach=species==='human'?79:58;
  // Lower the pelvis rather than stretching a grounded leg during a wide lunge.
  for(const side of [-1,1]){
    const hip=rotate([side*width,-h],p.hips,[0,-h]);
    const fx=side<0?p.leftX:p.rightX,fy=side<0?p.leftY:p.rightY;
    const dx=fx-p.pelvisX-hip[0];
    p.pelvisY=Math.max(p.pelvisY,fy-hip[1]-Math.sqrt(Math.max(100,reach*reach-dx*dx)));
  }
};

export const contacts = [
  {at:impacts.ground,who:'goblin',point:[840,877] as Point,distance:80,angle:148},
  {at:impacts.clash,who:'human',point:[900,650] as Point,distance:82,angle:70},
  {at:impacts.clash,who:'goblin',point:[900,650] as Point,distance:57,angle:45},
  {at:impacts.block,who:'human',point:[800,610] as Point,distance:82,angle:70},
  {at:impacts.block,who:'goblin',point:[800,610] as Point,distance:69,angle:144},
  {at:impacts.finish,who:'human',point:[794,663] as Point,distance:91,angle:112},
] as const;

const baseFighter=(f:number,species:Species):Fighter=>{
  const human=species==='human',roots=human?heroRoot:goblinRoot;
  const [x,y]=rootAt(roots,f),pose=poseAt(human?heroCues:goblinCues,f);
  const fighter:Fighter={x,y,scale:human?2.15:2.2,facing:human?(f<307?1:f<422?-1:1):-1,pose};
  if(human&&f<21){const entry=smooth((f-14)/7);pose.draw=0;pose.frontUpper=mix(15,pose.frontUpper,entry);pose.frontLower=mix(-12,pose.frontLower,entry);pose.wrist=mix(-120,pose.wrist,entry);}
  if(human&&f>=360&&f<395){const relaxed={...sampleClip('sheathe',1),draw:1,frontUpper:22,frontLower:20,wrist:125};Object.assign(pose,blendPose(pose,relaxed,smooth((f-360)/20)*(1-smooth((f-385)/10))));}
  if(human&&f>=422){Object.assign(pose,sampleClip('sheathe',1));pose.backUpper=-12+Math.sin(f*.6)*14;pose.frontUpper=12-Math.sin(f*.6)*14;pose.torso=4;}
  if(human)pose.width=1-.22*Math.max(1-smooth(Math.abs(f-307)/6),1-smooth(Math.abs(f-422)/6));
  if(!human&&f>=362)Object.assign(pose,sampleClip('fall',1));
  plant(fighter,roots,Math.min(f,human?449:344),species);
  // Slow breathing is additive only away from contact and defeat.
  if(f<85||(f>245&&f<270)||(human&&f>365&&f<385)){pose.pelvisY+=Math.sin(f*.09)*(human?.6:1.2);pose.head+=Math.sin(f*.06)*1.2;}
  return fighter;
};

export const sampleFighter=(frame:number,species:Species):Fighter=>{
  const f=fightFrame(frame),fighter=baseFighter(f,species),pose=fighter.pose;
  for(const c of contacts){
    if(c.who!==species)continue;
    const weight=smooth((f-c.at+7)/7)*(1-smooth((f-c.at-2)/7));
    if(weight<=0)continue;
    // Author one reachable contact pose, then interpolate angles into/out of it.
    // Solving IK anew at every intermediate frame can flip an elbow's bend branch.
    const contactBase=baseFighter(c.at,species),target=aimContact(contactBase,species,c.point,c.distance,c.angle);
    for(const key of ['frontUpper','frontLower','wrist'] as const){
      const reference=contactBase.pose[key];
      const angle=reference+((target[key]-reference+540)%360)-180;
      pose[key]=mix(pose[key],angle,weight);
    }
  }
  // A blocked swing recoils from its actual contact pose rather than cutting
  // through the defender. Likewise, the grounded club lifts out of the earth.
  const recoveries: {who:Species;at:number;end:number;action:CombatAction}[]=[
    {who:'goblin',at:108,end:124,action:'aggressiveIdle'},
    {who:'human',at:147,end:163,action:'battleIdle'},
    {who:'goblin',at:216,end:237,action:'aggressiveIdle'},
  ];
  for(const recovery of recoveries){
    if(species!==recovery.who||f<=recovery.at||f>=recovery.end)continue;
    const start=sampleFighter(recovery.at,species).pose,end=sampleClip(recovery.action,0);
    const recovered=blendPose(start,end,smooth((f-recovery.at)/(recovery.end-recovery.at)));
    for(const key of ['pelvisX','pelvisY','torso','hips','head','frontUpper','frontLower','backUpper','backLower','wrist'] as const)pose[key]=recovered[key];
  }
  return fighter;
};

export const contactError=(at:number,species:Species,target:Point,distance:number)=>{
  const p=weaponPoint(sampleFighter(at,species),species,distance);return Math.hypot(p[0]-target[0],p[1]-target[1]);
};
