import type {ReactNode} from 'react';
import {Character} from '../components/Character';
import {characterRegistry, type CharacterId} from '../production/characterRegistry';
import {assertAssetPin, type AssetPin, type AssetIdOf} from '../production/assetRegistry';
import type {CharacterAppearance, CharacterPerformance} from './types';
import {provisionalAppearances} from './provisionalArtwork';
import {LayeredCharacter} from './LayeredCharacter';
import type {VisualStyle} from './style';

/** Explicit lookup, never an evaluated registry source reference. Future art adds a new entry here. */
export const resolveAppearance=(character:CharacterId,pin?:AssetPin<AssetIdOf<'character-art'>>):CharacterAppearance=>{
  const entry=characterRegistry[character],selected=pin??entry.layeredAppearance;
  assertAssetPin(selected);
  assertAssetPin(entry.layeredRig);
  if(selected.id!=='art.layered-students')throw Error(`No layered appearance loader for ${selected.id}`);
  const appearance=provisionalAppearances[entry.assetAlias];
  if(appearance.version!==selected.version||appearance.rig.version!==entry.layeredRig.version)throw Error('Artwork/rig version mismatch');
  return appearance;
};

/** Shot components supply artwork independently of sampled or authored performance. */
export const CharacterRenderer=({character,performance,frame,fps=30,x,y,scale=1,facing=1,
  appearance,mode='layered',costume='student',style,heldItem}: {
  character:CharacterId;performance:CharacterPerformance;frame:number;fps?:number;
  x:number;y:number;scale?:number;facing?:1|-1;appearance?:AssetPin<AssetIdOf<'character-art'>>;
  mode?:'layered'|'procedural';costume?:string;style?:VisualStyle;heldItem?:ReactNode;
})=>{
  if(mode==='procedural'){
    if(costume!=='student'&&costume!=='mage')throw Error(`Unsupported procedural costume ${costume}`);
    return <Character id={characterRegistry[character].assetAlias} x={x} y={y} scale={scale} facing={facing}
      t={frame/fps} rig={performance.body} face={performance.face} costume={costume} sword={false} handItem={heldItem}/>;
  }
  return <LayeredCharacter appearance={resolveAppearance(character,appearance)} performance={performance}
    x={x} y={y} scale={scale} facing={facing} costume={costume} style={style} heldItem={heldItem}/>;
};
