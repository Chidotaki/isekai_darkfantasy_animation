import {clamp,hash} from '../motion';
import type {Point} from '../components/characterMotion';
import {anatomy,weaponPoint} from './rig';
import {impacts,sampleFighter} from './timeline';

export const GroundShadow=({x,y,width=100,opacity=.3}:{x:number;y:number;width?:number;opacity?:number})=><g opacity={opacity}><ellipse cx={x} cy={y} rx={width} ry="17" fill="#0b2227"/><ellipse cx={x} cy={y} rx={width*.6} ry="9" fill="#0b2227"/></g>;
export const Sparks=({age,point,seed=0}:{age:number;point:Point;seed?:number})=>{
  if(age<0||age>13)return null;
  const p=age/13;
  return <g transform={`translate(${point.join(' ')})`} opacity={(1-p)**2}>
    {Array.from({length:11},(_,i)=>{const a=hash(i+seed)*Math.PI*2,d=(12+hash(i+4)*70)*p,dx=Math.cos(a),dy=Math.sin(a);return <path key={i} d={`M${dx*d} ${dy*d+p*p*20}l${dx*(7+9*(1-p))} ${dy*12}`} stroke={i%3?'#e7d6a5':'#eafaf0'} strokeWidth={i%3?2.5:4} strokeLinecap="round"/>;})}
    {age<3&&<path d="M-14 0L-3-3 0-16 4-3 18 0 4 4 0 14-4 4Z" fill="#fff1c5"/>}
  </g>;
};
export const Dust=({age,point,strength=1}:{age:number;point:Point;strength?:number})=>{
  if(age<0||age>28)return null;
  const p=age/28;
  return <g transform={`translate(${point.join(' ')})`} opacity={(1-p)*.45*strength}>
    {Array.from({length:9},(_,i)=>{const side=i%2?1:-1;return <ellipse key={i} cx={side*(8+p*(35+hash(i)*65))} cy={-Math.sin(p*Math.PI*.75)*(10+hash(i+7)*26)} rx={7+p*20} ry={5+p*11} fill={i%3?'#b7b28d':'#7e8973'}/>;})}
    {Array.from({length:6},(_,i)=>{const dx=(i-2.5)*12*p,dy=-Math.sin(p*Math.PI)*(8+hash(i)*35);return <path key={i} d={`M${dx} ${dy}l5-3 3 4-6 2Z`} fill="#7a7d60"/>;})}
  </g>;
};

/** A swept ribbon built from the same grip/tip transforms that draw the sword. */
export const SwordTrail=({frame}:{frame:number})=>{
  const windows=[[142,155],[326,341]],window=windows.find(([a,b])=>frame>=a&&frame<=b);
  if(!window)return null;
  const samples=Array.from({length:6},(_,i)=>Math.max(window[0],frame-i*.65));
  const tip=samples.map(f=>weaponPoint(sampleFighter(f,'human'),'human',anatomy.human.blade));
  const base=samples.map(f=>weaponPoint(sampleFighter(f,'human'),'human',22));
  return <g>{tip.slice(1).map((p,i)=><path key={i} d={`M${tip[i].join(' ')}L${p.join(' ')}L${base[i+1].join(' ')}L${base[i].join(' ')}Z`} fill="#b5e6e3" opacity={(1-i/6)*.23}/>)}<path d={`M${tip.map(p=>p.join(' ')).join('L')}`} stroke="#e7f8e8" strokeWidth="2.2" opacity=".55" fill="none"/></g>;
};
export const SpeedLines=({frame}:{frame:number})=>{
  const hero=sampleFighter(frame,'human'),prev=sampleFighter(frame-1,'human'),dx=hero.x-prev.x;
  if(Math.abs(dx)<12)return null;
  return <g opacity={clamp(Math.abs(dx)/35)*.25} stroke="#c1cfc0" strokeWidth="2" strokeLinecap="round">
    {[0,1,2].map(i=><path key={i} d={`M${hero.x-Math.sign(dx)*(65+i*8)} ${hero.y-95-i*55}h${-dx*(2+i*.4)}`}/>)}
  </g>;
};
export const CombatEffects=({frame}:{frame:number})=><>
  <SwordTrail frame={frame}/><SpeedLines frame={frame}/>
  <Dust age={frame-impacts.ground} point={[840,880]}/>
  <Sparks age={frame-impacts.clash} point={[900,650]} seed={2}/>
  <Sparks age={frame-impacts.block} point={[800,610]} seed={7}/>
  <Dust age={frame-222} point={[530,880]} strength={.45}/>
  <Sparks age={frame-impacts.finish} point={[794,663]} seed={17}/>
  <Dust age={frame-impacts.fall} point={[660,880]} strength={.65}/>
</>;
