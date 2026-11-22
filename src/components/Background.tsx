import {hash} from '../motion';
export const Pine = ({x,y,s=1,color='#142d35'}:{x:number;y:number;s?:number;color?:string}) => <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}><path d="M-5 0V-100H5V0Z"/><path d="M0-210-43-130H-27L-62-72H-38L-80-14H80L38-72H62L27-130H43Z"/></g>;
export const Mountains = ({t,interior=false,distortion=0}:{t:number;interior?:boolean;distortion?:number}) => <g>
  <rect width="1920" height="1080" fill="url(#sky)"/>
  <circle cx="1480" cy="270" r="105" fill="#d3c3a3" opacity=".36"/><circle cx="1480" cy="270" r="155" fill="#cbd2bd" opacity=".05"/>
  <g transform={`translate(${-t*5} ${Math.sin(t*4)*distortion})`}><path d="M-200 660L50 380 230 500 510 165 790 460 1070 230 1380 490 1640 220 2200 680V1100H-200Z" fill="#647e82"/><path d="M400 315L510 165 637 305 544 271 508 292 473 264Z M973 350L1070 230 1195 353 1090 305 1057 328Z M1525 352L1640 220 1796 377 1662 321 1620 340Z" fill="#b9c4bc" opacity=".55"/></g>
  <g transform={`translate(${-t*13} ${Math.sin(t*5)*distortion*.6})`}><path d="M-100 720L170 430 440 680 770 420 1150 720 1540 440 1850 670 2300 410V1100H-100Z" fill="#365660"/><path d="M170 430L440 680 280 627Z M770 420L1150 720 870 643Z M1540 440L1850 670 1640 632Z" fill="#203f4b"/></g>
  <path d="M0 725Q300 650 650 735T1300 716 1920 720" fill="none" stroke="#b6c9bc" strokeWidth="30" opacity=".10"/>
  {Array.from({length:23},(_,i)=><Pine key={i} x={((i*125-t*(interior?120:35)+5000)%2875)-400} y={790+hash(i)*45} s={.7+hash(i+4)*.7} color={i%2?'#173a43':'#254751'}/>)}
  <path d="M-100 845Q500 755 1060 819T2100 790V1100H-100Z" fill="#152d36"/>
</g>;
export const Road = ({t}:{t:number}) => <g>
  <path d="M-100 806Q600 744 1110 806T2050 770L2080 977Q1400 900 800 950T-100 973Z" fill="#4a5356" stroke="#7d8580" strokeWidth="5"/>
  <path d="M-100 886Q600 826 1110 876T2050 843" fill="none" stroke="#c9bf98" strokeWidth="7" strokeDasharray="90 90" strokeDashoffset={t*240}/>
  <path d="M-100 976Q630 912 1070 946T2040 922" fill="none" stroke="#151e27" strokeWidth="20"/>
  {Array.from({length:14},(_,i)=>{const x=((i*170-t*150+5000)%2380)-220;return <g key={i}><path d={`M${x} 951v-51`} stroke="#687c7c" strokeWidth="9"/><path d={`M${x-85} 906h170`} stroke="#93a19a" strokeWidth="7"/></g>;})}
</g>;
export const Hall = ({t}:{t:number}) => <g>
  <rect width="1920" height="1080" fill="url(#stone)"/>
  {/* Receding vaults, clerestory, masonry and a ceremonial sun window. */}
  {[0,1,2].map(i=><path key={i} d={`M${120+i*160} 820V410Q960 ${-350+i*170} ${1800-i*160} 410V820`} fill="none" stroke={i%2?'#35434c':'#263641'} strokeWidth={65-i*10}/>)}
  {Array.from({length:10},(_,i)=><path key={i} d={`M0 ${170+i*65}H1920`} stroke="#a1a08a" strokeWidth="2" opacity=".045"/>)}
  <path d="M770 715V350Q960 105 1150 350V715Z" fill="#152431" stroke="#66706b" strokeWidth="12"/>
  <path d="M803 680V358Q960 161 1117 358V680Z" fill="#8b907b" opacity=".2"/>
  <circle cx="960" cy="360" r="122" fill="#d1b46b" opacity=".15" stroke="#c7ad6a" strokeWidth="5"/>
  <g stroke="#c8b477" fill="none" opacity=".7"><circle cx="960" cy="360" r="82" strokeWidth="4"/><circle cx="960" cy="360" r="53" strokeWidth="2"/>{Array.from({length:12},(_,i)=><path key={i} d="M960 257V285 M947 270L960 257 973 270" transform={`rotate(${i*30} 960 360)`} strokeWidth="3"/>)}<path d="M960 309L1004 385H916Z M960 411L916 335H1004Z" strokeWidth="3"/></g>
  <path d="M960 230V715M804 460H1116M804 572H1116" stroke="#718078" strokeWidth="8"/>
  <path d="M805 315L1118 315 1590 965H450Z" fill="url(#goldbeam)" opacity=".12"/>
  <path d="M0 795H1920V1080H0Z" fill="url(#floor)"/>
  {Array.from({length:13},(_,i)=><path key={i} d={`M960 770L${-1600+i*430} 1080`} stroke="#7d8985" opacity=".14" strokeWidth="2"/>)}
  {[815,850,906,990].map(y=><path key={y} d={`M0 ${y}H1920`} stroke="#92a092" strokeWidth="2" opacity=".1"/>)}
  <path d="M770 800L1150 800 1350 1080H580Z" fill="#514448" opacity=".35"/><path d="M770 800L580 1080M1150 800L1350 1080" stroke="#b59a62" strokeWidth="3" opacity=".3"/>
  {[120,410,1510,1800].map((x,i)=><g key={x}>
    <path d={`M${x-53} 130H${x+53}L${x+40} 805H${x-40}Z`} fill={i===0||i===3?'#182834':'#2c3c46'} stroke="#53616a" strokeWidth="3"/>
    <path d={`M${x-20} 160V790M${x+22} 160V790`} stroke="#8b958b" opacity=".16" strokeWidth="5"/>
    <path d={`M${x-70} 130h140v30h-140Z M${x-62} 798h124v28h-124Z M${x-76} 826h152v20h-152Z`} fill="#384751" stroke="#566168" strokeWidth="3"/>
  </g>)}
  {[570,1350].map(x=><g key={x}><path d={`M${x-50} 250H${x+50}V565L${x} 615 ${x-50} 565Z`} fill="#523e48" stroke="#967856" strokeWidth="3"/><path d={`M${x} 310l22 38-22 38-22-38Z M${x} 402v95`} fill="none" stroke="#c4a76c" strokeWidth="4"/><path d={`M${x-60} 246h120`} stroke="#b6a380" strokeWidth="7"/></g>)}
  {[290,1630].map((x,i)=><g key={x}><ellipse cx={x} cy="648" rx="115" ry="150" fill="url(#goldglow)" opacity={.45+Math.sin(t*5+i)*.07}/><path d={`M${x} 700v65m-25-65h50l-8 17h-34Z`} fill="#8c784e"/><path d={`M${x} 704Q${x-30} 680 ${x-8} ${637+Math.sin(t*8+i)*7}Q${x+4} 665 ${x+12} 650Q${x+34} 688 ${x} 704`} fill="#efba64"/><path d={`M${x} 700Q${x-12} 680 ${x} 664Q${x+14} 691 ${x} 700`} fill="#ffe5a4"/></g>)}
</g>;
