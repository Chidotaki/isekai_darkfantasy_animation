// NONCANONICAL: a four-second timing probe, never registered in the production Root.
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {defineEpisode} from '../production/EpisodeComposition';
import type {ShotRendererProps} from '../production/episodeTypes';
import {developmentManifest} from './developmentManifest';

const TimingProbe = ({scene, shot, episodeStart}: ShotRendererProps) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', color: '#ffffff', fontFamily: 'sans-serif', fontSize: 44}}>
    <div>NONCANONICAL — timing verification</div>
    <div>{scene.id} / {shot.id}</div>
    <div>Shot frame {frame} / Episode frame {episodeStart + frame}</div>
  </AbsoluteFill>;
};
export const developmentFixture = defineEpisode(developmentManifest, {'timing-probe': TimingProbe});
