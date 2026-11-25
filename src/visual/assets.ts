import {isPublicAssetPath} from '../production/assetRegistry';
import type {CharacterAppearance, CharacterLayer, LayerSource, CharacterPerformance} from './types';

export const layerSources = (layer:CharacterLayer):LayerSource[] => [layer.source,
  ...Object.values(layer.expressions??{}),...Object.values(layer.mouths??{}),
  ...Object.values(layer.costumes??{}).filter((v):v is LayerSource=>v!==null)];

/** Validate and sort once at import time. No fetch, filesystem reads or per-frame sorting. */
export const prepareAppearance = (appearance:CharacterAppearance):CharacterAppearance => {
  const ids=new Set<string>();
  if(!appearance.id||!appearance.version||!appearance.layers.length)throw Error('Appearance needs ID, version and layers.');
  const rig=appearance.rig;
  if(![rig.upperArm,rig.forearm,rig.thigh,rig.shin].every(n=>Number.isFinite(n)&&n>0))throw Error('Invalid rig lengths.');
  const points=[rig.torsoPivot,rig.neck,...rig.shoulders,...rig.hips,...rig.feet,...rig.eyes,rig.mouth,rig.hairPivot??[0,0],rig.scarfPivot??[0,0]];
  if(!points.flat().every(Number.isFinite)||!Number.isFinite(rig.handOffset)||rig.handOffset<0)throw Error('Invalid rig anchors.');
  for(const layer of appearance.layers){
    if(!/^[a-zA-Z0-9_-]+$/.test(layer.id)||ids.has(layer.id))throw Error(`Invalid or duplicate layer: ${layer.id}`);ids.add(layer.id);
    if(![...layer.offset,...layer.size,...(layer.anchor??[]),...(layer.scale??[]),...(layer.bind??[]),layer.rotation??0,layer.opacity??1,layer.order].every(Number.isFinite)||layer.size.some(v=>v<=0))throw Error(`Invalid layer geometry: ${layer.id}`);
    for(const source of layerSources(layer)){
      if(source.kind==='file'){
        if(!isPublicAssetPath(source.path)||!source.path.toLowerCase().endsWith(`.${source.format}`))throw Error(`Invalid layer file: ${source.path}`);
        if(source.region){const {rect,sheetSize,mask}=source.region;
          if(![...rect,...sheetSize].every(Number.isFinite)||rect[0]<0||rect[1]<0||rect[2]<=0||rect[3]<=0||rect[0]+rect[2]>sheetSize[0]||rect[1]+rect[3]>sheetSize[1]||!mask.trim())throw Error(`Invalid sheet region: ${layer.id}`);
        }
      }else if(!source.viewBox.every(Number.isFinite)||source.viewBox[2]<=0||source.viewBox[3]<=0)throw Error(`Invalid SVG viewBox: ${layer.id}`);
    }
  }
  return {...appearance,layers:[...appearance.layers].sort((a,b)=>a.order-b.order)};
};

export const selectLayerSources=(layer:CharacterLayer,p:CharacterPerformance,costume:string):readonly {source:LayerSource;opacity:number}[]=>{
  if(layer.visible===false)return [];
  const costumeSource=layer.costumes?.[costume];
  if(costumeSource===null)return [];
  const base=costumeSource??layer.source;
  const a=layer.expressions?.[p.expression.from]??base,b=p.expression.to?(layer.expressions?.[p.expression.to]??base):a;
  const intensity=p.expression.intensity;
  const mixed=a===b?[{source:a,opacity:1}]:[{source:a,opacity:1-p.expression.mix},{source:b,opacity:p.expression.mix}];
  const face=[...mixed.map(v=>({...v,opacity:v.opacity*intensity})),
    {source:layer.expressions?.neutral??base,opacity:1-intensity}].filter(v=>v.opacity>0);
  if(layer.mouths&&(p.mouth.from!=='rest'||p.mouth.to!=='rest')){
    const from=layer.mouths[p.mouth.from]??base,to=layer.mouths[p.mouth.to]??base,w=p.mouth.weight;
    const speaking=from===to?[{source:from,opacity:w}]:[{source:from,opacity:(1-p.mouth.mix)*w},{source:to,opacity:p.mouth.mix*w}];
    return [...speaking,...face.map(v=>({...v,opacity:v.opacity*(1-w)}))].filter(v=>v.opacity>0);
  }
  return face;
};
