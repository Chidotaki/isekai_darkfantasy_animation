import {productionConfig} from '../../production/config';
import type {EpisodeManifest} from '../../production/episodeTypes';
import {s001ShotDurations} from './timing';

/**
 * Previewable S001 ("The empty seat") manifest for Episode 001, Chapter 1.
 * No private manuscript prose or unreviewed TTS WAVs are embedded here.
 */
export const episode001S001Manifest = {
  id: 'Episode001S001',
  title: 'Episode 001 · Chuyến dã ngoại (S001 Preview)',
  sourceChapter: {
    reference: 'Isekai Dark Fantasy Project.docx · Chapter 1 (pages 1–2 · s001)',
    revision: 'approved-ch01-s001',
  },
  version: productionConfig.episode.initialVersion,
  kind: 'production',
  fps: productionConfig.fps,
  width: productionConfig.width,
  height: productionConfig.height,
  scenes: [
    {
      id: 's001',
      location: 'background.bus',
      characters: ['asakura-yuu'],
      continuityNotes: [
        'Japanese high school uniforms only; no fantasy costumes.',
        'Yuu sits in the window seat; the adjacent aisle seat stays empty until s001-sh004.',
        'Voice cues s001-v01, s001-a01 (silent hold), s001-v02 are wired to timing.ts.',
      ],
      settings: {backgroundColor: '#17232e', audioVolume: 1},
      shots: [
        {
          id: 's001-sh001',
          durationInFrames: s001ShotDurations['s001-sh001'],
          camera: {x: 800, y: 580, zoom: 1.14},
          animation: 's001-sh001',
          characters: [{character: 'asakura-yuu', x: 525, y: 570, expression: 'neutral'}],
          assets: ['background.bus'],
        },
        {
          id: 's001-sh002',
          durationInFrames: s001ShotDurations['s001-sh002'],
          camera: {x: 880, y: 585, zoom: 1.04},
          animation: 's001-sh002',
          characters: [{character: 'asakura-yuu', x: 525, y: 570, expression: 'neutral'}],
          assets: ['background.bus'],
        },
        {
          id: 's001-sh003',
          durationInFrames: s001ShotDurations['s001-sh003'],
          camera: {x: 1140, y: 565, zoom: 1.03},
          animation: 's001-sh003',
          characters: [{character: 'asakura-yuu', x: 525, y: 570, expression: 'neutral'}],
          assets: ['background.bus'],
        },
        {
          id: 's001-sh004',
          durationInFrames: s001ShotDurations['s001-sh004'],
          camera: {x: 635, y: 605, zoom: 1.32},
          animation: 's001-sh004',
          characters: [{character: 'asakura-yuu', x: 525, y: 570, expression: 'neutral'}],
          assets: ['background.bus'],
        },
      ],
    },
  ],
} as const satisfies EpisodeManifest;
