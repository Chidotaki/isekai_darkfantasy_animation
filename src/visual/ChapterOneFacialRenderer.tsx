import {useId} from 'react';
import {Artwork} from './LayeredCharacter';
import {chapterOneFaces,type ChapterFaceExpression,type ChapterFaceId,type FaceSprite} from './chapterOneFaces';

const AnchoredSprite = ({sprite,name}:{sprite:FaceSprite;name:string}) => {
  const uid=`face-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  const {source:[sx,sy],target:[tx,ty],scale,clip}=sprite;
  return <g data-face-layer={name} transform={`translate(${tx} ${ty}) scale(${scale}) translate(${-sx} ${-sy})`}>
    <defs><clipPath id={uid}>{sprite.mask?<path d={sprite.mask}/>:<rect x={clip[0]} y={clip[1]} width={clip[2]} height={clip[3]}/>}</clipPath></defs>
    <g clipPath={`url(#${uid})`}><Artwork source={{kind:'file',path:sprite.path,format:'png'}} layer={{offset:[0,0],size:sprite.size}}/></g>
  </g>;
};

/** Opt-in SVG renderer, 512px canvas. Same fixed-layer approach and Artwork
 * loader as Yuu; Yuu's tested renderer and all existing compositions stay intact.
 * blink 0..1, mouth 0..1 (closed/small/wide); omitted mouth uses expression. */
export const ChapterOneFacialRenderer = ({characterId,expression='neutral',blink=0,mouth}:{
  characterId:ChapterFaceId;expression?:ChapterFaceExpression;blink?:number;mouth?:number;
}) => {
  const rig=chapterOneFaces[characterId],face=rig.expressions[expression];
  if(!face)throw new Error(`Unsupported facial expression ${expression} for ${characterId}`);
  const eyes=blink>.72?'eyes_closed':blink>.18?'eyes_half_closed':face.eyes;
  const mouthName=mouth===undefined?face.mouth:mouth>.65?'mouth_open_wide':mouth>.2?'mouth_open_small':'mouth_neutral';
  return <g data-chapter-face={characterId}>
    {rig.behind.map(name=><AnchoredSprite key={name} name={name} sprite={rig.sprites[name]}/>)}
    <AnchoredSprite name={eyes} sprite={rig.sprites[eyes]}/>
    <AnchoredSprite name={face.brows} sprite={rig.sprites[face.brows]}/>
    <AnchoredSprite name={mouthName} sprite={rig.sprites[mouthName]}/>
    {rig.ahead.map(name=><AnchoredSprite key={name} name={name} sprite={rig.sprites[name]}/>)}
  </g>;
};
