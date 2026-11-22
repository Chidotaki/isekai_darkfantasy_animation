import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {audioAssetPath} from './assetRegistry';
import {buildTimeline} from './timeline';
import type {AnimationRegistry, AudioCue, EpisodeManifest, EpisodeTimeline} from './episodeTypes';

const AudioCues = ({cues = [], gain}: {cues?: readonly AudioCue[]; gain: number}) => <>
  {cues.map(cue => <Audio key={cue.id} name={cue.id}
    src={staticFile(audioAssetPath(cue.asset))} from={cue.from}
    durationInFrames={cue.durationInFrames} trimBefore={cue.trimBefore ?? 0}
    volume={(cue.volume ?? 1) * gain} />)}
</>;

/** Only leaf renderers subscribe to useCurrentFrame(); this shell has no animation clock. */
export const EpisodeComposition = ({timeline, animations}: {
  timeline: EpisodeTimeline; animations: AnimationRegistry;
}) => {
  const config = useVideoConfig();
  const episode = timeline.episode;
  if (config.fps !== episode.fps || config.width !== episode.width || config.height !== episode.height || config.durationInFrames !== timeline.durationInFrames) {
    throw new Error(`Composition metadata does not match the timeline: ${episode.id}`);
  }
  return <>
    {timeline.scenes.map(scheduled => <Sequence key={scheduled.scene.id}
      name={scheduled.scene.id} from={scheduled.from} durationInFrames={scheduled.durationInFrames}>
      <AbsoluteFill style={{backgroundColor: scheduled.scene.settings?.backgroundColor ?? '#101e28'}}>
        {scheduled.shots.map(item => {
          const Renderer = animations[item.shot.animation];
          if (!Renderer) throw new Error(`Missing shot renderer: ${item.shot.animation}`);
          return <Sequence key={item.shot.id} name={item.shot.id} from={item.from} durationInFrames={item.durationInFrames}>
            <Renderer scene={scheduled.scene} shot={item.shot} sceneStart={scheduled.from}
              shotStart={item.from} episodeStart={item.episodeFrom}/>
            <AudioCues cues={item.shot.audio} gain={scheduled.scene.settings?.audioVolume ?? 1}/>
          </Sequence>;
        })}
        <AudioCues cues={scheduled.scene.audio} gain={scheduled.scene.settings?.audioVolume ?? 1}/>
      </AbsoluteFill>
    </Sequence>)}
  </>;
};

/** Call once at module scope. Keep components out of serialized Remotion defaultProps. */
export const defineEpisode = (manifest: EpisodeManifest, animations: AnimationRegistry) => {
  const timeline = buildTimeline(manifest, Object.keys(animations));
  const Component = () => <EpisodeComposition timeline={timeline} animations={animations}/>;
  return {manifest, timeline, Component};
};
export type EpisodeDefinition = ReturnType<typeof defineEpisode>;
