import {clamp,mix} from '../motion';
export type Emotion='neutral'|'happy'|'amused'|'sad'|'worried'|'surprised'|'confused'|'angry'|'frustrated'|'embarrassed'|'disappointed'|'relieved'|'suspicious'|'determined'|'restrained'|'exhausted';
export type Expression=Emotion|'quiet'|'asleep';
/** Continuous channels, in local SVG units except normalized gaze/lids/blush. */
export type FacePose={gazeX:number;gazeY:number;lidL:number;lidR:number;browLiftL:number;browLiftR:number;browAngleL:number;browAngleR:number;mouthWidth:number;mouthOpen:number;mouthCurve:number;mouthSkew:number;lipPress:number;teeth:number;blush:number;cheek:number;headTilt:number;headYaw:number;blink:number};
export const neutralFace:FacePose={gazeX:0,gazeY:0,lidL:1,lidR:1,browLiftL:0,browLiftR:0,browAngleL:0,browAngleR:0,mouthWidth:6,mouthOpen:0,mouthCurve:1,mouthSkew:0,lipPress:0,teeth:0,blush:0,cheek:0,headTilt:0,headYaw:0,blink:0};
export const expressionPresets:Record<Emotion,Partial<FacePose>>={
  neutral:{},
  happy:{lidL:.88,lidR:.88,browLiftL:1.5,browLiftR:1.5,mouthWidth:7.8,mouthCurve:5,cheek:.7},
  amused:{lidL:.85,lidR:.9,browLiftL:2,browLiftR:.5,mouthWidth:7,mouthCurve:3.8,mouthSkew:1.2,headTilt:-2,cheek:.4},
  sad:{lidL:.72,lidR:.72,browAngleL:-15,browAngleR:15,browLiftL:1,browLiftR:1,mouthCurve:-3,gazeY:.3,headTilt:3},
  worried:{lidL:.92,lidR:.88,browAngleL:-18,browAngleR:18,browLiftL:1,browLiftR:1,mouthCurve:-2.8,lipPress:.2},
  surprised:{lidL:1.2,lidR:1.2,browLiftL:4,browLiftR:4,mouthWidth:3.4,mouthOpen:5.2,mouthCurve:0},
  confused:{lidL:.85,lidR:1.08,browLiftL:-.5,browLiftR:3.3,browAngleL:9,browAngleR:8,mouthSkew:-1.5,mouthCurve:-.6,headTilt:4},
  angry:{lidL:.68,lidR:.68,browLiftL:-1.6,browLiftR:-1.6,browAngleL:21,browAngleR:-21,mouthCurve:-1.5,lipPress:.5},
  frustrated:{lidL:.6,lidR:.82,browLiftL:-1,browLiftR:.3,browAngleL:12,browAngleR:-15,mouthWidth:7,mouthCurve:-2,mouthSkew:1,lipPress:.65},
  embarrassed:{gazeY:.2,lidL:.82,lidR:.86,browAngleL:-7,browAngleR:7,mouthCurve:1.8,mouthSkew:1.5,lipPress:.3,blush:.25,headTilt:3},
  disappointed:{lidL:.58,lidR:.62,gazeY:.35,browAngleL:-10,browAngleR:10,mouthCurve:-2.5,mouthWidth:5.2,headTilt:2},
  relieved:{lidL:.6,lidR:.6,browLiftL:.7,browLiftR:.7,mouthCurve:3,mouthWidth:6.5,cheek:.2},
  suspicious:{lidL:.56,lidR:.81,browLiftL:-1,browLiftR:2,browAngleL:9,browAngleR:4,mouthWidth:5,mouthCurve:-.5,headTilt:-3},
  determined:{lidL:.87,lidR:.87,browAngleL:16,browAngleR:-16,browLiftL:-.4,browLiftR:-.4,mouthCurve:0,lipPress:.25},
  restrained:{lidL:.86,lidR:.87,browAngleL:-3,browAngleR:3,mouthWidth:5.5,mouthCurve:.2,lipPress:.4},
  exhausted:{lidL:.46,lidR:.5,browAngleL:-5,browAngleR:5,browLiftL:-.6,browLiftR:-.6,gazeY:.25,mouthCurve:-.8,mouthOpen:.3,headTilt:3},
};
export const blendFaces=(a:FacePose,b:FacePose,weight:number):FacePose=>Object.fromEntries(Object.keys(a).map(k=>[k,mix(a[k as keyof FacePose],b[k as keyof FacePose],clamp(weight))])) as FacePose;
export const expressionFace=(name:Expression,intensity=1):FacePose=>blendFaces(neutralFace,{...neutralFace,...(name==='asleep'?{lidL:0,lidR:0}:expressionPresets[name==='quiet'?'neutral':name])},intensity);
export const resolveFace=(expression:Expression,intensity=1,blend?:{expression:Expression;weight:number},controls:Partial<FacePose>={}):FacePose=>{
  const base=expressionFace(expression,intensity),mixed=blend?blendFaces(base,expressionFace(blend.expression,intensity),blend.weight):base;
  return {...mixed,...controls};
};
export type MouthShape='rest'|'closed'|'A'|'E'|'O'|'U'|'F';
export const mouthShapes:Record<MouthShape,Pick<FacePose,'mouthWidth'|'mouthOpen'|'teeth'|'lipPress'>>={
  rest:{mouthWidth:6,mouthOpen:0,teeth:0,lipPress:0},closed:{mouthWidth:5.5,mouthOpen:0,teeth:0,lipPress:.6},
  A:{mouthWidth:6.8,mouthOpen:7,teeth:.35,lipPress:0},E:{mouthWidth:8,mouthOpen:3.5,teeth:.7,lipPress:0},
  O:{mouthWidth:3.8,mouthOpen:6,teeth:0,lipPress:0},U:{mouthWidth:3,mouthOpen:3.6,teeth:0,lipPress:.1},F:{mouthWidth:6,mouthOpen:1.7,teeth:1,lipPress:.3},
};
