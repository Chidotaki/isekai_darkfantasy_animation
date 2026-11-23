// Explicit development entry point; not part of src/Root.tsx.
import {Composition, registerRoot} from 'remotion';
import {developmentFixture} from '../src/episodes/developmentFixture';
const {manifest, timeline, Component} = developmentFixture;
registerRoot(() => <Composition id="DevelopmentTimingFixture" component={Component}
  fps={manifest.fps} width={manifest.width} height={manifest.height} durationInFrames={timeline.durationInFrames}/>);
