// NONCANONICAL data fixture; no plot, dialogue or production episode registration.
import {productionConfig} from '../production/config';
import type {EpisodeManifest} from '../production/episodeTypes';

export const developmentManifest = {
  id: 'DevelopmentTimingFixture', title: 'NONCANONICAL timing fixture', kind: 'development',
  sourceChapter: {reference: 'none-development-only', revision: 'none'}, version: '0.1.0',
  fps: productionConfig.fps, width: productionConfig.width, height: productionConfig.height,
  scenes: [
    {id: 'scene-a', location: 'background.bus', characters: [], settings: {backgroundColor: '#213647'},
      continuityNotes: ['Timing check only; the location asset is referenced but not drawn.'],
      shots: [
        {id: 'shot-a', durationInFrames: 30, animation: 'timing-probe', camera: {x: 960, y: 540, zoom: 1}, characters: []},
        {id: 'shot-b', durationInFrames: 60, animation: 'timing-probe', camera: {x: 960, y: 540, zoom: 1}, characters: []},
      ]},
    {id: 'scene-b', location: 'background.hall', characters: [], settings: {backgroundColor: '#37463a'},
      shots: [{id: 'shot-c', durationInFrames: 30, animation: 'timing-probe', camera: {x: 960, y: 540, zoom: 1}, characters: []}]},
  ],
} as const satisfies EpisodeManifest;
