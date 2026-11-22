import {Hand,Segment} from '../components/Character';
import {blinkAmount,endpoint,type Point} from '../components/characterMotion';
import {jointBetween,rotate,type Fighter} from './rig';
import {Club} from './Weapons';

/** Broad shoulders, short bowed legs, long forearms and a low neck distinguish this rig. */
export const Goblin=({fighter,t,weapon=true}:{fighter:Fighter;t:number;weapon?:boolean})=>{
  const {x,y,scale,facing,pose:p}=fighter,skin='#7b9b65',ink='#22382f';
  const fallen=p.fall/88,eye=1-blinkAmount(t,4.3);
  const arm=(side:number)=>{
    const shoulder:Point=[side*33,-117],upper=side===1?p.frontUpper:p.backUpper,lower=side===1?p.frontLower:p.backLower;
    const elbow=endpoint(shoulder,33,upper),wrist=endpoint(elbow,29,lower),grip=endpoint(wrist,6,lower);
    return <g>
      <Segment a={shoulder} b={elbow} width={33} endWidth={26} color={skin} shade={side<0}/>
      <Segment a={elbow} b={wrist} width={27} endWidth={19} color={skin} shade={side<0}/>
      <path d={`M${elbow[0]-8} ${elbow[1]+2}l10 3`} stroke="#486449" strokeWidth="2"/>
      <g transform={`translate(${wrist.join(' ')}) rotate(${-lower})`}><path d="M-11-7H11V3H-11Z" fill="#584b38" stroke={ink} strokeWidth="2"/><path d="M-9-3H9" stroke="#aa9571" strokeWidth="2"/></g>
      {side===1&&weapon&&<g transform={`translate(${grip.join(' ')}) rotate(${p.wrist})`}><Club/></g>}
      <Hand at={grip} side={side} skin={skin} open={fallen>.3?.4:0} angle={side===1?p.wrist:-lower*.4}/>
    </g>;
  };
  return <g transform={`translate(${x} ${y}) scale(${scale*facing} ${scale})`}>
    <g transform={`translate(${fallen*57} ${fallen*-30}) rotate(${p.fall} 0 -30)`}>
      {[-1,1].map(side=>{
        const h=rotate([side*20,-58],p.hips,[0,-58]),hip:Point=[h[0]+p.pelvisX,h[1]+p.pelvisY];
        const foot:Point=side<0?[p.leftX,p.leftY]:[p.rightX,p.rightY],knee=jointBetween(hip,foot,30,29,side);
        return <g key={side}>
          <Segment a={hip} b={knee} width={32} endWidth={26} color="#4e5640" shade={side<0}/>
          <Segment a={knee} b={foot} width={26} endWidth={19} color={skin}/>
          <g transform={`translate(${foot.join(' ')}) rotate(${side<0?p.ankleL:p.ankleR})`}>
            <path d="M-12-10H10L14-1 23 3 21 9H-14Z" fill="#65523b" stroke={ink} strokeWidth="2.4"/>
            <path d="M-10-5H10M-10 0H13" stroke="#b0a17d" strokeWidth="2.5"/>
          </g>
        </g>;
      })}
      <g transform={`translate(${p.pelvisX} ${p.pelvisY})`}>
        <path transform={`rotate(${p.hips} 0 -58)`} d="M-31-76L30-76 36-43 20-38 7-48-7-39-34-43Z" fill="#544b38" stroke={ink} strokeWidth="2.5"/>
        <g transform={`rotate(${p.torso} 0 -62)`}>
          {arm(-1)}
          <path d="M-34-128Q0-143 34-128L44-110 31-87 31-62Q0-51-31-62L-31-88-43-110Z" fill={skin} stroke={ink} strokeWidth="3"/>
          <path d="M-30-125L-12-132 19-66-4-60Z" fill="#685139" stroke={ink} strokeWidth="2.5"/>
          <path d="M-33-116L-17-109-25-90-36-97Z" fill="#93794e" stroke={ink} strokeWidth="2"/>
          <path d="M6-114Q20-121 31-112M9-97Q22-94 29-102" fill="none" stroke="#4c704f" strokeWidth="2.4"/>
          <path d="M-32-74Q0-66 32-74L32-63Q0-55-32-63Z" fill="#4d3d31" stroke={ink} strokeWidth="2"/>
          <rect x="-6" y="-71" width="14" height="11" rx="2" fill="#b5a26a" stroke={ink} strokeWidth="2"/>
          <path d="M-3-67H5V-63H-3Z" fill="#4d3d31"/>
          {arm(1)}
          <g transform={`rotate(${p.head} 0 -132)`}>
            <path d="M-17-144L-16-126Q0-118 17-126V-144" fill={skin} stroke={ink} strokeWidth="2.4"/>
            <path d="M-31-170L-65-181Q-60-150-33-149M31-170L64-181Q57-150 33-149" fill={skin} stroke={ink} strokeWidth="3"/>
            <path d="M-37-167L-55-173-44-158M37-167L54-173 44-157" fill="#a6a379"/>
            <path d="M-34-176Q-24-202 4-199Q38-195 37-171L34-146Q23-128 0-128Q-26-130-35-149Z" fill={skin} stroke={ink} strokeWidth="3"/>
            <path d="M-30-179Q-33-153-21-144L-8-133Q-31-135-35-154Z" fill="#496c4c" opacity=".5"/>
            <path d="M-20-192L-12-207-3-195 8-208 17-191" fill="#354c3b" stroke={ink} strokeWidth="2"/>
            {[-15,16].map(cx=><g key={cx} transform={`translate(${cx} -164)`}>
              {fallen>.8?<path d="M-7 0Q0 3 7 0" fill="none" stroke={ink} strokeWidth="2"/>:<g transform={`scale(1 ${eye})`}><path d="M-9-3Q0-8 9-2L6 4H-6Z" fill="#eee0aa"/><ellipse cx="3" cy="0" rx="2.5" ry="5" fill="#293d31"/><circle cx="4" cy="-2" r="1" fill="#fff8cf"/></g>}
            </g>)}
            <path d="M-26-175L-7-170M9-170L29-177" stroke="#324b35" strokeWidth="5" strokeLinecap="round"/>
            <path d="M-5-164L-10-151Q0-145 12-151L6-164" fill="#92a572" stroke="#4d6d4a" strokeWidth="1.6"/>
            <path d={p.roar>.2?'M-17-145Q0-151 19-145Q16-123 0-125Q-14-125-17-145Z':'M-18-143Q0-137 19-143L12-135Q0-131-13-136Z'} fill="#394539" stroke={ink} strokeWidth="1.8"/>
            <path d="M-15-138L-12-150-7-136M11-136L16-151 19-139" fill="#e7dab5" stroke="#65765a" strokeWidth="1"/>
          </g>
        </g>
      </g>
    </g>
  </g>;
};
