import type {CastId} from '../components/Character';
import type {Expression} from '../components/faceRig';
import type {ApprovalStatus, AssetIdOf, AssetPin} from './assetRegistry';

export type CharacterEntry = {
  readonly displayName: string;
  readonly japaneseName?: string;
  readonly assetAlias: CastId;
  readonly rig: AssetIdOf<'rig'>;
  readonly artwork: AssetIdOf<'character-art'>;
  readonly assetVersion: string;
  readonly status: ApprovalStatus; // Story identity approval, separate from artwork status.
  readonly costumes?: readonly string[];
  readonly starterReference?: AssetPin<AssetIdOf<'character-art'>>;
  readonly expressions?: readonly Expression[];
  readonly layeredAppearance?: AssetPin<AssetIdOf<'character-art'>>;
  readonly layeredRig?: AssetPin<AssetIdOf<'rig'>>;
};

const humanAsset = {
  rig: 'rig.human-cutout', artwork: 'art.student-cast', assetVersion: '1.0.0',
  costumes: ['student'],
  layeredAppearance: {id:'art.layered-students',version:'1.0.0'},
  layeredRig: {id:'rig.layered-human',version:'1.0.0'},
} as const;

export const characterRegistry = {
  'asakura-yuu': {...humanAsset, displayName: 'Asakura Yuu', japaneseName: '朝倉 悠', assetAlias: 'ren', status: 'approved',artwork:'art.starter-yuu',rig:'rig.starter-yuu',costumes:['chapter-01'],starterReference:{id:'sheet.asakura-yuu',version:'1.0.0'},layeredAppearance:{id:'art.starter-yuu',version:'1.0.0'},layeredRig:{id:'rig.starter-yuu',version:'1.0.0'}},
  'tachibana-kairyu': {...humanAsset, displayName: 'Tachibana Kairyū', japaneseName: '橘 海龍', assetAlias: 'elias', status: 'approved',artwork:'art.starter-kairyu',rig:'rig.starter-kairyu',costumes:['chapter-01'],starterReference:{id:'sheet.tachibana-kairyu',version:'1.0.0'},layeredAppearance:{id:'art.starter-kairyu',version:'1.0.0'},layeredRig:{id:'rig.starter-kairyu',version:'1.0.0'}},
  'minase-shiori': {...humanAsset, displayName: 'Minase Shiori', japaneseName: '水瀬 栞', assetAlias: 'mira', status: 'approved',artwork:'art.starter-shiori',rig:'rig.starter-shiori',costumes:['chapter-01'],starterReference:{id:'sheet.minase-shiori',version:'1.0.0'},layeredAppearance:{id:'art.starter-shiori',version:'1.0.0'},layeredRig:{id:'rig.starter-shiori',version:'1.0.0'}},
  'prototype-toma': {...humanAsset, displayName: 'Toma (prototype)', assetAlias: 'toma', status: 'provisional'},
  'prototype-lina': {...humanAsset, displayName: 'Lina (prototype)', assetAlias: 'lina', status: 'provisional'},
} as const satisfies Record<string, CharacterEntry>;

export type CharacterId = keyof typeof characterRegistry;

/** Pass this alias to the existing Character; palettes and silhouettes stay untouched. */
export const characterAssetId = (id: CharacterId): CastId => {
  if (!Object.hasOwn(characterRegistry, id)) throw new Error(`Unknown character: ${id}`);
  return characterRegistry[id].assetAlias;
};
