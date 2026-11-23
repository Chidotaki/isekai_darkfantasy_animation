import {Composition} from 'remotion';
import {episodeRegistry} from './episodeRegistry';

/** Manifest-controlled registrations; the four authored prototype registrations stay separate. */
export const EpisodeCompositions = () => {
  const ids = new Set(['IsekaiDemo', 'CombatDemo', 'MagicCombatDemo', 'EmotionalDemo', 'CharacterVisualTest']);
  return <>{episodeRegistry.map(({manifest, timeline, Component}) => {
    if (manifest.kind !== 'production' || ids.has(manifest.id)) throw new Error(`Invalid or duplicate production episode: ${manifest.id}`);
    ids.add(manifest.id);
    return <Composition key={manifest.id} id={manifest.id} component={Component}
      width={manifest.width} height={manifest.height} fps={manifest.fps}
      durationInFrames={timeline.durationInFrames}/>;
  })}</>;
};
