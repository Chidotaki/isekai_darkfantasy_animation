import {AbsoluteFill, Interactive, useCurrentFrame} from 'remotion';
import {ease, mix} from './motion';
import {CharacterRenderer} from './visual/CharacterRenderer';
import {samplePerformance} from './visual/performance';
import {StageLighting} from './visual/StageLighting';
import type {VisualExpression} from './visual/types';

const expressions:readonly VisualExpression[]=['happy','amused','worried','surprised','fear','frustrated','sad','neutral'];
const labels=['Smile','Subtle amusement','Concern','Surprise','Fear','Frustration','Sadness','Neutral'];

/** Noncanonical 24-second rig inspection, not an episode or a story beat. */
export const CharacterVisualTest=()=>{
  const frame=useCurrentFrame();
  const close=ease(frame,270,305)*(1-ease(frame,456,485));
  const medium=ease(frame,140,175)*(1-ease(frame,255,275));
  const zoom=1+medium*.28+close*1.25;
  const cameraY=mix(540,330,close)+medium*-65;
  const expressionIndex=Math.max(0,Math.min(7,Math.floor((frame-300)/22)));
  const expressionWeight=ease((frame-300)%22,0,7);
  const inFaces=frame>=300&&frame<476;
  const gesture=ease(frame,170,198)*(1-ease(frame,243,266));
  const sit=ease(frame,492,522)*(1-ease(frame,552,582));
  const walk=ease(frame,600,615),walkFrame=Math.max(0,frame-600);
  const p=samplePerformance(frame,{
    pose:frame>=600?'walk':frame>=180&&frame<255?'talk':'idle',seed:.4,walkStrength:walk,walkTime:walkFrame/30,
    expression:inFaces?expressions[Math.max(0,expressionIndex-1)]:'neutral',
    nextExpression:inFaces?expressions[expressionIndex]:undefined,expressionMix:expressionWeight,
    face:{gazeX:Math.sin(frame/38)*.3,headTilt:(ease(frame,150,180)-ease(frame,240,270))*-5,
      ...(frame>=208&&frame<=215?{blink:ease(frame,208,211)*(1-ease(frame,212,215))}:{}),
      ...(inFaces?{}:{mouthSkew:gesture*.5})},
    body:{...(frame<600?{pelvisY:sit*35,torso:sit*3+gesture*-1.3,
      frontUpper:14+gesture*58+sit*14,frontLower:-7+gesture*125+sit*24,wrist:gesture*-18}:{} )},
  });
  // Stance moves 18 units over .66 seconds; root travel cancels it once the walk is established.
  // Integral of cubic ease-in/out on the first .5 s avoids an abrupt start in root velocity.
  const t=walkFrame/30,u=Math.min(1,t/.5);
  const integral=u<.5?u**4:u-.5+(1-u)**4;
  const travel=27.272727*(t<=.5?.5*integral:t-.25);
  const x=960+travel*3;
  const title=frame<150?'Neutral · breathing · three provisional appearances':frame<270?'Head tilt · blink · talking · hand attachment'
    :frame<300?'Camera close-up':frame<476?labels[expressionIndex]:frame<600?'Standing → sitting → standing':'Walk · planted stance · secondary motion';
  const bench=ease(frame,480,490)*(1-ease(frame,585,598));
  const others=1-ease(frame,125,150);
  return <AbsoluteFill style={{backgroundColor:'#111d29'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <rect width={1920} height={1080} fill="#182a38"/>
      <path d="M0 800L960 690 1920 800V1080H0Z" fill="#213440"/>
      <StageLighting/>
      <g transform={`translate(960 540) scale(${zoom}) translate(-960 ${-cameraY})`}>
        <path d="M0 940H1920" stroke="#647b83" strokeOpacity=".2" strokeWidth="2"/>
        <g opacity={others}>
          <ellipse cx={430} cy={945} rx={105} ry={16} fill="#071522" opacity=".4"/>
          <ellipse cx={1490} cy={945} rx={105} ry={16} fill="#071522" opacity=".4"/>
          <CharacterRenderer character="tachibana-kairyu" performance={samplePerformance(frame,{seed:2,expression:'happy'})} frame={frame} x={430} y={940} scale={2.8}/>
          <CharacterRenderer character="minase-shiori" performance={samplePerformance(frame,{seed:4,expression:'neutral'})} frame={frame} x={1490} y={940} scale={2.8} facing={-1}/>
        </g>
        <g opacity={bench} fill="#43525a" stroke="#17232e" strokeWidth="4">
          <path d="M760 826H1160V844H760Z"/><path d="M785 844H806V938H785ZM1114 844H1135V938H1114Z"/>
        </g>
        <ellipse cx={x} cy={948} rx={118} ry={17} fill="#06121d" opacity=".5"/>
        <CharacterRenderer character="asakura-yuu" performance={p} frame={frame} x={x} y={940} scale={3}
          heldItem={gesture>.001?<g opacity={gesture}><rect x={-3} y={-18} width={19} height={27} rx={2} fill="#b7b6a6" stroke="#182736" strokeWidth={1.5}/><path d="M1-12h9M1-8h9" stroke="#76848a" strokeWidth={1}/></g>:undefined}/>
      </g>
      <g fontFamily="Arial, sans-serif">
        <Interactive.Text name="Test title" x={74} y={66} fontSize={24} letterSpacing={3} fill="#acb9bc">CHARACTER VISUAL TEST</Interactive.Text>
        <Interactive.Text name="Artwork status" x={74} y={105} fontSize={18} letterSpacing={2} fill="#82979e">PROVISIONAL ART · NONCANONICAL · 1920 × 1080 / 30 FPS</Interactive.Text>
        <text x={74} y={1020} fontSize={23} fill="#d5d9d1">{title}</text>
        <text x={1846} y={1020} textAnchor="end" fontSize={18} fill="#82979e">{String(frame).padStart(3,'0')} / 719</text>
      </g>
    </svg>
  </AbsoluteFill>;
};
