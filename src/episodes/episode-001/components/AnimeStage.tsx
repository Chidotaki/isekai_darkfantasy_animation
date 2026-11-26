import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import type {Framing} from '../../../acting/camera';
import type {SubtitleCue} from '../timing';

/** Deterministic, natural-feeling blink envelope (0 = open, 1 = closed). */
export const blinkAt = (t: number, period = 3.8, phase = 0): number => {
  const local = ((t + phase) % period + period) % period;
  return interpolate(local, [1.85, 1.92, 1.99, 2.09], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

/** Restrained anime camera stage: centers 1920×1080 SVG around Framing (x, y, zoom). */
export const AnimeStage = ({
  camera,
  children,
  subtitles,
  sceneFrame,
  backgroundColor = '#17232e',
}: {
  camera: Framing;
  children: ReactNode;
  subtitles?: readonly SubtitleCue[];
  sceneFrame?: number;
  backgroundColor?: string;
}) => {
  const activeSub =
    subtitles && sceneFrame !== undefined
      ? subtitles.find((s) => sceneFrame >= s.from && sceneFrame < s.from + s.durationInFrames)
      : undefined;

  return (
    <AbsoluteFill style={{backgroundColor, overflow: 'hidden'}}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="anime-vignette" cx="50%" cy="50%" r="72%">
            <stop offset="68%" stopColor="#080d14" stopOpacity="0" />
            <stop offset="100%" stopColor="#080d14" stopOpacity="0.34" />
          </radialGradient>
        </defs>
        <g transform={`translate(960 540) scale(${camera.zoom}) translate(${-camera.x} ${-camera.y})`}>
          {children}
        </g>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#anime-vignette)" pointerEvents="none" />
      </svg>

      {activeSub && (
        <div
          style={{
            position: 'absolute',
            left: 160,
            right: 160,
            bottom: 54,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(11, 16, 24, 0.78)',
              color: '#f7f8fa',
              padding: '12px 26px',
              borderRadius: 8,
              fontFamily: '"Noto Sans", "Segoe UI", Arial, sans-serif',
              fontSize: 34,
              lineHeight: 1.35,
              textAlign: 'center',
              textShadow: '0 2px 6px rgba(0,0,0,0.85)',
              maxWidth: 1480,
            }}
          >
            {activeSub.text}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
