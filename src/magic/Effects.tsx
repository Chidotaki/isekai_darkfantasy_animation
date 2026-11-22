import type {Point} from '../components/characterMotion';
import {hash,mix} from '../motion';
import {smooth} from '../combat/animations';
import {Dust,Sparks} from '../combat/CombatEffects';
import {spellConfigs,canDirectCast,type DirectCast,type ScrollActivation} from './spells';
import {magicCues,pillarContact,projectilePoint,scrollPoint} from './timeline';
export const MagicDefs=()=> <defs>
  <radialGradient id="fire-glow"><stop stopColor="#ffcd75" stopOpacity=".8"/><stop offset=".3" stopColor="#f3763d" stopOpacity=".3"/><stop offset="1" stopColor="#e9673b" stopOpacity="0"/></radialGradient>
  <radialGradient id="water-glow"><stop stopColor="#d4fff0" stopOpacity=".8"/><stop offset="1" stopColor="#84d4df" stopOpacity="0"/></radialGradient>
  <radialGradient id="steam"><stop stopColor="#d6e2da" stopOpacity=".44"/><stop offset=".55" stopColor="#b7cdca" stopOpacity=".26"/><stop offset="1" stopColor="#b0c7c4" stopOpacity="0"/></radialGradient>
  <linearGradient id="shield-fill"><stop stopColor="#a9d9e5" stopOpacity=".03"/><stop offset="1" stopColor="#b5e2f0" stopOpacity=".22"/></linearGradient>
  <linearGradient id="water-stream" x2="1" y2="1"><stop stopColor="#eefbef" stopOpacity=".9"/><stop offset="1" stopColor="#82becd" stopOpacity=".5"/></linearGradient>
</defs>;
export const Staff=()=> <g>
  <path d="M-4 65L-5-97-11-108-5-119 0-112 6-120 12-108 5-97 4 65Z" fill="#695440" stroke="#1c2733" strokeWidth="2.2"/>
  <path d="M-1 60V-97" stroke="#b09b6e" strokeWidth="1.5"/>
  <path d="M-5-30H5M-5-25H5M-5-20H5M-5-15H5M-5-10H5M-5-5H5" stroke="#b6a080" strokeWidth="3"/>
  <path d="M0-126L9-112 0-100-9-112Z" fill="#c68863" stroke="#e7bc7e" strokeWidth="1.6"/><path d="M0-121L3-112 0-105-3-112Z" fill="#e8bf88"/>
</g>;
export const CastEffect=({frame,event,point,cancelAt=Infinity}:{frame:number;event:DirectCast;point:Point;cancelAt?:number})=>{
  if(!canDirectCast(event.caster.id,event.spell))return null;
  const end=Math.min(event.release,cancelAt),charge=smooth((frame-event.start)/18),fade=1-smooth((frame-end)/9);
  if(frame<event.start||frame>end+9)return null;
  const color=spellConfigs[event.spell].color,r=22+charge*24;
  return <g transform={`translate(${point.join(' ')})`} opacity={charge*fade}>
    <circle r="92" fill={event.spell==='fireProjectile'?'url(#fire-glow)':'url(#water-glow)'}/>
    <g transform={`rotate(${frame*1.8})`} fill="none" stroke={color}>
      <circle r={r} strokeWidth="1.5"/><circle r={r-6} strokeWidth=".8"/>
      <path d={`M0 ${-r}L${r*.86} ${r*.5}H${-r*.86}Z`} strokeWidth="1.2"/>
      {[0,60,120,180,240,300].map(a=><path key={a} transform={`rotate(${a}) translate(0 ${-r+3})`} d="M-4-9V-3L4-7V-11" strokeWidth="2"/>)}
    </g>
    {Array.from({length:9},(_,i)=>{const p=(frame*.035+i*.113)%1,a=i*2.4+frame*.035,d=(1-p)*70;return <circle key={i} cx={Math.cos(a)*d} cy={Math.sin(a)*d} r={1+p*2.4} fill={color} opacity={p}/>;})}
    <circle r={5+charge*6+Math.sin(frame*.7)*1.5} fill="#ffe3ad"/>
  </g>;
};
export const FireProjectile=({frame,launch=magicCues.launch,impact=magicCues.pillar,samplePosition=projectilePoint}:{frame:number;launch?:number;impact?:number;samplePosition?:(frame:number)=>Point})=>{
  if(frame<launch||frame>=impact)return null;
  const p=samplePosition(frame),previous=samplePosition(Math.max(launch,frame-1)),angle=Math.atan2(p[1]-previous[1],p[0]-previous[0])*180/Math.PI;
  return <g transform={`translate(${p.join(' ')}) rotate(${angle}) scale(${spellConfigs.fireProjectile.radius/18})`}>
    <ellipse rx="84" ry="63" fill="url(#fire-glow)"/>
    <path d={`M23 0Q2-24-25-15L-82 ${-9+Math.sin(frame)*4}-53 1-92 11-23 17Q7 24 23 0Z`} fill="#df6336" opacity=".85"/>
    <path d="M20 0Q2-17-23-9L-51 1-25 9Q0 19 20 0Z" fill="#fbb75a"/>
    <path d="M14 0Q0-9-19-3L-31 2-17 5Q1 10 14 0Z" fill="#fff0b4"/>
    {[0,1,2,3].map(i=><circle key={i} cx={-42-i*17} cy={Math.sin(frame*.8+i)*12} r={2.5-i*.4} fill="#ffbe6c"/>)}
  </g>;
};
export const PillarImpact=({frame}:{frame:number})=>{
  const age=frame-magicCues.pillar;if(age<0)return null;
  const heat=(1-smooth((frame-224)/48))*(.8+.12*Math.sin(frame*.4));
  return <g>
    <path d="M903 685L914 702 917 726 920 750 916 786 910 816 899 805 894 782 896 758 890 732 898 711Z" fill="#17262b" opacity=".78"/>
    <path d="M913 688L900 716 915 740 902 755 916 782 906 808M915 739L917 724M902 755L892 760" stroke="#1a2229" strokeWidth="5" fill="none"/>
    <g opacity={heat}><ellipse cx="915" cy="752" rx="55" ry="100" fill="url(#fire-glow)"/><path d="M913 698L905 716 916 740 906 756 915 781 909 803M916 738L917 724" stroke="#fca05b" strokeWidth="2.7" fill="none"/>
    {Array.from({length:10},(_,i)=>{const p=((frame-118)*.025+i*.13)%1;return <circle key={i} cx={908+Math.sin(i*7+p*2)*22} cy={785-p*120} r={1.6+hash(i)*1.7} fill="#efab65" opacity={1-p}/>;})}</g>
    <Sparks age={age} point={pillarContact} seed={17}/><Dust age={age} point={pillarContact} strength={.7}/>
    {age<10&&<ellipse cx="925" cy="740" rx={15+age*6} ry={24+age*8} fill="none" stroke="#ffbd79" strokeWidth={9-age*.8} opacity={1-age/10}/>}
  </g>;
};
/** One brief household pour, not a directed water attack. The target is hot stone. */
const defaultWaterSource=(frame:number)=>scrollPoint(frame,[-25,-3]);
export const UtilityWater=({frame,event,sourceAt=defaultWaterSource,target=[916,805]}:{frame:number;event:ScrollActivation;sourceAt?:(frame:number)=>Point;target?:Point})=>{
  const age=frame-event.activate,duration=spellConfigs.createWater.duration;
  const pouring=age>=0&&age<duration;
  const origin=sourceAt(Math.min(frame,event.spent));
  const strength=smooth(age/5)*(1-smooth((age-duration+8)/8));
  return <g>
    {pouring&&<g opacity={strength}>
      <path d={`M${origin[0]} ${origin[1]}Q${origin[0]+110} ${origin[1]-45} ${target.join(' ')}`} fill="none" stroke="url(#water-stream)" strokeWidth="7" strokeLinecap="round"/>
      {Array.from({length:12},(_,i)=>{const p=((age*.065+i/12)%1),x=(1-p)**2*origin[0]+2*(1-p)*p*(origin[0]+110)+p*p*target[0],y=(1-p)**2*origin[1]+2*(1-p)*p*(origin[1]-45)+p*p*target[1];return <ellipse key={i} cx={x+Math.sin(i)*5} cy={y} rx="2.1" ry="4.2" fill="#c8e8de" opacity=".8"/>;})}
      {[0,1,2,3,4].map(i=><path key={i} d={`M${target.join(' ')}q${(i-2)*13} -22 ${(i-2)*24} 8`} fill="none" stroke="#a3cfcd" strokeWidth="2"/>)}
    </g>}
    {age>3&&<g transform={`translate(${target[0]-916} ${target[1]-805})`} opacity={smooth(age/30)*.7}><ellipse cx="938" cy="883" rx={45+smooth(age/40)*27} ry="10" fill="#69989f" opacity=".38"/><path d="M899 883Q931 878 966 883M917 889L952 888" fill="none" stroke="#b4c7be" strokeOpacity=".5" strokeWidth="1.5"/></g>}
  </g>;
};
export const Steam=({frame}:{frame:number})=>{
  if(frame<226||frame>400)return null;
  const fade=smooth((frame-226)/34)*(1-smooth((frame-342)/58));
  return <g opacity={fade}>
    {Array.from({length:11},(_,i)=>{const p=Math.max(0,Math.min(1,(frame-226-i*8)/125)),x=918+p*340+Math.sin(i*2+p*5)*p*70,y=795-p*(300+hash(i+21)*110);return <ellipse key={i} cx={x} cy={y} rx={28+p*105} ry={24+p*95} fill="url(#steam)" opacity={p>0?.55:0}/>;})}
    {Array.from({length:4},(_,i)=><path key={i} d={`M${923+i*11} 803q-28-50 10-95t${25+i*9}-115`} fill="none" stroke="#d5e5df" strokeWidth="3" strokeOpacity={(1-smooth((frame-270)/35))*.22}/>)}
  </g>;
};
export const MagicShield=({frame,event,center,impact}:{frame:number;event:DirectCast;center:Point;impact:number})=>{
  if(!canDirectCast(event.caster.id,'magicShield')||frame<event.start||frame>impact+30)return null;
  const appear=smooth((frame-event.start)/15),fade=1-smooth((frame-impact-5)/25),age=frame-impact;
  return <g transform={`translate(${center.join(' ')})`} opacity={appear*fade}>
    <ellipse rx={42*appear} ry={spellConfigs.magicShield.radius*appear} fill="url(#shield-fill)" stroke="#acd3e0" strokeWidth="2.5"/>
    <ellipse rx={35*appear} ry={116*appear} fill="none" stroke="#a5c9d5" strokeOpacity=".35"/>
    {[0,1,2,3,4,5].map(i=><path key={i} transform={`translate(${Math.sin(i*Math.PI/3)*37} ${Math.cos(i*Math.PI/3)*105})`} d="M-4-5L0 0-3 5M4-5V5" fill="none" stroke="#d5edf0" strokeWidth="1.5"/>)}
    {age>=0&&<><ellipse cx="-22" rx={Math.min(40,4+age*3)} ry={Math.min(124,7+age*8)} fill="none" stroke="#ecfff7" strokeWidth="3" opacity={1-smooth(age/19)}/><path d="M-28-8L-5-27 8-18 18-56M-5-27L-14-74M-28-8L2 18-3 52 16 83M2 18L24 5" fill="none" stroke="#d7e8ef" strokeWidth="1.7" opacity={smooth(age/5)}/></>}
  </g>;
};
