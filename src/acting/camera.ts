import {smooth} from '../combat/animations';
import {mix} from '../motion';
export type Framing={x:number;y:number;zoom:number};
export type Shot='closeUp'|'medium'|'twoShot'|'overShoulder'|'reaction';
/** Targets are world coordinates. Every preset stays on the same side of the aisle. */
export const cameraPresets:Record<Shot,{zoom:number;offsetY:number}>={closeUp:{zoom:2.65,offsetY:12},medium:{zoom:1.65,offsetY:105},twoShot:{zoom:1.12,offsetY:145},overShoulder:{zoom:1.8,offsetY:70},reaction:{zoom:2.35,offsetY:38}};
export const frameShot=(shot:Shot,x:number,headY:number):Framing=>({x,y:headY+cameraPresets[shot].offsetY,zoom:cameraPresets[shot].zoom});
export const cameraMove=(frame:number,from:number,to:number,start:Framing,end:Framing):Framing=>{const p=smooth((frame-from)/(to-from));return {x:mix(start.x,end.x,p),y:mix(start.y,end.y,p),zoom:mix(start.zoom,end.zoom,p)};};
export const slowPushIn=(frame:number,from:number,to:number,shot:Framing,amount=.08)=>cameraMove(frame,from,to,shot,{...shot,zoom:shot.zoom*(1+amount)});
export const slowPullback=(frame:number,from:number,to:number,shot:Framing,amount=.08)=>cameraMove(frame,from,to,shot,{...shot,zoom:shot.zoom*(1-amount)});
