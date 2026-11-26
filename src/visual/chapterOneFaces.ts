import type {YuuFaceExpression} from './yuuFacialSprites';

type Point = readonly [number, number];
export type FaceSprite = {
  path: string; size: Point;
  /** Measured source landmark -> fixed 512px face canvas landmark. */
  source: Point; target: Point; scale: number;
  clip: readonly [number, number, number, number];
  /** Optional feature outline where a supplied cell contains another feature. */
  mask?: string;
};
type Features = {eyes: string; brows: string; mouth: string};
export type ChapterFaceExpression = YuuFaceExpression | 'concerned' | 'stern';
export type FaceRig = {
  sprites: Record<string, FaceSprite>;
  behind: string[]; ahead: string[];
  expressions: Partial<Record<ChapterFaceExpression, Features>> & {neutral: Features};
};

// The supplied manifests incorrectly split these 4-column / 5-row atlases into
// 5 columns / 4 rows. Sample measured original atlas regions, never the cut cells
// or the assembled preview (top-right). No source artwork is regenerated.
const atlasSprite = (character: string, source: Point, target: Point, scale: number,
  clip: FaceSprite['clip']): FaceSprite => ({
  path: `assets/characters/${character}/facial-v1/${character.replace(/-/g,'_')}_facial_atlas_5x4_transparent.png`,
  size: [1672,941], source, target, scale, clip,
});
const k = (source: Point,target: Point,scale: number,clip: FaceSprite['clip']) =>
  atlasSprite('tachibana-kairyu',source,target,scale,clip);
const s = (source: Point,target: Point,scale: number,clip: FaceSprite['clip']) =>
  atlasSprite('minase-shiori',source,target,scale,clip);
const studentExpressions: FaceRig['expressions'] = {
  neutral:{eyes:'eyes_neutral',brows:'brows_neutral',mouth:'mouth_neutral'},
  happy:{eyes:'eyes_neutral',brows:'brows_soft',mouth:'mouth_smile'},
  worried:{eyes:'eyes_half_closed',brows:'brows_worried',mouth:'mouth_sad'},
  serious:{eyes:'eyes_neutral',brows:'brows_stern',mouth:'mouth_neutral'},
  surprised:{eyes:'eyes_surprised',brows:'brows_soft',mouth:'mouth_o'},
};
const kairyu: FaceRig = {
  behind:['back_hair','base_head_neck'], ahead:['front_hair'], expressions:studentExpressions,
  sprites:{
    back_hair:k([245,333],[256,450],1.2,[108,15,280,277]),
    base_head_neck:k([633,333],[256,450],1.2,[520,104,224,231]),
    front_hair:k([1025,333],[256,450],1.2,[885,15,285,240]),
    eyes_neutral:k([247,421],[256,282],.72,[120,397,253,54]),
    eyes_half_closed:k([636,421],[256,282],.72,[510,399,255,52]),
    eyes_closed:k([1023,423],[256,283],.72,[896,398,252,45]),
    eyes_surprised:k([1420,421],[256,282],.68,[1293,388,259,66]),
    brows_neutral:k([247,559],[256,255],.67,[119,540,260,33]),
    brows_soft:k([636,549],[256,249],.67,[509,524,259,44]),
    brows_worried:k([1026,552],[256,253],.67,[894,520,265,58]),
    brows_stern:k([1420,559],[256,257],.67,[1287,537,266,43]),
    mouth_neutral:k([250,700],[256,363],.5,[201,688,100,31]),
    mouth_smile:k([637,701],[256,363],.5,[574,682,126,47]),
    mouth_sad:k([1025,854],[256,363],.5,[954,835,143,32]),
    mouth_open_small:k([1025,701],[256,363],.48,[971,672,108,63]),
    mouth_open_wide:k([250,850],[256,363],.46,[190,806,118,88]),
    mouth_o:k([1422,700],[256,363],.5,[1388,660,66,79]),
  },
};
const shiori: FaceRig = {
  behind:['back_hair','base_head_neck'], ahead:['front_hair'], expressions:studentExpressions,
  sprites:{
    back_hair:s([260,360],[256,470],1.1,[135,12,250,352]),
    base_head_neck:s([650,360],[256,470],1.1,[530,99,240,265]),
    front_hair:s([1025,360],[256,470],1.1,[907,13,247,309]),
    eyes_neutral:s([251,452],[256,256],.64,[130,433,240,44]),
    eyes_half_closed:s([648,456],[256,256],.64,[524,442,249,36]),
    eyes_closed:s([1025,462],[256,260],.64,[904,451,242,24]),
    eyes_surprised:s([1420,451],[256,256],.64,[1298,423,241,62]),
    brows_neutral:s([253,574],[256,231],.62,[122,558,263,30]),
    brows_soft:s([648,567],[256,228],.62,[522,548,258,37]),
    brows_worried:s([1025,575],[256,231],.62,[893,547,263,45]),
    brows_stern:s([1420,578],[256,234],.62,[1289,553,267,44]),
    mouth_neutral:s([253,707],[256,322],.45,[218,695,70,24]),
    mouth_smile:s([648,707],[256,322],.45,[603,694,89,26]),
    mouth_sad:s([1025,854],[256,322],.45,[984,839,84,29]),
    mouth_open_small:s([1025,704],[256,322],.45,[986,680,78,48]),
    mouth_open_wide:s([252,849],[256,322],.40,[209,811,85,75]),
    mouth_o:s([1424,705],[256,322],.45,[1399,677,48,53]),
  },
};
const elderSprite = (name:string,source:Point,target:Point,scale:number,clip:FaceSprite['clip']):FaceSprite => ({
  path:`assets/npcs/elder-ritual-official/facial-v1/sprites/${name}.png`,size:[512,512],source,target,scale,clip,
});
const elder: FaceRig = {
  // Base already includes hair, beard and bust. Hair references are never loaded.
  behind:['base_head_neck'],ahead:[],
  expressions:{
    neutral:{eyes:'eyes_neutral',brows:'brows_neutral',mouth:'mouth_neutral'},
    concerned:{eyes:'eyes_half_closed',brows:'brows_worried',mouth:'mouth_neutral'},
    stern:{eyes:'eyes_stern',brows:'brows_stern',mouth:'mouth_neutral'},
  },
  sprites:{
    base_head_neck:elderSprite('base_head_neck_clean',[256,473],[256,473],1,[0,0,512,512]),
    eyes_neutral:elderSprite('eyes_neutral',[253,245],[253,216],.82,[132,209,242,72]),
    eyes_half_closed:elderSprite('eyes_half_closed',[253,245],[253,216],.82,[132,209,242,72]),
    eyes_closed:elderSprite('eyes_closed',[253,245],[253,216],.82,[132,209,242,72]),
    eyes_stern:elderSprite('eyes_stern',[253,245],[253,216],.82,[132,209,242,72]),
    brows_neutral:elderSprite('brows_neutral',[253,209],[253,191],.82,[132,186,242,46]),
    brows_worried:elderSprite('brows_worried',[253,209],[253,191],.82,[135,178,238,62]),
    // This cell also contains eyes and nose creases. Keep only its two brows.
    brows_stern:{...elderSprite('brows_stern',[253,209],[253,191],.82,[141,175,233,42]),
      mask:'M141 181 Q159 173 176 180 L241 207 L244 215 L228 213 L170 190 L141 187 Z M270 208 L336 180 Q356 174 374 181 L374 188 L341 191 L285 213 L269 215 Z'},
    mouth_neutral:elderSprite('mouth_neutral',[256,318],[254,302],.46,[204,303,104,31]),
    mouth_open_small:elderSprite('mouth_open_small',[256,318],[254,302],.46,[212,300,88,30]),
    mouth_open_wide:elderSprite('mouth_open_wide',[256,312],[254,302],.38,[204,285,105,53]),
    mouth_o:elderSprite('mouth_o',[256,318],[254,303],.30,[237,285,38,67]),
  },
};
export const chapterOneFaces = {'tachibana-kairyu':kairyu,'minase-shiori':shiori,'elder-ritual-official':elder};
export type ChapterFaceId = keyof typeof chapterOneFaces;
