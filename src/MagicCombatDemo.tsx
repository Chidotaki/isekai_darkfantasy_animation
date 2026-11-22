import {AbsoluteFill,Interactive,useCurrentFrame} from 'remotion';
import {Character} from './components/Character';
import {ArtDefs,Camera,Finish,Particles} from './components/Atmosphere';
import {GroundShadow,Sparks,Dust} from './combat/CombatEffects';
import {weaponPoint} from './combat/rig';
import {ease,mix} from './motion';
import {Courtyard,CoverPillar} from './magic/Courtyard';
import {CastEffect,FireProjectile,MagicDefs,MagicShield,PillarImpact,Staff,Steam,UtilityWater} from './magic/Effects';
import {EnchantedScroll,ScrollPouch} from './magic/Scroll';
import {fireCast,secondCast,shieldCast,waterScroll} from './magic/spells';
import {barrierContact,disarmContact,magicActor,magicCues,scrollPoint,staffPoint} from './magic/timeline';

export const MagicCombatDemo=()=>{
  const f=useCurrentFrame(),t=f/30,hero=magicActor(f,'ren'),mage=magicActor(f,'mage');
  const scrollHeld=f>=171&&f<283,staffHeld=f<magicCues.disarm;
  const drop=ease(f,420,445),staffOrigin=staffPoint(420,0),staffTip=staffPoint(420,112);
  const staffAngle=Math.atan2(staffTip[0]-staffOrigin[0],-(staffTip[1]-staffOrigin[1]))*180/Math.PI;
  const scrollDrop=ease(f,283,303),scrollOrigin=scrollPoint(283);
  const shake=[118,375,420].reduce((v,at)=>v+(f>=at&&f<at+7?(1-(f-at)/7)*2:0),0);
  const ren=<g><Character id="ren" x={hero.x} y={hero.y} scale={hero.scale} facing={1} rig={hero.pose} t={t} expression={f<150?'determined':f<280?'quiet':'determined'} look={f>160&&f<260?.25:.7} handItem={scrollHeld?<g transform="scale(-1 1)"><EnchantedScroll frame={f} event={waterScroll}/></g>:undefined}/><g transform={`translate(${hero.x} ${hero.y}) scale(${hero.scale}) translate(${hero.pose.pelvisX} ${hero.pose.pelvisY})`}><ScrollPouch/></g></g>;
  const mageArt=<Character id="toma" costume="mage" sword={false} handItem={staffHeld?<Staff/>:undefined} x={mage.x} y={mage.y} scale={mage.scale} facing={-1} rig={mage.pose} t={t} expression={f>419?'surprised':'determined'} look={.65}/>;
  return <AbsoluteFill style={{background:'#142b35'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080"><ArtDefs/><MagicDefs/>
      <Camera x={1010+ease(f,325,420)*60} y={552} zoom={1+ease(f,145,185)*.045-ease(f,295,350)*.045} shake={shake} t={t}>
        <Interactive.G name="Ruined stone courtyard"><Courtyard frame={f}/></Interactive.G>
        <GroundShadow x={hero.x} y={hero.y+5}/><GroundShadow x={mage.x} y={mage.y+5}/>
        <Interactive.G name="Enemy mage and casting">
          {mageArt}
          <CastEffect frame={f} event={fireCast} point={staffPoint(f)}/>
          {f<420&&<CastEffect frame={f} event={secondCast} point={staffPoint(f)} cancelAt={420}/>}
        </Interactive.G>
        <Interactive.G name="Ren and physical scroll">
          {f<300&&ren}
        </Interactive.G>
        <Interactive.G name="Pillar cover and heat"><CoverPillar/><PillarImpact frame={f}/></Interactive.G>
        <Interactive.G name="Finite water and steam"><UtilityWater frame={f} event={waterScroll}/><Steam frame={f}/></Interactive.G>
        <Interactive.G name="Physical counterattack">{f>=300&&ren}</Interactive.G>
        <Interactive.G name="Projectile and defensive barrier"><FireProjectile frame={f}/><MagicShield frame={f} event={shieldCast} center={[barrierContact[0]+27,barrierContact[1]]} impact={magicCues.shield}/><Sparks age={f-375} point={barrierContact}/><Sparks age={f-420} point={disarmContact()} seed={8}/></Interactive.G>
        <Interactive.G name="Spent scroll and disarmed staff">
          {f>=283&&<g transform={`translate(${mix(scrollOrigin[0],962,scrollDrop)} ${mix(scrollOrigin[1],925,scrollDrop)-Math.sin(scrollDrop*Math.PI)*30}) scale(1 ${mix(1,.3,scrollDrop)}) rotate(${scrollDrop*100}) scale(1.6)`} opacity={1-ease(f,465,539)*.72}><EnchantedScroll frame={f} event={waterScroll} ground/></g>}
          {!staffHeld&&<g transform={`translate(${mix(staffOrigin[0],1450,drop)} ${mix(staffOrigin[1],935,drop)-Math.sin(drop*Math.PI)*110}) rotate(${mix(staffAngle,85,drop)}) scale(2.05)`}><Staff/></g>}
          <Dust age={f-445} point={[1450,935]} strength={.45}/>
        </Interactive.G>
        <Particles t={t*.4} count={25} color="#c0cdc1" strength={.16}/>
        <Interactive.G name="Courtyard foreground"><Courtyard frame={f} foreground/></Interactive.G>
      </Camera><Finish/><rect width="1920" height="1080" fill="#0b1c29" opacity={1-ease(f,0,12)}/>
    </svg>
  </AbsoluteFill>;
};
