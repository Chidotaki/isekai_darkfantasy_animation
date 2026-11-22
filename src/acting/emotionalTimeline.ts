import {neutral,smooth} from '../combat/animations';
import {plant,rootAt,type RootKey} from '../combat/timeline';
import type {CombatPose,Fighter} from '../combat/rig';
import {expressionFace,blendFaces,type Emotion,type FacePose} from '../components/faceRig';
import {addActing,samplePoseKeys,shoulderMotion,subtleBreath,type ActingCue,type PoseKey} from './acting';
import {gazeAt,handPoint,wristPoint,reachHand,objectHandoff} from './interactions';
import {speechAt,type SpeechCue} from './speech';
import {dialogue} from './dialogue';
import {frameShot,slowPushIn,slowPullback} from './camera';
import {mix} from '../motion';
export type StoryActor='ren'|'mira'|'elias';
export const handoffFrame=132,packetRestFrame=183;
export const handoffTargets={giver:[1150,698],receiver:[1240,698]} as const;
const base=(p:Partial<CombatPose>={}):CombatPose=>({...neutral,draw:0,pelvisY:0,leftX:-47,leftY:-31,rightX:48,rightY:-31,frontUpper:7,frontLower:-5,backUpper:-8,backLower:8,...p});
const braceletPose=()=>{const actor:Fighter={x:0,y:0,scale:1,facing:1,pose:base({head:1})};reachHand(actor,[31,-119]);return actor.pose;};
const yuuKeys:PoseKey[]=[
  [0,base({head:1,frontUpper:-6,frontLower:-10})],[68,base({head:-1})],
  [142,base({frontUpper:35,frontLower:65,wrist:0})],
  [183,base({frontUpper:-10,frontLower:-45,wrist:0})],[220,base()],
  [285,base({head:1,frontUpper:-8,frontLower:4})],[360,base()],
  [450,base({torso:-2,head:1})],[535,base({torso:-1})],
  [590,braceletPose()],
  [650,braceletPose()],
  [705,base({frontUpper:6,frontLower:-5})],[780,base({torso:1})],[899,base()],
];
const kairyuKeys:PoseKey[]=[
  [0,base({pelvisY:5,frontUpper:18,frontLower:18,backUpper:-16,backLower:12})],
  [70,base({pelvisY:5,frontUpper:20,frontLower:55})],[142,base({pelvisY:5,frontUpper:30,frontLower:70})],
  [180,base({pelvisY:5,frontUpper:20,frontLower:20})],[705,base({pelvisY:5,frontUpper:20,frontLower:20})],
  [752,base({pelvisY:5,frontUpper:35,frontLower:90,head:-1})],[799,base({pelvisY:5,frontUpper:24,frontLower:36})],
  [899,base({pelvisY:5,frontUpper:20,frontLower:25})],
];
const shioriKeys:PoseKey[]=[
  [0,base({torso:-3,head:-1,width:.9,frontUpper:-10,frontLower:-25})],
  [174,base({torso:-3,width:.9,frontUpper:-10,frontLower:-25})],
  [201,base({torso:4,head:-2,width:1,frontUpper:20,frontLower:90})],
  [280,base({torso:3,head:-1,frontUpper:26,frontLower:104})],
  [357,base({torso:2,head:-1,frontUpper:15,frontLower:35})],
  [397,base({torso:-4,head:1,width:.88,frontUpper:-10,frontLower:-25})],
  [899,base({torso:-3,width:.9,frontUpper:-10,frontLower:-25})],
];
const actingCues:Record<StoryActor,ActingCue[]>={
  ren:[{from:55,to:96,action:'listen',strength:.5},{from:132,to:151,action:'hesitate',strength:.4},{from:267,to:310,action:'nervousHands',strength:.35},{from:409,to:452,action:'avoidEyeContact',strength:.5},{from:500,to:540,action:'sigh',strength:.5},{from:550,to:700,action:'lookDown',strength:.6},{from:752,to:775,action:'hesitate',strength:.3},{from:793,to:899,action:'relax',strength:.6}],
  mira:[{from:185,to:207,action:'hesitate',strength:.3},{from:294,to:331,action:'listen',strength:.6},{from:360,to:411,action:'turnAway',strength:.7}],
  elias:[{from:144,to:190,action:'listen',strength:.6},{from:208,to:285,action:'listen',strength:.4},{from:430,to:470,action:'hesitate',strength:.3},{from:734,to:792,action:'reassure',strength:.25},{from:800,to:873,action:'listen',strength:.5}],
};
const kairyuRoot:RootKey[]=[[0,780,969],[55,1010,969],[160,1010,969],[190,976,969],[899,976,969]];
type EmotionKey=readonly [number,Emotion,number];
const emotions:Record<StoryActor,EmotionKey[]>={
  ren:[[0,'restrained',.25],[65,'amused',.48],[145,'happy',.35],[205,'neutral',.4],[244,'confused',.3],[278,'embarrassed',.5],[325,'amused',.3],[362,'relieved',.25],[405,'worried',.3],[453,'restrained',.6],[527,'disappointed',.3],[575,'restrained',.4],[701,'neutral',.35],[752,'surprised',.28],[784,'relieved',.3],[832,'happy',.45],[899,'happy',.35]],
  mira:[[0,'neutral',.45],[206,'happy',.5],[268,'amused',.55],[313,'confused',.2],[349,'happy',.4],[380,'relieved',.3],[415,'neutral',.4],[899,'neutral',.4]],
  elias:[[0,'happy',.4],[90,'happy',.45],[163,'relieved',.35],[290,'amused',.3],[425,'worried',.2],[680,'neutral',.3],[752,'happy',.42],[822,'neutral',.35],[899,'happy',.5]],
};
export const emotionAt=(frame:number,actor:StoryActor):FacePose=>{
  const keys=emotions[actor];
  for(let i=1;i<keys.length;i++)if(frame<=keys[i][0]){const a=keys[i-1],b=keys[i];return blendFaces(expressionFace(a[1],a[2]),expressionFace(b[1],b[2]),smooth((frame-a[0])/(b[0]-a[0])));}
  const last=keys[keys.length-1];return expressionFace(last[1],last[2]);
};
const actorBase=(frame:number,id:StoryActor):Fighter=>{
  const [x,y]=id==='elias'?rootAt(kairyuRoot,frame):id==='ren'?[1370,940]:[565,940];
  const pose=addActing(samplePoseKeys(frame,id==='ren'?yuuKeys:id==='mira'?shioriKeys:kairyuKeys),frame,actingCues[id]);
  pose.pelvisY+=subtleBreath(frame,id==='ren'?0:id==='mira'?2:4);
  const actor:Fighter={x,y,scale:id==='mira'?2.05:2.25,facing:id==='ren'?-1:1,pose};
  if(id==='elias'){plant(actor,kairyuRoot,frame,'human');const walking=1-smooth((frame-40)/15);pose.backUpper+=Math.sin(frame*.24)*10*walking;}
  return actor;
};
export const emotionalActor=(frame:number,id:StoryActor):Fighter=>{
  const actor=actorBase(frame,id),p=actor.pose;
  if(id==='elias'){
    const weight=smooth((frame-55)/26)*(1-smooth((frame-141)/28));
    reachHand(actor,handoffTargets.giver,1,weight);p.wrist=-p.torso;
  }
  if(id==='ren'){
    const weight=smooth((frame-99)/25)*(1-smooth((frame-143)/35));
    reachHand(actor,handoffTargets.receiver,1,weight);p.wrist=-p.torso;
    const touch=smooth((frame-586)/25)*(1-smooth((frame-650)/36));
    if(touch>0){const bracelet=wristPoint(actor);reachHand(actor,[bracelet[0]+Math.sin((frame-608)*.13)*1.6,bracelet[1]-2],-1,touch);}
  }
  return actor;
};
export const emotionalPerformance=(frame:number,id:StoryActor,cues:readonly SpeechCue[]=dialogue)=>{
  const actor=emotionalActor(frame,id),speech=speechAt(frame,id,cues),face=emotionAt(frame,id);
  const yuu=actorBase(frame,'ren'),kairyu=actorBase(frame,'elias');
  let target:readonly[number,number]=id==='ren'?[kairyu.x,kairyu.y-190*kairyu.scale]:[yuu.x,yuu.y-190*yuu.scale];
  let gaze=gazeAt(actor,target),yaw=0;
  if(id==='ren'){
    const window=(1-smooth((frame-35)/24))+smooth((frame-424)/24)*(1-smooth((frame-718)/37));
    const shiori=smooth((frame-195)/16)*(1-smooth((frame-419)/20));
    gaze={gazeX:mix(gaze.gazeX,1,shiori),gazeY:mix(gaze.gazeY,-.1,shiori)};
    gaze.gazeX=mix(gaze.gazeX,-.85,Math.min(1,window));yaw=-.55*Math.min(1,window);
    const down=smooth((frame-550)/24)*(1-smooth((frame-694)/30));gaze.gazeY=mix(gaze.gazeY,.9,down);gaze.gazeX=mix(gaze.gazeX,.05,down);yaw*=1-down;
  }
  if(id==='mira'){const joined=smooth((frame-178)/25)*(1-smooth((frame-363)/32));gaze={gazeX:mix(-.85,gaze.gazeX,joined),gazeY:mix(.1,gaze.gazeY,joined)};yaw=mix(-.65,.25,joined);}
  if(id==='elias'&&frame>190&&frame<370){const glance=smooth((frame-190)/20)*(1-smooth((frame-350)/20));gaze.gazeX=mix(gaze.gazeX,-.7,glance);}
  const micro=Math.sin(frame*.045+(id==='ren'?1:2))*.035;
  Object.assign(face,gaze,{headYaw:yaw,gazeX:gaze.gazeX+micro},speech.face);
  face.headTilt+=speech.nod;
  const shoulders=(id==='ren'&&(frame<180||frame>540&&frame<710))?0:shoulderMotion(frame,actingCues[id]);
  return {actor,face,shoulders,sleeve:id==='ren'?smooth((frame-628)/36)*.82:0,speech};
};
export const breakfastAt=(frame:number)=>objectHandoff(frame,handoffFrame,emotionalActor(frame,'elias'),emotionalActor(frame,'ren'));
export const emotionalCamera=(frame:number)=>{
  if(frame<180)return {x:1185,y:655,zoom:1.13};
  if(frame<360)return frameShot('twoShot',1010,510);
  if(frame<445)return {...frameShot('overShoulder',1395,465),zoom:1.85};
  if(frame<540)return slowPushIn(frame,445,540,frameShot('reaction',1385,482),.025);
  if(frame<720)return slowPushIn(frame,540,720,{...frameShot('medium',1395,445),zoom:2.35},.035);
  return slowPullback(frame,750,899,{x:1200,y:640,zoom:1.3},.045);
};
