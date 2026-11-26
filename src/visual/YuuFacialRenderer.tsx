import {useId} from 'react';
import {Artwork} from './LayeredCharacter';
import {yuuExpressionSprites,yuuFacialPath,yuuSpriteAnchors,type YuuSprite,type YuuFacialState} from './yuuFacialSprites';

const Sprite=({name}:{name:YuuSprite})=>{
  const calibration=yuuSpriteAnchors[name],uid=`yuu-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  const clip='clip' in calibration?calibration.clip:undefined;
  const [sx,sy]=calibration.source,[tx,ty]=calibration.target,s=calibration.scale;
  return <g data-yuu-sprite={name} transform={`translate(${tx} ${ty}) scale(${s}) translate(${-sx} ${-sy})`}>
    {clip&&<defs><clipPath id={uid}><rect x={clip[0]} y={clip[1]} width={clip[2]} height={clip[3]}/></clipPath></defs>}
    <g clipPath={clip?`url(#${uid})`:undefined}>
      <Artwork source={{kind:'file',path:`${yuuFacialPath}/${name}.png`,format:'png'}} layer={{offset:[0,0],size:[512,512]}}/>
    </g>
  </g>;
};

/** SVG host. Fixed base/head/hair; only eyes, eyebrows and mouth select another file.
 * neckOnly removes the supplied school-uniform bust when attaching to the existing body.
 */
export const YuuFacialRenderer=({expression='neutral',blink=0,mouth,neckOnly=false}:Partial<YuuFacialState>&{neckOnly?:boolean})=>{
  const face=yuuExpressionSprites[expression],uid=`yuu-neck-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  const eyes:YuuSprite=blink>.72?'eyes_closed':blink>.18?'eyes_half_closed':face.eyes;
  return <g data-yuu-face="facial-v1">
    {neckOnly&&<defs><clipPath id={uid}><rect x={0} y={0} width={512} height={360}/></clipPath></defs>}
    <g clipPath={neckOnly?`url(#${uid})`:undefined}>
      <Sprite name="back_hair"/>
      <Sprite name="base_head_neck"/>
      <Sprite name={eyes}/>
      <Sprite name={face.brows}/>
      <Sprite name={mouth??face.mouth}/>
      <Sprite name="front_hair"/>
    </g>
  </g>;
};
