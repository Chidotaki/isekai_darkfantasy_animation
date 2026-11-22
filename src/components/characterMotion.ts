import {clamp, ease, hash, mix} from '../motion';
import {mouthShapes,type MouthShape} from './faceRig';

export type Point = readonly [number, number];
const TAU = Math.PI * 2;
const wrap = (n: number, period: number) => ((n % period) + period) % period;

/** Pure frame-time samplers: no stateful springs, timers, or random sampling. */
export const idleMotion = (t: number, seed: number) => {
  const breath = Math.sin(t * TAU / 3.8 + seed);
  return {
    breath, sway: Math.sin(t * .83 + seed) * 1.1, rise: -breath * .85,
    lean: Math.sin(t * .7 + seed) * .65,
    head: Math.sin(t * 1.13 + seed + .7) * .8,
    secondary: Math.sin(t * TAU / 3.8 + seed - .6),
  };
};

export const talkMotion = (t: number, seed: number) => {
  const phrase = wrap(t + seed * .37, 3.6);
  const envelope = ease(phrase, .12, .4) * (1 - ease(phrase, 2.55, 2.95));
  const syllable = clamp(.44 + Math.sin(t * 16 + seed) * .34 + Math.sin(t * 23 + seed) * .22);
  const shapes:MouthShape[]=['A','E','closed','O','U','F'];
  const step=wrap(t*6+seed,shapes.length),a=mouthShapes[shapes[Math.floor(step)]],b=mouthShapes[shapes[(Math.floor(step)+1)%shapes.length]],p=step%1;
  return {
    mouth: envelope * syllable,
    mouthOpen:envelope*syllable*mix(a.mouthOpen,b.mouthOpen,p),
    mouthWidth:mix(6,mix(a.mouthWidth,b.mouthWidth,p),envelope),
    teeth:mix(a.teeth,b.teeth,p)*envelope,lipPress:mix(a.lipPress,b.lipPress,p)*envelope,
    gesture: envelope * (.42 + .28 * Math.sin(t * 2.7 + seed)),
    head: envelope * (Math.sin(t * 3.4 + seed) * 1.8 - .8),
    lean: envelope * (1 + Math.sin(t * 2.1 + seed) * .8),
    lift: envelope * Math.sin(t * 3.4 + seed - .5) * .6,
  };
};

/** Quick closure, softer release, staggered intervals and occasional double blink. */
export const blinkAmount = (t: number, seed: number) => {
  const cycle = Math.floor((t + seed) / 9), phase = wrap(t + seed, 9);
  const first = 1.7 + hash(cycle + seed * 13) * 1.4;
  const second = 5.9 + hash(cycle + seed * 7 + 4) * 1.5;
  const blink = (start: number) => ease(phase, start, start + .065) * (1 - ease(phase, start + .09, start + .20));
  return Math.max(blink(first), blink(second), hash(cycle + seed + 31) > .72 ? blink(first + .29) : 0);
};

/** Stance moves backward under the body; recovery lifts the toe in a soft arc. */
export const walkMotion = (t: number, strength = 1) => {
  const weight = clamp(strength), cycle = wrap(t / 1.1, 1);
  const foot = (offset: number) => {
    const p = wrap(cycle + offset, 1), recovery = clamp((p - .6) / .4);
    return {
      x: weight * (p < .6 ? mix(9, -9, p / .6) : mix(-9, 9, ease(recovery, 0, 1))),
      y: -weight * Math.sin(Math.PI * recovery) * 12,
      angle: weight * Math.sin(Math.PI * recovery) * -9,
    };
  };
  return {
    left: foot(0), right: foot(.5), shift: Math.sin(cycle * TAU) * 2.6 * weight,
    drop: (1 - Math.cos(cycle * TAU * 2)) * 1.3 * weight,
    lean: Math.sin(cycle * TAU) * 1.3 * weight,
    arm: Math.sin(cycle * TAU + .3) * 20 * weight,
    secondary: Math.sin(cycle * TAU - .7) * 3 * weight,
  };
};

export const endpoint = (start: Point, length: number, degrees: number): Point => {
  const angle = degrees * Math.PI / 180;
  return [start[0] + Math.sin(angle) * length, start[1] + Math.cos(angle) * length];
};

/** Two-bone solve keeps knees connected while the pelvis shifts over feet. */
export const kneeBetween = (hip: Point, ankle: Point, side: number): Point => {
  const dx = ankle[0] - hip[0], dy = ankle[1] - hip[1];
  const distance = Math.max(.001, Math.hypot(dx, dy)), reach = Math.min(distance, 79.99);
  const height = Math.sqrt(Math.max(0, 40 * 40 - reach * reach / 4));
  return [(hip[0] + ankle[0]) / 2 + side * dy / distance * height,
    (hip[1] + ankle[1]) / 2 - side * dx / distance * height];
};
