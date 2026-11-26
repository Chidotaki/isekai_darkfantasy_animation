import {YuuFacialRenderer} from '../../../visual/YuuFacialRenderer';
import type {YuuFaceExpression, YuuMouth} from '../../../visual/yuuFacialSprites';

export type YuuSeatedPose = 'phone' | 'look-up' | 'watch-seat' | 'place-bag' | 'earphones' | 'window-rest';

export type YuuSeatedProps = {
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  pose?: YuuSeatedPose;
  expression?: YuuFaceExpression;
  blink?: number;
  mouth?: YuuMouth;
  /** Head tilt in degrees. Positive tilts right/down, negative tilts up. */
  headTilt?: number;
  /** Subtle horizontal head shift to suggest gaze turn. */
  headTurnX?: number;
  /** Subtle vertical head nod in pixels. */
  headNodY?: number;
  /** 0..1 progress of placing the backpack onto the adjacent seat. */
  bagPlaceProgress?: number;
  /** Whether earphones are visible in his ears/collar. */
  hasEarphones?: boolean;
  /** Subtle breathing offset in pixels. */
  breath?: number;
};

/** Dark Japanese school backpack prop. */
export const SchoolBackpack = ({
  x,
  y,
  scale = 1,
  rotation = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
    {/* Top handle */}
    <path d="M-16 -96 Q0 -116 16 -96" fill="none" stroke="#151922" strokeWidth={7} strokeLinecap="round" />
    {/* Main bag body */}
    <path
      d="M-54 -84 Q-56 -98 -32 -98 H32 Q56 -98 54 -84 L62 12 Q64 34 42 36 H-42 Q-64 34 -62 12 Z"
      fill="#202733"
      stroke="#12161e"
      strokeWidth={4}
    />
    {/* Upper flap / pocket seam */}
    <path d="M-52 -42 Q0 -30 52 -42" fill="none" stroke="#12161e" strokeWidth={3.5} />
    <rect x={-40} y={-22} width={80} height={46} rx={10} fill="#283140" stroke="#12161e" strokeWidth={3} />
    {/* Subtle zipper & buckle highlight */}
    <line x1={-32} y1={-12} x2={32} y2={-12} stroke="#505e73" strokeWidth={2.5} strokeLinecap="round" />
    {/* Side strap */}
    <path d="M-56 -64 Q-72 -25 -58 18" fill="none" stroke="#171c25" strokeWidth={8} strokeLinecap="round" />
  </g>
);

/**
 * Reusable seated Asakura Yuu in modern Japanese high school uniform.
 * Combines the calibrated YuuFacialRenderer head with cel-shaded seated uniform body & arms.
 */
export const YuuSeated = ({
  x,
  y,
  scale = 1,
  facing = 1,
  pose = 'phone',
  expression = 'neutral',
  blink = 0,
  mouth,
  headTilt = 0,
  headTurnX = 0,
  headNodY = 0,
  bagPlaceProgress = 0,
  hasEarphones = false,
  breath = 0,
}: YuuSeatedProps) => {
  const showPhone = pose === 'phone' || pose === 'look-up';
  const phoneLowered = pose === 'look-up' ? 18 : 0;

  // Arm reach interpolation for placing backpack on the adjacent seat
  const reachX = bagPlaceProgress * 115;
  const reachY = Math.sin(bagPlaceProgress * Math.PI) * -28;

  return (
    <g data-character="asakura-yuu-seated" transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}>
      {/* Seated trousers: lap, knees, shins, and school loafers grounded to floor */}
      <g transform="translate(0 185)">
        {/* Thighs on seat cushion */}
        <path
          d="M-74 0 L-66 48 Q0 58 66 48 L74 0 Z"
          fill="#262a33"
          stroke="#13161d"
          strokeWidth={4}
        />
        {/* Left & right lower legs */}
        <path
          d="M-64 42 L-62 152 L-22 152 L-16 48 Z"
          fill="#232730"
          stroke="#13161d"
          strokeWidth={4}
        />
        <path
          d="M16 48 L22 152 L62 152 L64 42 Z"
          fill="#232730"
          stroke="#13161d"
          strokeWidth={4}
        />
        {/* School loafers */}
        <path d="M-66 150 Q-68 172 -40 174 H-16 Q-12 160 -22 150 Z" fill="#171a21" stroke="#0d0f14" strokeWidth={3} />
        <path d="M22 150 Q12 160 16 174 H40 Q68 172 66 150 Z" fill="#171a21" stroke="#0d0f14" strokeWidth={3} />
      </g>

      {/* Seated Japanese school uniform torso (navy blazer, white shirt, crimson tie) */}
      <g transform={`translate(0 ${breath * 0.6})`}>
        {/* Blazer body */}
        <path
          d="M-66 44 Q-76 48 -82 95 L-76 196 H76 L82 95 Q76 48 66 44 L36 32 H-36 Z"
          fill="#26364d"
          stroke="#141922"
          strokeWidth={4}
        />
        {/* Cel shadow on left side of blazer */}
        <path d="M-66 44 Q-76 48 -82 95 L-76 196 H-42 L-48 56 Z" fill="#1b2738" opacity="0.65" />
        {/* White shirt V-front */}
        <polygon points="-28,32 28,32 0,118" fill="#edf0f4" stroke="#141922" strokeWidth={3} />
        {/* Seamless neck bridge behind facial renderer */}
        <rect x={-18} y={-2} width={36} height={46} rx={10} fill="#ebd6c5" stroke="#141922" strokeWidth={3} />
        {/* White shirt collar */}
        <polygon points="-28,32 -16,22 -2,44 -14,56" fill="#edf0f4" stroke="#141922" strokeWidth={2.5} />
        <polygon points="28,32 16,22 2,44 14,56" fill="#edf0f4" stroke="#141922" strokeWidth={2.5} />
        {/* Crimson tie */}
        <polygon points="-8,42 8,42 11,96 0,116 -11,96" fill="#7f2b35" stroke="#141922" strokeWidth={2.5} />
        <polygon points="-10,36 10,36 7,48 -7,48" fill="#6d222b" stroke="#141922" strokeWidth={2.5} />
        {/* Blazer lapels */}
        <path d="M-34 32 L-8 118 L-42 90 Z" fill="#202e42" stroke="#141922" strokeWidth={3} />
        <path d="M34 32 L8 118 L42 90 Z" fill="#202e42" stroke="#141922" strokeWidth={3} />
        {/* Blazer buttons */}
        <circle cx={0} cy={136} r={4.5} fill="#161b24" />
        <circle cx={0} cy={170} r={4.5} fill="#161b24" />

        {/* Left/back arm */}
        {pose === 'place-bag' ? (
          <g>
            <path
              d="M-70 52 Q-88 116 -46 168"
              fill="none"
              stroke="#223146"
              strokeWidth={28}
              strokeLinecap="round"
            />
            <circle cx={-46} cy={172} r={11} fill="#ebd5c3" stroke="#141922" strokeWidth={3} />
          </g>
        ) : (
          <g>
            <path
              d={`M-70 52 Q-84 114 ${showPhone ? -24 : -50} ${138 + phoneLowered * 0.5}`}
              fill="none"
              stroke="#223146"
              strokeWidth={28}
              strokeLinecap="round"
            />
            <circle
              cx={showPhone ? -24 : -50}
              cy={138 + phoneLowered * 0.5}
              r={11}
              fill="#ebd5c3"
              stroke="#141922"
              strokeWidth={3}
            />
          </g>
        )}

        {/* Right/aisle-side arm */}
        {pose === 'place-bag' ? (
          <g>
            <path
              d={`M70 52 Q${92 + reachX * 0.45} ${116 + reachY * 0.4} ${54 + reachX} ${148 + reachY}`}
              fill="none"
              stroke="#26364d"
              strokeWidth={30}
              strokeLinecap="round"
            />
            <circle
              cx={54 + reachX}
              cy={148 + reachY}
              r={13}
              fill="#ebd5c3"
              stroke="#141922"
              strokeWidth={3}
            />
          </g>
        ) : pose === 'earphones' ? (
          <g>
            <path
              d="M70 52 Q98 92 48 18"
              fill="none"
              stroke="#26364d"
              strokeWidth={28}
              strokeLinecap="round"
            />
            <circle cx={48} cy={18} r={12} fill="#ebd5c3" stroke="#141922" strokeWidth={3} />
          </g>
        ) : (
          <g>
            <path
              d={`M70 52 Q84 114 ${showPhone ? 24 : 50} ${138 + phoneLowered * 0.5}`}
              fill="none"
              stroke="#26364d"
              strokeWidth={28}
              strokeLinecap="round"
            />
            <circle
              cx={showPhone ? 24 : 50}
              cy={138 + phoneLowered * 0.5}
              r={12}
              fill="#ebd5c3"
              stroke="#141922"
              strokeWidth={3}
            />
          </g>
        )}

        {/* Smartphone prop when holding phone */}
        {showPhone && (
          <g transform={`translate(0 ${136 + phoneLowered})`}>
            <rect
              x={-18}
              y={-28}
              width={36}
              height={54}
              rx={6}
              fill="#19202a"
              stroke="#0f1319"
              strokeWidth={3}
            />
            <rect x={-14} y={-23} width={28} height={42} rx={3} fill="#a8d5f0" opacity={0.85} />
            {/* Subtle phone screen glow */}
            <ellipse cx={0} cy={-16} rx={38} ry={24} fill="#b8e2ff" opacity={0.14} />
          </g>
        )}

        {/* Head using calibrated YuuFacialRenderer (neckOnly anchored seamlessly to collar) */}
        <g
          transform={`translate(${headTurnX} ${headNodY + breath * 0.3}) rotate(${headTilt} 0 24)`}
        >
          <g transform="translate(-140 -178) scale(0.555)">
            <YuuFacialRenderer expression={expression} blink={blink} mouth={mouth} neckOnly />
          </g>

          {/* Optional earphones */}
          {hasEarphones && (
            <g>
              <circle cx={-34} cy={12} r={4.5} fill="#1d222b" stroke="#6d7b8c" strokeWidth={1.5} />
              <circle cx={34} cy={12} r={4.5} fill="#1d222b" stroke="#6d7b8c" strokeWidth={1.5} />
              <path
                d="M-34 16 Q-32 54 -10 82 M34 16 Q32 54 10 82"
                fill="none"
                stroke="#1d222b"
                strokeWidth={2.2}
                opacity={0.85}
              />
            </g>
          )}
        </g>
      </g>
    </g>
  );
};
