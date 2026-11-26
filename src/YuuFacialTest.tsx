import {AbsoluteFill,Interactive,useCurrentFrame,useVideoConfig} from 'remotion';
import {ease} from './motion';
import {sampleStarterPerformance} from './visual/starterSheets';
import {CharacterRenderer} from './visual/CharacterRenderer';
import {YuuFacialRenderer} from './visual/YuuFacialRenderer';
import {yuuFaceFromPerformance,type YuuFaceExpression} from './visual/yuuFacialSprites';
import type {VisualExpression} from './visual/types';

const requests:VisualExpression[]=['neutral','happy','worried','determined','surprised','neutral'];
const specimens:YuuFaceExpression[]=['neutral','happy','worried','serious','surprised'];
/** Noncanonical 12-second calibration fixture. No assembled-preview image is rendered. */
export const YuuFacialTest=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps,section=Math.min(5,Math.floor(t/2));
  const blink=ease(t,3.64,3.70)*(1-ease(t,3.78,3.88));
  const talking=t>=10||(t>=8.6&&t<9.8);
  const performance=sampleStarterPerformance('asakura-yuu',frame,{fps,expression:requests[section],talk:talking,blink});
  const face=yuuFaceFromPerformance(performance);
  return <AbsoluteFill style={{backgroundColor:'#293842'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <Interactive.Text name="Test title" x={70} y={70} fontFamily="Arial" fontSize={30} fill="#e2e5df">YUU · FIXED-HEAD FACIAL TEST</Interactive.Text>
      <Interactive.Text name="Test scope" x={70} y={109} fontFamily="Arial" fontSize={19} fill="#aebcc2">Independent eyes, brows and mouths · noncanonical calibration</Interactive.Text>
      <g transform={`translate(35 150) scale(1.5) rotate(${performance.body.head*.4} 253 356)`}>
        <YuuFacialRenderer {...face}/>
      </g>
      <ellipse cx={1040} cy={935} rx={75} ry={9} fill="#17232c"/>
      <CharacterRenderer character="asakura-yuu" facialMode="sprites-v1" frame={frame} fps={fps} performance={performance} x={1040} y={930} scale={1.03}/>
      <text x={1040} y={980} textAnchor="middle" fontFamily="Arial" fontSize={21} fill="#c4ced1">Existing starter body</text>
      {specimens.map((expression,i)=><g key={expression} transform={`translate(1420 ${160+i*160})`}>
        <g transform="scale(.34)"><YuuFacialRenderer expression={expression}/></g>
        <text x={190} y={85} fontFamily="Arial" fontSize={23} fill="#c4ced1">{expression}</text>
      </g>)}
      <text x={90} y={930} fontFamily="Arial" fontSize={26} fill="#e2e5df">{face.expression} · {face.blink>.72?'blink':talking?'talk':'rest'}</text>
      <text x={90} y={972} fontFamily="Arial" fontSize={19} fill="#aebcc2">Base head + back hair + front hair stay fixed across expressions</text>
      <text x={1830} y={1040} textAnchor="end" fontFamily="Arial" fontSize={17} fill="#aebcc2">{frame} / 359 · 30 FPS</text>
    </svg>
  </AbsoluteFill>;
};
