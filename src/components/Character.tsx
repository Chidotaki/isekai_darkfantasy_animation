import React from 'react';
import {clamp, ease, mix} from '../motion';
import {CharacterFace, type Expression} from './CharacterFace';
import {endpoint, idleMotion, kneeBetween, talkMotion, walkMotion, type Point} from './characterMotion';
import {rotate, type CombatPose} from '../combat/rig';
import {Scabbard, Sword} from '../combat/Weapons';
import {resolveFace,type FacePose} from './faceRig';

export type {Expression} from './CharacterFace';
export type CastId = 'ren' | 'elias' | 'mira' | 'toma' | 'lina';
export type Pose = 'stand' | 'sit' | 'walk' | 'talk' | 'awaken' | 'blessed' | 'wait';
export const cast = {
  ren: {hair:'#14212b',coat:'#334c61',trim:'#63b7b8',skin:'#dfc3aa',pants:'#293748',style:0},
  elias: {hair:'#ba8050',coat:'#e0d4b7',trim:'#d9a34d',skin:'#f0d1ae',pants:'#3c4350',style:1},
  mira: {hair:'#733e49',coat:'#765165',trim:'#edb18f',skin:'#e4b79e',pants:'#3e3546',style:2},
  toma: {hair:'#4c332c',coat:'#566c66',trim:'#c8ba86',skin:'#b88b70',pants:'#354247',style:3},
  lina: {hair:'#a39b79',coat:'#4b5b77',trim:'#b5b5d1',skin:'#e3c6ab',pants:'#303b51',style:4},
} as const;
/** Stable art IDs; canonical story names do not require renaming existing assets. */
export const characterMetadata={ren:{name:'Asakura Yuu',japanese:'朝倉 悠',role:'protagonist'},mira:{name:'Minase Shiori',japanese:'水瀬 栞',role:'childhood friend'},elias:{name:'Tachibana Kairyū',japanese:'橘 海龍',role:'class representative'}} as const;
export type CharacterProps = {
  id: CastId; x: number; y: number; scale?: number; t: number;
  pose?: Pose; expression?: Expression; look?: number; gesture?: number;
  turn?: number; opacity?: number; speaking?: boolean; poseTime?: number; walkBlend?: number;
  rig?: CombatPose; facing?: number;
  costume?: 'student'|'mage'; sword?: boolean; handItem?: React.ReactNode;
  face?:Partial<FacePose>; expressionIntensity?:number; expressionBlend?:{expression:Expression;weight:number};
  shoulderLift?:number; sleeveCover?:number; stillness?:number;
  backArmInFront?:boolean; handOpen?:number;
  rearView?:boolean;
};
const INK = '#182736';

/** Tapered filled cutout between rig joints, rather than a stick stroke. */
export const Segment = ({a,b,width,endWidth,color,shade=false}: {
  a:Point;b:Point;width:number;endWidth:number;color:string;shade?:boolean;
}) => {
  const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.max(.001,Math.hypot(dx,dy));
  const nx=-dy/length,ny=dx/length;
  const p=(base:Point,w:number)=>`${base[0]+nx*w},${base[1]+ny*w}`;
  return <g>
    <path d={`M${p(a,width/2)}L${p(b,endWidth/2)}Q${b[0]+dx/length*endWidth/2},${b[1]+dy/length*endWidth/2} ${p(b,-endWidth/2)}L${p(a,-width/2)}Q${a[0]-dx/length*width/2},${a[1]-dy/length*width/2} ${p(a,width/2)}Z`} fill={color} stroke={INK} strokeWidth="2.3" strokeLinejoin="round"/>
    <path d={`M${p(a,-width*.22)}L${p(b,-endWidth*.22)}`} stroke={shade?'#071523':'#f3ead2'} strokeOpacity={shade?.15:.10} strokeWidth={width*.27} strokeLinecap="round"/>
  </g>;
};

export const Hand = ({at,side,skin,open,angle}: {at:Point;side:number;skin:string;open:number;angle:number}) =>
  <g transform={`translate(${at[0]} ${at[1]}) rotate(${angle}) scale(${side} 1)`}>
    <path d={open>.15 ? 'M-6-3Q-5-8-1-6L1-2 9-4Q14-4 13 0L8 5Q2 10-5 6Z' : 'M-6-5Q0-8 6-4L8 3Q6 9 0 9L-6 6Q-9 0-6-5Z'} fill={skin} stroke={INK} strokeWidth="2"/>
    <path d={open>.15?'M0 2L7 0':'M-3 1L2 3'} stroke="#8b665c" strokeOpacity=".5" strokeWidth="1.2" strokeLinecap="round"/>
  </g>;

export const Shoe = ({at,side,angle=0}: {at:Point;side:number;angle?:number}) =>
  <g transform={`translate(${at[0]} ${at[1]}) rotate(${angle}) scale(${side} 1)`}>
    <path d="M-9-8L8-8 10-1Q21 0 22 6Q8 11-11 7L-11-1Z" fill="#192936" stroke="#111e2c" strokeWidth="2.5"/>
    <path d="M-10 6Q7 10 21 6" stroke="#657179" strokeWidth="2.6"/>
    <path d="M0-5L7-4M1-1L8 0" stroke="#96a09c" strokeWidth="1.5" strokeLinecap="round"/>
  </g>;

/** Same feet-origin API and cast: every existing scene now uses the cutout rig. */
export const Character: React.FC<CharacterProps> = ({
  id,x,y,scale=1,t,pose='stand',expression='quiet',look=0,gesture=0,
  turn=1,opacity=1,speaking=false,poseTime=t,walkBlend=1,rig,facing=1,costume='student',sword=true,handItem,
  face,expressionIntensity=1,expressionBlend,shoulderLift=0,sleeveCover=0,stillness=0,backArmInFront=false,handOpen=0,rearView=false,
}) => {
  const mage=costume==='mage';
  const c=mage?{hair:'#bac6bd',coat:'#51465e',trim:'#bd9b69',skin:'#c5ae9d',pants:'#292b3e',style:1}:cast[id],seed=Object.keys(cast).indexOf(id)*1.73;
  const seated=pose==='sit',talking=pose==='talk'||speaking;
  const idle=idleMotion(t,seed),talk=talkMotion(t,seed);
  const facial=resolveFace(expression,expressionIntensity,expressionBlend,{gazeX:look,...(talking?{mouthOpen:talk.mouthOpen,mouthWidth:talk.mouthWidth,teeth:talk.teeth,lipPress:talk.lipPress}:{}),...face});
  const walk=walkMotion(poseTime,pose==='walk'?walkBlend:0);
  const crouch=pose==='awaken'?(1-ease(t,.5,2.6))*62:0;
  const bless=pose==='blessed'?ease(poseTime,0,1.3):0;
  const waiting=pose==='wait'?ease(t,.5,2)*(1-ease(t,4.2,6.3)):0;
  const gestureAmount=clamp(gesture+(talking?talk.gesture:0));
  const pelvisX=rig?.pelvisX??(idle.sway*(seated?.3:1)+walk.shift);
  const pelvisY=rig?.pelvisY??(crouch+idle.rise*.45+walk.drop);
  const torsoLean=rig?.torso??(idle.lean+walk.lean+(talking?talk.lean:0)-waiting*1.5);
  const secondary=idle.secondary*(1-stillness*.7)+walk.secondary+(talking?talk.head*.35:0);
  const hip=(side:number):Point=>{const h=rotate([side*16,-85],rig?.hips??0,[0,-85]);return [pelvisX+h[0],pelvisY+h[1]];};
  const feet:Point[]=rig?[[rig.leftX,rig.leftY],[rig.rightX,rig.rightY]]:seated?[[-47,-31],[48,-31]]:[[-23+walk.left.x,-7+walk.left.y],[23+walk.right.x,-7+walk.right.y]];
  const arms = [-1,1].map(side=>{
    const upper=rig?(side===1?rig.frontUpper:rig.backUpper):side*(14+bless*33+waiting*16+(side===1?gestureAmount*28:gestureAmount*6))+walk.arm;
    const lower=rig?(side===1?rig.frontLower:rig.backLower):side*(-7+bless*128+waiting*106+(side===1?gestureAmount*142:gestureAmount*28))-walk.arm*.7;
    const shoulder:Point=[side*29,-145+shoulderLift];
    const elbow=endpoint(shoulder,34,upper),wrist=endpoint(elbow,30,lower);
    return {side,shoulder,elbow,wrist,lower,open:Math.max(bless,waiting,gestureAmount)};
  });
  const arm=(index:number)=>{
    const a=arms[index];
    const cuff:Point=[mix(a.elbow[0],a.wrist[0],.82),mix(a.elbow[1],a.wrist[1],.82)];
    return <g>
      <Segment a={a.shoulder} b={a.elbow} width={25} endWidth={21} color={c.coat} shade={index===0}/>
      <Segment a={a.elbow} b={a.wrist} width={21} endWidth={14} color={c.coat} shade={index===0}/>
      <Segment a={cuff} b={a.wrist} width={16} endWidth={15} color={id==='ren'?'#263e51':c.trim}/>
      {rig&&index===1&&<g transform={`translate(${endpoint(a.wrist,6,a.lower).join(' ')}) rotate(${rig.wrist})`}>{handItem}{sword&&rig.draw>.01&&<Sword draw={rig.draw}/>}</g>}
      <Hand at={endpoint(a.wrist,6,a.lower)} side={a.side} skin={c.skin} open={rig?handOpen:a.open} angle={rig&&index===1?rig.wrist:-a.lower*.3}/>
      {id==='ren'&&!mage&&index===1&&<g transform={`translate(${a.wrist.join(' ')}) rotate(${-a.lower})`}>
        <ellipse cy="2" rx="7.6" ry="2.2" fill="none" stroke="#b9c5c8" strokeWidth="2.7"/><path d="M-6 2Q0 6 6 2" fill="none" stroke="#edf0e7" strokeWidth="1"/>
        {sleeveCover>0&&<path d={`M-8 -5H8V${sleeveCover*8}Q0 ${sleeveCover*8+2} -8 ${sleeveCover*8}Z`} fill="#263e51" stroke={INK} strokeWidth="1.1"/>}
      </g>}
    </g>;
  };
  return <g transform={`translate(${x} ${y}) scale(${scale*facing} ${scale})`} opacity={opacity}>
    {mage&&<path transform={`translate(${pelvisX} ${pelvisY}) rotate(${torsoLean*.3} 0 -100)`} d={`M-29-154Q0-170 29-154L${48+secondary}-25Q15-13-5-24L-46-20-34-91Z`} fill="#302b41" stroke={INK} strokeWidth="3"/>}
    {!rig&&<ellipse cy={seated?-22:7} rx={seated?61:46} ry="9" fill="#06121d" opacity=".3"/>}
    {feet.map((foot,i)=>{
      const side=i===0?-1:1,root=hip(side);
      const knee:Point=seated?[side*46,-76]:kneeBetween(root,foot,rig?1:side);
      return <g key={i}>
        <Segment a={root} b={knee} width={28} endWidth={23} color={c.pants} shade={i===0}/>
        <Segment a={knee} b={foot} width={23} endWidth={17} color={c.pants} shade={i===0}/>
        <path d={`M${knee[0]-5} ${knee[1]+2}l9 2`} stroke="#93a1a3" strokeOpacity=".15" strokeWidth="2"/>
        <Shoe at={foot} side={rig?1:side} angle={rig?(i===0?rig.ankleL:rig.ankleR):i===0?walk.left.angle:walk.right.angle}/>
      </g>;
    })}
    <g transform={`translate(${pelvisX} ${pelvisY})`}>
      <path transform={`rotate(${rig?.hips??0} 0 -85)`} d="M-27-98Q0-103 27-98L28-73Q15-67 0-74Q-15-67-28-73Z" fill={c.pants} stroke={INK} strokeWidth="2.5"/>
      {rig&&sword&&<><Scabbard/>{rig.draw<=.01&&<g transform="translate(-22 -100) rotate(240)"><Sword draw={0}/></g>}</>}
      <g transform={`scale(${rig?.width??1} 1) rotate(${torsoLean} 0 -88) translate(0 ${rig?0:idle.rise+(talking?talk.lift:0)})`}>
        {!backArmInFront&&arm(0)}
        <g transform={`translate(0 -86) scale(${1+idle.breath*.007} ${1+idle.breath*.009}) translate(0 86)`}>
          <path d="M-27-155Q0-165 27-155L34-141 29-113 33-82Q17-76 1-81Q-15-76-33-82L-29-113-34-141Z" fill={c.coat} stroke={INK} strokeWidth="2.8"/>
          <path d="M-27-150L-22-123-24-85-32-84-29-114-32-140Z" fill="#091b2b" opacity=".2"/>
          <path d="M7-151L25-151 29-140 22-116 24-88 7-88Z" fill="#fff2ca" opacity=".055"/>
          <g opacity={rearView?0:1}>
          <path d="M-16-154L0-126 16-154" fill="#e7ddc9" stroke={INK} strokeWidth="1.4"/>
          <path d="M-16-155L-23-138-13-129-21-121-6-104 0-127M16-155L23-138 13-129 21-121 6-104" fill="none" stroke={INK} strokeOpacity=".65" strokeWidth="2"/>
          <path d="M1-126V-83" stroke={id==='ren'?'#86b8ba':'#7f806e'} strokeWidth="2"/>
          <path d="M-24-101L-10-99M12-99L26-101" stroke={INK} strokeWidth="3" strokeLinecap="round"/>
          <path d="M-23-98L-11-96M13-96L25-98" stroke="#f0dfba" strokeOpacity=".18" strokeWidth="1"/>
          {[112,102,91].map(v=><circle key={v} cx="5" cy={-v} r="1.4" fill={c.trim}/>)}
          {id==='elias'&&<><path d="M19-140h12v13l-6 5-6-5Z" fill="#bd8c49"/><path d="M25-137v10m-3-7h6" stroke="#fff0bb" strokeWidth="1.4"/></>}
          {id!=='ren'&&<path d="M-3-149H3L5-129 0-123-5-129Z" fill={c.trim} stroke={INK} strokeWidth="1"/>}
          </g>
          {rearView&&<path d="M-22-149Q0-137 22-149M0-140V-84M-27-108Q0-102 27-108" fill="none" stroke={INK} strokeWidth="1.6" strokeOpacity=".35"/>}
          <path d={`M-31-84Q-15 ${-80+secondary*.5} 0-83Q15 ${-80-secondary*.5} 32-84`} fill="none" stroke={INK} strokeWidth="2"/>
        </g>
        {mage&&<><path d="M-27-153L-39-48Q-20-38 0-46Q22-38 40-48L27-153 12-146 5-65-5-65-13-146Z" fill={c.coat} stroke={INK} strokeWidth="2.5"/><path d="M-13-146L-7-60M13-146L7-60M-34-50Q0-40 35-50" fill="none" stroke={c.trim} strokeWidth="2"/><path d="M-30-104Q0-93 30-104L29-95Q0-84-29-95Z" fill="#282a37"/><circle cy="-97" r="6" fill={c.trim}/></>}
        {arm(1)}
        {backArmInFront&&arm(0)}
        <g transform={`translate(${facial.gazeX*2.3} ${rig?0:-idle.rise*.2}) rotate(${(rig?.head??(idle.head*(1-stillness)+(talking?talk.head:0)+look*2-torsoLean*.35))+facial.headTilt} 0 -162) scale(${mix(.92,1,clamp(Math.abs(turn)))*(1-Math.abs(facial.headYaw)*.07)} 1)`}>
          {mage&&<path d="M-40-181Q-51-224-21-245L0-255 25-243Q49-222 40-177L27-169-27-169Z" fill="#3b334d" stroke={INK} strokeWidth="3"/>}
          <CharacterFace t={t} seed={seed} skin={c.skin} hair={c.hair} style={c.style} expression={expression} look={look} mouth={talking?talk.mouth:0} secondary={secondary} rearView={rearView} controls={facial}/>
          {mage&&<path d="M-14-171L-8-158 0-149 9-160 14-173 5-170 0-166-5-171Z" fill="#bac6bd" stroke={INK} strokeWidth="1.5"/>}
        </g>
        {id==='ren'&&!mage&&<>
          <g transform={`rotate(${secondary*2.2} 14 -147)`}><path d="M9-151Q24-150 25-137L22-108 10-113 12-137Z" fill="#438e9b" stroke={INK} strokeWidth="1.5"/><path d="M16-139L16-116" stroke="#97d0c9" strokeOpacity=".35" strokeWidth="2"/></g>
          <path d="M-20-160Q0-148 22-160L23-148Q1-135-22-148Z" fill={c.trim} stroke={INK} strokeWidth="1.8"/>
          <path d="M-15-151Q0-144 16-151" fill="none" stroke="#afe0d2" strokeOpacity=".45" strokeWidth="2"/>
        </>}
      </g>
    </g>
  </g>;
};
