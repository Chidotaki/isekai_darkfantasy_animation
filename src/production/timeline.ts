import {assertAssetPin, audioAssetPath, getAsset} from './assetRegistry';
import {characterAssetId} from './characterRegistry';
import {productionConfig} from './config';
import type {AudioCue, EpisodeManifest, EpisodeTimeline, ScheduledScene} from './episodeTypes';

const frameCount = (value: number, label: string, zeroAllowed = false): void => {
  if (!Number.isSafeInteger(value) || value < (zeroAllowed ? 0 : 1)) {
    throw new Error(`${label} must be ${zeroAllowed ? 'nonnegative' : 'positive'} integer frames.`);
  }
};
const uniqueId = (id: string, ids: Set<string>, label: string): void => {
  if (!id.trim() || ids.has(id)) throw new Error(`Empty or duplicate ${label}: ${id}`);
  ids.add(id);
};
const volume = (value: number | undefined): void => {
  if (value !== undefined && (!Number.isFinite(value) || value < 0 || value > 1)) {
    throw new Error('Audio volume must be between 0 and 1.');
  }
};
const validateAudio = (cues: readonly AudioCue[] = [], duration: number): void => {
  const ids = new Set<string>();
  for (const cue of cues) {
    uniqueId(cue.id, ids, 'audio cue');
    frameCount(cue.from, 'Audio start', true);
    frameCount(cue.durationInFrames, 'Audio duration');
    frameCount(cue.trimBefore ?? 0, 'Audio trim', true);
    if (cue.from + cue.durationInFrames > duration) throw new Error(`Audio exceeds its owner: ${cue.id}`);
    volume(cue.volume);
    audioAssetPath(cue.asset);
    if (cue.speaker) characterAssetId(cue.speaker);
  }
};

/** Pure, contiguous cuts. All intervals are [start, end); nested offsets are added once. */
export const buildTimeline = (episode: EpisodeManifest, animationIds?: readonly string[]): EpisodeTimeline => {
  if (!/^[a-zA-Z0-9-]+$/.test(episode.id)) throw new Error('Episode ID must be Remotion-compatible (letters, digits, hyphens).');
  if (!episode.title.trim() || !episode.version.trim() || !episode.sourceChapter.reference.trim() || !episode.sourceChapter.revision.trim()) {
    throw new Error('Episode title, version and source reference/revision are required.');
  }
  if (episode.fps !== productionConfig.fps) throw new Error('Phase 1 production uses 30 FPS.');
  frameCount(episode.width, 'Width');
  frameCount(episode.height, 'Height');
  if (!episode.scenes.length) throw new Error('An episode needs at least one scene.');
  episode.assetPins?.forEach(assertAssetPin);
  const sceneIds = new Set<string>();
  let episodeFrom = 0;
  const scenes: ScheduledScene[] = episode.scenes.map(scene => {
    uniqueId(scene.id, sceneIds, 'scene');
    if (getAsset(scene.location).category !== 'background') throw new Error(`Invalid location: ${scene.location}`);
    scene.characters.forEach(characterAssetId);
    volume(scene.settings?.audioVolume);
    if (!scene.shots.length) throw new Error(`Scene has no shots: ${scene.id}`);
    const shotIds = new Set<string>();
    let sceneFrom = 0;
    const shots = scene.shots.map(shot => {
      uniqueId(shot.id, shotIds, 'shot');
      frameCount(shot.durationInFrames, 'Shot duration');
      if (!shot.animation.trim()) throw new Error(`Shot has no animation reference: ${shot.id}`);
      if (animationIds && !animationIds.includes(shot.animation)) throw new Error(`Missing shot renderer: ${shot.animation}`);
      const camera = shot.camera;
      if (!Object.values(camera).filter(v => typeof v === 'number').every(Number.isFinite) || ('zoom' in camera && camera.zoom <= 0)) {
        throw new Error(`Invalid camera: ${shot.id}`);
      }
      for (const placement of shot.characters) {
        characterAssetId(placement.character);
        if (!scene.characters.includes(placement.character)) throw new Error(`Shot character missing from scene: ${placement.character}`);
        if (![placement.x, placement.y, placement.scale ?? 1].every(Number.isFinite) || (placement.scale ?? 1) <= 0) {
          throw new Error(`Invalid placement: ${placement.character}`);
        }
        if (placement.motion && getAsset(placement.motion).category !== 'animation') throw new Error(`Invalid motion: ${placement.motion}`);
        if (placement.appearance) {
          assertAssetPin(placement.appearance);
          if(getAsset(placement.appearance.id).category!=='character-art') throw new Error('Appearance must reference character artwork.');
        }
      }
      shot.assets?.forEach(getAsset);
      validateAudio(shot.audio, shot.durationInFrames);
      const scheduled = {shot, from: sceneFrom, episodeFrom: episodeFrom + sceneFrom, durationInFrames: shot.durationInFrames};
      sceneFrom += shot.durationInFrames;
      frameCount(sceneFrom, 'Scene duration');
      return scheduled;
    });
    validateAudio(scene.audio, sceneFrom);
    const scheduled = {scene, from: episodeFrom, durationInFrames: sceneFrom, shots};
    episodeFrom += sceneFrom;
    frameCount(episodeFrom, 'Episode duration');
    return scheduled;
  });
  return {episode, scenes, durationInFrames: episodeFrom};
};
