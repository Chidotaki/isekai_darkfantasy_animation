import {hash} from '../motion';

const Tree=({x,y,scale=1,shade='#182f31',sway=0}:{x:number;y:number;scale?:number;shade?:string;sway?:number})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
  <path d="M-52 0Q-26-137-37-334L-53-650-5-681 29-620 19-338Q23-110 60 0L19-16 0-5-20-18Z" fill={shade}/>
  <path d="M-24-373L-129-491-180-516-110-474-16-322M12-420L101-564 168-593 111-550 15-350" fill={shade}/>
  <path d="M-16-13Q-4-172-13-320M-22-393L-31-570M12-188L1-311" fill="none" stroke="#92a387" strokeOpacity=".12" strokeWidth="5"/>
  <g transform={`rotate(${sway} 0 -440)`} fill={shade}><path d="M-256-540Q-290-611-205-631Q-218-696-131-705Q-87-779-8-727Q75-763 117-701Q228-710 235-628Q302-585 244-532Q183-492 117-521Q37-464-19-505Q-87-468-148-512Q-225-484-256-540Z"/></g>
  <path d="M-35-70Q-19-54-18-17L-44-5Z" fill="#536d4e" opacity=".55"/>
</g>;
export const Forest=({t,foreground=false}:{t:number;foreground?:boolean})=>foreground?<g>
  <Tree x={1545} y={954} scale={1.5} shade="#0e242a" sway={Math.sin(t*.5)*.4}/>
  <Tree x={-74} y={1030} scale={1.7} shade="#0c2027" sway={Math.sin(t*.6+2)*.5}/>
  <g fill="#142e30">{Array.from({length:18},(_,i)=>{const x=i*119;return <path key={i} d={`M${x} 1080q-35-96-69-110q28 58 53 110q19-74 55-101q-13 59-31 101Z`} transform={`rotate(${Math.sin(t*.8+i)*2} ${x} 1080)`}/>;})}</g>
</g>:<>
  <defs>
    <linearGradient id="forestSky" x2="0" y2="1"><stop stopColor="#152f3a"/><stop offset=".55" stopColor="#66827a"/><stop offset="1" stopColor="#294846"/></linearGradient>
    <linearGradient id="forestFloor" x2="0" y2="1"><stop stopColor="#4b6253"/><stop offset="1" stopColor="#1c3133"/></linearGradient>
    <linearGradient id="forestPath" x2=".2" y2="1"><stop stopColor="#7a8264"/><stop offset="1" stopColor="#4c5549"/></linearGradient>
    <linearGradient id="forestRay" x2=".7" y2="1"><stop stopColor="#e8dfac" stopOpacity=".19"/><stop offset="1" stopColor="#d8dfb1" stopOpacity="0"/></linearGradient>
    <radialGradient id="forestMist"><stop stopColor="#b3c8b5" stopOpacity=".23"/><stop offset="1" stopColor="#b3c8b5" stopOpacity="0"/></radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#forestSky)"/>
  <circle cx="1090" cy="180" r="100" fill="#d7dcc0" opacity=".22"/>
  <g transform={`translate(${Math.sin(t*.08)*7} 0)`}>{Array.from({length:17},(_,i)=><Tree key={i} x={i*127-40} y={760+hash(i)*30} scale={.75+hash(i+3)*.45} shade={i%2?'#3b5a56':'#49665e'}/>)}</g>
  <path d="M0 767Q480 700 962 763Q1430 709 1920 771V1080H0Z" fill="url(#forestFloor)"/>
  <path d="M1000 741Q772 808 931 881Q1060 970 1720 1080H340Q378 961 724 868Q880 816 1000 741Z" fill="url(#forestPath)"/>
  <path d="M885 824Q1046 849 1313 934M722 888Q536 944 531 1001" stroke="#abb18b" strokeOpacity=".14" strokeWidth="3" fill="none"/>
  <g opacity=".7"><path d="M215 787V434Q217 357 294 349Q364 351 368 435V785L325 786V447Q321 404 292 404Q259 405 260 449V788Z" fill="#465b58" stroke="#283f43" strokeWidth="5"/><path d="M216 496H258M327 535H368M217 666H258M326 693H368M246 369L264 410M331 370L313 410" stroke="#263f42" strokeWidth="5"/><path d="M215 788L230 682 244 714 249 788M323 784L341 707 350 750 368 777" fill="#647456"/></g>
  <Tree x={260} y={818} scale={1.15} shade="#284541" sway={Math.sin(t*.45)*.5}/><Tree x={1740} y={828} scale={1.05} shade="#2b4742" sway={Math.sin(t*.4+1)*.5}/>
  <g fill="url(#forestRay)" transform={`translate(${Math.sin(t*.15)*15} 0)`}><path d="M1010 0H1090L713 950H301Z"/><path d="M1190 0H1220L1150 940H945Z"/><path d="M1290 0H1320L1515 920H1340Z"/></g>
  <ellipse cx={1000+Math.sin(t*.15)*40} cy="735" rx="810" ry="140" fill="url(#forestMist)"/>
  {Array.from({length:42},(_,i)=>{const x=hash(i+111)*1920,y=775+hash(i+9)*265,s=3+hash(i+17)*9;return <g key={i} transform={`translate(${x} ${y})`}><ellipse cy="4" rx={s*2} ry={s*.5} fill="#132e2e" opacity=".3"/><path d={`M${-s} 2L${-s*.6} ${-s*.6} ${s*.4} ${-s} ${s} 0 ${s*.4} 4Z`} fill={i%3?'#536559':'#7b8170'}/></g>;})}
  <g fill="#587451">{[120,360,1430,1740].map((x,i)=><g key={x} transform={`translate(${x} ${884+i%2*60}) rotate(${Math.sin(t+i)*2})`}><path d="M0 0Q-55-72-75-64Q-34-64 0 0Q-18-84-9-99Q-8-42 0 0Q43-73 63-57Q26-44 0 0Z"/><path d="M0 0Q-38-20-59-12Q-28-6 0 0Q27-29 52-15Q23-11 0 0Z"/></g>)}</g>
</>;
