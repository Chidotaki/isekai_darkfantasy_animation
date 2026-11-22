import {AbsoluteFill,Sequence,staticFile,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {ArtDefs,Finish} from './components/Atmosphere';
import {SchoolTrip,Representative,Summoning,AnotherWorld,Unblessed} from './scenes';
export type DemoProps = {narrationFile: string; narrationStartSeconds: number; soundtrackVolume: number};
const Stage=({children}:{children:React.ReactNode})=><svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><ArtDefs/>{children}<Finish/></svg>;
export const IsekaiDemo = ({narrationFile,narrationStartSeconds,soundtrackVolume}: DemoProps) => {
  const {fps}=useVideoConfig();
  return <AbsoluteFill style={{backgroundColor:'#101e28'}}>
    <Sequence name="01 · School trip" durationInFrames={8*fps}><Stage><SchoolTrip/></Stage></Sequence>
    <Sequence name="02 · The class representative" from={8*fps} durationInFrames={7*fps}><Stage><Representative/></Stage></Sequence>
    <Sequence name="03 · The summoning" from={15*fps} durationInFrames={8*fps}><Stage><Summoning/></Stage></Sequence>
    <Sequence name="04 · Another world" from={23*fps} durationInFrames={9*fps}><Stage><AnotherWorld/></Stage></Sequence>
    <Sequence name="05 · The unblessed student" from={32*fps} durationInFrames={8*fps}><Stage><Unblessed/></Stage></Sequence>
    <Audio name="Original score and ambience" src={staticFile('audio/isekai-score.wav')} volume={soundtrackVolume*(narrationFile?.5:1)}/>
    {narrationFile&&<Audio name="Local narration" from={Math.max(0,Math.round(narrationStartSeconds*fps))} src={staticFile(narrationFile)} volume={1}/>}
  </AbsoluteFill>;
};
