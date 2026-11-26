import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {cameraMove} from '../../../acting/camera';
import type {ShotRendererProps} from '../../../production/episodeTypes';
import {AnimeStage, blinkAt} from '../components/AnimeStage';
import {StandingClassmateWithBag} from '../components/Classmates';
import {BusSeatPair, busVibration, SchoolBusShell} from '../components/SchoolBusInterior';
import {SchoolBackpack, YuuSeated} from '../components/YuuSeated';

/**
 * s001-sh001: Medium interior bus; a male student with a large backpack asks
 * about the vacant seat beside Yuu. Yuu looks up from his phone and responds.
 */
export const S001Shot001 = ({shot, episodeStart}: ShotRendererProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const globalT = (episodeStart + frame) / fps;
  const vib = busVibration(globalT);

  const camera = cameraMove(
    frame,
    0,
    shot.durationInFrames,
    {x: 800, y: 580, zoom: 1.14},
    {x: 775, y: 572, zoom: 1.22},
  );

  // Standing student enters aisle beside Yuu's row
  const studentX = interpolate(t, [0.4, 2.0], [1160, 965], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const walkPhase = t < 2.0 ? Math.max(0, (t - 0.4) * 7.5) : 0;
  const studentLean = interpolate(t, [2.0, 2.6, 5.2, 6.2], [0, -2.5, -2.5, -0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Yuu looks up from phone around 3.2s, responds briefly around 4.1s-4.7s
  const lookUp = interpolate(t, [2.9, 3.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headTilt = interpolate(lookUp, [0, 1], [15, -2]);
  const headTurnX = interpolate(lookUp, [0, 1], [0, 9]);
  const isResponding = t >= 4.0 && t <= 4.75;
  const mouth = isResponding ? 'mouth_open_small' : 'mouth_neutral';
  const breath = Math.sin(globalT * 2.1) * 1.4;

  return (
    <AnimeStage camera={camera}>
      <g transform={`translate(0 ${vib.dy}) rotate(${vib.rot} 960 540)`}>
        <SchoolBusShell t={globalT} scenerySpeed={1} />

        {/* Back row seats for consistent depth */}
        <BusSeatPair x={1220} y={715} scale={0.62} tone="far" />
        <BusSeatPair x={460} y={725} scale={0.68} tone="far" />

        {/* Yuu's row (window seat + empty aisle seat) */}
        <g transform="translate(615 805)">
          <BusSeatPair x={0} y={0} scale={1.06} tone="near" />
        </g>

        {/* Asakura Yuu seated by the window */}
        <YuuSeated
          x={525}
          y={570}
          scale={0.98}
          pose={lookUp > 0.45 ? 'look-up' : 'phone'}
          expression="neutral"
          blink={blinkAt(globalT, 3.7, 0.2)}
          mouth={mouth}
          headTilt={headTilt}
          headTurnX={headTurnX}
          breath={breath}
        />

        {/* Yuu's backpack resting by his feet */}
        <SchoolBackpack x={545} y={855} scale={0.78} rotation={-4} />

        {/* Standing male classmate with large backpack in the aisle */}
        <StandingClassmateWithBag
          x={studentX}
          y={1010}
          scale={0.96}
          facing={-1}
          walkPhase={walkPhase}
          leanDeg={studentLean}
        />
      </g>
    </AnimeStage>
  );
};
