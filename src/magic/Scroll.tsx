import {smooth} from '../combat/animations';
import {scrollState,type ScrollActivation} from './spells';
/** The inscription exists before use. Light belongs to the parchment, never the user. */
export const EnchantedScroll=({frame,event,ground=false}:{frame:number;event:ScrollActivation;ground?:boolean})=>{
  const state=scrollState(frame,event),open=ground?1:smooth((frame-event.unroll)/24);
  const spent=smooth((frame-event.spent+8)/15);
  const glow=state==='active'?Math.sin(Math.PI*(frame-event.activate)/(event.spent-event.activate))*.85:0;
  const width=8+open*42;
  return <g transform={ground?'rotate(8)':''}>
    <path d={`M-5 -21Q${width*.4} -25 ${width} -21L${width+2} 25Q${width*.45} 20 -5 25Z`} fill={spent>.8?'#aaa28a':'#d8c599'} stroke="#635b50" strokeWidth="1.8"/>
    <path d={`M-2-15H${width-4}V18H-2Z`} fill="none" stroke="#917b59" strokeWidth=".8"/>
    {open>.08&&<g opacity={open*(1-spent*.87)} fill="none" stroke="#4d8d92" strokeWidth="1.3">
      <path d={`M${width*.5} -12Q${width*.17} 0 ${width*.5} 9Q${width*.83} 0 ${width*.5} -12Z`}/>
      <path d={`M6 13H${width-6}M6 16H${width-6}M8-10v5m${width-18}-5v5`}/>
    </g>}
    <path d={`M-5-24Q2-26 3-21V23Q0 27-6 24ZM${width-3} -23Q${width+5} -26 ${width+6} -20V23Q${width+2} 27 ${width-3} 23Z`} fill={spent>.8?'#b5aa92':'#e5d4ad'} stroke="#776b53" strokeWidth="1.3"/>
    {glow>0&&<g opacity={glow}><ellipse cx={width*.5} rx={width*.8} ry="32" fill="url(#water-glow)"/><path d={`M${width*.5} -12Q${width*.17} 0 ${width*.5} 9Q${width*.83} 0 ${width*.5} -12Z M6 13H${width-6}`} stroke="#dcfff3" strokeWidth="2" fill="none"/></g>}
    {spent>.1&&<g opacity={spent} stroke="#686252" strokeWidth="1.2" fill="none"><path d={`M${width*.5-6} -12l4 9-3 7 9 11M8-8l6 4-2 4M${width-8} 4l-5 5 2 4`}/><path d={`M8-10H${width-9}M7 13H${width-8}`} strokeOpacity=".3"/></g>}
  </g>;
};
export const ScrollPouch=()=> <g transform="translate(-25 -94)"><path d="M-9-6Q1-12 12-5L11 15Q0 20-10 13Z" fill="#594c3e" stroke="#192736" strokeWidth="2"/><path d="M-9-5Q0 5 12-5L8 3H-5Z" fill="#79624a"/><circle cy="2" r="2" fill="#baa477"/></g>;
