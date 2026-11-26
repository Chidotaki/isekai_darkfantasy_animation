import {Composition} from 'remotion';
import {IsekaiDemo} from './IsekaiDemo';
import {CombatDemo} from './CombatDemo';
import {MagicCombatDemo} from './MagicCombatDemo';
import {EmotionalDemo} from './EmotionalDemo';
import {EpisodeCompositions} from './production/EpisodeCompositions';
import {CharacterVisualTest} from './CharacterVisualTest';
import {YuuFacialTest} from './YuuFacialTest';
import {CharacterRosterTest} from './CharacterRosterTest';
export const Root = () => <>
  <Composition id="IsekaiDemo" component={IsekaiDemo} width={1920} height={1080} fps={30} durationInFrames={1200} defaultProps={{narrationFile: '', narrationStartSeconds: 0, soundtrackVolume: 0.75}}/>
  <Composition id="CombatDemo" component={CombatDemo} width={1920} height={1080} fps={30} durationInFrames={450}/>
  <Composition id="MagicCombatDemo" component={MagicCombatDemo} width={1920} height={1080} fps={30} durationInFrames={540}/>
  <Composition id="EmotionalDemo" component={EmotionalDemo} width={1920} height={1080} fps={30} durationInFrames={900} defaultProps={{audioFile:'',audioVolume:1,speechCues:[],showDialogue:true}}/>
  <EpisodeCompositions/>
  <Composition id="CharacterVisualTest" component={CharacterVisualTest} width={1920} height={1080} fps={30} durationInFrames={720}/>
  <Composition id="YuuFacialTest" component={YuuFacialTest} width={1920} height={1080} fps={30} durationInFrames={360}/>
  <Composition id="CharacterRosterTest" component={CharacterRosterTest} width={1920} height={1080} fps={30} durationInFrames={360}/>
</>;
