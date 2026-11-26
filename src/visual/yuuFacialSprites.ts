import type {Point} from '../components/characterMotion';
import type {CharacterPerformance} from './types';

type SpriteAnchor = {
  /** Measured feature landmark in the 512px source cell, not the cell center. */
  source: Point; target: Point; scale: number;
  /** Source-space clip. Eye cells include brow marks; mouths include lip shading. */
  clip?: readonly [number,number,number,number];
};
export const yuuFacialPath='assets/characters/asakura-yuu/facial-v1/sprites';
/** Calibrated against the fixed base head and inspected source PNGs. No preview layer. */
export const yuuSpriteAnchors={
  // The supplied bald crown extends through the hair's open wisps. It is hidden
  // by this constant scalp crop; the face, ears, nose and neck never change.
  base_head_neck:{source:[253,356],target:[253,356],scale:1,clip:[0,112,512,400]},
  back_hair:{source:[256,93],target:[253,48],scale:.95},
  front_hair:{source:[256,123],target:[253,36],scale:1},
  eyes_neutral:{source:[256,263],target:[253,237],scale:.66,clip:[128,245,255,49]},
  eyes_half_closed:{source:[256,266],target:[253,237],scale:.67,clip:[133,251,246,39]},
  eyes_closed:{source:[256,268],target:[253,239],scale:.66,clip:[129,257,254,30]},
  eyes_surprised:{source:[256,263],target:[253,237],scale:.70,clip:[139,239,234,62]},
  brows_neutral:{source:[256,255],target:[253,211],scale:.62},
  brows_soft:{source:[256,252],target:[253,208],scale:.63},
  brows_worried:{source:[256,250],target:[253,211],scale:.70},
  brows_angry:{source:[256,255],target:[253,213],scale:.59},
  mouth_neutral:{source:[256,246],target:[253,309],scale:.36,clip:[202,234,107,20]},
  mouth_smile:{source:[256,247],target:[253,309],scale:.34},
  mouth_sad:{source:[256,249],target:[253,309],scale:.33},
  mouth_tense:{source:[256,241],target:[253,309],scale:.30},
  mouth_open_small:{source:[256,218],target:[253,307],scale:.35},
  mouth_open_wide:{source:[256,211],target:[253,306],scale:.35},
  mouth_open_narrow:{source:[256,240],target:[253,309],scale:.35},
  mouth_o:{source:[256,229],target:[253,307],scale:.40},
} as const satisfies Record<string,SpriteAnchor>;
export type YuuSprite=keyof typeof yuuSpriteAnchors;
export type YuuFaceExpression='neutral'|'happy'|'worried'|'serious'|'surprised';
export type YuuMouth=Extract<YuuSprite,`mouth_${string}`>;
export type YuuFacialState={expression:YuuFaceExpression;blink:number;mouth?:YuuMouth};
export const yuuExpressionSprites={
  neutral:{eyes:'eyes_neutral',brows:'brows_neutral',mouth:'mouth_neutral'},
  happy:{eyes:'eyes_neutral',brows:'brows_soft',mouth:'mouth_smile'},
  worried:{eyes:'eyes_half_closed',brows:'brows_worried',mouth:'mouth_sad'},
  serious:{eyes:'eyes_neutral',brows:'brows_angry',mouth:'mouth_neutral'},
  surprised:{eyes:'eyes_surprised',brows:'brows_soft',mouth:'mouth_o'},
} as const satisfies Record<YuuFaceExpression,{eyes:YuuSprite;brows:YuuSprite;mouth:YuuMouth}>;

/** Small adapter for the existing expression/blink/talk performance contract. */
export const yuuFaceFromPerformance=(p:CharacterPerformance):YuuFacialState=>{
  const name=p.expression.mix>=.5?(p.expression.to??p.expression.from):p.expression.from;
  const expression:YuuFaceExpression=['happy','amused','relieved'].includes(name)?'happy'
    :['surprised','fear'].includes(name)?'surprised'
    :['worried','sad','exhausted','disappointed'].includes(name)?'worried'
    :['determined','angry','frustrated','suspicious'].includes(name)?'serious':'neutral';
  const mouths={rest:undefined,closed:'mouth_neutral',A:'mouth_open_wide',E:'mouth_open_narrow',O:'mouth_o',U:'mouth_open_small',F:'mouth_tense'} as const;
  const mouth=p.mouth.weight>.2?mouths[p.mouth.mix>=.5?p.mouth.to:p.mouth.from]:undefined;
  return {expression,blink:p.face.blink,mouth};
};
