import {blinkAmount} from './characterMotion';
import {clamp} from '../motion';
import {useId} from 'react';
import {resolveFace,type Expression,type FacePose} from './faceRig';

export type {Expression} from './faceRig';
type Props = {
  t: number; seed: number; skin: string; hair: string; style: number;
  expression: Expression; look: number; mouth: number; secondary: number;
  controls?:Partial<FacePose>;
  rearView?:boolean;
};

/** Separate head cutout, attached at the neck by the parent rig. */
export const CharacterFace = ({t, seed, skin, hair, style, expression, look, mouth, secondary,controls,rearView=false}: Props) => {
  const f=resolveFace(expression,1,undefined,{gazeX:look,...(mouth>.1?{mouthOpen:1.3+mouth*5,mouthWidth:4.5+mouth*2.5,teeth:mouth>.4?.5:0}:{}),...controls});
  const eyeOpen=1-Math.max(blinkAmount(t,seed),clamp(f.blink));
  const gaze=Math.max(-1,Math.min(1,f.gazeX)),gazeY=Math.max(-1,Math.min(1,f.gazeY));
  const uid=useId().replace(/:/g,''),mw=Math.max(2,f.mouthWidth),mo=Math.max(0,f.mouthOpen);
  if(rearView)return <><path d="M-10-180V-153Q0-148 10-153V-180" fill={skin} stroke="#192635" strokeWidth="2.4"/><path d="M-33-192Q-40-218-27-230L-12-230-8-237 5-232 20-236Q39-223 34-201L29-181 16-174-2-178-18-174-30-182Z" fill={hair} stroke="#192635" strokeWidth="2.8"/><path d="M-25-218Q-8-230 14-224M-20-184L-14-190M4-182L7-190" fill="none" stroke="#fff4d2" strokeOpacity=".16" strokeWidth="2.5" strokeLinecap="round"/></>;
  return <>
    {(style === 2 || style === 4) && <g transform={`rotate(${secondary * (style === 4 ? 3 : .6)} 23 -210)`}>
      <path d={style === 2 ? 'M-32-211Q-43-180-32-157L33-157Q43-189 28-215Z' : 'M20-212Q55-221 51-186Q49-161 36-149L31-179Z'} fill={hair} stroke="#192635" strokeWidth="2.5"/>
    </g>}
    <path d="M-10-176V-153Q0-148 10-153V-176" fill={skin} stroke="#192635" strokeWidth="2.4"/>
    <path d="M-9-169Q0-162 9-169V-161Q0-157-9-161Z" fill="#855646" opacity=".18"/>
    <ellipse cx="-32" cy="-192" rx="6" ry="9" fill={skin} stroke="#192635" strokeWidth="2"/>
    <ellipse cx="32" cy="-192" rx="6" ry="9" fill={skin} stroke="#192635" strokeWidth="2"/>
    <path d="M-32-207Q-34-230 0-232Q34-230 33-206L31-187Q27-169 5-165Q-15-164-28-181Z" fill={skin} stroke="#192635" strokeWidth="2.8"/>
    <path d="M-30-208Q-30-221-17-224L-22-196Q-22-178-3-167Q-22-169-29-185Z" fill="#825c52" opacity=".12"/>
    <g transform={`translate(${gaze*2+f.headYaw*4} ${gazeY*.7}) scale(${1-Math.abs(f.headYaw)*.1} 1)`}>
      {[-13,13].map((x,i)=>{const lid=Math.max(0,Math.min(1.3,i===0?f.lidL:f.lidR))*eyeOpen,top=-6*lid,bottom=Math.max(0,5*lid-f.cheek*.6*eyeOpen),d=`M-7 0Q-5 ${top*1.65} 0 ${top}Q5 ${top} 7 0Q5 ${bottom*1.5} 0 ${bottom}Q-5 ${bottom} -7 0Z`;
        return <g key={x} transform={`translate(${x} -193)`}>
          <defs><clipPath id={`${uid}-eye-${i}`}><path d={d}/></clipPath></defs>
          <path d={d} fill="#f7eddb"/>
          <g clipPath={`url(#${uid}-eye-${i})`} transform={`translate(${gaze*2.5} ${gazeY*2.3})`}>
            <ellipse rx="3.9" ry="5.3" fill="#34464c"/><ellipse cy=".5" rx="2.4" ry="4" fill="#152534"/><circle cx="1.1" cy="-2.1" r="1.25" fill="#fff9e7"/>
          </g>
          <path d={`M-7 0Q-5 ${top*1.65} 0 ${top}Q5 ${top} 7 0`} stroke="#253342" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d={`M-6 1Q0 ${bottom*1.5} 6 1`} stroke="#805f55" strokeOpacity=".35" strokeWidth=".9" fill="none"/>
          <g transform={`translate(0 ${-12-(i===0?f.browLiftL:f.browLiftR)}) rotate(${i===0?f.browAngleL:f.browAngleR})`}><path d="M-6 0Q0-1.3 6 0" stroke={hair} strokeWidth="2.8" fill="none" strokeLinecap="round"/></g>
        </g>;
      })}
      <path d="M1-190L-1-184 3-183" stroke="#987266" strokeOpacity=".55" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <ellipse cx="-21" cy="-182" rx="5.5" ry="2.4" fill="#ce8577" opacity={.13+f.blush*.45}/><ellipse cx="21" cy="-182" rx="5.5" ry="2.4" fill="#ce8577" opacity={.13+f.blush*.45}/>
      <g transform={`translate(${f.mouthSkew*.4} -175.5) rotate(${f.mouthSkew*2})`}>
        {mo>.2?<><path d={`M${-mw} 0Q0 ${f.mouthCurve-mo*.9} ${mw} 0Q${mw*.8} ${mo+f.mouthCurve} 0 ${mo+f.mouthCurve*.6}Q${-mw*.8} ${mo+f.mouthCurve} ${-mw} 0Z`} fill="#704950" stroke="#533b43" strokeWidth="1"/>{f.teeth>.05&&<path d={`M${-mw*.57} .3Q0 ${Math.min(1,f.mouthCurve*.3)} ${mw*.57} .3`} stroke="#f3e3d0" strokeWidth={1.2+f.teeth*.7} strokeLinecap="round"/>}</>:<path d={`M${-mw} 0Q0 ${f.mouthCurve} ${mw} 0`} stroke="#80594f" strokeWidth={1.6+f.lipPress*.6} fill="none" strokeLinecap="round"/>}
      </g>
    </g>
    <g transform={`rotate(${secondary * .8} 0 -215)`}>
      <path d={[
        'M-33-191Q-40-213-29-224L-32-230-14-231Q0-244 12-235L23-239Q38-226 35-205L29-189 19-211 10-200 9-221Q0-207-10-202L-9-218-23-205-25-188Z',
        'M-32-200Q-39-215-29-226L-16-225-12-236 0-231 18-236Q39-224 33-205L28-196 17-215Q-1-211-17-214Z',
        'M-32-185Q-42-223-18-232Q19-243 34-219L34-183 23-207 12-213 3-206-9-221Q-23-211-26-184Z',
        'M-33-205Q-44-212-32-223Q-34-235-19-232Q-10-245 0-235Q13-245 22-233Q40-231 32-219Q43-208 31-199L23-210 10-207-1-216-16-210Z',
        'M-32-200Q-37-231-6-235Q25-241 34-216L31-194 18-213 4-205-7-221Q-19-208-29-202Z',
      ][style]} fill={hair} stroke="#172635" strokeWidth="2.6" strokeLinejoin="round"/>
      <path d={style === 0 ? 'M-25-220Q-12-234 2-230M10-228L22-223M-24-207L-16-216' : 'M-25-220Q-8-231 13-225'} stroke="#fff4d2" strokeOpacity=".14" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </g>
  </>;
};
