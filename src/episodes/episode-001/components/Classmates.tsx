import {NPCCharacter} from '../../../visual/NPCCharacter';
import {npcAssets} from '../../../visual/npcAssets';

/**
 * Standing male classmate in Japanese school uniform (reusing student-m01 cutout)
 * wearing a noticeably large shoulder backpack as described in Chapter 1 S001.
 */
export const StandingClassmateWithBag = ({
  x,
  y,
  scale = 1,
  facing = 1,
  opacity = 1,
  walkPhase = 0,
  leanDeg = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  opacity?: number;
  /** Continuous walk cycle phase in radians; 0 when standing still. */
  walkPhase?: number;
  leanDeg?: number;
}) => {
  const heightScale = (730 / npcAssets['student-m01'].size[1]) * scale;
  const strideBob = walkPhase === 0 ? 0 : Math.abs(Math.sin(walkPhase)) * -10;
  const strideTilt = walkPhase === 0 ? 0 : Math.sin(walkPhase) * 1.4;

  return (
    <g
      data-character="standing-classmate"
      opacity={opacity}
      transform={`translate(${x} ${y + strideBob}) rotate(${leanDeg + strideTilt})`}
    >
      {/* Large backpack slung over shoulder behind/beside torso */}
      <g transform={`translate(${facing * -62 * scale} ${-410 * scale}) scale(${scale * 1.15})`}>
        <path
          d="M-54 -88 Q-58 -106 -28 -106 H28 Q58 -106 54 -88 L64 28 Q66 56 38 58 H-38 Q-66 56 -64 28 Z"
          fill="#2d3c4f"
          stroke="#131820"
          strokeWidth={4}
        />
        <rect x={-42} y={-28} width={84} height={54} rx={12} fill="#384a61" stroke="#131820" strokeWidth={3} />
        <path d="M-24 -102 Q0 -122 24 -102" fill="none" stroke="#131820" strokeWidth={6} strokeLinecap="round" />
      </g>

      {/* Existing approved student-m01 standing cutout */}
      <NPCCharacter npcId="student-m01" x={0} y={0} scale={heightScale} facing={facing} idle={walkPhase === 0} />

      {/* Shoulder strap crossing blazer */}
      <path
        d={`M${facing * -18 * scale} ${-560 * scale} Q${facing * 6 * scale} ${-460 * scale} ${facing * -24 * scale} ${-350 * scale}`}
        fill="none"
        stroke="#1b222c"
        strokeWidth={11 * scale}
        strokeLinecap="round"
        opacity={0.92}
      />
    </g>
  );
};

export type ClassmatePreset = 'm02' | 'm03' | 'f01' | 'f02' | 'f03';

const classmatePalettes: Record<
  ClassmatePreset,
  {hair: string; skin: string; tie: string; glasses?: boolean; ribbon?: boolean; hairStyle: 'short' | 'bob' | 'ponytail'}
> = {
  m02: {hair: '#1f232a', skin: '#efd7c5', tie: '#842d37', glasses: true, hairStyle: 'short'},
  m03: {hair: '#5a4332', skin: '#edd2bd', tie: '#842d37', hairStyle: 'short'},
  f01: {hair: '#3a2d28', skin: '#f4dfd0', tie: '#8a2d3a', ribbon: true, hairStyle: 'ponytail'},
  f02: {hair: '#1d2028', skin: '#f3ddd0', tie: '#8a2d3a', glasses: true, ribbon: true, hairStyle: 'bob'},
  f03: {hair: '#694b39', skin: '#f1d9c8', tie: '#8a2d3a', ribbon: true, hairStyle: 'bob'},
};

/**
 * Reusable seated classmate in matching Japanese school uniform (navy blazer, white shirt, red tie/ribbon).
 * Supports subtle head nods, talking mouth, raised hand (for back-row friend), or looking at a phone.
 */
export const SeatedClassmate = ({
  preset,
  x,
  y,
  scale = 1,
  facing = 1,
  headTilt = 0,
  talking = false,
  talkPhase = 0,
  blink = false,
  raiseHand = false,
  holdingPhone = false,
}: {
  preset: ClassmatePreset;
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  headTilt?: number;
  talking?: boolean;
  talkPhase?: number;
  blink?: number | boolean;
  raiseHand?: boolean;
  holdingPhone?: boolean;
}) => {
  const pal = classmatePalettes[preset];
  const isBlinking = typeof blink === 'boolean' ? blink : blink > 0.5;
  const mouthOpen = talking ? Math.max(0, Math.sin(talkPhase * 11)) : 0;

  return (
    <g data-character={`seated-${preset}`} transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}>
      {/* Blazer torso */}
      <path
        d="M-58 40 Q-68 46 -72 92 L-68 182 H68 L72 92 Q68 46 58 40 L30 30 H-30 Z"
        fill="#26374e"
        stroke="#141922"
        strokeWidth={4}
      />
      {/* White shirt & tie/ribbon */}
      <polygon points="-24,30 24,30 0,104" fill="#edf0f4" stroke="#141922" strokeWidth={2.5} />
      {pal.ribbon ? (
        <path d="M-16 42 L0 52 L16 42 L13 62 L0 55 L-13 62 Z" fill={pal.tie} stroke="#141922" strokeWidth={2} />
      ) : (
        <polygon points="-7,40 7,40 9,90 0,104 -9,90" fill={pal.tie} stroke="#141922" strokeWidth={2} />
      )}

      {/* Optional raised hand (e.g., friend in back row calling out) */}
      {raiseHand && (
        <g>
          <path
            d="M54 54 Q88 -4 72 -62"
            fill="none"
            stroke="#26374e"
            strokeWidth={24}
            strokeLinecap="round"
          />
          <circle cx={72} cy={-66} r={12} fill={pal.skin} stroke="#141922" strokeWidth={3} />
        </g>
      )}

      {/* Optional holding phone */}
      {holdingPhone && (
        <g transform="translate(32 108)">
          <rect x={-14} y={-22} width={28} height={42} rx={5} fill="#18202a" stroke="#0f1318" strokeWidth={2.5} />
          <rect x={-10} y={-18} width={20} height={32} rx={2} fill="#b7dcf2" opacity={0.85} />
        </g>
      )}

      {/* Head & hair */}
      <g transform={`rotate(${headTilt} 0 24)`}>
        {/* Back hair for bob/ponytail */}
        {pal.hairStyle === 'bob' && (
          <path
            d="M-48 -28 Q-54 22 -36 38 H36 Q54 22 48 -28 Z"
            fill={pal.hair}
            stroke="#141922"
            strokeWidth={3}
          />
        )}
        {pal.hairStyle === 'ponytail' && (
          <path
            d="M-36 -38 Q-68 -18 -56 32 Q-42 22 -38 -12 Z"
            fill={pal.hair}
            stroke="#141922"
            strokeWidth={3}
          />
        )}

        {/* Neck */}
        <rect x={-14} y={8} width={28} height={28} rx={8} fill={pal.skin} stroke="#141922" strokeWidth={3} />

        {/* Face */}
        <path
          d="M-38 -36 Q-40 16 0 24 Q40 16 38 -36 Q38 -74 0 -74 Q-38 -74 -38 -36 Z"
          fill={pal.skin}
          stroke="#141922"
          strokeWidth={3.5}
        />

        {/* Eyes */}
        {isBlinking ? (
          <g stroke="#141922" strokeWidth={3} strokeLinecap="round">
            <path d="M-24 -22 Q-16 -18 -8 -22" fill="none" />
            <path d="M8 -22 Q16 -18 24 -22" fill="none" />
          </g>
        ) : (
          <g>
            <ellipse cx={-16} cy={-22} rx={5.5} ry={6.5} fill="#212630" />
            <ellipse cx={16} cy={-22} rx={5.5} ry={6.5} fill="#212630" />
            <circle cx={-14} cy={-24} r={2} fill="#ffffff" />
            <circle cx={18} cy={-24} r={2} fill="#ffffff" />
          </g>
        )}

        {/* Optional glasses */}
        {pal.glasses && (
          <g fill="none" stroke="#222730" strokeWidth={2.4}>
            <rect x={-27} y={-29} width={22} height={14} rx={4} />
            <rect x={5} y={-29} width={22} height={14} rx={4} />
            <line x1={-5} y1={-22} x2={5} y2={-22} />
          </g>
        )}

        {/* Mouth */}
        {mouthOpen > 0.25 ? (
          <ellipse cx={0} cy={4} rx={6.5} ry={3 + mouthOpen * 4.5} fill="#6e2b33" stroke="#141922" strokeWidth={2} />
        ) : (
          <path d="M-7 4 Q0 7 7 4" fill="none" stroke="#141922" strokeWidth={2.4} strokeLinecap="round" />
        )}

        {/* Front hair / bangs */}
        <path
          d="M-42 -36 Q-44 -82 0 -84 Q44 -82 42 -36 Q32 -54 18 -40 Q6 -56 -4 -36 Q-18 -54 -28 -38 Z"
          fill={pal.hair}
          stroke="#141922"
          strokeWidth={3.5}
        />
      </g>
    </g>
  );
};
