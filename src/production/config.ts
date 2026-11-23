/** Remotion frames remain the only timeline unit. Existing demos keep their authored timings. */
export const productionConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  episode: {targetMinutes: 10, suggestedMinutes: [8, 12], initialVersion: '0.1.0'},
  naming: {
    episode: 'episode-NNN',
    scene: 'scene-NNN',
    shot: 'shot-NNN',
    output: 'out/<episode-id>-v<version>.mp4',
  },
} as const;

export const secondsToFrames = (seconds: number, fps: number = productionConfig.fps): number => {
  if (!Number.isFinite(seconds) || seconds < 0 || !Number.isFinite(fps) || fps <= 0) {
    throw new Error('Seconds must be nonnegative and FPS must be positive.');
  }
  return Math.round(seconds * fps);
};

export const framesToSeconds = (frames: number, fps: number = productionConfig.fps): number => {
  if (!Number.isSafeInteger(frames) || frames < 0 || !Number.isFinite(fps) || fps <= 0) {
    throw new Error('Frames must be nonnegative integers and FPS must be positive.');
  }
  return frames / fps;
};
