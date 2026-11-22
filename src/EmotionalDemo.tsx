import {AbsoluteFill,Interactive,staticFile,useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {Character} from './components/Character';
import {ArtDefs,Camera,Finish,Particles} from './components/Atmosphere';
import {BusInterior,Seat} from './components/Bus';
import {dialogue} from './acting/dialogue';
import type {SpeechCue} from './acting/speech';
import {emotionalActor,emotionalCamera,emotionalPerformance,packetRestFrame,type StoryActor} from './acting/emotionalTimeline';
import {handPoint} from './acting/interactions';
import {ease} from './motion';
export type EmotionalProps={audioFile:string;audioVolume:number;speechCues:SpeechCue[];showDialogue:boolean};
/** Original paper-wrapped breakfast. The two gripping edges are forty local units apart. */
const Breakfast=()=> <g transform="translate(20 -10)"><path d="M-21-11L20-11 24 10 19 14H-20L-24 9Z" fill="#e2d6b7" stroke="#5d6b69" strokeWidth="1.5"/><path d="M-21-7L-17 10M20-7L16 10M-20-7H20M-17 10H16" stroke="#aab2a4" strokeWidth="1"/><path d="M-7-10H7V13H-7Z" fill="#82988b"/><path d="M-4-4Q0-8 4-4Q0-1-4-4Z M0-4V5" fill="none" stroke="#e8dec3" strokeWidth="1.1"/></g>;
export const EmotionalDemo=({audioFile,audioVolume,speechCues,showDialogue}:EmotionalProps)=>{
  const frame=useCurrentFrame(),t=frame/30,cues=speechCues.length?speechCues:dialogue,camera=emotionalCamera(frame);
  const performer=(id:StoryActor)=>{
    const {actor,face,shoulders,sleeve}=emotionalPerformance(frame,id,cues);
    const holding=id==='elias'?frame<132:id==='ren'&&frame>=132&&frame<packetRestFrame;
    return <Character id={id} x={actor.x} y={actor.y} scale={actor.scale} facing={actor.facing} t={t} rig={actor.pose} pose={id==='elias'?'stand':'sit'} sword={false} face={face} stillness={.9} expression="neutral" shoulderLift={shoulders} sleeveCover={sleeve} backArmInFront={id==='ren'&&frame>=550&&frame<710} handOpen={id==='elias'&&frame>720?.3:0} handItem={holding?<Breakfast/>:undefined}/>;
  };
  const rested=emotionalActor(packetRestFrame,'ren'),restPoint=handPoint(rested);
  const currentLine=cues.find(c=>frame>=c.from&&frame<c.to);
  const overShoulder=frame>=360&&frame<445;
  return <AbsoluteFill style={{background:'#152b39'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080"><ArtDefs/>
      <Camera {...camera} t={t} shake={.2}>
        <Interactive.G name="Field trip bus and passing mountains"><BusInterior t={t+4}/></Interactive.G>
        <Interactive.G name="Bus seats"><Seat x={565} y={878} s={2.15}/><Seat x={1370} y={878} s={2.3}/></Interactive.G>
        <Interactive.G name="Minase Shiori listening and turning">{performer('mira')}</Interactive.G>
        <Interactive.G name="Asakura Yuu restrained reactions">{performer('ren')}</Interactive.G>
        {frame>=packetRestFrame&&<g transform={`translate(${restPoint.join(' ')}) scale(-2.25 2.25)`}><Breakfast/></g>}
        <Interactive.G name="Tachibana Kairyu offering breakfast">{!overShoulder&&performer('elias')}</Interactive.G>
        {overShoulder&&<g opacity=".82"><Character id="elias" x={943} y={1130} scale={3.15} t={t} rearView sword={false} expression="neutral" stillness={1}/></g>}
        <Interactive.G name="Foreground seats"><Seat x={-70} y={1240} s={3}/><Seat x={1880} y={1240} s={3}/><path d="M25 755L185 729 220 1100H0Z" fill="#172f3c" opacity=".7"/></Interactive.G>
        <Particles t={t*.3} count={16} strength={.1} color="#d4e2d2"/>
      </Camera><Finish/>
      {showDialogue&&currentLine?.text&&<g opacity={ease(frame,currentLine.from,currentLine.from+3)*(1-ease(frame,currentLine.to-3,currentLine.to))}><rect x="265" y="949" width="1390" height="52" rx="6" fill="#0b1822" opacity=".8"/><text x="960" y="985" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="29" fill="#e8e5d8">{currentLine.text}</text></g>}
      <rect width="1920" height="1080" fill="#142b38" opacity={1-ease(frame,0,12)}/>
    </svg>
    {audioFile&&<Audio name="Local character dialogue" src={staticFile(audioFile)} volume={audioVolume}/>}
  </AbsoluteFill>;
};
