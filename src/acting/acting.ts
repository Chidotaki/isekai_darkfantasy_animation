import {smooth,blendPose} from '../combat/animations';
import type {CombatPose} from '../combat/rig';
import {mix} from '../motion';
/** Sparse acting events settle back to a held pose; they are not perpetual sways. */
export type ActingAction='listen'|'hesitate'|'nervousHands'|'lookDown'|'avoidEyeContact'|'turnAway'|'sigh'|'relax'|'reassure';
export type ActingCue={from:number;to:number;action:ActingAction;strength?:number};
export const actingPresets:Record<ActingAction,Partial<CombatPose>>={
  listen:{head:-2,torso:1.5},hesitate:{head:2,torso:-1.2,pelvisY:-.8},
  nervousHands:{frontUpper:-7,frontLower:12,backUpper:5,backLower:9},
  lookDown:{head:4,torso:2},avoidEyeContact:{head:3,torso:-2},turnAway:{torso:-4,head:-3,width:-.08},
  sigh:{pelvisY:2,torso:2.5,head:2},relax:{pelvisY:1,torso:-1.2,head:1},
  reassure:{frontUpper:15,frontLower:27,head:-1,torso:1.2},
};
export const actingWeight=(f:number,cue:ActingCue)=>smooth((f-cue.from)/Math.min(15,(cue.to-cue.from)/3))*(1-smooth((f-cue.to+18)/18))*(cue.strength??1);
export const addActing=(pose:CombatPose,f:number,cues:readonly ActingCue[]):CombatPose=>{
  const p={...pose};
  for(const cue of cues){const w=actingWeight(f,cue);for(const [key,value] of Object.entries(actingPresets[cue.action]))p[key as keyof CombatPose]+=value*w;}
  return p;
};
export type PoseKey=readonly [number,CombatPose];
export const samplePoseKeys=(f:number,keys:readonly PoseKey[])=>{
  for(let i=1;i<keys.length;i++)if(f<=keys[i][0])return blendPose(keys[i-1][1],keys[i][1],smooth((f-keys[i-1][0])/(keys[i][0]-keys[i-1][0])));
  return {...keys[keys.length-1][1]};
};
export const subtleBreath=(f:number,seed=0)=>Math.sin(f*Math.PI*2/124+seed)*.45;
export const shoulderMotion=(f:number,cues:readonly ActingCue[])=>cues.reduce((v,c)=>v+actingWeight(f,c)*(c.action==='hesitate'?-1.3:c.action==='sigh'?1.8:c.action==='relax'?.7:0),0);
export const lookBetween=(f:number,from:number,to:number,start:number,end:number)=>mix(start,end,smooth((f-from)/(to-from)));
