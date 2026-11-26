import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {cameraMove} from '../../../acting/camera';
import type {ShotRendererProps} from '../../../production/episodeTypes';
import {AnimeStage, blinkAt} from '../components/AnimeStage';
import {SeatedClassmate, StandingClassmateWithBag} from '../components/Classmates';
import {BusSeatPair, busVibration, SchoolBusShell} from '../components/SchoolBusInterior';
import {SchoolBackpack, YuuSeated} from '../components/YuuSeated';

/**
 * s001-sh002: The student notices another seat toward the back of the bus and leaves.
 * Includes the deliberate silent reaction hold (s001-a01) as Yuu watches the empty seat.
 */
export const S001Shot002 = ({shot, episodeStart}: ShotRendererProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const globalT = (episodeStart + frame) / fps;
  const vib = busVibration(globalT);

  // Camera starts wider on the aisle and gently settles toward Yuu & the empty seat during the hold
  const camera = cameraMove(
    frame,
    Math.round(shot.durationInFrames * 0.45),
    shot.durationInFrames,
    {x: 880, y: 585, zoom: 1.04},
    {x: 690, y: 595, zoom: 1.18},
  );

  // Classmate turns around ~2.0s and walks down the aisle toward the back row (2.4s - 5.6s)
  const walkProgress = interpolate(t, [2.4, 5.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const studentX = interpolate(walkProgress, [0, 1], [965, 1185]);
  const studentY = interpolate(walkProgress, [0, 1], [1005, 795]);
  const studentScale = interpolate(walkProgress, [0, 1], [0.95, 0.56]);
  const studentOpacity = interpolate(t, [5.1, 5.8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const walkPhase = t >= 2.4 && t <= 5.7 ? (t - 2.4) * 8.2 : 0;

  // Back-row friend peeks up and raises hand (0.8s - 3.6s)
  const friendRaise = t >= 0.8 && t <= 3.6;

  // Yuu shifts gaze from the aisle down toward the empty seat beside him during the silent hold
  const watchSeat = interpolate(t, [4.6, 5.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const yuuHeadTilt = interpolate(watchSeat, [0, 1], [-1, 10]);
  const yuuHeadTurn = interpolate(watchSeat, [0, 1], [8, 12]);
  const breath = Math.sin(globalT * 2.1) * 1.3;

  return (
    <AnimeStage camera={camera}>
      <g transform={`translate(0 ${vib.dy}) rotate(${vib.rot} 960 540)`}>
        <SchoolBusShell t={globalT} scenerySpeed={1} />

        {/* Back row across the aisle: friend calling out */}
        <BusSeatPair x={1250} y={715} scale={0.62} tone="far" />
        <SeatedClassmate
          preset="m02"
          x={1195}
          y={575}
          scale={0.6}
          facing={-1}
          headTilt={friendRaise ? -6 : 2}
          talking={t >= 1.2 && t <= 3.2}
          talkPhase={t}
          blink={blinkAt(globalT, 4.1, 0.9)}
          raiseHand={friendRaise}
        />

        {/* Rear window row for depth */}
        <BusSeatPair x={460} y={725} scale={0.68} tone="far" />

        {/* Yuu's row */}
        <g transform="translate(615 805)">
          <BusSeatPair x={0} y={0} scale={1.06} tone="near" />
        </g>

        <YuuSeated
          x={525}
          y={570}
          scale={0.98}
          pose="watch-seat"
          expression="neutral"
          blink={blinkAt(globalT, 3.6, 0.5)}
          headTilt={yuuHeadTilt}
          headTurnX={yuuHeadTurn}
          breath={breath}
        />

        <SchoolBackpack x={545} y={855} scale={0.78} rotation={-4} />

        {/* Standing student turning and walking toward the back */}
        {studentOpacity > 0.01 && (
          <StandingClassmateWithBag
            x={studentX}
            y={studentY}
            scale={studentScale}
            facing={t < 2.2 ? -1 : 1}
            opacity={studentOpacity}
            walkPhase={walkPhase}
          />
        )}
      </g>
    </AnimeStage>
  );
};
