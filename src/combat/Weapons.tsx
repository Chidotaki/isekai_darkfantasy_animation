/** Both weapons attach at (0,0), extend along -Y, and share the rig's grip transform. */
export const Sword = ({draw=1}:{draw?:number}) => <g>
  <g transform={`scale(1 ${draw})`}>
    <path d="M-5-14L-5-89 0-103 5-89 5-14Z" fill="#d7edf0" stroke="#344f5d" strokeWidth="1.5"/>
    <path d="M0-99V-15H4V-88Z" fill="#91b6c5"/>
    <path d="M-3-18V-86L0-96" fill="none" stroke="#fff9d9" strokeWidth="1.2"/>
  </g>
  <path d="M-15-13Q0-20 15-13L14-9Q0-14-14-9Z" fill="#c0a363" stroke="#263b48" strokeWidth="1.8"/>
  <path d="M-3-10H3V12H-3Z" fill="#34545b" stroke="#192b38" strokeWidth="1.5"/>
  <path d="M-3-5L3-2M-3 1L3 4M-3 7L3 10" stroke="#8ca59b" strokeWidth="1"/>
  <circle cy="15" r="4.5" fill="#bb9f62" stroke="#273b47" strokeWidth="1.5"/>
</g>;
export const Scabbard = () => <g transform="translate(-22 -88) rotate(60)">
  <path d="M-7-7H7L5 90Q0 100-5 90Z" fill="#233945" stroke="#142735" strokeWidth="2"/>
  <path d="M-7-5H7M-5 82H5" stroke="#9b8b61" strokeWidth="4"/>
  <path d="M-2 5V75" stroke="#48626b" strokeWidth="1.5"/>
</g>;
export const Club = () => <g>
  <path d="M-4 14L-6-33Q-17-47-15-71L-8-84 11-80 18-65Q17-48 6-29L4 14Z" fill="#866044" stroke="#293332" strokeWidth="2.3"/>
  <path d="M0 10L-2-37-5-71M5-40L10-66M-8-52L-10-65" fill="none" stroke="#b3905d" strokeWidth="2.5" strokeLinecap="round"/>
  <path d="M-15-61L15-57M-13-68L16-64" stroke="#444e49" strokeWidth="5"/>
  <path d="M-4 8L4 5M-4 2L4-1M-4-4L4-7" stroke="#c3ac7a" strokeWidth="2.5"/>
  <circle cx="-9" cy="-62" r="1.5" fill="#a9ad8d"/><circle cx="10" cy="-59" r="1.5" fill="#a9ad8d"/>
</g>;
