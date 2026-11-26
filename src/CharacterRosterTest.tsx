import {AbsoluteFill,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {YuuFacialRenderer} from './visual/YuuFacialRenderer';
import type {YuuFaceExpression} from './visual/yuuFacialSprites';
import {ChapterOneFacialRenderer} from './visual/ChapterOneFacialRenderer';
import {NPCCharacter} from './visual/NPCCharacter';
import {npcAssets,type NPCId} from './visual/npcAssets';

const expressions:YuuFaceExpression[]=['neutral','happy','worried','serious','surprised'];
// Deterministic, staggered blinks. Mouth pulses demonstrate swapping, not audio sync.
const blinkAt=(seconds:number,phase=0)=>{
  const t=(seconds+phase)%3.7;
  return interpolate(t,[1.7,1.78,1.84,1.94],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
};
const Faces=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
  const expression=expressions[Math.min(4,Math.floor(t/2.4))];
  const elderExpression=t<4?'neutral':t<8?'concerned':'stern';
  const speaking=t%2.4>.5||t>7;
  const mouth=speaking?(.5+.5*Math.sin(t*16)):undefined;
  return <g>
    <g transform="translate(65 135) scale(.85)"><YuuFacialRenderer expression={expression} blink={blinkAt(t)} mouth={mouth===undefined?undefined:mouth>.65?'mouth_open_wide':mouth>.2?'mouth_open_small':'mouth_neutral'}/></g>
    <g transform="translate(515 135) scale(.85)"><ChapterOneFacialRenderer characterId="tachibana-kairyu" expression={expression} blink={blinkAt(t,.15)} mouth={mouth}/></g>
    <g transform="translate(965 135) scale(.85)"><ChapterOneFacialRenderer characterId="minase-shiori" expression={expression} blink={blinkAt(t,.1)} mouth={mouth}/></g>
    <g transform="translate(1415 135) scale(.85)"><ChapterOneFacialRenderer characterId="elder-ritual-official" expression={elderExpression} blink={blinkAt(t,.08)} mouth={mouth}/></g>
    <text x={280} y={585} textAnchor="middle">Asakura Yuu · {expression}</text>
    <text x={730} y={585} textAnchor="middle">Tachibana Kairyū · {expression}</text>
    <text x={1180} y={585} textAnchor="middle">Minase Shiori · {expression}</text>
    <text x={1630} y={585} textAnchor="middle">Ritual official · {elderExpression}</text>
  </g>;
};
const NPCs=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const groups=['students','knights','clerics'] as const;
  return <g>{groups.map((category,group)=>{
    const ids=(Object.keys(npcAssets) as NPCId[]).filter(id=>npcAssets[id].category===category);
    const left=category==='students'?55:category==='knights'?775:1350;
    const spacing=category==='students'?112:135;
    return <g key={category}>
      <text x={left} y={648} fontSize={20} fill="#aebaca">{ids.length} {category} · standing cutouts</text>
      {ids.map((id,index)=><g key={id}>
        <NPCCharacter npcId={id} x={left+spacing*(index+.5)+interpolate(frame,[0,12*fps],[0,5],{extrapolateRight:'clamp'})} y={1005}
          scale={320/npcAssets[id].size[1]} facing={group===2?-1:1} idle/>
        <text x={left+spacing*(index+.5)} y={1035} fontSize={16} textAnchor="middle">{id}</text>
      </g>)}
    </g>;
  })}</g>;
};

/** Noncanonical, data-driven diagnostic roster; no Chapter 1 story content. */
export const CharacterRosterTest=()=> <AbsoluteFill style={{background:'#26313e'}}>
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{fontFamily:'Arial, sans-serif',fill:'#e2e7ed',fontSize:23}}>
    <rect x={35} y={115} width={1850} height={490} rx={20} fill="#424d5b"/>
    <text x={60} y={62} fontSize={32}>Chapter 1 · V1 character roster</text>
    <text x={60} y={94} fontSize={19} fill="#aebaca">Noncanonical facial and cutout verification · fixed heads / independent facial features</text>
    <Faces/>
    <NPCs/>
  </svg>
</AbsoluteFill>;
