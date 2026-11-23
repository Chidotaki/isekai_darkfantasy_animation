import {idleMotion, blinkAmount, talkMotion, walkMotion} from '../components/characterMotion';
import {blendFaces, expressionFace, mouthShapes, type FacePose, type MouthShape} from '../components/faceRig';
import {neutral} from '../combat/animations';
import type {CombatPose} from '../combat/rig';
import type {CharacterPerformance, CharacterRig, VisualExpression} from './types';
import {provisionalRig} from './rig';
import {clamp} from '../motion';

export const visualFace = (name: VisualExpression, intensity = 1) => name==='fear'
  ? blendFaces(expressionFace('neutral'),blendFaces(expressionFace('worried'),expressionFace('surprised'),.45),clamp(intensity))
  : expressionFace(name,intensity);

export const samplePerformance = (frame: number, options: {
  fps?:number; seed?:number; pose?:'idle'|'walk'|'sit'|'talk'; walkStrength?:number; walkTime?:number;
  expression?:VisualExpression; nextExpression?:VisualExpression; expressionMix?:number;
  intensity?:number; face?:Partial<FacePose>; body?:Partial<CombatPose>;
  mouth?:MouthShape; rig?:CharacterRig;
} = {}): CharacterPerformance => {
  const t=frame/(options.fps??30),seed=options.seed??0,rig=options.rig??provisionalRig;
  const idle=idleMotion(t,seed),walk=walkMotion(options.walkTime??t,options.pose==='walk'?(options.walkStrength??1):0),talk=talkMotion(t,seed);
  const speaking=options.pose==='talk';
  const from=options.expression??'neutral',to=options.nextExpression,weight=clamp(options.expressionMix??0);
  const face=to?blendFaces(visualFace(from,options.intensity),visualFace(to,options.intensity),weight):visualFace(from,options.intensity);
  const blink=Math.max(blinkAmount(t,seed),options.face?.blink??0);
  const shapes:MouthShape[]=['A','E','closed','O','U','F'];
  const step=((t*6+seed)%shapes.length+shapes.length)%shapes.length;
  const mouthFrom=options.mouth??(speaking?shapes[Math.floor(step)]:'rest');
  const mouthTo=options.mouth??(speaking?shapes[(Math.floor(step)+1)%shapes.length]:'rest');
  const faceResult={...face,...(speaking?{mouthOpen:talk.mouthOpen,mouthWidth:talk.mouthWidth,teeth:talk.teeth}:{}),blink,...options.face};
  if(options.mouth) Object.assign(faceResult,mouthShapes[options.mouth]);
  return {
    body:{...neutral,draw:0,pelvisY:(options.pose==='sit'?35:0)+walk.drop,pelvisX:idle.sway*.25+walk.shift,
      torso:idle.lean*.45+walk.lean+(speaking?talk.lean*.35:0),head:idle.head*.5+(speaking?talk.head*.35:0),hips:0,
      backUpper:-14+walk.arm,frontUpper:14-walk.arm,backLower:7-walk.arm*.5,frontLower:-7+walk.arm*.5,wrist:0,
      leftX:rig.feet[0][0]+walk.left.x,leftY:rig.feet[0][1]+walk.left.y,
      rightX:rig.feet[1][0]+walk.right.x,rightY:rig.feet[1][1]+walk.right.y,
      ankleL:walk.left.angle,ankleR:walk.right.angle,...options.body},
    face:faceResult,expression:{from,to,mix:weight,intensity:clamp(options.intensity??1)},mouth:{from:mouthFrom,to:mouthTo,mix:speaking?step%1:0,weight:options.mouth?1:speaking?clamp(talk.mouth*3):0},
    headOffset:[faceResult.gazeX*.9, idle.rise*.15],breath:idle.breath,
    secondary:idle.secondary*.6+walk.secondary*.35,
  };
};

/** Reuse exact authored combat/acting channels instead of retiming their contact choreography. */
export const withExistingPose = (performance:CharacterPerformance, body:CombatPose):CharacterPerformance => ({...performance,body,breath:0});
