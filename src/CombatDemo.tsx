import {AbsoluteFill,Interactive,useCurrentFrame} from 'remotion';
import {Character} from './components/Character';
import {ArtDefs,Camera,Finish,Particles} from './components/Atmosphere';
import {ease,mix} from './motion';
import {Forest} from './combat/Forest';
import {Goblin} from './combat/Goblin';
import {Club} from './combat/Weapons';
import {CombatEffects,GroundShadow} from './combat/CombatEffects';
import {fightFrame,impacts,sampleFighter} from './combat/timeline';
import {weaponPoint} from './combat/rig';

const Fight=()=>{
  const frame=useCurrentFrame(),t=frame/30,clock=fightFrame(frame),hero=sampleFighter(frame,'human'),goblin=sampleFighter(frame,'goblin');
  const shake=[impacts.ground,impacts.clash,impacts.block,impacts.finish].reduce((sum,at)=>sum+(frame>=at&&frame<at+8?(1-(frame-at)/8)*(at===impacts.ground?3:2):0),0);
  const zoom=1+ease(frame,20,130)*.055-ease(frame,365,449)*.085;
  const heroArt=<Character id="ren" x={hero.x} y={hero.y} scale={hero.scale} facing={hero.facing} t={clock/30} rig={hero.pose} expression={frame<365?'determined':'quiet'} look={frame>372&&frame<390?-Math.sin((frame-372)*.18):.65}/>;
  const goblinArt=<Goblin fighter={goblin} t={clock/30} weapon={clock<338}/>;
  const dropOrigin=weaponPoint(sampleFighter(338,'goblin'),'goblin',0),dropTip=weaponPoint(sampleFighter(338,'goblin'),'goblin',84),drop=ease(frame,338,356);
  const dropAngle=Math.atan2(dropTip[0]-dropOrigin[0],-(dropTip[1]-dropOrigin[1]))*180/Math.PI;
  return <AbsoluteFill style={{background:'#0c2028'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <ArtDefs/>
      <Camera x={960+ease(frame,290,345)*25+ease(frame,405,449)*45} y={550} zoom={zoom} shake={shake} t={t}>
        <Interactive.G name="Forest clearing"><Forest t={t}/></Interactive.G>
        <GroundShadow x={hero.x} y={hero.y+3} width={100}/>
        <GroundShadow x={goblin.x-ease(frame,344,362)*150} y={goblin.y+3} width={mix(95,165,ease(frame,344,362))}/>
        <Interactive.G name="Synchronized fighters">
          {hero.y<goblin.y?<>{heroArt}{goblinArt}</>:<>{goblinArt}{heroArt}</>}
        </Interactive.G>
        {frame>=338&&<g transform={`translate(${mix(dropOrigin[0],900,drop)} ${mix(dropOrigin[1],865,drop)-Math.sin(drop*Math.PI)*60}) rotate(${mix(dropAngle,-85,drop)}) scale(2.2)`}><Club/></g>}
        <Interactive.G name="Weapon trails and impacts"><CombatEffects frame={frame}/></Interactive.G>
        <Particles t={t*.3} count={35} color="#d1d4a4" y={160} h={720} strength={.24}/>
        <Interactive.G name="Foreground trees"><Forest t={t} foreground/></Interactive.G>
      </Camera>
      <Finish/>
      <rect width="1920" height="1080" fill="#06131b" opacity={1-ease(frame,0,13)}/>
    </svg>
  </AbsoluteFill>;
};
export const CombatDemo=()=> <Fight/>;
