import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {cameraMove} from '../../../acting/camera';
import type {ShotRendererProps} from '../../../production/episodeTypes';
import {AnimeStage, blinkAt} from '../components/AnimeStage';
import {BusSeatPair, busVibration, SchoolBusShell} from '../components/SchoolBusInterior';
import {SchoolBackpack, YuuSeated, type YuuSeatedPose} from '../components/YuuSeated';

/**
 * s001-sh004: Close on Yuu placing his backpack onto the empty seat, putting on
 * earphones, and looking away as his first-person self-introduction (s001-v02) plays.
 */
export const S001Shot004 = ({shot, episodeStart}: ShotRendererProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const globalT = (episodeStart + frame) / fps;
  const vib = busVibration(globalT);

  const camera = cameraMove(
    frame,
    0,
    shot.durationInFrames,
    {x: 635, y: 605, zoom: 1.32},
    {x: 590, y: 585, zoom: 1.42},
  );

  // Beat 1 (0.5s - 2.6s): Yuu lifts his backpack onto the empty aisle seat
  const bagProgress = interpolate(t, [0.5, 2.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bagX = interpolate(bagProgress, [0, 1], [545, 705]);
  const bagY =
    interpolate(bagProgress, [0, 1], [855, 718]) - Math.sin(bagProgress * Math.PI) * 55;
  const bagRot = interpolate(bagProgress, [0, 0.5, 1], [-4, 6, 3]);

  // Beat 2 (2.8s - 4.6s): Yuu puts on earphones
  // Beat 3 (4.6s+): Yuu settles back and looks toward the window
  const pose: YuuSeatedPose =
    t < 2.8 ? 'place-bag' : t < 4.6 ? 'earphones' : 'window-rest';
  const hasEarphones = t >= 3.6;

  const headTurnX = interpolate(t, [0.5, 2.2, 4.4, 6.0], [10, 14, 0, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headTilt = interpolate(t, [0.5, 2.2, 4.4, 6.0], [8, 12, 0, -3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const breath = Math.sin(globalT * 2.0) * 1.4;

  return (
    <AnimeStage camera={camera}>
      <g transform={`translate(0 ${vib.dy}) rotate(${vib.rot} 960 540)`}>
        <SchoolBusShell t={globalT} scenerySpeed={1.1} />

        {/* Rear row behind Yuu for continuity */}
        <BusSeatPair x={460} y={725} scale={0.68} tone="far" />

        {/* Yuu's row */}
        <g transform="translate(615 805)">
          <BusSeatPair x={0} y={0} scale={1.06} tone="near" />
        </g>

        <YuuSeated
          x={525}
          y={570}
          scale={0.98}
          pose={pose}
          expression="neutral"
          blink={blinkAt(globalT, 3.8, 0.3)}
          headTilt={headTilt}
          headTurnX={headTurnX}
          bagPlaceProgress={t < 2.8 ? bagProgress : 0}
          hasEarphones={hasEarphones}
          breath={breath}
        />

        {/* School backpack moving onto the empty aisle seat */}
        <SchoolBackpack x={bagX} y={bagY} scale={0.78} rotation={bagRot} />
      </g>
    </AnimeStage>
  );
};
