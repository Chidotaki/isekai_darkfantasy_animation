import {Character, CastId} from './Character';
import {Mountains} from './Background';
export const BusExterior = ({t,x=960,y=740,scale=1}:{t:number;x?:number;y?:number;scale?:number}) => <g transform={`translate(${x} ${y+Math.sin(t*13)*2}) scale(${scale})`}>
  <ellipse cy="95" rx="390" ry="33" fill="#07121b" opacity=".4"/>
  <path d="M-365-184Q-365-213-325-213H284Q335-209 354-161L384-64V59Q380 80 355 80H-343Q-370 78-370 52Z" fill="#b7995c" stroke="#172934" strokeWidth="9"/>
  <path d="M-365-184H321L358-95H-365Z" fill="#203641"/>
  <path d="M-363-41H379V25H-363Z" fill="#d8c18a"/>
  <path d="M-360 30H378" stroke="#4d6a70" strokeWidth="12"/>
  {(['ren','lina','mira','toma','elias'] as CastId[]).map((id,i)=><g key={id}>
    <rect x={-342+i*117} y="-180" width="104" height="92" rx="8" fill="#597e86"/>
    <clipPath id={`buswin${i}`}><rect x={-342+i*117} y="-180" width="104" height="92" rx="8"/></clipPath>
    <g clipPath={`url(#buswin${i})`}><Character id={id} x={-289+i*117} y={-45} scale={.57} t={t} pose={id==='ren'?'sit':'talk'} expression={id==='ren'?'quiet':'happy'} look={id==='ren'?-1:i%2?1:-1}/><path d={`M${-330+i*117}-177l35 89`} stroke="#b8e3dd" strokeWidth="17" opacity=".13"/></g>
  </g>)}
  <path d="M264-178H312L342-92H264Z" fill="#8aaba8"/><path d="M293-70h59v125h-59Z" fill="#4d696e" stroke="#1a3440" strokeWidth="4"/><path d="M320-62v107" stroke="#adc5b7" strokeWidth="3"/>
  <path d="M-335-60H220" stroke="#e6d8b3" strokeWidth="4"/><path d="M-325-51h30m10 0h30" stroke="#324f5a" strokeWidth="4"/>
  {[-240,253].map(cx=><g key={cx} transform={`translate(${cx} 64)`}><circle r="57" fill="#111e29"/><circle r="35" fill="#708187" stroke="#263e49" strokeWidth="8"/><g transform={`rotate(${t*250})`} stroke="#b5bdb3" strokeWidth="5"><path d="M-25 0h50M0-25v50"/></g><circle r="12" fill="#283f48"/></g>)}
  <rect x="358" y="4" width="20" height="18" rx="4" fill="#ffe7a9"/><rect x="-373" y="9" width="12" height="23" rx="4" fill="#b76553"/>
  <path d="M-342-221H295" stroke="#243d48" strokeWidth="7"/>
</g>;
export const Seat = ({x,y,s=1}:{x:number;y:number;s?:number}) => <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-60-178Q-65-205-38-209H39Q65-206 62-178L55-49H-55Z" fill="#284d59" stroke="#152d3c" strokeWidth="7"/><path d="M-47-182H47M-45-170V-65M45-170V-65" fill="none" stroke="#67837e" strokeWidth="3" opacity=".65"/><path d="M-57-50H62V-26H-57Z" fill="#3f6570" stroke="#172c39" strokeWidth="6"/><path d="M-40-24V20M43-24V20" stroke="#192b36" strokeWidth="8"/></g>;
export const BusInterior = ({t}:{t:number}) => <g>
  <Mountains t={t+4} interior/>
  <rect width="1920" height="200" fill="#233c49"/>
  <path d="M0 200H1920V245H0Z M0 645H1920V1080H0Z" fill="#253c48"/>
  <path d="M0 657H1920V690H0Z" fill="#a69f81"/><path d="M0 705H1920" stroke="#638081" strokeWidth="8"/>
  {[0,465,1005,1545,1910].map(x=><g key={x}><path d={`M${x} 210V660`} stroke="#142e3c" strokeWidth="45"/><path d={`M${x+12} 245V625`} stroke="#728c8b" strokeWidth="5"/></g>)}
  <rect x="0" y="245" width="1920" height="400" fill="url(#glass)"/>
  <path d="M0 243H1920M0 639H1920" stroke="#a3b1a2" strokeWidth="6"/>
  {[160,700,1240,1780].map(x=><path key={x} d={`M${x} 250l-130 385h65l130-385Z`} fill="#c9ded0" opacity=".08"/>)}
  <path d="M0 870H1920V1080H0Z" fill="#192d3a"/>
  <path d="M0 1010L1920 870M0 1080L1920 940" stroke="#596965" strokeWidth="4" opacity=".3"/>
  <path d="M0 125H1920" stroke="#9b9e86" strokeWidth="9"/>
  {[280,820,1360].map(x=><g key={x}><path d={`M${x} 130v65`} stroke="#94a395" strokeWidth="5"/><rect x={x-25} y="185" width="50" height="30" rx="12" fill="none" stroke="#c7c9ac" strokeWidth="7"/></g>)}
  <path d="M0 172H1920" stroke="#e4c394" strokeWidth="6" opacity=".5"/>
</g>;
