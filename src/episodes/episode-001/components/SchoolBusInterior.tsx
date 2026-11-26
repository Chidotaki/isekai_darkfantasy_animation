import {useId} from 'react';

export type BusMotion = {
  /** Subtle vertical road vibration in pixels. */
  readonly dy: number;
  /** Subtle suspension roll in degrees. */
  readonly rot: number;
};

/** Small, natural bus suspension hum. Never excessive. */
export const busVibration = (t: number): BusMotion => {
  const hum = Math.sin(t * 11.5) * 0.65 + Math.sin(t * 23.2 + 0.8) * 0.25;
  const roadDip = Math.sin(t * 2.1) * 0.75;
  const rot = Math.sin(t * 1.7 + 0.4) * 0.11;
  return {dy: hum + roadDip, rot};
};

/** Passing mountain/roadside scenery seen through the bus windows. */
export const BusWindowScenery = ({
  t,
  speed = 1,
  top = 155,
  height = 460,
}: {
  t: number;
  speed?: number;
  top?: number;
  height?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const farOffset = ((t * 18 * speed) % 960 + 960) % 960;
  const midOffset = ((t * 68 * speed) % 640 + 640) % 640;
  const nearOffset = ((t * 320 * speed) % 480 + 480) % 480;

  return (
    <g data-bus-scenery="morning-drive">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8bb8d8" />
          <stop offset="55%" stopColor="#c5dfee" />
          <stop offset="100%" stopColor="#f3ebd8" />
        </linearGradient>
        <linearGradient id={`sunbeam-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff8e3" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fff8e3" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x={-120} y={top} width={2160} height={height} fill={`url(#sky-${uid})`} />

      {/* Soft morning clouds */}
      <g transform={`translate(${-farOffset * 0.35} ${top + 55})`} opacity="0.72">
        {[0, 960, 1920].map((ox) => (
          <g key={ox} transform={`translate(${ox} 0)`}>
            <path
              d="M80 68 Q130 28 210 46 Q270 15 350 48 Q410 38 445 68 Z"
              fill="#f7f9fb"
            />
            <path
              d="M560 92 Q615 56 690 72 Q755 46 820 74 Q870 68 900 92 Z"
              fill="#eef4f8"
            />
          </g>
        ))}
      </g>

      {/* Distant mountain ridge */}
      <g transform={`translate(${-farOffset} ${top + height - 180})`}>
        {[0, 960, 1920].map((ox) => (
          <path
            key={ox}
            d={`M${ox - 40} 180 L${ox + 120} 62 L${ox + 290} 98 L${ox + 480} 28 L${ox + 680} 84 L${ox + 850} 44 L${ox + 960} 72 L${ox + 960} 180 Z`}
            fill="#6f8da6"
            opacity="0.75"
          />
        ))}
      </g>

      {/* Midground forested hills */}
      <g transform={`translate(${-midOffset} ${top + height - 125})`}>
        {[0, 640, 1280, 1920].map((ox) => (
          <path
            key={ox}
            d={`M${ox - 30} 130 Q${ox + 70} 38 ${ox + 180} 72 Q${ox + 280} 22 ${ox + 390} 66 Q${ox + 510} 28 ${ox + 640} 64 L${ox + 640} 130 Z`}
            fill="#47665c"
          />
        ))}
      </g>

      {/* Foreground passing trees & utility poles */}
      <g transform={`translate(${-nearOffset} ${top + height - 105})`}>
        {[0, 480, 960, 1440, 1920].map((ox) => (
          <g key={ox} transform={`translate(${ox} 0)`}>
            {/* Utility pole */}
            <rect x={95} y={-210} width={10} height={315} fill="#36424c" opacity="0.65" />
            <rect x={68} y={-190} width={64} height={6} fill="#36424c" opacity="0.65" />
            {/* Foliage silhouette */}
            <path
              d="M170 110 Q210 18 265 44 Q320 8 375 52 Q425 28 455 110 Z"
              fill="#2c453d"
            />
            {/* Guardrail */}
            <rect x={0} y={84} width={480} height={8} fill="#8996a0" opacity="0.8" />
          </g>
        ))}
      </g>

      {/* Subtle diagonal morning sunlight */}
      <polygon
        points={`140,${top} 490,${top} 280,${top + height} -70,${top + height}`}
        fill={`url(#sunbeam-${uid})`}
      />
      <polygon
        points={`880,${top} 1230,${top} 1020,${top + height} 670,${top + height}`}
        fill={`url(#sunbeam-${uid})`}
      />
    </g>
  );
};

/** Consistent 2D anime bus seat pair (window seat + aisle seat) with antimacassar cloth. */
export const BusSeatPair = ({
  x,
  y,
  scale = 1,
  tone = 'mid',
}: {
  x: number;
  y: number;
  scale?: number;
  tone?: 'far' | 'mid' | 'near';
}) => {
  const fill = tone === 'far' ? '#25384a' : tone === 'near' ? '#2d465c' : '#293f54';
  const shade = tone === 'far' ? '#1c2b3a' : '#1e3042';
  const cloth = tone === 'far' ? '#bfc8d1' : '#dce3ea';

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Window seat */}
      <g transform="translate(-88 0)">
        <path
          d="M-76 -230 Q-76 -262 -44 -262 H44 Q76 -262 76 -230 L84 -35 H-84 Z"
          fill={fill}
          stroke="#151b24"
          strokeWidth={4}
        />
        <path
          d="M-46 -258 H46 L50 -196 Q0 -188 -50 -196 Z"
          fill={cloth}
          stroke="#151b24"
          strokeWidth={2.5}
        />
        <path d="M-68 -140 H68" stroke={shade} strokeWidth={4} opacity="0.65" />
      </g>

      {/* Aisle seat */}
      <g transform="translate(88 0)">
        <path
          d="M-76 -230 Q-76 -262 -44 -262 H44 Q76 -262 76 -230 L84 -35 H-84 Z"
          fill={fill}
          stroke="#151b24"
          strokeWidth={4}
        />
        <path
          d="M-46 -258 H46 L50 -196 Q0 -188 -50 -196 Z"
          fill={cloth}
          stroke="#151b24"
          strokeWidth={2.5}
        />
        <path d="M-68 -140 H68" stroke={shade} strokeWidth={4} opacity="0.65" />
        {/* Aisle armrest */}
        <rect
          x={68}
          y={-96}
          width={22}
          height={64}
          rx={8}
          fill="#223140"
          stroke="#151b24"
          strokeWidth={3}
        />
      </g>

      {/* Shared seat cushion */}
      <rect
        x={-172}
        y={-42}
        width={344}
        height={44}
        rx={12}
        fill="#334c63"
        stroke="#151b24"
        strokeWidth={4}
      />
    </g>
  );
};

/**
 * Reusable Japanese school bus interior shell (ceiling, luggage rack, hanging straps, windows).
 * Designed to frame seated characters cleanly across medium, wide, and close shots.
 */
export const SchoolBusShell = ({
  t,
  scenerySpeed = 1,
  showStraps = true,
}: {
  t: number;
  scenerySpeed?: number;
  showStraps?: boolean;
}) => {
  const strapSway = Math.sin(t * 2.4) * 4.5 + Math.sin(t * 5.1) * 1.4;
  return (
    <g data-bus-shell="interior">
      {/* Outside scenery through bus windows */}
      <BusWindowScenery t={t} speed={scenerySpeed} top={145} height={470} />

      {/* Ceiling & overhead luggage rack */}
      <rect x={-120} y={-40} width={2160} height={205} fill="#253342" />
      <rect x={-120} y={118} width={2160} height={38} fill="#314254" stroke="#151b24" strokeWidth={3} />
      <path d="M-120 112 H2040" stroke="#7d8f9e" strokeWidth={5} />

      {/* Window pillars & rubber seals */}
      {[-60, 440, 960, 1480, 1980].map((px) => (
        <g key={px}>
          <rect x={px - 24} y={150} width={48} height={465} fill="#1f2c3a" stroke="#141922" strokeWidth={3} />
          <rect x={px - 8} y={168} width={16} height={430} fill="#344658" opacity="0.6" />
        </g>
      ))}

      {/* Upper & lower window rails */}
      <rect x={-120} y={148} width={2160} height={22} fill="#1b2633" stroke="#141922" strokeWidth={3} />
      <rect x={-120} y={596} width={2160} height={34} fill="#8a96a0" stroke="#141922" strokeWidth={3} />

      {/* Lower bus side wall & floor */}
      <rect x={-120} y={630} width={2160} height={490} fill="#253443" />
      <rect x={-120} y={630} width={2160} height={16} fill="#445769" />
      <rect x={-120} y={910} width={2160} height={220} fill="#19232d" />

      {/* Hanging bus straps */}
      {showStraps &&
        [250, 700, 1220, 1700].map((sx, idx) => {
          const phase = strapSway + Math.sin(t * 2.8 + idx * 1.1) * 1.6;
          return (
            <g key={sx} transform={`translate(${sx} 112) rotate(${phase})`}>
              <line x1={0} y1={0} x2={0} y2={68} stroke="#8f9aa4" strokeWidth={5} />
              <rect
                x={-19}
                y={66}
                width={38}
                height={34}
                rx={10}
                fill="none"
                stroke="#d6dbe0"
                strokeWidth={7}
              />
            </g>
          );
        })}
    </g>
  );
};
