import {cast} from '../components/Character';
import type {CastId} from '../components/Character';
import {expressionPresets, mouthShapes, type MouthShape} from '../components/faceRig';
import {visualFace} from './performance';
import {provisionalRig} from './rig';
import {prepareAppearance} from './assets';
import {visualTokens as tokens} from './style';
import type {CharacterAppearance, CharacterLayer, LayerSource, Shape, VisualExpression} from './types';

// Original project geometry, split into exportable artwork. All palettes/silhouettes remain provisional.
const path=(d:string,fill:string,extra:Shape['props']={}):Shape=>({tag:'path',props:{d,fill,stroke:tokens.outline,strokeWidth:tokens.outlineWidth,strokeLinejoin:'round',...extra}});
const ellipse=(cx:number,cy:number,rx:number,ry:number,fill:string,extra:Shape['props']={}):Shape=>({tag:'ellipse',props:{cx,cy,rx,ry,fill,...extra}});
const vector=(box:readonly[number,number,number,number],...shapes:Shape[]):LayerSource=>({kind:'vector',viewBox:box,shapes});
const hairPaths=[
  'M-33-191Q-40-213-29-224L-32-230-14-231Q0-244 12-235L23-239Q38-226 35-205L29-189 19-211 10-200 9-221Q0-207-10-202L-9-218-23-205-25-188Z',
  'M-32-200Q-39-215-29-226L-16-225-12-236 0-231 18-236Q39-224 33-205L28-196 17-215Q-1-211-17-214Z',
  'M-32-185Q-42-223-18-232Q19-243 34-219L34-183 23-207 12-213 3-206-9-221Q-23-211-26-184Z',
  'M-33-205Q-44-212-32-223Q-34-235-19-232Q-10-245 0-235Q13-245 22-233Q40-231 32-219Q43-208 31-199L23-210 10-207-1-216-16-210Z',
  'M-32-200Q-37-231-6-235Q25-241 34-216L31-194 18-213 4-205-7-221Q-19-208-29-202Z',
];
const segment=(length:number,width:number,end:number,color:string)=>vector([-width/2-2,-7,width+4,length+16],
  path(`M${-width/2} 0Q0-10 ${width/2} 0L${end/2} ${length}Q0 ${length+end*.32} ${-end/2} ${length}Z`,color),
  path(`M${-width*.23} 2L${-end*.23} ${length-2}`,'none',{stroke:'#fff2ca',strokeOpacity:.08,strokeWidth:width*.24}));
const mouthArt=(width:number,open:number,curve:number,teeth=0)=>vector([-12,-10,24,24],open>.2
  ?path(`M${-width} 0Q0 ${curve-open*.9} ${width} 0Q${width*.8} ${open+curve} 0 ${open+curve*.6}Q${-width*.8} ${open+curve} ${-width} 0Z`,'#704950',{stroke:'#533b43',strokeWidth:1})
  :path(`M${-width} 0Q0 ${curve} ${width} 0`,'none',{stroke:'#80594f',strokeWidth:1.8,strokeLinecap:'round'}),
  ...(teeth>.05?[path(`M${-width*.57} .3Q0 .5 ${width*.57} .3`,'none',{stroke:'#f3e3d0',strokeWidth:1.2+teeth*.7,strokeLinecap:'round'})]:[]));

export const provisionalAppearance = (alias:CastId,files=true):CharacterAppearance => {
  const c=cast[alias],layers:CharacterLayer[]=[];
  const add=(id:string,bone:CharacterLayer['bone'],order:number,source:LayerSource,offset:readonly[number,number],size:readonly[number,number],extra:Partial<CharacterLayer>={})=>layers.push({id,bone,order,source,offset,size,...extra});
  const r=provisionalRig;
  for(const [i,suffix] of (['L','R'] as const).entries()){
    add(`thigh-${suffix}`,`thigh${suffix}`,10+i,segment(r.thigh,28,23,c.pants),[-16,-7],[32,r.thigh+16]);
    add(`shin-${suffix}`,`shin${suffix}`,12+i,segment(r.shin,23,17,c.pants),[-13.5,-7],[27,r.shin+16]);
    add(`shoe-${suffix}`,`foot${suffix}`,14+i,vector([-14,-12,39,25],path('M-9-8L8-8 10-1Q21 0 22 6Q8 11-11 7L-11-1Z','#192936'),path('M-10 6Q7 10 21 6','none',{stroke:'#657179',strokeWidth:2.6}),path('M0-5L7-4M1-1L8 0','none',{stroke:'#96a09c',strokeWidth:1.5})),[-14,-12],[39,25]);
    add(`sleeve-${suffix}`,`upperArm${suffix}`,i===0?20:46,segment(r.upperArm,25,21,c.coat),[-14.5,-7],[29,r.upperArm+16]);
    add(`cuff-${suffix}`,`forearm${suffix}`,i===0?21:47,segment(r.forearm,21,14,c.coat),[-12.5,-7],[25,r.forearm+16]);
    add(`hand-${suffix}`,`hand${suffix}`,i===0?22:48,vector([-12,-12,28,28],path('M-6-5Q0-8 6-4L8 3Q6 9 0 9L-6 6Q-9 0-6-5Z',c.skin,{strokeWidth:2}),path('M-3 1L2 3','none',{stroke:'#8b665c',strokeWidth:1.2})),[-12,-12],[28,28]);
  }
  add('hips','hips',18,vector([-35,-105,70,40],path('M-27-98Q0-103 27-98L28-73Q15-67 0-74Q-15-67-28-73Z',c.pants)),[-35,-105],[70,40]);
  const torso=vector([-38,-170,76,96],
    path('M-27-155Q0-165 27-155L34-141 29-113 33-82Q17-76 1-81Q-15-76-33-82L-29-113-34-141Z',c.coat,{strokeWidth:2.8}),
    path('M-16-154L0-126 16-154','#e7ddc9',{strokeWidth:1.4}),
    path('M-16-155L-23-138-13-129-21-121-6-104 0-127M16-155L23-138 13-129 21-121 6-104','none',{strokeOpacity:.65,strokeWidth:2}),
    path('M1-126V-83','none',{stroke:alias==='ren'?'#86b8ba':'#7f806e',strokeWidth:2}),
    path('M-24-101L-10-99M12-99L26-101','none',{strokeWidth:3,strokeLinecap:'round'}),
    ...[112,102,91].map(v=>ellipse(5,-v,1.4,1.4,c.trim)),
    ...(alias!=='ren'?[path('M-3-149H3L5-129 0-123-5-129Z',c.trim,{strokeWidth:1})]:[]),
    ...(alias==='elias'?[path('M19-140h12v13l-6 5-6-5Z','#bd8c49',{stroke:'none'}),path('M25-137v10m-3-7h6','none',{stroke:'#fff0bb',strokeWidth:1.4})]:[]));
  add('jacket','torso',30,files&&alias==='ren'?{kind:'file',path:'assets/characters/provisional-v1/yuu-jacket.svg',format:'svg'}:torso,[-38,-170],[76,96]);
  add('cel-shadow','torso',31,vector([-38,-170,76,96],path('M-27-150L-22-123-24-85-32-84-29-114-32-140Z',tokens.shadow,{stroke:'none'})),[-38,-170],[76,96],{role:'shadow',opacity:tokens.shadowOpacity});
  add('cel-highlight','torso',32,vector([-38,-170,76,96],path('M7-151L25-151 29-140 22-116 24-88 7-88Z',tokens.highlight,{stroke:'none'})),[-38,-170],[76,96],{role:'highlight',opacity:tokens.highlightOpacity});
  if(c.style===2||c.style===4)add('back-hair','backHair',25,vector([-50,-245,105,103],path(c.style===2?'M-32-211Q-43-180-32-157L33-157Q43-189 28-215Z':'M20-212Q55-221 51-186Q49-161 36-149L31-179Z',c.hair)),[-50,-83],[105,103]);
  add('neck','head',40,vector([-15,-180,30,32],path('M-10-176V-153Q0-148 10-153V-176',c.skin,{strokeWidth:2.4}),path('M-9-169Q0-162 9-169V-161Q0-157-9-161Z','#855646',{stroke:'none',opacity:.18})),[-15,-18],[30,32]);
  add('head','head',41,vector([-44,-240,88,80],
    ellipse(-32,-192,6,9,c.skin,{stroke:tokens.outline,strokeWidth:2}),ellipse(32,-192,6,9,c.skin,{stroke:tokens.outline,strokeWidth:2}),
    path('M-32-207Q-34-230 0-232Q34-230 33-206L31-187Q27-169 5-165Q-15-164-28-181Z',c.skin,{strokeWidth:2.8}),
    path('M-30-208Q-30-221-17-224L-22-196Q-22-178-3-167Q-22-169-29-185Z','#825c52',{stroke:'none',opacity:.12}),
    path('M1-190L-1-184 3-183','none',{stroke:'#987266',strokeOpacity:.55,strokeWidth:1.6}),
    ellipse(-21,-182,5.5,2.4,'#ce8577',{opacity:.13}),ellipse(21,-182,5.5,2.4,'#ce8577',{opacity:.13})),[-44,-78],[88,80]);
  const eye=vector([-9,-9,18,18],path('M-7 0Q-5-10 0-6Q5-6 7 0Q5 7.5 0 5Q-5 5-7 0Z','#f7eddb',{stroke:'none'}));
  for(const suffix of ['L','R'] as const){
    add(`eye-white-${suffix}`,`eye${suffix}`,50,files?{kind:'file',path:'assets/characters/provisional-v1/eye-white.png',format:'png'}:eye,[-9,-9],[18,18]);
    add(`pupil-${suffix}`,`eye${suffix}`,51,vector([-7,-7,14,14],ellipse(0,0,3.9,5.3,'#34464c'),ellipse(0,.5,2.4,4,'#152534'),ellipse(1.1,-2.1,1.25,1.25,'#fff9e7')),[-7,-7],[14,14],{motion:'pupil',clip:{rx:6.4,ry:5.2}});
    add(`lid-${suffix}`,`eye${suffix}`,52,vector([-9,-9,18,18],path('M-7 0Q-5-10 0-6Q5-6 7 0','none',{stroke:'#253342',strokeWidth:2,strokeLinecap:'round'})),[-9,-9],[18,18]);
    add(`brow-${suffix}`,`brow${suffix}`,53,vector([-9,-5,18,10],path('M-6 0Q0-1.3 6 0','none',{stroke:c.hair,strokeWidth:2.8,strokeLinecap:'round'})),[-9,-5],[18,10]);
  }
  const expressions:Partial<Record<VisualExpression,LayerSource>>={};
  for(const expression of [...Object.keys(expressionPresets),'quiet','asleep','fear'] as VisualExpression[]){const f=visualFace(expression);expressions[expression]=mouthArt(f.mouthWidth,f.mouthOpen,f.mouthCurve,f.teeth);}
  const mouths=Object.fromEntries(Object.entries(mouthShapes).map(([id,m])=>[id,mouthArt(m.mouthWidth,m.mouthOpen,.3,m.teeth)])) as Record<MouthShape,LayerSource>;
  add('mouth','mouth',54,mouthArt(6,0,1),[-12,-10],[24,24],{expressions,mouths});
  const hair=vector([-44,-248,88,72],path(hairPaths[c.style],c.hair,{strokeWidth:2.6}),path(c.style===0?'M-25-220Q-12-234 2-230M10-228L22-223M-24-207L-16-216':'M-25-220Q-8-231 13-225','none',{stroke:'#fff4d2',strokeOpacity:.14,strokeWidth:3,strokeLinecap:'round'}));
  add('front-hair','frontHair',60,files&&alias==='ren'?{kind:'file',path:'assets/characters/provisional-v1/yuu-hair.webp',format:'webp'}:hair,[-44,-86],[88,72]);
  if(alias==='ren'){
    add('scarf-tail','scarf',65,vector([5,-155,27,52],path('M9-151Q24-150 25-137L22-108 10-113 12-137Z','#438e9b',{strokeWidth:1.5}),path('M16-139L16-116','none',{stroke:'#97d0c9',strokeOpacity:.35,strokeWidth:2})),[5,-155],[27,52]);
    add('scarf-collar','torso',66,vector([-26,-166,54,36],path('M-20-160Q0-148 22-160L23-148Q1-135-22-148Z',c.trim,{strokeWidth:1.8}),path('M-15-151Q0-144 16-151','none',{stroke:'#afe0d2',strokeOpacity:.45,strokeWidth:2})),[-26,-166],[54,36]);
    add('silver-bracelet','forearmR',49,vector([-10,24,20,12],ellipse(0,30,7,2,'none',{stroke:'#b9c5c8',strokeWidth:2}),path('M-5 30Q0 33 5 30','none',{stroke:'#edf0e7',strokeWidth:.7})),[-10,24],[20,12]);
  }
  return prepareAppearance({id:`provisional-${alias}`,version:'1.0.0',status:'provisional',provenance:'Original project Character.tsx and CharacterFace.tsx geometry; not a production master sheet.',rig:r,costumes:['student'],layers});
};

export const provisionalAppearances = {
  ren:provisionalAppearance('ren'),elias:provisionalAppearance('elias'),mira:provisionalAppearance('mira'),
  toma:provisionalAppearance('toma'),lina:provisionalAppearance('lina'),
};
