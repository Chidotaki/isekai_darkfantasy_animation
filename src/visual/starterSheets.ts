import type {Point} from '../components/characterMotion';
import type {CombatPose} from '../combat/rig';
import {mouthShapes, type MouthShape} from '../components/faceRig';
import {prepareAppearance} from './assets';
import {inverse, solveRig} from './rig';
import {samplePerformance} from './performance';
import maskRuns from './starterMaskRuns';
import type {Bone, CharacterAppearance, CharacterLayer, CharacterPerformance, CharacterRig, LayerSource, VisualExpression} from './types';

export type StarterId='asakura-yuu'|'tachibana-kairyu'|'minase-shiori';
type Rect=readonly[number,number,number,number];
type Part=readonly [string,Bone,number,Rect,string];
type SheetDefinition={origin:Point;neck:Point;shoulders:readonly[Point,Point];hips:readonly[Point,Point];feet:readonly[Point,Point];
  upper:number;lower:number;leg:number;head:Rect;heads:readonly Rect[];skin:string;eyes:readonly[Point,Point];mouth:Point;parts:readonly Part[]};

/** Source pixels are never repainted or flattened. Masks isolate visible front-view artwork. */
export const starterSheetPaths:Record<StarterId,string>={
  'asakura-yuu':'assets/characters/chapter-01-starter-v1/asakura-yuu.png',
  'tachibana-kairyu':'assets/characters/chapter-01-starter-v1/tachibana-kairyu.png',
  'minase-shiori':'assets/characters/chapter-01-starter-v1/minase-shiori.png',
};
// Landmarks on each supplied portrait, in original source pixels. Turned faces have
// different eye positions; blink overlays must follow the selected drawing.
const portraitEyes:Record<StarterId,readonly (readonly [Point,Point])[]>={
  'asakura-yuu':[[[900,592],[934,592]],[[1023,592],[1055,592]],[[1147,593],[1181,593]],[[1263,589],[1296,586]]],
  'tachibana-kairyu':[[[866,663],[905,663]],[[997,664],[1036,664]],[[1128,663],[1168,663]],[[1262,665],[1300,666]]],
  'minase-shiori':[[[824,626],[866,626]],[[960,633],[1000,633]],[[1100,630],[1141,630]],[[1249,626],[1290,626]]],
};
const portraitLidColors:Record<StarterId,readonly (readonly [string,string])[]>={
  'asakura-yuu':[['#e9d7c4','#ebd8c9'],['#ebdbc8','#ebdac8'],['#e8d6c5','#eddccd'],['#ecdbcd','#e3d4c6']],
  'tachibana-kairyu':[['#f3c9a3','#f3c8a5'],['#f1c9a8','#f1c6a4'],['#f2c5a6','#f1c8a7'],['#f4caad','#f1c5a5']],
  'minase-shiori':[['#f8ded2','#fce1d5'],['#faddd0','#f8dacd'],['#faded2','#f8dbcd'],['#fadfd3','#fcddd1']],
};
export const starterDefinitions:Record<StarterId,SheetDefinition>={
  'asakura-yuu':{origin:[210,711],neck:[210,190],shoulders:[[149,286],[276,286]],hips:[[178,424],[242,424]],feet:[[169,669],[255,669]],upper:61,lower:51,leg:123,
    head:[161,79,99,114],heads:[[858,517,117,130],[978,517,118,130],[1101,518,117,130],[1227,517,120,130]],skin:'#e8d7c5',eyes:[[194,145.5],[224,145.5]],mouth:[210,170.5],parts:[
      ['thigh-L','thighL',10,[151,416,58,138],'M155 417L208 420 192 483 188 531 185 553 155 553 154 535 160 501Z'],
      ['thigh-R','thighR',10,[210,416,62,139],'M211 420L268 416 268 474 261 513 268 552 233 554 226 509 224 470Z'],
      ['shin-L','shinL',11,[149,535,44,100],'M155 536L189 536 188 563 183 612 188 627 153 633 150 612Z'],
      ['shin-R','shinR',11,[229,535,48,101],'M232 537L265 537 266 578 271 614 276 630 237 634 234 616Z'],
      ['boot-L','footL',12,[128,612,64,104],'M152 613L188 614 187 634 183 643 183 679 179 698Q149 719 130 712L129 705 143 688 156 675 156 642 149 632Z'],
      ['boot-R','footR',12,[230,610,64,106],'M234 613L273 611 275 631 266 644 268 677 282 695 293 706 291 712Q269 722 241 702L235 692 239 644 231 635Z'],
      ['upper-arm-L','upperArmL',20,[124,281,35,73],'M132 282L157 289 148 322 146 350 126 352 128 318Z'],
      ['forearm-L','forearmL',21,[119,341,29,66],'M128 342L147 343 140 370 137 392 140 400 122 407 120 398 125 370Z'],
      ['hand-L-bracelet','handL',22,[118,391,33,65],'M122 395L138 391 142 404 140 414 146 435 148 447 143 449 137 439 137 451 130 449 124 436 120 419Z'],
      ['upper-arm-R','upperArmR',20,[266,282,36,69],'M267 286L294 283 298 305 295 336 290 350 271 349Z'],
      ['forearm-R-bracer','forearmR',21,[268,337,34,68],'M270 347L298 337 299 390 301 399 279 403 275 386Z'],
      ['hand-R','handR',22,[270,393,31,62],'M279 395L299 395 298 416 296 438 284 450 278 452 279 441 283 433 280 422 278 435 273 439 272 434 276 410Z'],
      ['tunic','torso',30,[150,181,121,180],'M190 190L230 190 249 213 263 253 270 348 251 360 155 356 151 334 161 259 173 219Z'],
      ['belt-pouch-hem','hips',31,[148,337,125,96],'M155 339L261 337 267 353 273 388 270 421 249 428 226 423 208 429 180 424 150 421 149 400Z'],
      ['hood-cape','scarf',35,[117,183,188,126],'M182 189Q171 186 162 197L153 209Q137 208 132 224L118 286 136 297 153 298 154 290 181 306 189 247 207 228 232 234 238 304 267 300 271 289 286 300 303 289 284 235Q278 213 257 207L242 188 231 184 226 195 239 207 225 222 194 224 179 208 190 195Z'],
    ]},
  'tachibana-kairyu':{origin:[188,711],neck:[188,145],shoulders:[[113,214],[262,214]],hips:[[156,373],[219,373]],feet:[[135,668],[246,669]],upper:75,lower:79,leg:149,
    head:[133,29,109,126],heads:[[811,573,138,148],[946,574,135,148],[1080,574,134,148],[1213,574,132,148]],skin:'#f4c6a4',eyes:[[175,105],[203,105]],mouth:[192,130],parts:[
      ['cape-left','torso',3,[63,220,76,267],'M119 224L137 234 130 369 109 446 89 453 90 478Q65 460 64 432L82 366 95 291Z'],
      ['cape-right','torso',3,[247,219,69,267],'M251 220L274 239 286 308 312 424Q317 461 290 481L287 453 268 461 247 384Z'],
      ['thigh-L','thighL',10,[117,363,73,157],'M128 365L185 366 175 424 162 481 158 515 122 512 119 473Z'],
      ['thigh-R','thighR',10,[186,363,74,158],'M189 364L245 365 253 422 251 461 257 503 221 519 214 475 202 437Z'],
      ['shin-L','shinL',11,[110,478,59,196],'M139 479L157 502 159 522 166 537 151 597 148 650 136 669 112 658 115 593 119 553 112 530 120 510Z'],
      ['shin-R','shinR',11,[213,478,55,197],'M235 479L252 498 259 526 265 543 258 601 260 654 245 674 224 660 222 602 215 548 213 526Z'],
      ['boot-L','footL',12,[87,648,66,67],'M113 650L145 656 149 676 138 693 127 707Q101 717 88 709L88 700 102 678Z'],
      ['boot-R','footR',12,[225,649,64,67],'M226 657L259 649 264 677 284 698 286 708Q265 720 245 708L232 696Z'],
      ['upper-arm-L','upperArmL',20,[82,205,53,89],'M99 208L134 216 120 247 112 287 84 294 83 277 91 247Z'],
      ['upper-arm-R','upperArmR',20,[243,204,57,93],'M245 207L279 212 286 243 298 278 293 292 265 297 255 253Z'],
      ['bracer-L','forearmL',21,[73,280,44,95],'M85 280L111 289 116 305 100 368 75 374 73 365 76 317Z'],
      ['bracer-R','forearmR',21,[264,281,42,96],'M278 289L297 281 304 317 305 365 286 376 266 366 268 314Z'],
      ['glove-L','handL',22,[72,361,40,67],'M77 365L101 361 101 380 110 394 109 405 104 406 98 396 98 417 91 427 78 415 73 397Z'],
      ['glove-R','handR',22,[266,362,40,67],'M281 363L302 369 303 399 295 420 284 427 280 419 280 399 275 409 269 409 268 399 277 382Z'],
      ['cuirass','torso',30,[126,129,122,191],'M159 134L177 143 201 141 219 129 225 155 244 175 244 221 229 252 237 297 215 316 150 316 133 298 140 254 127 224 135 180 153 164Z'],
      ['belt-tassets','hips',31,[113,299,151,111],'M139 300L236 299 242 320 261 393 252 405 223 378 215 355 158 353 143 395 123 407 114 397 123 346Z'],
      ['pauldron-L','upperArmL',35,[89,141,57,106],'M131 143L139 159 144 184 138 206 127 220 118 239 90 245 92 230 97 222 90 215Q90 176 119 162Z'],
      ['pauldron-R','upperArmR',35,[230,143,61,103],'M243 144L251 163Q284 174 288 215L280 223 286 231 287 242 264 244 249 229 242 217 232 203 234 173Z'],
      ['sheathed-sword','hips',36,[218,266,79,296],'M245 270L250 267 257 274 252 288 259 315 267 321 266 327 255 328 280 467 296 554 290 562 280 550 272 512 245 369 238 347 225 348 219 341 222 335 237 331 239 311 235 299Z'],
    ]},
  'minase-shiori':{origin:[196,721],neck:[195,147],shoulders:[[129,220],[261,220]],hips:[[177,435],[211,435]],feet:[[174,675],[207,687]],upper:68,lower:63,leg:127,
    head:[141,37,108,137],heads:[[784,547,139,165],[925,548,135,165],[1067,547,139,166],[1208,547,139,166]],skin:'#fae8da',eyes:[[180,102],[210,102]],mouth:[192,128],parts:[
      ['rear-robe-L','hips',3,[54,217,97,383],'M125 219L147 235 126 359 106 464 82 542 87 578 113 591 97 598 72 573 65 547 78 511 63 489Q48 459 56 424L79 346 106 279Z'],
      ['rear-robe-R','hips',3,[239,218,100,381],'M241 223L267 220 286 280 308 359 335 437Q341 464 331 488L313 477 322 548 311 572 285 594 274 598 247 549Z'],
      ['thigh-L','thighL',10,[153,424,44,119],'M156 425L196 429 192 478 184 530 159 542 157 503Z'],
      ['thigh-R','thighR',10,[195,423,45,121],'M197 424L230 423 236 474 229 516 224 543 202 536 201 478Z'],
      ['shin-L','shinL',11,[148,520,43,163],'M159 521L184 523 185 559 179 615 184 646 174 681 158 679 155 657 161 619 149 551Z'],
      ['shin-R','shinR',11,[193,520,38,175],'M205 521L226 525 231 552 219 615 219 657 214 693 195 692 197 658 202 614 194 551Z'],
      ['boot-L','footL',12,[159,661,27,49],'M162 663L182 662 181 678 175 702Q165 710 160 702L160 696Z'],
      ['boot-R','footR',12,[184,676,40,50],'M195 678L216 677 216 701 221 713 215 722Q197 731 185 714L186 706Z'],
      ['upper-arm-L','upperArmL',20,[103,215,39,81],'M119 216L141 224 131 255 128 291 104 296 107 271Z'],
      ['upper-arm-R','upperArmR',20,[248,215,38,83],'M250 220L273 216 283 267 285 293 262 296Z'],
      ['sleeve-L','forearmL',21,[96,282,34,79],'M105 284L129 284 120 317 115 352 98 361 96 353Z'],
      ['sleeve-R','forearmR',21,[262,282,31,80],'M263 284L285 284 292 353 286 361 270 356 265 325Z'],
      ['hand-L','handL',22,[91,349,28,64],'M99 354L115 350 114 368 111 388 106 405 100 410 97 407 98 392 95 400 92 395 92 378Z'],
      ['hand-R','handR',22,[270,349,26,65],'M270 352L287 351 293 371 295 390 292 402 286 411 282 408 283 392 278 402 275 398 276 380Z'],
      ['bodice-collar','torso',30,[128,133,137,162],'M176 134L211 134 222 149 247 161 260 203 255 244 242 278 219 292 159 291 140 278 133 240 130 201 144 163 168 153Z'],
      ['embroidered-skirt','hips',31,[77,273,247,327],'M145 274L240 274 253 312 268 374 287 425 314 492 322 547 305 581 277 598 258 550 234 486 218 451 198 474 175 463 157 443 148 485 123 548 111 596 87 581 77 553 91 504 106 448 122 393 132 333Z'],
      ['cape-shoulder-L','upperArmL',35,[110,157,61,91],'M145 158L168 172 153 208 137 229 110 245 117 224 123 196 132 175Z'],
      ['cape-shoulder-R','upperArmR',35,[219,156,62,92],'M222 157L248 163 260 185 266 214 280 244 256 232 237 215 220 179Z'],
      ['hair-strands','head',38,[145,145,98,111],'M150 147L164 148 161 189 164 217 171 248 164 239 153 215 150 187ZM221 145L235 145 239 192 233 229 223 253 226 223 223 190Z'],
    ]},
};

const local=(p:Point,o:Point):Point=>[p[0]-o[0],p[1]-o[1]];
const headMask=([x,y,w,h]:Rect,id:StarterId)=>id==='asakura-yuu'
  // Retain the portrait's neck, but leave its hood to the body layer.
  ?`M${x} ${y}h${w}v${h*.86}H${x+w*.71}V${y+h}H${x+w*.35}V${y+h*.86}H${x}Z`
  :`M${x} ${y}h${w}v${h}h${-w}Z`;
const silhouetteCache=new Map<string,string>();
// Trace closed vector contours once. Unlike adjacent scanline rectangles, these do not
// introduce antialias seams through the face when the camera scales fractional pixels.
const silhouette=(id:StarterId,[x,y,w,h]:Rect,head=false)=>{
  const key=`${id}:${x},${y},${w},${h}:${head}`,cached=silhouetteCache.get(key);if(cached)return cached;
  const bits=new Uint8Array(w*h),edges=new Map<number,number[]>(),stride=w+1;
  for(let row=0;row<h;row++){const runs=maskRuns[id][row+y]??[];for(let n=0;n<runs.length;n+=2)for(let col=Math.max(x,runs[n]);col<Math.min(x+w,runs[n+1]);col++)bits[row*w+col-x]=1;}
  if(head){ // Exclude disconnected sheet guide marks and neighboring portrait fragments.
    const seen=new Uint8Array(bits.length);let largest:number[]=[];
    for(let start=0;start<bits.length;start++)if(bits[start]&&!seen[start]){
      const component=[start];seen[start]=1;
      for(let j=0;j<component.length;j++){const p=component[j],col=p%w,row=Math.floor(p/w);
        for(const n of [col?p-1:-1,col<w-1?p+1:-1,row?p-w:-1,row<h-1?p+w:-1])if(n>=0&&bits[n]&&!seen[n]){seen[n]=1;component.push(n);}
      }
      if(component.length>largest.length)largest=component;
    }
    bits.fill(0);largest.forEach(p=>bits[p]=1);
    // Trim one source pixel of paper-colored antialias fringe around the portrait.
    const filled=bits.slice();
    for(const p of largest){const col=p%w,row=Math.floor(p/w);
      if(col>0&&col<w-1&&row>0&&row<h-1&&[p-1,p+1,p-w,p+w].some(n=>!filled[n]))bits[p]=0;
    }
  }
  const inside=(a:number,b:number)=>a>=0&&a<w&&b>=0&&b<h&&bits[b*w+a]===1;
  const edge=(a:number,b:number)=>{const list=edges.get(a)??[];list.push(b);edges.set(a,list);};
  for(let row=0;row<h;row++)for(let col=0;col<w;col++)if(inside(col,row)){
    const a=row*stride+col,b=a+1,c=b+stride,d=a+stride;
    if(!inside(col,row-1))edge(a,b);if(!inside(col+1,row))edge(b,c);if(!inside(col,row+1))edge(c,d);if(!inside(col-1,row))edge(d,a);
  }
  const paths:string[]=[];
  while(edges.size){const start=edges.keys().next().value!;let at=start;const points:Point[]=[];
    do{points.push([at%stride,Math.floor(at/stride)]);const list=edges.get(at);if(!list?.length)break;const next=list.pop()!;if(!list.length)edges.delete(at);at=next;}while(at!==start);
    if(points.length<8)continue;
    const corners=points.filter((b,i)=>{const a=points[(i+points.length-1)%points.length],c=points[(i+1)%points.length];return (b[0]-a[0])*(c[1]-b[1])!==(b[1]-a[1])*(c[0]-b[0]);});
    paths.push(corners.map(([a,b],i)=>`${i?'L':'M'}${a+x} ${b+y}`).join('')+'Z');
  }
  const result=paths.join('');silhouetteCache.set(key,result);return result;
};
const sheet=(id:StarterId,rect:Rect,mask:string,head=false):LayerSource=>({kind:'file',path:starterSheetPaths[id],format:'png',region:{rect,mask,silhouette:silhouette(id,rect,head),sheetSize:[1376,768]}});
const faceIndex=(id:StarterId,e:VisualExpression)=>{
  if(id==='asakura-yuu')return ['determined','angry','frustrated'].includes(e)?1:['surprised','fear'].includes(e)?3:['exhausted','sad','worried','disappointed','asleep'].includes(e)?2:0;
  if(id==='tachibana-kairyu')return ['surprised','fear','worried'].includes(e)?2:['angry','frustrated'].includes(e)?3:['determined','exhausted','sad','restrained','disappointed'].includes(e)?1:0;
  return ['happy','amused','relieved'].includes(e)?3:['surprised','worried','fear'].includes(e)?2:['sad','exhausted','determined','restrained','disappointed'].includes(e)?1:0;
};
const expressionNames:VisualExpression[]=['neutral','happy','amused','sad','worried','surprised','confused','angry','frustrated','embarrassed','disappointed','relieved','suspicious','determined','restrained','exhausted','quiet','asleep','fear'];

const makeAppearance=(id:StarterId):CharacterAppearance=>{
  const d=starterDefinitions[id],o=d.origin;
  const rig:CharacterRig={id:`starter-${id}`,version:'1.0.0',torsoPivot:local([o[0],d.hips[0][1]-65],o),neck:local(d.neck,o),shoulders:d.shoulders.map(p=>local(p,o)) as unknown as readonly[Point,Point],
    hips:d.hips.map(p=>local(p,o)) as unknown as readonly[Point,Point],feet:d.feet.map(p=>local(p,o)) as unknown as readonly[Point,Point],upperArm:d.upper,forearm:d.lower,handOffset:16,thigh:d.leg,shin:d.leg,
    eyes:d.eyes.map(p=>local(p,d.neck)) as unknown as readonly[Point,Point],mouth:local(d.mouth,d.neck),hairPivot:[0,-80],scarfPivot:local(d.neck,o)};
  const base=samplePerformance(0,{rig,body:{pelvisX:0,pelvisY:0,torso:0,hips:0,head:0,backUpper:0,backLower:0,frontUpper:0,frontLower:0,wrist:0,width:1}});
  const bind=solveRig(rig,{...base,breath:0,secondary:0,headOffset:[0,0],face:{...base.face,headTilt:0}});
  const layers:CharacterLayer[]=d.parts.map(([name,bone,order,rect,mask])=>({id:name,bone,order,bind:inverse(bind[bone]),source:sheet(id,rect,mask),offset:local([rect[0],rect[1]],o),size:[rect[2],rect[3]]}));
  const expressions=Object.fromEntries(expressionNames.map(e=>{const r=d.heads[faceIndex(id,e)];return [e,sheet(id,r,headMask(r,id),true)];}));
  layers.push({id:'sheet-head-expressions',bone:'head',order:45,bind:inverse(bind.head),source:expressions.neutral,expressions,offset:local([d.head[0],d.head[1]],o),size:[d.head[2],d.head[3]]});
  // Minimal closed lids and talk mouths supplement the finite expression drawings on the sheets.
  // They use this character's landmarks/colors, not the old provisional face artwork.
  const shape=(tag:'path'|'ellipse'|'rect',props:Record<string,string|number>)=>({tag,props});
  for(const i of [0,1]){
    const lids=Object.fromEntries(expressionNames.map(e=>{
      const index=faceIndex(id,e),r=d.heads[index],eye=portraitEyes[id][index][i];
      const scale=Math.min(d.head[2]/r[2],d.head[3]/r[3]); // Match the image's SVG xMidYMid meet.
      const x=d.head[0]+(d.head[2]-r[2]*scale)/2+(eye[0]-r[0])*scale;
      const y=d.head[1]+(d.head[3]-r[3]*scale)/2+(eye[1]-r[1])*scale;
      const fill=portraitLidColors[id][index][i];
      const source:LayerSource={kind:'vector',viewBox:d.head,shapes:[
        // Nested translucent edges blend the technical lid into the painted complexion.
        ...[0,1,2,3].map(n=>shape('ellipse',{cx:x,cy:y,rx:10-n*.5,ry:5.6-n*.5,fill,opacity:[.18,.3,.6,1][n]})),
        shape('path',{d:`M${x-7} ${y}Q${x} ${y+2} ${x+7} ${y}`,fill:'none',stroke:'#342f30',strokeWidth:.85}),
      ]};return [e,source];
    }));
    layers.push({id:`closed-lid-${i}`,bone:'head',order:47,bind:inverse(bind.head),motion:'blink',offset:local([d.head[0],d.head[1]],o),size:[d.head[2],d.head[3]],source:lids.neutral,expressions:lids});
  }
  const mouthScale=id==='tachibana-kairyu'?1.1:.8;
  const mouths=Object.fromEntries(Object.entries(mouthShapes).map(([key,m])=>[key,{kind:'vector',viewBox:[-14,-7,28,14],shapes:[
    shape('ellipse',{cx:0,cy:0,rx:13,ry:6,fill:d.skin}),
    m.mouthOpen>1?shape('ellipse',{cx:0,cy:0,rx:m.mouthWidth*mouthScale,ry:m.mouthOpen*.45,fill:'#664b49',stroke:'#513e3c',strokeWidth:.65}):shape('path',{d:'M-6 0Q0 .8 6 0',fill:'none',stroke:'#705750',strokeWidth:.8}),
  ]}])) as unknown as Record<MouthShape,LayerSource>;
  const smile:LayerSource={kind:'vector',viewBox:[-14,-7,28,14],shapes:[shape('ellipse',{cx:0,cy:0,rx:11,ry:5,fill:d.skin}),shape('path',{d:'M-6 0Q0 1.7 6-.4',fill:'none',stroke:'#705750',strokeWidth:.8})]};
  layers.push({id:'talk-mouth',bone:'head',order:48,bind:inverse(bind.head),motion:'speech',offset:local([d.mouth[0]-14,d.mouth[1]-7],o),size:[28,14],source:mouths.rest,mouths,
    ...(id==='asakura-yuu'?{expressionOpacity:{happy:1,amused:.8,relieved:.6},expressions:{happy:smile,amused:smile,relieved:smile}}:{})});
  return prepareAppearance({id:`chapter-01-${id}`,version:'1.0.0',status:'approved',provenance:`User-approved Chapter 1 starter sheet: ${starterSheetPaths[id]}. Original pixels with technical masks; not an expanded production master.`,rig,costumes:['chapter-01'],layers});
};
export const starterAppearances:Record<StarterId,CharacterAppearance>={
  'asakura-yuu':makeAppearance('asakura-yuu'),'tachibana-kairyu':makeAppearance('tachibana-kairyu'),'minase-shiori':makeAppearance('minase-shiori'),
};

/** Restrained motion for single-view artwork; no invented hidden costume surfaces or extreme turns. */
export const sampleStarterPerformance=(id:StarterId,frame:number,options:{fps?:number;expression?:VisualExpression;nextExpression?:VisualExpression;expressionMix?:number;talk?:boolean;gesture?:number;posture?:number;blink?:number}={}):CharacterPerformance=>{
  const p=samplePerformance(frame,{fps:options.fps,rig:starterAppearances[id].rig,seed:id==='asakura-yuu'?.4:id==='tachibana-kairyu'?2:4,pose:options.talk?'talk':'idle',expression:options.expression,nextExpression:options.nextExpression,expressionMix:options.expressionMix});
  const t=frame/(options.fps??30),g=options.gesture??0,s=options.posture??0;
  const body:CombatPose={...p.body,pelvisX:Math.sin(t*.7)*.65+s*2,pelvisY:s*3,torso:p.body.torso*.25+s*.5,head:p.body.head*.45,
    backUpper:Math.sin(t*.9)*.35,backLower:Math.sin(t*.9-.3)*.4,frontUpper:g*5,frontLower:g*15,wrist:g*-3};
  return {...p,body,breath:p.breath*.35,secondary:p.secondary*.12,headOffset:[p.headOffset[0],p.headOffset[1]*.3],face:{...p.face,headTilt:p.face.headTilt*.3,blink:Math.max(p.face.blink,options.blink??0)}};
};
