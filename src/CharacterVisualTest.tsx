import {AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease} from './motion';
import {CharacterRenderer} from './visual/CharacterRenderer';
import {sampleStarterPerformance, type StarterId} from './visual/starterSheets';
import type {VisualExpression} from './visual/types';

const cast:readonly {id:StarterId;name:string;x:number;scale:number}[]=[
  {id:'asakura-yuu',name:'Asakura Yuu',x:430,scale:1.1},
  {id:'tachibana-kairyu',name:'Tachibana Kairyū',x:960,scale:1.03},
  {id:'minase-shiori',name:'Minase Shiori',x:1490,scale:1.04},
];
const emotions:readonly VisualExpression[]=['neutral','determined','exhausted','surprised','worried','happy'];
const labels=['Neutral','Serious / determined','Subdued / tired','Startled','Worried','Mild smile / talk'];

/** Same 24-second technical composition. Approved starter sheets; no canonical scene or dialogue. */
export const CharacterVisualTest=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const weights=cast.map((_,i)=>ease(frame,120+i*180,145+i*180)*(1-ease(frame,270+i*180,300+i*180)));
  const focus=weights.reduce((a,b)=>a+b,0),zoom=1+focus*1.55;
  const cameraX=960+weights.reduce((a,w,i)=>a+w*(cast[i].x-960),0),cameraY=540-focus*205;
  const active=frame>=120&&frame<660?Math.floor((frame-120)/180):-1;
  const local=active<0?0:frame-120-active*180;
  const emotion=Math.min(5,Math.floor(local/30));
  return <AbsoluteFill style={{backgroundColor:'#26343d'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <rect width={1920} height={1080} fill="#26343d"/>
      <path d="M0 860L960 795 1920 860V1080H0Z" fill="#303f46"/>
      <g transform={`translate(960 540) scale(${zoom}) translate(${-cameraX} ${-cameraY})`}>
        <path d="M0 950H1920" stroke="#95a4a8" opacity=".13"/>
        {cast.map((c,i)=>{
          const f=frame-120-i*180,isActive=active===i;
          const gesture=ease(f,65,87)*(1-ease(f,123,148));
          const blink=ease(f,40,42)*(1-ease(f,43,46));
          const performance=sampleStarterPerformance(c.id,frame,{fps,
            expression:isActive?emotions[Math.max(0,emotion-1)]:'neutral',nextExpression:isActive?emotions[emotion]:undefined,
            expressionMix:ease(local%30,0,8),talk:isActive&&local>=152,gesture,
            posture:frame>=660?Math.sin((frame-660)/60*Math.PI):0,blink});
          return <g key={c.id}>
            <ellipse cx={c.x} cy={953} rx={85} ry={10} fill="#101c24" opacity=".35"/>
            <CharacterRenderer character={c.id} performance={performance} frame={frame} fps={fps} x={c.x} y={950} scale={c.scale}/>
          </g>;
        })}
      </g>
      <g fontFamily="Arial, sans-serif">
        <Interactive.Text name="Test title" x={70} y={62} fontSize={25} letterSpacing={3} fill="#d2dcdf">CHAPTER 1 · CHARACTER VISUAL TEST</Interactive.Text>
        <Interactive.Text name="Approval scope" x={70} y={102} fontSize={18} letterSpacing={2} fill="#a1b2b9">APPROVED STARTER REFERENCES · TECHNICAL PUPPETS · NONCANONICAL</Interactive.Text>
        {active<0?cast.map(c=><text key={c.id} x={c.x} y={1006} textAnchor="middle" fontSize={23} fill="#d4dedf">{c.name}</text>)
          :<text x={70} y={1018} fontSize={24} fill="#d4dedf">{cast[active].name} · {labels[emotion]}</text>}
        <text x={1850} y={1055} textAnchor="end" fontSize={16} fill="#97aab3">1920 × 1080 / 30 FPS · {String(frame).padStart(3,'0')} / 719</text>
      </g>
    </svg>
  </AbsoluteFill>;
};
