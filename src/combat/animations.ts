import {clamp,mix} from '../motion';
import type {CombatPose} from './rig';

export const neutral:CombatPose={pelvisX:0,pelvisY:6,torso:0,hips:0,head:0,backUpper:-16,backLower:12,frontUpper:15,frontLower:-12,wrist:12,leftX:-25,leftY:-7,rightX:25,rightY:-7,ankleL:0,ankleR:0,draw:1,fall:0,roar:0,width:1};
type Key={at:number;pose:Partial<CombatPose>;ease?:'smooth'|'fast'|'linear'};
export type Clip=Key[];
const guard={...neutral,pelvisY:13,torso:8,hips:-5,head:-6,backUpper:-30,backLower:70,frontUpper:40,frontLower:112,wrist:38};
const brute={...neutral,pelvisY:8,torso:12,hips:-7,head:-7,backUpper:-38,backLower:34,frontUpper:25,frontLower:125,wrist:-22};

/** Anticipation / strike / follow-through / recovery are authored, reusable pose clips. */
export const combatClips = {
  battleIdle:[{at:0,pose:guard},{at:.5,pose:{pelvisY:14,head:-4,torso:9}},{at:1,pose:guard}],
  drawSword:[{at:0,pose:{...neutral,draw:0,frontUpper:-35,frontLower:-36,wrist:-120}},{at:.32,pose:{torso:-9,hips:6,head:8,frontUpper:-45,frontLower:-36}},{at:.65,pose:{draw:1,torso:4,hips:-4,frontUpper:65,frontLower:160,wrist:20}},{at:1,pose:guard}],
  forwardDash:[{at:0,pose:guard},{at:.28,pose:{pelvisY:25,torso:20,hips:-10,frontUpper:-30,frontLower:35,wrist:70}},{at:.68,pose:{pelvisY:17,torso:28,backUpper:-65,backLower:-25}},{at:1,pose:guard}],
  backstep:[{at:0,pose:guard},{at:.4,pose:{pelvisY:18,torso:-10,hips:8,frontLower:135,head:7}},{at:1,pose:guard}],
  sideDodge:[{at:0,pose:guard},{at:.25,pose:{pelvisY:25,torso:-14,hips:10}},{at:.55,pose:{pelvisY:31,torso:30,hips:-12,head:-25,frontUpper:0,frontLower:55,wrist:60,backUpper:-65,backLower:20}},{at:1,pose:guard}],
  horizontalSlash:[{at:0,pose:guard},{at:.28,pose:{pelvisX:-6,pelvisY:17,torso:-22,hips:12,head:18,frontUpper:-48,frontLower:150,wrist:-65,backUpper:-55,backLower:10}},{at:.42857142857142855,pose:{pelvisX:8,torso:22,hips:-12,head:-16,frontUpper:66,frontLower:75,wrist:75},ease:'fast'},{at:.64,pose:{pelvisX:10,torso:27,hips:-14,frontUpper:85,frontLower:115,wrist:110}},{at:1,pose:guard}],
  verticalSlash:[{at:0,pose:guard},{at:.28,pose:{pelvisY:9,torso:-14,hips:8,frontUpper:170,frontLower:205,wrist:0,backUpper:-30,backLower:120}},{at:.4,pose:{pelvisY:21,torso:26,hips:-10,head:-18,frontUpper:75,frontLower:45,wrist:130},ease:'fast'},{at:.68,pose:{pelvisY:26,torso:33,hips:-13,frontUpper:60,frontLower:110,wrist:70}},{at:1,pose:guard}],
  swordBlock:[{at:0,pose:guard},{at:.3,pose:{pelvisY:17,torso:-12,hips:8,frontUpper:60,frontLower:155,wrist:60,backUpper:40,backLower:135}},{at:.5,pose:{pelvisY:24,torso:-19,head:13,hips:12}},{at:.73,pose:{pelvisY:18,torso:-6,hips:5}},{at:1,pose:guard}],
  recovery:[{at:0,pose:guard},{at:.45,pose:{torso:-3,hips:3,pelvisY:11,head:4}},{at:1,pose:guard}],
  sheathe:[{at:0,pose:guard},{at:.25,pose:{torso:-8,hips:5,frontUpper:-42,frontLower:165,wrist:-120}},{at:.55,pose:{frontUpper:-38,frontLower:-36,wrist:-120,draw:1}},{at:.86,pose:{draw:0,torso:0,hips:0}},{at:1,pose:{...neutral,draw:0}}],
  aggressiveIdle:[{at:0,pose:brute},{at:.5,pose:{pelvisY:12,torso:17,head:-10}},{at:1,pose:brute}],
  roar:[{at:0,pose:brute},{at:.3,pose:{pelvisY:3,torso:-14,hips:8,head:-8,frontUpper:110,frontLower:175,wrist:-22,backUpper:-64,backLower:-30,roar:1}},{at:.7,pose:{torso:-9,head:4,roar:.8}},{at:1,pose:brute}],
  charge:[{at:0,pose:brute},{at:.2,pose:{pelvisY:18,torso:30,hips:-13,frontUpper:120,frontLower:165,wrist:-25}},{at:.8,pose:{torso:34,head:-24,backUpper:-65,backLower:-35}},{at:1,pose:brute}],
  heavySwing:[{at:0,pose:brute},{at:.32,pose:{pelvisY:3,torso:-20,hips:12,head:12,frontUpper:150,frontLower:195,wrist:-20,backUpper:55,backLower:160}},{at:.53,pose:{pelvisY:24,torso:36,hips:-12,head:-22,frontUpper:65,frontLower:130,wrist:80},ease:'fast'},{at:.68,pose:{pelvisY:28,torso:42,frontUpper:55,frontLower:150,wrist:60}},{at:1,pose:brute}],
  blockReaction:[{at:0,pose:brute},{at:.3,pose:{torso:-8,hips:7,frontUpper:35,frontLower:85,wrist:0,backUpper:20,backLower:130}},{at:.53,pose:{pelvisY:20,torso:-22,head:14,hips:12}},{at:1,pose:brute}],
  stagger:[{at:0,pose:brute},{at:.3,pose:{torso:-28,hips:14,head:24,pelvisY:15,frontUpper:50,frontLower:35,wrist:105,roar:.4}},{at:.65,pose:{torso:-15,hips:7,pelvisY:24,backUpper:-70,backLower:-15}},{at:1,pose:{...brute,pelvisY:25,torso:-18}}],
  fall:[{at:0,pose:{...brute,pelvisY:25,torso:-18}},{at:.3,pose:{pelvisY:39,torso:-30,head:20,fall:22,frontUpper:40,frontLower:10}},{at:.75,pose:{fall:82,pelvisY:30,torso:-12,hips:5,head:6,frontUpper:30,frontLower:-8,backUpper:-25,backLower:30}},{at:1,pose:{fall:88,pelvisY:30,head:9,roar:0}}],
} satisfies Record<string,Clip>;
export type CombatAction=keyof typeof combatClips;
export const blendPose=(a:CombatPose,b:CombatPose,p:number):CombatPose => Object.fromEntries(Object.keys(a).map(k=>[k,mix(a[k as keyof CombatPose],b[k as keyof CombatPose],p)])) as CombatPose;
export const smooth=(x:number)=>{const p=clamp(x);return p*p*(3-2*p);};
export const sampleClip=(name:CombatAction,progress:number):CombatPose=>{
  const keys:Clip=combatClips[name]; let previous={...neutral,...keys[0].pose};
  for(let i=1;i<keys.length;i++){
    const next={...previous,...keys[i].pose};
    if(progress<=keys[i].at){let p=clamp((progress-keys[i-1].at)/(keys[i].at-keys[i-1].at));p=keys[i].ease==='fast'?p*p:keys[i].ease==='linear'?p:smooth(p);return blendPose(previous,next,p);}
    previous=next;
  }
  return previous;
};

