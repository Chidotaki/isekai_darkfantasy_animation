/** Story permissions are separate from the visuals. Ren has no direct-casting role. */
export const spellConfigs = {
  fireProjectile:{source:'direct',color:'#ffad58',prepare:60,travel:24,radius:18},
  magicShield:{source:'direct',color:'#a4cddd',radius:127},
  createWater:{source:'scroll',color:'#a8e5dc',duration:38,liters:1.5,offensive:false,charges:1},
} as const;
export type DirectSpell='fireProjectile'|'magicShield';
export type Caster={id:'enemy-mage';capability:'spellcaster'};
export const enemyCaster:Caster={id:'enemy-mage',capability:'spellcaster'};
export type DirectCast={kind:'direct';caster:Caster;spell:DirectSpell;start:number;release:number};
export type ScrollActivation={kind:'scroll';user:'ren';spell:'createWater';scrollId:string;retrieve:number;unroll:number;activate:number;spent:number};
export const fireCast:DirectCast={kind:'direct',caster:enemyCaster,spell:'fireProjectile',start:34,release:34+spellConfigs.fireProjectile.prepare};
export const shieldCast:DirectCast={kind:'direct',caster:enemyCaster,spell:'magicShield',start:352,release:367};
export const secondCast:DirectCast={kind:'direct',caster:enemyCaster,spell:'fireProjectile',start:395,release:437};
export const waterScroll:ScrollActivation={kind:'scroll',user:'ren',spell:'createWater',scrollId:'ren-only-water-scroll',retrieve:162,unroll:184,activate:220,spent:258};
export const canDirectCast=(actor:string,spell:string)=>actor===enemyCaster.id&&(spell==='fireProjectile'||spell==='magicShield');
export const scrollState=(frame:number,event:ScrollActivation)=>frame<event.retrieve?'stored':frame<event.activate?'ready':frame<event.spent?'active':'spent';
