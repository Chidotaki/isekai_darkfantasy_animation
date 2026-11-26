import {useCurrentFrame, useVideoConfig} from 'remotion';
import {cameraMove} from '../../../acting/camera';
import type {ShotRendererProps} from '../../../production/episodeTypes';
import {AnimeStage, blinkAt} from '../components/AnimeStage';
import {SeatedClassmate} from '../components/Classmates';
import {BusSeatPair, busVibration, SchoolBusShell} from '../components/SchoolBusInterior';
import {SchoolBackpack, YuuSeated} from '../components/YuuSeated';

/**
 * s001-sh003: Wide bus interior; classmates socialize in groups while Yuu
 * remains isolated by the window beside the empty seat.
 */
export const S001Shot003 = ({shot, episodeStart}: ShotRendererProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const globalT = (episodeStart + frame) / fps;
  const vib = busVibration(globalT);

  // Restrained horizontal pan from lively classmate groups across to isolated Yuu
  const camera = cameraMove(
    frame,
    0,
    shot.durationInFrames,
    {x: 1140, y: 565, zoom: 1.03},
    {x: 840, y: 572, zoom: 1.08},
  );

  const breath = Math.sin(globalT * 2.1) * 1.2;
  const yuuGlance = Math.sin(t * 0.7) * 2;

  return (
    <AnimeStage camera={camera}>
      <g transform={`translate(0 ${vib.dy}) rotate(${vib.rot} 960 540)`}>
        <SchoolBusShell t={globalT} scenerySpeed={1.05} />

        {/* Back-right row: two boys chatting / playing cards (clearly separated from foreground row) */}
        <BusSeatPair x={1220} y={705} scale={0.65} tone="far" />
        <SeatedClassmate
          preset="m02"
          x={1160}
          y={555}
          scale={0.63}
          facing={1}
          headTilt={Math.sin(globalT * 3.1) * 4}
          talking
          talkPhase={globalT}
          blink={blinkAt(globalT, 3.9, 0.3)}
        />
        <SeatedClassmate
          preset="m03"
          x={1275}
          y={558}
          scale={0.63}
          facing={-1}
          headTilt={Math.cos(globalT * 2.6) * 4}
          talking={Math.sin(globalT * 1.5) > 0}
          talkPhase={globalT + 1.1}
          blink={blinkAt(globalT, 4.2, 1.4)}
        />

        {/* Mid-right row: girls leaning together looking at a phone */}
        <BusSeatPair x={1510} y={820} scale={0.96} tone="mid" />
        <SeatedClassmate
          preset="f01"
          x={1425}
          y={605}
          scale={0.92}
          facing={1}
          headTilt={8 + Math.sin(globalT * 2.2) * 3}
          talking
          talkPhase={globalT + 0.5}
          blink={blinkAt(globalT, 3.5, 0.8)}
          holdingPhone
        />
        <SeatedClassmate
          preset="f02"
          x={1585}
          y={612}
          scale={0.92}
          facing={-1}
          headTilt={-6 + Math.cos(globalT * 2.4) * 2.5}
          talking={Math.cos(globalT * 1.8) > 0}
          talkPhase={globalT + 2.0}
          blink={blinkAt(globalT, 4.0, 1.9)}
        />

        {/* Rear-left row behind Yuu */}
        <BusSeatPair x={460} y={725} scale={0.68} tone="far" />
        <SeatedClassmate
          preset="f03"
          x={420}
          y={575}
          scale={0.65}
          facing={1}
          headTilt={Math.sin(globalT * 2.0) * 3}
          talking
          talkPhase={globalT + 0.8}
          blink={blinkAt(globalT, 3.8, 1.2)}
        />

        {/* Yuu's row (isolated by the window with empty aisle seat beside him) */}
        <g transform="translate(615 805)">
          <BusSeatPair x={0} y={0} scale={1.06} tone="near" />
        </g>

        <YuuSeated
          x={525}
          y={570}
          scale={0.98}
          pose="watch-seat"
          expression="neutral"
          blink={blinkAt(globalT, 3.7, 0.1)}
          headTilt={2}
          headTurnX={8 + yuuGlance}
          breath={breath}
        />

        <SchoolBackpack x={545} y={855} scale={0.78} rotation={-4} />
      </g>
    </AnimeStage>
  );
};
