import type {ReactNode} from 'react';
import {Character} from '../components/Character';
import {characterRegistry, type CharacterId} from '../production/characterRegistry';
import {assertAssetPin, type AssetPin, type AssetIdOf} from '../production/assetRegistry';
import type {CharacterAppearance, CharacterPerformance} from './types';
import {provisionalAppearances} from './provisionalArtwork';
import {starterAppearances,type StarterId} from './starterSheets';
import {LayeredCharacter} from './LayeredCharacter';
import type {VisualStyle} from './style';
import {YuuFacialRenderer} from './YuuFacialRenderer';
import {yuuFaceFromPerformance} from './yuuFacialSprites';
import {ChapterOneFacialRenderer,chapterFaceFromPerformance} from './ChapterOneFacialRenderer';

// Preserve the starter body; an explicit facial mode replaces only its facial layers.
const spriteBody=(id:StarterId):CharacterAppearance=>({
  ...starterAppearances[id],layers:starterAppearances[id].layers.filter(l=>
    l.id!=='sheet-head-expressions'&&!l.id.startsWith('closed-lid-')&&l.id!=='talk-mouth'&&l.id!=='hair-strands'),
});
const spriteBodies={
  'asakura-yuu':spriteBody('asakura-yuu'),
  'tachibana-kairyu':spriteBody('tachibana-kairyu'),
  'minase-shiori':spriteBody('minase-shiori'),
};
const isStarter=(id:CharacterId):id is StarterId=>id in spriteBodies;
// Landmarks are the neck joint in each fixed 512px facial canvas. Yuu is unchanged.
const spriteHeadTransforms:Record<StarterId,string>={
  'asakura-yuu':'scale(.32) translate(-253 -356)',
  'tachibana-kairyu':'scale(.33) translate(-256 -442)',
  'minase-shiori':'scale(.36) translate(-256 -390)',
};

/** Explicit lookup, never an evaluated registry source reference. Future art adds a new entry here. */
export const resolveAppearance=(character:CharacterId,pin?:AssetPin<AssetIdOf<'character-art'>>):CharacterAppearance=>{
  const entry=characterRegistry[character],selected=pin??entry.layeredAppearance;
  assertAssetPin(selected);
  assertAssetPin(entry.layeredRig);
  const appearance=selected.id==='art.layered-students'?provisionalAppearances[entry.assetAlias]
    :selected.id===entry.layeredAppearance.id&&character in starterAppearances?starterAppearances[character as keyof typeof starterAppearances]:undefined;
  if(!appearance)throw Error(`No layered appearance loader for ${character}: ${selected.id}`);
  if(appearance.version!==selected.version||appearance.rig.version!==entry.layeredRig.version)throw Error('Artwork/rig version mismatch');
  return appearance;
};

/** Shot components supply artwork independently of sampled or authored performance. */
export const CharacterRenderer=({character,performance,frame,fps=30,x,y,scale=1,facing=1,
  appearance,mode='layered',costume,style,heldItem,facialMode='starter'}: {
  character:CharacterId;performance:CharacterPerformance;frame:number;fps?:number;
  x:number;y:number;scale?:number;facing?:1|-1;appearance?:AssetPin<AssetIdOf<'character-art'>>;
  mode?:'layered'|'procedural';costume?:string;style?:VisualStyle;heldItem?:ReactNode;
  facialMode?:'starter'|'sprites-v1';
})=>{
  if(facialMode==='sprites-v1'&&(mode!=='layered'||!(character in spriteBodies)))throw Error('facial-v1 requires a layered starter character');
  if(mode==='procedural'){
    costume??='student';
    if(costume!=='student'&&costume!=='mage')throw Error(`Unsupported procedural costume ${costume}`);
    return <Character id={characterRegistry[character].assetAlias} x={x} y={y} scale={scale} facing={facing}
      t={frame/fps} rig={performance.body} face={performance.face} costume={costume} sword={false} handItem={heldItem}/>;
  }
  const resolved=resolveAppearance(character,appearance);
  let body=resolved,headAttachment:ReactNode;
  if(facialMode==='sprites-v1'){
    if(!isStarter(character)||resolved!==starterAppearances[character])throw Error('facial-v1 requires the matching starter body');
    body=spriteBodies[character];
    headAttachment=<g transform={spriteHeadTransforms[character]}>
      {character==='asakura-yuu'?<YuuFacialRenderer {...yuuFaceFromPerformance(performance)} neckOnly/>
        :<ChapterOneFacialRenderer characterId={character} {...chapterFaceFromPerformance(performance)} neckOnly/>}
    </g>;
  }
  return <LayeredCharacter appearance={body} performance={performance} headAttachment={headAttachment}
    x={x} y={y} scale={scale} facing={facing} costume={costume??resolved.costumes[0]} style={style} heldItem={heldItem}/>;
};
