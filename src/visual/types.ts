import type {SVGProps} from 'react';
import type {CombatPose} from '../combat/rig';
import type {FacePose, Expression, MouthShape} from '../components/faceRig';
import type {Point} from '../components/characterMotion';

export type VisualExpression = Expression | 'fear';
export type Bone = 'hips' | 'torso' | 'head' | 'backHair' | 'frontHair' |
  'upperArmL' | 'forearmL' | 'handL' | 'upperArmR' | 'forearmR' | 'handR' |
  'thighL' | 'shinL' | 'footL' | 'thighR' | 'shinR' | 'footR' |
  'eyeL' | 'eyeR' | 'browL' | 'browR' | 'mouth' | 'scarf';
export type Shape = {
  readonly tag: 'path' | 'ellipse' | 'circle' | 'rect';
  readonly props: SVGProps<SVGElement>;
};
export type LayerSource =
  | {readonly kind: 'vector'; readonly shapes: readonly Shape[]; readonly viewBox: readonly [number, number, number, number]}
  | {readonly kind: 'file'; readonly path: string; readonly format: 'png' | 'webp' | 'svg'};
export type CharacterLayer = {
  readonly id: string;
  readonly bone: Bone;
  readonly order: number;
  readonly source: LayerSource;
  /** Layer-local artwork rectangle, relative to the named joint. */
  readonly offset: Point;
  readonly size: Point;
  readonly anchor?: Point;
  readonly rotation?: number;
  readonly scale?: Point;
  readonly visible?: boolean;
  readonly opacity?: number;
  readonly role?: 'shadow' | 'highlight';
  readonly motion?: 'pupil';
  readonly clip?: {readonly rx: number; readonly ry: number};
  readonly expressions?: Partial<Record<VisualExpression, LayerSource>>;
  readonly mouths?: Partial<Record<MouthShape, LayerSource>>;
  readonly costumes?: Readonly<Record<string, LayerSource | null>>;
};
export type CharacterRig = {
  readonly id: string;
  readonly version: string;
  readonly torsoPivot: Point;
  readonly neck: Point;
  readonly shoulders: readonly [Point, Point];
  readonly upperArm: number;
  readonly forearm: number;
  readonly handOffset: number;
  readonly hips: readonly [Point, Point];
  readonly thigh: number;
  readonly shin: number;
  readonly feet: readonly [Point, Point];
  readonly eyes: readonly [Point, Point]; // Relative to neck, like the head artwork.
  readonly mouth: Point;
  readonly hairPivot?: Point; // Relative to neck.
  readonly scarfPivot?: Point; // Relative to feet origin.
};
export type CharacterAppearance = {
  readonly id: string;
  readonly version: string;
  readonly status: 'provisional' | 'approved';
  readonly provenance: string;
  readonly rig: CharacterRig;
  readonly costumes: readonly string[];
  readonly layers: readonly CharacterLayer[];
};
export type CharacterPerformance = {
  readonly body: CombatPose;
  readonly face: FacePose;
  readonly expression: {readonly from: VisualExpression; readonly to?: VisualExpression; readonly mix: number; readonly intensity:number};
  readonly mouth: {readonly from: MouthShape; readonly to: MouthShape; readonly mix: number; readonly weight:number};
  readonly headOffset: Point;
  readonly breath: number;
  readonly secondary: number;
};
