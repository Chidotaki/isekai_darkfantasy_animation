import {visualTokens} from './style';
/** Flat SVG planes, no blur/bloom. Each shot chooses its own palette and strength. */
export const StageLighting=({color=visualTokens.separation,strength=.13}: {color?:string;strength?:number})=><g pointerEvents="none">
  <path d="M0 0H900L1470 1080H0Z" fill={color} opacity={strength}/>
  <path d="M1920 0H1720L1420 1080H1920Z" fill="#050d16" opacity={strength*.8}/>
</g>;
