import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Character} from './components/Character';
import {Camera,MagicCircle,Particles} from './components/Atmosphere';
import {Mountains,Road,Hall,Pine} from './components/Background';
import {BusExterior,BusInterior,Seat} from './components/Bus';
import {ease,mix} from './motion';
const useTime=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return f/fps;};
const InteriorCast=({t,focus=false,alarm=false}:{t:number;focus?:boolean;alarm?:boolean}) => <>
  <Seat x={280} y={870} s={2.1}/><Seat x={1125} y={870} s={2.1}/><Seat x={1510} y={870} s={2.1}/>
  <Character id="mira" x={280} y={940} scale={2.1} t={t} pose="sit" speaking={!alarm} expression={alarm?'surprised':'happy'} look={1}/>
  <Character id="lina" x={1125} y={935} scale={1.95} t={t+1} pose="sit" expression={alarm?'surprised':'happy'} look={-1}/>
  <Character id="elias" x={720} y={927} scale={2.45} t={t} pose={alarm?'stand':'talk'} expression={alarm?'surprised':'happy'} look={-.6} gesture={alarm?.7:0}/>
  <Character id="ren" x={1510} y={935} scale={2.1} t={t} pose="sit" expression={alarm?'worried':'quiet'} look={alarm?-.7:focus?mix(-.9,.9,ease(t,4,5.4)):.9}/>
  {/* Foreground seat backs frame the conversation without hiding faces. */}
  <g opacity=".95"><Seat x={-40} y={1230} s={3}/><Seat x={1000} y={1250} s={3}/><Seat x={1890} y={1230} s={3}/></g>
</>;
export const SchoolTrip=()=>{
  const t=useTime();
  if(t<3.6)return <Camera zoom={mix(1,1.06,ease(t,0,3.6))} y={555}>
    <Mountains t={t}/><Road t={t}/><BusExterior t={t} x={mix(780,1050,ease(t,0,4.8))} y={758} scale={.89}/>
    <g transform={`translate(${-t*230} 0)`}><Pine x={180} y={1150} s={2.7} color="#0d232c"/><Pine x={2390} y={1170} s={2.4} color="#0d232c"/></g>
    <path d="M0 968Q480 920 900 1000T1920 940V1080H0Z" fill="#0d202b"/>
    <rect width="1920" height="1080" fill="#070e19" opacity={1-ease(t,0,1)}/>
  </Camera>;
  return <Camera x={mix(940,1040,ease(t,3.6,8))} y={580} zoom={1.05} t={t} shake={.8}><BusInterior t={t}/><InteriorCast t={t}/><Particles t={t} count={22} strength={.23} color="#cde2d2"/></Camera>;
};
export const Representative=()=>{
  const t=useTime();
  const close=t>=3.8;
  return <Camera x={close?1450:mix(740,800,ease(t,0,3.8))} y={close?615:590} zoom={close?mix(1.38,1.5,ease(t,3.8,7)):1.18} t={t+8} shake={.6}>
    <BusInterior t={t+8}/><InteriorCast t={t} focus/>
  </Camera>;
};
export const Summoning=()=>{
  const t=useTime();const energy=ease(t,.4,4.9);
  // Integrate a positive, decaying speed so slowing down never reverses motion.
  const travel=15+1.8*(1-Math.exp(-t/2))+.1*t;
  return <>
    {t<5.7?<Camera zoom={1.03+energy*.05} x={960} y={580} shake={energy*5} t={t}>
      <Mountains t={travel} distortion={energy*13}/><Road t={travel}/>
      <rect width="1920" height="1080" fill="#0b1834" opacity={energy*.35}/>
      <MagicCircle x={960} y={865} r={mix(100,640,energy)} t={t*2} opacity={energy}/>
      <BusExterior t={travel} y={750-energy*65} x={960} scale={.94}/>
      <ellipse cx="960" cy="825" rx="670" ry="300" fill="url(#blueglow)" opacity={energy*.6}/>
      {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${400+i*180} 840Q${300+i*190+Math.sin(t*3+i)*80} 530 ${440+i*170} ${700-energy*750}`} stroke="#a6f7ed" strokeWidth="2" fill="none" opacity={energy*.45}/>)}
      <Particles t={t*2} count={100} color="#b5fff2" strength={energy}/>
    </Camera>:<Camera x={1190} y={570} zoom={1.13} shake={5} t={t}><BusInterior t={20}/><InteriorCast t={t} alarm/><rect width="1920" height="1080" fill="#8ce5df" opacity={.3}/><Particles t={t*4} count={65} color="#d8fff5"/></Camera>}
    <rect width="1920" height="1080" fill="#e7fff7" opacity={ease(t,6.25,7.5)}/>
  </>;
};
const Blessing=({t,x,y,strength=1,r=130}:{t:number;x:number;y:number;strength?:number;r?:number})=><g opacity={strength}>
  <path d={`M${x-60} 70H${x+60}L${x+180} ${y}H${x-180}Z`} fill="url(#goldbeam)" opacity=".7"/>
  <ellipse cx={x} cy={y-170} rx={r*1.7} ry={330} fill="url(#goldglow)"/>
  <MagicCircle x={x} y={y} r={r} t={t} color="#f4ce78" opacity={.7}/>
  <Particles t={t} x={x-r} y={150} w={r*2} h={y-180} count={24} strength={.9}/>
</g>;
export const AnotherWorld=()=>{
  const t=useTime(); const blessing=ease(t,3.2,6.2);
  return <Camera x={mix(960,1010,ease(t,0,9))} y={570} zoom={mix(.94,1.04,ease(t,0,9))}>
    <Hall t={t}/>
    <MagicCircle x={960} y={873} r={650} t={-t*.3} color="#f4ce78" opacity={.25*(1-ease(t,0,3))}/>
    <Character id="lina" x={1430} y={869} scale={1.12} t={t} pose="awaken" expression={t<1?'asleep':'surprised'} look={Math.sin(t)}/>
    <Character id="toma" x={700+ease(t,2.8,4.7)*65} y={880} scale={1.3} t={t} poseTime={t-2.8} walkBlend={ease(t,2.8,3.05)*(1-ease(t,4.45,4.7))} pose={t<2.8?'awaken':t<4.7?'walk':'stand'} expression="worried" look={Math.sin(t*1.3)}/>
    <Character id="mira" x={1290} y={944} scale={1.6} t={t-.25} pose={t<3?'awaken':'stand'} expression="surprised" look={-.7}/>
    <Character id="ren" x={420} y={934} scale={1.58} t={t-.6} pose="awaken" expression={t<1.1?'asleep':'worried'} look={mix(-.7,.8,ease(t,1,3))}/>
    <Blessing t={t} x={1290} y={944} strength={blessing*.5} r={100}/><Blessing t={t+1} x={735} y={880} strength={blessing*.35} r={85}/><Blessing t={t+2} x={1430} y={869} strength={blessing*.3} r={80}/>
    <Blessing t={t} x={1020} y={930} strength={blessing} r={190}/>
    <Character id="elias" x={1020} y={930-blessing*12} scale={1.8} t={t} poseTime={t-3.5} pose={t<3.5?'awaken':'blessed'} expression={t<5?'surprised':'happy'} look={0}/>
    <g opacity={blessing}><circle cx="1020" cy={500+Math.sin(t)*5} r="51" fill="none" stroke="#ffdda0" strokeWidth="3"/><path d="M1020 470L1043 510H997Z" fill="none" stroke="#fff0bf" strokeWidth="3"/><circle cx="1020" cy="500" r="100" fill="url(#goldglow)"/></g>
    <Particles t={t} count={90} strength={ease(t,1.5,4.5)*.7}/>
    <rect width="1920" height="1080" fill="#e7fff7" opacity={1-ease(t,0,1.4)}/>
  </Camera>;
};
export const Unblessed=()=>{
  const t=useTime();const push=ease(t,0,8);
  return <>
    <Camera x={mix(785,480,push)} y={mix(650,660,push)} zoom={mix(1.12,2.7,push)}>
      <Hall t={t+9}/>
      <Blessing t={t+9} x={1430} y={869} strength={.35} r={80}/><Character id="lina" x={1430} y={869} scale={1.12} t={t+9} pose="blessed" expression="happy"/>
      <Blessing t={t+10} x={735} y={880} strength={.35} r={85}/><Character id="toma" x={765} y={880} scale={1.3} t={t} pose="blessed" expression="happy" look={.4}/>
      <Blessing t={t+9} x={1290} y={944} strength={.5} r={100}/><Character id="mira" x={1290} y={944} scale={1.6} t={t+9} pose="blessed" expression="happy" look={-.6}/>
      <Blessing t={t+9} x={1020} y={930} strength={1} r={190}/><Character id="elias" x={1020} y={918} scale={1.8} t={t+9} poseTime={t+5.5} pose="blessed" expression="happy"/>
      <circle cx="1020" cy={500+Math.sin(t+9)*5} r="51" fill="none" stroke="#ffdda0" strokeWidth="3"/>
      <Character id="ren" x={420} y={934} scale={1.58} t={t} pose="wait" expression={t<3?'quiet':'worried'} look={mix(.7,-.15,ease(t,.5,2.5))+ease(t,4.5,6)*.8}/>
      {/* The descending lights stop short of Ren; his outstretched palm stays empty. */}
      <Particles t={t+9} x={620} w={1300} y={80} h={770} count={60} strength={.6}/>
      <path d="M280 953Q420 942 553 958" fill="none" stroke="#081522" strokeWidth="9" opacity=".3"/>
    </Camera>
    <rect width="1920" height="1080" fill="#07101b" opacity={ease(t,7.45,8)*.7}/>
  </>;
};
