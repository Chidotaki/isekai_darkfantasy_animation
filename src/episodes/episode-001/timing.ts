import {secondsToFrames} from '../../production/config';

export type S001CueId = 's001-v01' | 's001-a01' | 's001-v02';

export type S001CueTiming = {
  readonly cueId: S001CueId;
  readonly kind: 'speech' | 'silent_action';
  /** Provisional or measured WAV duration in seconds. Update from timing.private.json when audio is ready. */
  readonly durationSeconds: number;
};

export type SubtitleCue = {
  readonly cueId: S001CueId;
  /** Scene-relative start frame (30 FPS). */
  readonly from: number;
  readonly durationInFrames: number;
  readonly speaker?: string;
  /** Keep canonical names such as "Asakura Yuu" untouched in subtitles. */
  readonly text: string;
};

/**
 * Provisional S001 cue durations matching chapter1-plan.json (~45s total).
 * Replace `durationSeconds` with measured WAV durations when VieNeu-TTS audio is delivered.
 */
export const defaultS001Cues: Record<S001CueId, S001CueTiming> = {
  's001-v01': {cueId: 's001-v01', kind: 'speech', durationSeconds: 14.0},
  's001-a01': {cueId: 's001-a01', kind: 'silent_action', durationSeconds: 4.5},
  's001-v02': {cueId: 's001-v02', kind: 'speech', durationSeconds: 20.5},
};

export type S001ShotDurations = {
  readonly 's001-sh001': number;
  readonly 's001-sh002': number;
  readonly 's001-sh003': number;
  readonly 's001-sh004': number;
};

/**
 * Derives per-shot frame counts from cue durations plus breathing room for visual beats.
 * Ensures S001 adapts cleanly when actual WAV durations are plugged in.
 */
export const computeS001ShotDurations = (
  cues: Record<S001CueId, S001CueTiming> = defaultS001Cues,
): S001ShotDurations => {
  const v01Frames = secondsToFrames(cues['s001-v01'].durationSeconds);
  const a01Frames = secondsToFrames(cues['s001-a01'].durationSeconds);
  const v02Frames = secondsToFrames(cues['s001-v02'].durationSeconds);

  // Split s001-v01 across the request (sh001) and noticing the back seat (first part of sh002),
  // followed by the silent departure + reaction hold (s001-a01).
  const sh001 = Math.max(210, Math.round(v01Frames * 0.55) + 30);
  const sh002 = Math.max(240, Math.round(v01Frames * 0.45) + a01Frames);
  // Split s001-v02 across the wide isolation shot (sh003) and bag-placement + intro hold (sh004).
  const sh003 = Math.max(240, Math.round(v02Frames * 0.45) + 30);
  const sh004 = Math.max(270, Math.round(v02Frames * 0.55) + 60);

  return {
    's001-sh001': sh001,
    's001-sh002': sh002,
    's001-sh003': sh003,
    's001-sh004': sh004,
  };
};

export const s001ShotDurations = computeS001ShotDurations(defaultS001Cues);
