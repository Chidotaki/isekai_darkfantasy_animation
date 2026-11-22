import {clamp,mix} from '../motion';
import {mouthShapes,type FacePose,type MouthShape} from '../components/faceRig';
export type SpeechCue={actor:string;from:number;to:number;text?:string;envelope?:number[]};
const shapes:MouthShape[]=['A','E','closed','O','E','U','F'];
/** RMS drives the jaw; a small shape cycle approximates articulation, not phonemes. */
export const speechAt=(frame:number,actor:string,cues:readonly SpeechCue[])=>{
  const cue=cues.find(c=>c.actor===actor&&frame>=c.from&&frame<c.to);
  if(!cue)return {active:false,energy:0,face:{} as Partial<FacePose>,nod:0};
  const age=frame-cue.from;
  const read=(i:number)=>cue.envelope?.[Math.max(0,Math.floor(i))]??0;
  const energy=cue.envelope?clamp(read(age)*.6+read(age-1)*.2+read(age+1)*.2):clamp(Math.sin(age*.67)*.32+Math.sin(age*.37)*.25+.35);
  if(energy<.055)return {active:false,energy:0,face:{} as Partial<FacePose>,nod:0};
  const index=Math.floor(age/4)%shapes.length,p=(age%4)/4,a=mouthShapes[shapes[index]],b=mouthShapes[shapes[(index+1)%shapes.length]];
  return {active:true,energy,face:{mouthWidth:mix(a.mouthWidth,b.mouthWidth,p),mouthOpen:mix(a.mouthOpen,b.mouthOpen,p)*energy,mouthCurve:.3,teeth:mix(a.teeth,b.teeth,p),lipPress:mix(a.lipPress,b.lipPress,p)},nod:Math.sin(age*.18)*.8*energy};
};
