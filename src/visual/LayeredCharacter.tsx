import {createElement, useId, type ReactNode} from 'react';
import {Img, staticFile} from 'remotion';
import {selectLayerSources} from './assets';
import {multiply, solveRig, type Matrix} from './rig';
import type {CharacterAppearance, CharacterLayer, CharacterPerformance, LayerSource} from './types';
import type {VisualStyle} from './style';

export const Artwork = ({source,layer}:{source:LayerSource;layer:Pick<CharacterLayer,'offset'|'size'>}) => {
  const [x,y]=layer.offset,[width,height]=layer.size;
  const clipId=`sheet-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  if(source.kind==='file'&&source.region){
    const {rect,mask,sheetSize,silhouette}=source.region;
    return <svg x={x} y={y} width={width} height={height} viewBox={rect.join(' ')} overflow="hidden">
      <defs><clipPath id={clipId}><path d={mask}/></clipPath>{silhouette&&<clipPath id={`${clipId}-paper`}><path d={silhouette}/></clipPath>}</defs>
      <g clipPath={`url(#${clipId})`}><foreignObject x={0} y={0} width={sheetSize[0]} height={sheetSize[1]} clipPath={silhouette?`url(#${clipId}-paper)`:undefined}>
        <Img src={staticFile(source.path)} style={{width:'100%',height:'100%',display:'block'}}/>
      </foreignObject></g>
    </svg>;
  }
  if(source.kind==='file')return <foreignObject x={x} y={y} width={width} height={height}>
    <Img src={staticFile(source.path)} style={{width:'100%',height:'100%',display:'block'}}/>
  </foreignObject>;
  return <svg x={x} y={y} width={width} height={height} viewBox={source.viewBox.join(' ')} overflow="visible">
    {source.shapes.map((shape,i)=>createElement(shape.tag,{...shape.props,key:i}))}
  </svg>;
};

const Layer = ({layer,matrix,performance,costume,uid,style}: {
  layer:CharacterLayer;matrix:Matrix;performance:CharacterPerformance;costume:string;uid:string;style:VisualStyle;
}) => {
  const sources=selectLayerSources(layer,performance,costume);
  const anchor=layer.anchor??[0,0],sx=layer.scale?.[0]??1,sy=layer.scale?.[1]??1;
  const pupil=layer.motion==='pupil';
  const gain=layer.role==='shadow'?(style.shadow??1):layer.role==='highlight'?(style.highlight??1):1;
  const expressionGain=layer.expressionOpacity?((layer.expressionOpacity[performance.expression.from]??0)*(1-performance.expression.mix)
    +(layer.expressionOpacity[performance.expression.to??performance.expression.from]??0)*performance.expression.mix)*performance.expression.intensity:0;
  const activity=layer.motion==='blink'?performance.face.blink
    :layer.motion==='speech'?Math.max(performance.mouth.weight,expressionGain):1;
  const clipId=`${uid}-${layer.id}`;
  return <g transform={`matrix(${(layer.bind?multiply(matrix,layer.bind):matrix).join(' ')})`} opacity={(layer.opacity??1)*gain*activity}>
    {layer.clip&&<defs><clipPath id={clipId}><ellipse rx={layer.clip.rx} ry={layer.clip.ry}/></clipPath></defs>}
    <g clipPath={layer.clip?`url(#${clipId})`:undefined}>
      <g transform={`translate(${pupil?performance.face.gazeX*2.2:0} ${pupil?performance.face.gazeY*1.7:0}) translate(${anchor.join(' ')}) rotate(${layer.rotation??0}) scale(${sx} ${sy}) translate(${-anchor[0]} ${-anchor[1]})`}>
        {sources.filter(v=>v.opacity>.001).map(({source,opacity},i)=><g key={i} opacity={opacity}><Artwork source={source} layer={layer}/></g>)}
      </g>
    </g>
  </g>;
};

/** SVG host required. Remotion Img waits for local PNG/WebP/SVG decoding before capturing a frame. */
export const LayeredCharacter = ({appearance,performance,x,y,scale=1,facing=1,costume='student',style={},heldItem}: {
  appearance:CharacterAppearance;performance:CharacterPerformance;x:number;y:number;scale?:number;facing?:1|-1;
  costume?:string;style?:VisualStyle;heldItem?:ReactNode;
}) => {
  const uid=useId().replace(/[^a-zA-Z0-9_-]/g,''),matrices=solveRig(appearance.rig,performance);
  if(!appearance.costumes.includes(costume))throw Error(`Unsupported costume ${costume} for ${appearance.id}`);
  const correction=style.brightness!==undefined||style.saturation!==undefined
    ?`brightness(${style.brightness??1}) saturate(${style.saturation??1})`:undefined;
  return <g transform={`translate(${x} ${y}) scale(${scale*facing} ${scale})`} opacity={style.opacity??1} style={{filter:correction}}>
    {appearance.layers.map(layer=><Layer key={layer.id} layer={layer} matrix={matrices[layer.bone]}
      performance={performance} costume={costume} uid={uid} style={style}/>)}
    {heldItem&&<g transform={`matrix(${matrices.handR.join(' ')})`}>{heldItem}</g>}
  </g>;
};
