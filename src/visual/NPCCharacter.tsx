import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Artwork} from './LayeredCharacter';
import {npcAssets,type NPCId} from './npcAssets';

/** Full standing cutout, with x/y at bottom-center. Animate x/y externally for
 * simple translation; this deliberately has no limb or walking animation. */
export const NPCCharacter = ({npcId,x,y,scale=1,facing=1,opacity=1,idle=false}:{
  npcId:NPCId;x:number;y:number;scale?:number;facing?:1|-1;opacity?:number;idle?:boolean;
}) => {
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),asset=npcAssets[npcId];
  const phase=Object.keys(npcAssets).indexOf(npcId)*1.37;
  const sway=idle?Math.sin(frame/fps*1.35+phase)*.35:0;
  return <g data-npc={npcId} opacity={opacity} transform={`translate(${x} ${y}) scale(${scale*facing} ${scale}) rotate(${sway})`}>
    <Artwork source={{kind:'file',path:asset.path,format:'png'}} layer={{offset:[-asset.foot[0],-asset.foot[1]],size:asset.size}}/>
  </g>;
};
