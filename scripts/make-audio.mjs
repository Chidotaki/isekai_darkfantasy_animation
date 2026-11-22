// Original, deterministic synthesis: no samples, services, or downloaded music.
import {mkdirSync,writeFileSync} from 'node:fs';
const sr=48000, seconds=40, n=sr*seconds;
const left=new Float32Array(n),right=new Float32Array(n);
let seed=7349;
const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1;};
const sine=(f,t)=>Math.sin(2*Math.PI*f*t);
const clamp=x=>Math.max(0,Math.min(1,x));
function tone(start,dur,freq,gain,pan=0,kind='pad'){
  for(let k=0;k<dur*sr;k++) {const idx=Math.floor(start*sr)+k;if(idx>=n)break;const t=k/sr;
    const env=kind==='bell'?(1-Math.exp(-t*80))*Math.exp(-t*1.5):Math.min(1,t/1.2)*Math.min(1,(dur-t)/1.5);
    const a=kind==='bell'?sine(freq,t)+.3*sine(freq*2.76,t)*Math.exp(-t*2):sine(freq,t)+.2*sine(freq*2.002,t)+.12*sine(freq*.501,t);
    const v=a*env*gain;left[idx]+=v*(1-pan*.4);right[idx]+=v*(1+pan*.4);
  }
}
// A restrained D minor motif; the hall opens to a luminous suspended chord.
[[0,146.83],[4,174.61],[8,130.81],[12,164.81],[15,116.54],[23,146.83],[27,174.61],[31,130.81],[35,138.59]].forEach(([t,f])=>{tone(t,6,f,.07,-.3);tone(t+.2,6,f*1.5,.035,.4);});
[[1,587.33],[3.4,523.25],[6,440],[9.5,587.33],[12.8,659.25],[24.8,880],[26.1,1174.66],[27.4,1396.91],[28.8,1760],[30.3,1174.66],[33,880],[36.4,554.37]].forEach(([t,f],i)=>tone(t,3.5,f,.075,i%2?.6:-.6,'bell'));
tone(15,7.5,55,.08);tone(23,8,293.66,.06);tone(23.2,8,440,.045);tone(32,8,73.42,.065);
let low=0;
for(let i=0;i<n;i++){
  const t=i/sr;const noise=rand();low=low*.97+noise*.03;
  let v=0;
  if(t<21.5){const road=clamp((22-t)/3);v+=(low*.14+sine(47,t)*.018+sine(94,t)*.008)*road;}
  if(t>15&&t<22.5){const p=(t-15)/7.5;v+=sine(80+t*t*1.5,t)*p*.018+noise*p*p*.024;}
  if(t>21.5&&t<25){const dt=t-21.5;v+=noise*Math.exp(-dt*2.2)*.18+low*Math.exp(-dt)*.3;}
  if(t>23){v+=low*.025;}
  const fade=clamp(t/.5)*clamp((40-t)/1.2);
  left[i]=(left[i]+v)*fade;right[i]=(right[i]+v*.92)*fade;
}
// Subtle room echo for the magical notes, followed by a soft limiter.
for(let i=n-1;i>sr*.27;i--){left[i]+=right[i-Math.floor(sr*.27)]*.13;right[i]+=left[i-Math.floor(sr*.19)]*.10;}
const out=Buffer.alloc(44+n*4);out.write('RIFF',0);out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(2,22);out.writeUInt32LE(sr,24);out.writeUInt32LE(sr*4,28);out.writeUInt16LE(4,32);out.writeUInt16LE(16,34);out.write('data',36);out.writeUInt32LE(n*4,40);
let peak=0;for(let i=0;i<n;i++){const l=Math.tanh(left[i]*1.5)*.8,r=Math.tanh(right[i]*1.5)*.8;peak=Math.max(peak,Math.abs(l),Math.abs(r));out.writeInt16LE(Math.round(l*32767),44+i*4);out.writeInt16LE(Math.round(r*32767),46+i*4);}
mkdirSync('public/audio',{recursive:true});writeFileSync('public/audio/isekai-score.wav',out);console.log(`Created original 40s stereo score; peak ${(20*Math.log10(peak)).toFixed(1)} dBFS.`);
