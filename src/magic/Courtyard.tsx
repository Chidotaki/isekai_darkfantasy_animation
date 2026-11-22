import {hash} from '../motion';
export const Courtyard=({frame,foreground=false}:{frame:number;foreground?:boolean})=>{
  if(foreground)return <g fill="#182b30">
    <path d="M-80 1070L-25 885 80 910 142 1032 190 1068ZM1690 1070L1730 931 1830 904 1960 969V1080Z" stroke="#293f42" strokeWidth="4"/>
    {[120,210,1680,1770].map((x,i)=><g key={x} transform={`translate(${x} 1000) rotate(${Math.sin(frame*.025+i)*1.5})`} stroke="#385345" strokeWidth="3"><path d="M0 25Q-15-20-4-49M-3-5Q-25-5-32-25M-6-17Q12-25 16-40M-7-24Q-25-34-25-47" fill="none"/></g>)}
  </g>;
  return <g>
    <defs><linearGradient id="courtyard-sky" x2="0" y2="1"><stop stopColor="#122635"/><stop offset="1" stopColor="#536669"/></linearGradient><linearGradient id="court-floor" x2="0" y2="1"><stop stopColor="#536361"/><stop offset="1" stopColor="#22383c"/></linearGradient><linearGradient id="pillar-face" x2="1" y2=".2"><stop stopColor="#6d7770"/><stop offset="1" stopColor="#424f50"/></linearGradient></defs>
    <rect x="-250" y="-100" width="2420" height="1300" fill="url(#courtyard-sky)"/>
    <circle cx={380+Math.sin(frame*.001)*5} cy="240" r="165" fill="url(#water-glow)" opacity=".15"/><circle cx="380" cy="240" r="43" fill="#b7c7b5" opacity=".5"/>
    <g transform={`translate(${-frame*.018} 0)`} fill="#263d43"><path d="M-100 550L20 320 115 411 212 298 320 441 488 350 620 510 810 412 968 555V800H-100Z"/><path d="M1390 580V350H1445V260H1460V350H1510V585L1640 410 1770 522 1870 350 2090 521V800Z"/></g>
    <path d="M-100 750V345L44 320 115 371 175 342 269 390V720H480V415L585 370 640 397 760 356 802 424V740H1180V410L1280 361 1355 390 1440 348 1490 375V730H1720V344L1810 325 1880 380 2020 340V800Z" fill="#394e52" stroke="#1f353d" strokeWidth="9"/>
    {[34,500,1200,1760].map((x,i)=><g key={x}>
      <path d={`M${x} 740V538Q${x+105} 343 ${x+210} 538V740`} fill="#1e343d" stroke="#61706b" strokeWidth="27"/>
      <path d={`M${x+16} 738V540Q${x+104} 382 ${x+194} 540V738`} fill="none" stroke="#253e45" strokeWidth="7"/>
      {Array.from({length:5},(_,j)=><path key={j} d={`M${x-17} ${560+j*37}h35M${x+190} ${560+j*37}h35`} stroke="#263c43" strokeWidth="3"/>)}
      <path d={`M${x+25} 410l14 30-8 42 13 41`} fill="none" stroke="#1f353b" strokeWidth="3"/>
      <g opacity=".4" fill="#52705c">{Array.from({length:9},(_,j)=><ellipse key={j} cx={x+190+Math.sin(j)*12} cy={410+j*23} rx="9" ry="18" transform={`rotate(${j*41} ${x+190} ${410+j*23})`}/>)}</g>
    </g>)}
    <path d="M0 730Q850 680 1920 734V1200H0Z" fill="url(#court-floor)"/>
    <g stroke="#829087" strokeOpacity=".15" fill="none">{[760,800,858,940,1050].map(y=><path key={y} d={`M-50 ${y}Q900 ${y-20} 1980 ${y}`}/>)}{[-500,-120,250,610,980,1350,1700,2110,2450].map(x=><path key={x} d={`M960 700L${x} 1100`}/>)}</g>
    {Array.from({length:22},(_,i)=>{const x=hash(i+12)*2000,y=760+hash(i+99)*220;return <g key={i} transform={`translate(${x} ${y})`}><ellipse cy="9" rx="22" ry="6" fill="#172c32" opacity=".3"/><path d="M-14 5L-8-10 8-14 19 2 8 9Z" fill={i%2?'#52615d':'#3e5352'} stroke="#30464a" strokeWidth="2"/></g>;})}
    <path d="M155 781Q202 749 250 777L279 814H126Z" fill="#344c46"/>
    <g opacity=".17" fill="#bfd0c4"><path d="M380 240L920 752H1120Z"/><path d="M380 240L1240 770H1350Z"/></g>
  </g>;
};
/** Broken column, tall enough to shelter a crouching Ren, low enough to pour over. */
export const CoverPillar=()=> <g>
  <ellipse cx="844" cy="899" rx="132" ry="20" fill="#152a30" opacity=".4"/>
  <path d="M750 863L925 860 952 890 944 910H730L731 888Z" fill="#394c4d" stroke="#243b41" strokeWidth="4"/>
  <path d="M777 609L813 581 849 605 884 566 913 602 920 862Q849 888 766 864Z" fill="url(#pillar-face)" stroke="#253c42" strokeWidth="4"/>
  <path d="M884 566L913 602 920 862 894 872 890 612 849 605Z" fill="#35494c"/>
  <path d="M790 633L785 856M813 628L809 864M839 634L839 868M866 620L872 868" stroke="#b2b29a" strokeWidth="4" strokeOpacity=".17"/>
  <path d="M777 609L813 581 849 605 884 566 913 602 890 612 846 622 809 605Z" fill="#889083" stroke="#35494c" strokeWidth="2"/>
  <path d="M766 761Q844 781 916 755M771 672Q836 685 914 669" fill="none" stroke="#2c4145" strokeWidth="3"/>
  <path d="M847 622L837 665 847 689 836 732" stroke="#2b4145" strokeWidth="3" fill="none"/>
  <path d="M739 885L784 877 793 905 727 912Z" fill="#64716a" stroke="#263e43" strokeWidth="3"/>
  <path d="M753 865Q777 851 802 860L796 870Z" fill="#4d6751"/>
</g>;
