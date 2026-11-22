import {Easing, interpolate} from 'remotion';
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const ease = (t: number, a: number, b: number) => interpolate(t, [a,b], [0,1], {extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});
export const mix = (a: number,b: number,t: number) => a+(b-a)*t;
export const hash = (n: number) => {const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
