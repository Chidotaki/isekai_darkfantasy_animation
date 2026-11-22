// Local PCM WAV -> 30fps amplitude cues and one 30-second dialogue track.
// Usage: node scripts/prepare-speech.mjs manifest.json [output.wav]
// Manifest: [{actor:'ren',from:142,file:'public/audio/yuu.wav',text:'...'}]
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const local=(p)=>{const target=path.resolve(root,p);if(!target.startsWith(root+path.sep))throw Error('Only project-local paths are supported.');return target;};
if(!process.argv[2])throw Error('Provide a project-relative JSON dialogue manifest.');
const output=process.argv[3]??'public/audio/emotional-dialogue.wav';
if(!local(output).startsWith(path.join(root,'public')+path.sep)||path.extname(output).toLowerCase()!=='.wav')throw Error('Write the mixed WAV inside public/ so Remotion can load it.');
const manifest=JSON.parse(fs.readFileSync(local(process.argv[2]),'utf8').replace(/^\uFEFF/,''));
if(!Array.isArray(manifest)||manifest.length===0)throw Error('The manifest must contain at least one dialogue clip.');
const rate=24000,fps=30,total=rate*30,mix=new Float32Array(total),cues=[];
const pcm=(file)=>{
  const b=fs.readFileSync(local(file));if(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WAVE')throw Error('Use uncompressed 16-bit PCM WAV clips.');
  let channels=0,sampleRate=0,bits=0,format=0,data;
  for(let p=12;p+8<=b.length;){const id=b.toString('ascii',p,p+4),n=b.readUInt32LE(p+4);if(p+8+n>b.length)throw Error('Truncated WAV');if(id==='fmt '){format=b.readUInt16LE(p+8);channels=b.readUInt16LE(p+10);sampleRate=b.readUInt32LE(p+12);bits=b.readUInt16LE(p+22);}if(id==='data')data=b.subarray(p+8,p+8+n);p+=8+n+(n%2);}
  if(format!==1||bits!==16||!channels||!sampleRate||!data)throw Error('Use uncompressed 16-bit PCM WAV clips.');
  const length=Math.floor(data.length/(2*channels)),mono=new Float32Array(length);
  for(let i=0;i<length;i++)for(let ch=0;ch<channels;ch++)mono[i]+=data.readInt16LE((i*channels+ch)*2)/32768/channels;
  // Trim synthesis padding, keeping 20ms around actual speech.
  let start=0,end=length;while(start<end&&Math.abs(mono[start])<.004)start++;while(end>start&&Math.abs(mono[end-1])<.004)end--;
  start=Math.max(0,start-Math.round(sampleRate*.02));end=Math.min(length,end+Math.round(sampleRate*.02));
  const out=new Float32Array(Math.ceil((end-start)*rate/sampleRate));
  for(let i=0;i<out.length;i++){const at=start+i*sampleRate/rate,j=Math.min(length-1,Math.floor(at)),p=at-j;out[i]=mono[j]*(1-p)+(mono[j+1]??mono[j])*p;}
  return out;
};
for(const line of manifest){
  if(!['ren','mira','elias'].includes(line.actor)||!Number.isInteger(line.from)||line.from<0||typeof line.file!=='string')throw Error('Invalid actor, file or start frame.');
  const samples=pcm(line.file),frames=Math.ceil(samples.length/(rate/fps)),to=line.from+frames;
  if(to>900)throw Error(`Line exceeds demo: ${line.text}`);
  if(cues.some(c=>line.from<c.to&&to>c.from))throw Error(`Dialogue overlap: ${line.text}`);
  const rms=[];for(let f=0;f<frames;f++){let sum=0,n=0;for(let i=f*800;i<Math.min(samples.length,(f+1)*800);i++){sum+=samples[i]**2;n++;}rms.push(Math.sqrt(sum/Math.max(1,n)));}
  const peak=Math.max(.03,...rms),envelope=rms.map(v=>Number((v<.006?0:Math.min(1,(v/peak)**.65)).toFixed(3)));
  cues.push({actor:line.actor,from:line.from,to,text:line.text,envelope});
  for(let i=0;i<samples.length;i++)mix[line.from*800+i]+=samples[i]*.87;
  console.log(`${line.actor}: ${line.from}–${to} (${(samples.length/rate).toFixed(2)}s) ${line.text}`);
}
// Quiet deterministic coach hum; excluded from the mouth envelope.
for(let i=0;i<total;i++){const t=i/rate,fade=Math.min(1,t/1.5,(30-t)/.8);mix[i]+=(Math.sin(t*Math.PI*2*57)*.004+Math.sin(t*Math.PI*2*114)*.002)*fade;}
const wav=Buffer.alloc(44+total*2);wav.write('RIFF');wav.writeUInt32LE(36+total*2,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(total*2,40);
for(let i=0;i<total;i++)wav.writeInt16LE(Math.round(Math.max(-.98,Math.min(.98,mix[i]))*32767),44+i*2);
fs.mkdirSync(path.dirname(local(output)),{recursive:true});
fs.writeFileSync(local(output),wav);
fs.mkdirSync(local('out'),{recursive:true});
fs.writeFileSync(local('out/emotional-audio.props.json'),JSON.stringify({audioFile:output.replace(/^public[\\/]/,''),speechCues:cues,audioVolume:1,showDialogue:true},null,2));
