import React from 'react';
import {hash} from '../motion';
export const ArtDefs = () => <defs>
  <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#112432"/><stop offset=".65" stopColor="#688481"/><stop offset="1" stopColor="#d4b08a"/></linearGradient>
  <linearGradient id="stone" x2="0" y2="1"><stop stopColor="#111c29"/><stop offset="1" stopColor="#34444e"/></linearGradient>
  <linearGradient id="floor" x2="0" y2="1"><stop stopColor="#415058"/><stop offset="1" stopColor="#111e2b"/></linearGradient>
  <linearGradient id="goldbeam" x2="0" y2="1"><stop stopColor="#fff0b0" stopOpacity=".5"/><stop offset="1" stopColor="#e3b557" stopOpacity="0"/></linearGradient>
  <radialGradient id="goldglow"><stop stopColor="#ffedaf" stopOpacity=".65"/><stop offset=".4" stopColor="#edb44e" stopOpacity=".17"/><stop offset="1" stopColor="#edb44e" stopOpacity="0"/></radialGradient>
  <radialGradient id="blueglow"><stop stopColor="#b2fff2" stopOpacity=".65"/><stop offset=".45" stopColor="#55d6d3" stopOpacity=".16"/><stop offset="1" stopColor="#55d6d3" stopOpacity="0"/></radialGradient>
  <radialGradient id="vignette"><stop offset=".45" stopColor="#030912" stopOpacity="0"/><stop offset="1" stopColor="#030912" stopOpacity=".65"/></radialGradient>
  <linearGradient id="glass" x2="1" y2="1"><stop stopColor="#b4d9ca" stopOpacity=".18"/><stop offset=".5" stopColor="#9dcad3" stopOpacity="0"/><stop offset="1" stopColor="#b4d9ca" stopOpacity=".14"/></linearGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="9"/></filter>
</defs>;
export const Particles = ({t,count=70,color='#f5d88d',x=0,y=0,w=1920,h=1080,strength=1}:{t:number;count?:number;color?:string;x?:number;y?:number;w?:number;h?:number;strength?:number}) => <g opacity={strength}>{Array.from({length:count},(_,i)=>{
  const px=x+hash(i+20)*w+Math.sin(t*.7+i)*16, py=y+((hash(i+90)*h+t*(17+hash(i)*25))%h);
  const r=1.1+hash(i+3)*2.5;return <g key={i} opacity={.25+Math.sin(t*1.6+i)**2*.65}><circle cx={px} cy={py} r={r*3} fill={color} opacity=".07"/><circle cx={px} cy={py} r={r} fill={color}/>{i%9===0&&<path d={`M${px-8} ${py}h16 M${px} ${py-8}v16`} stroke={color} strokeWidth="1"/>}</g>;
})}</g>;
export const MagicCircle = ({x,y,r,t,color='#83ece2',opacity=1}:{x:number;y:number;r:number;t:number;color?:string;opacity?:number}) => <g transform={`translate(${x} ${y}) scale(1 .29)`} opacity={opacity}>
  <ellipse rx={r*1.25} ry={r*1.25} fill={color==='#83ece2'?'url(#blueglow)':'url(#goldglow)'}/>
  <g transform={`rotate(${t*9})`} stroke={color} fill="none">
    <circle r={r} strokeWidth="5"/><circle r={r*.94} strokeWidth="1.5"/><circle r={r*.7} strokeWidth="3"/>
    <path d={`M0 ${-r*.86}L${r*.745} ${r*.43}H${-r*.745}Z M0 ${r*.86}L${r*.745} ${-r*.43}H${-r*.745}Z`} strokeWidth="2"/>
    {Array.from({length:18},(_,i)=><g key={i} transform={`rotate(${i*20}) translate(0 ${-r*.82})`}><path d="M-8 12V-12L8 0-8 5M8-12V12" strokeWidth="3"/></g>)}
  </g>
</g>;
export const Camera = ({children,x=960,y=540,zoom=1,shake=0,t=0}:{children:React.ReactNode;x?:number;y?:number;zoom?:number;shake?:number;t?:number}) => <g transform={`translate(${960+Math.sin(t*31)*shake} ${540+Math.sin(t*27)*shake}) scale(${zoom}) translate(${-x} ${-y})`}>{children}</g>;
export const Finish = () => <><rect width="1920" height="1080" fill="url(#vignette)" pointerEvents="none"/><rect width="1920" height="70" fill="#060b12"/><rect y="1010" width="1920" height="70" fill="#060b12"/></>;
