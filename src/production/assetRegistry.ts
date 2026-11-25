export type ApprovalStatus = 'approved' | 'provisional';
export type AudioCategory = 'narration' | 'dialogue' | 'sfx' | 'ambience' | 'bgm';
export type AssetCategory = AudioCategory | 'character-art' | 'rig' | 'expression' |
  'animation' | 'background' | 'prop' | 'vfx';
export type AssetEntry = {
  readonly category: AssetCategory;
  readonly version: string;
  readonly status: ApprovalStatus;
  readonly source:
    | {readonly kind: 'file'; readonly path: string} // Relative to public/, never a URL.
    | {readonly kind: 'component'; readonly reference: string} // Source path#export; not dynamic code.
    | {readonly kind: 'planned'; readonly note: string};
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
};

/** Keys are unique asset IDs. Availability does not imply canonical design approval. */
export const assetRegistry = {
  'sheet.asakura-yuu': {category:'character-art',version:'1.0.0',status:'approved',source:{kind:'file',path:'assets/characters/chapter-01-starter-v1/asakura-yuu.png'},metadata:{role:'source-sheet',approvalScope:'Chapter 1 starter',sha256:'156d93ed3d4ebd97f9bf6f8ccb505ddf7aeda13ca4ee5d1e8b77e57611b4664b'}},
  'sheet.tachibana-kairyu': {category:'character-art',version:'1.0.0',status:'approved',source:{kind:'file',path:'assets/characters/chapter-01-starter-v1/tachibana-kairyu.png'},metadata:{role:'source-sheet',approvalScope:'Chapter 1 starter',sha256:'51e129edca9c05be81a5258a41de5f013300f9b60ecd581b8651a8d148535094'}},
  'sheet.minase-shiori': {category:'character-art',version:'1.0.0',status:'approved',source:{kind:'file',path:'assets/characters/chapter-01-starter-v1/minase-shiori.png'},metadata:{role:'source-sheet',approvalScope:'Chapter 1 starter',sha256:'a031bb4be9f6e6b11549ab2378cf24caa29a13e0a1f1051a4bcf9a82e18bc115'}},
  'art.starter-yuu': {category:'character-art',version:'1.0.0',status:'approved',source:{kind:'component',reference:'src/visual/starterSheets.ts#starterAppearances'},metadata:{character:'asakura-yuu',reference:'sheet.asakura-yuu',approvalScope:'Starter-sheet technical interpretation'}},
  'art.starter-kairyu': {category:'character-art',version:'1.0.0',status:'approved',source:{kind:'component',reference:'src/visual/starterSheets.ts#starterAppearances'},metadata:{character:'tachibana-kairyu',reference:'sheet.tachibana-kairyu',approvalScope:'Starter-sheet technical interpretation'}},
  'art.starter-shiori': {category:'character-art',version:'1.0.0',status:'approved',source:{kind:'component',reference:'src/visual/starterSheets.ts#starterAppearances'},metadata:{character:'minase-shiori',reference:'sheet.minase-shiori',approvalScope:'Starter-sheet technical interpretation'}},
  'rig.starter-yuu': {category:'rig',version:'1.0.0',status:'provisional',source:{kind:'component',reference:'src/visual/starterSheets.ts#starterAppearances'},metadata:{character:'asakura-yuu'}},
  'rig.starter-kairyu': {category:'rig',version:'1.0.0',status:'provisional',source:{kind:'component',reference:'src/visual/starterSheets.ts#starterAppearances'},metadata:{character:'tachibana-kairyu'}},
  'rig.starter-shiori': {category:'rig',version:'1.0.0',status:'provisional',source:{kind:'component',reference:'src/visual/starterSheets.ts#starterAppearances'},metadata:{character:'minase-shiori'}},
  'art.layered-students': {category: 'character-art', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/visual/provisionalArtwork.ts#provisionalAppearances'}},
  'rig.layered-human': {category: 'rig', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/visual/rig.ts#provisionalRig'}},
  'art.provisional-jacket-svg': {category: 'character-art', version: '1.0.0', status: 'provisional', source: {kind: 'file', path: 'assets/characters/provisional-v1/yuu-jacket.svg'}},
  'art.provisional-hair-webp': {category: 'character-art', version: '1.0.0', status: 'provisional', source: {kind: 'file', path: 'assets/characters/provisional-v1/yuu-hair.webp'}},
  'art.provisional-eye-png': {category: 'character-art', version: '1.0.0', status: 'provisional', source: {kind: 'file', path: 'assets/characters/provisional-v1/eye-white.png'}},
  'art.student-cast': {category: 'character-art', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/components/Character.tsx#cast'}},
  'rig.human-cutout': {category: 'rig', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/components/Character.tsx#Character'}},
  'rig.goblin-cutout': {category: 'rig', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/combat/Goblin.tsx#Goblin'}},
  'expression.human': {category: 'expression', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/components/faceRig.ts#expressionPresets'}},
  'motion.idle': {category: 'animation', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/components/characterMotion.ts#idleMotion'}},
  'motion.walk': {category: 'animation', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/components/characterMotion.ts#walkMotion'}},
  'motion.talk': {category: 'animation', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/components/characterMotion.ts#talkMotion'}},
  'background.bus': {category: 'background', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/components/Bus.tsx#BusInterior'}},
  'background.hall': {category: 'background', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/components/Background.tsx#Hall'}},
  'background.forest': {category: 'background', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/combat/Forest.tsx#Forest'}},
  'background.courtyard': {category: 'background', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/magic/Courtyard.tsx#Courtyard'}},
  'prop.scroll': {category: 'prop', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/magic/Scroll.tsx#EnchantedScroll'}},
  'vfx.particles': {category: 'vfx', version: '1.0.0', status: 'provisional', source: {kind: 'component', reference: 'src/components/Atmosphere.tsx#Particles'}},
  'audio.prototype-score': {category: 'bgm', version: '1.0.0', status: 'provisional', source: {kind: 'file', path: 'audio/isekai-score.wav'}, metadata: {containsAmbience: true, prototypeOnly: true}},
} as const satisfies Record<string, AssetEntry>;

export type AssetId = keyof typeof assetRegistry;
export type AssetIdOf<C extends AssetCategory> = {
  [K in AssetId]: (typeof assetRegistry)[K]['category'] extends C ? K : never
}[AssetId];

export type AssetPin<Id extends AssetId = AssetId> = {readonly id:Id; readonly version:string};
export const assertAssetPin = (pin:{readonly id:AssetId;readonly version:string}):void => {
  if(getAsset(pin.id).version!==pin.version) throw new Error(`Asset version mismatch: ${pin.id}@${pin.version}`);
};

export const getAsset = (id: AssetId): AssetEntry => {
  if (!Object.hasOwn(assetRegistry, id)) throw new Error(`Unknown asset: ${id}`);
  return assetRegistry[id];
};

export const isPublicAssetPath = (path: string): boolean =>
  path.length > 0 && !/[\\:?#\x00]/.test(path) &&
  path.split('/').every(part => part !== '' && part !== '.' && part !== '..');

export const audioAssetPath = (id: AssetIdOf<AudioCategory>): string => {
  const asset = getAsset(id);
  if (!['narration', 'dialogue', 'sfx', 'ambience', 'bgm'].includes(asset.category) ||
      asset.source.kind !== 'file' || !isPublicAssetPath(asset.source.path)) {
    throw new Error(`Audio cue requires a local file-backed audio asset: ${id}`);
  }
  return asset.source.path;
};
