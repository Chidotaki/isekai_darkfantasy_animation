import type {ComponentType} from 'react';
import type {Framing, Shot as CameraPreset} from '../acting/camera';
import type {VisualExpression} from '../visual/types';
import type {AssetId, AssetIdOf, AssetPin, AudioCategory} from './assetRegistry';
import type {CharacterId} from './characterRegistry';

export type AudioCue = {
  readonly id: string;
  readonly asset: AssetIdOf<AudioCategory>;
  /** Frames relative to the owning scene or shot. End is exclusive. */
  readonly from: number;
  readonly durationInFrames: number;
  readonly trimBefore?: number;
  readonly volume?: number;
  readonly speaker?: CharacterId;
};

export type CharacterPlacement = {
  readonly character: CharacterId;
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
  readonly facing?: 1 | -1;
  readonly expression?: VisualExpression;
  readonly motion?: AssetIdOf<'animation'>;
  readonly appearance?: AssetPin<AssetIdOf<'character-art'>>;
  readonly costume?: string;
};

export type ShotManifest = {
  readonly id: string;
  readonly durationInFrames: number;
  readonly camera: Framing | {readonly preset: CameraPreset; readonly x: number; readonly headY: number};
  /** Explicit key in this episode's renderer table, not a dynamic import or eval. */
  readonly animation: string;
  readonly characters: readonly CharacterPlacement[];
  readonly audio?: readonly AudioCue[];
  readonly assets?: readonly AssetId[];
};

export type SceneManifest = {
  readonly id: string;
  readonly location: AssetIdOf<'background'>;
  readonly characters: readonly CharacterId[];
  readonly shots: readonly ShotManifest[];
  readonly audio?: readonly AudioCue[];
  readonly continuityNotes?: readonly string[];
  readonly settings?: {readonly backgroundColor?: string; readonly audioVolume?: number};
  // Duration is computed from shots, never duplicated in the manifest.
};

export type EpisodeManifest = {
  readonly id: string;
  readonly title: string;
  /** A reference/version only: never embed the unpublished manuscript here. */
  readonly sourceChapter: {readonly reference: string; readonly revision: string};
  readonly version: string;
  readonly kind: 'production' | 'development';
  readonly fps: number;
  readonly width: number;
  readonly height: number;
  readonly scenes: readonly SceneManifest[];
  /** Optional locks for referenced art, rigs, motion or audio; mismatches fail preflight. */
  readonly assetPins?: readonly AssetPin[];
};

export type ScheduledShot = {
  readonly shot: ShotManifest;
  readonly from: number; // Scene-relative.
  readonly episodeFrom: number;
  readonly durationInFrames: number;
};
export type ScheduledScene = {
  readonly scene: SceneManifest;
  readonly from: number; // Episode-relative.
  readonly durationInFrames: number;
  readonly shots: readonly ScheduledShot[];
};
export type EpisodeTimeline = {
  readonly episode: EpisodeManifest;
  readonly durationInFrames: number;
  readonly scenes: readonly ScheduledScene[];
};
export type ShotRendererProps = {
  readonly scene: SceneManifest;
  readonly shot: ShotManifest;
  readonly sceneStart: number;
  readonly shotStart: number;
  readonly episodeStart: number;
};
export type AnimationRegistry = Readonly<Record<string, ComponentType<ShotRendererProps>>>;
