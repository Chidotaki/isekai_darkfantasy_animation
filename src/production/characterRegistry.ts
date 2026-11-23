import type {CastId, CharacterProps} from '../components/Character';
import type {Expression} from '../components/faceRig';
import type {ApprovalStatus, AssetIdOf} from './assetRegistry';

export type CharacterEntry = {
  readonly displayName: string;
  readonly japaneseName?: string;
  readonly assetAlias: CastId;
  readonly rig: AssetIdOf<'rig'>;
  readonly artwork: AssetIdOf<'character-art'>;
  readonly assetVersion: string;
  readonly status: ApprovalStatus; // Story identity approval, separate from artwork status.
  readonly costumes?: readonly NonNullable<CharacterProps['costume']>[];
  readonly expressions?: readonly Expression[];
};

const humanAsset = {
  rig: 'rig.human-cutout', artwork: 'art.student-cast', assetVersion: '1.0.0',
  costumes: ['student'],
} as const;

export const characterRegistry = {
  'asakura-yuu': {...humanAsset, displayName: 'Asakura Yuu', japaneseName: '朝倉 悠', assetAlias: 'ren', status: 'approved'},
  'tachibana-kairyu': {...humanAsset, displayName: 'Tachibana Kairyū', japaneseName: '橘 海龍', assetAlias: 'elias', status: 'approved'},
  'minase-shiori': {...humanAsset, displayName: 'Minase Shiori', japaneseName: '水瀬 栞', assetAlias: 'mira', status: 'approved'},
  'prototype-toma': {...humanAsset, displayName: 'Toma (prototype)', assetAlias: 'toma', status: 'provisional'},
  'prototype-lina': {...humanAsset, displayName: 'Lina (prototype)', assetAlias: 'lina', status: 'provisional'},
} as const satisfies Record<string, CharacterEntry>;

export type CharacterId = keyof typeof characterRegistry;

/** Pass this alias to the existing Character; palettes and silhouettes stay untouched. */
export const characterAssetId = (id: CharacterId): CastId => {
  if (!Object.hasOwn(characterRegistry, id)) throw new Error(`Unknown character: ${id}`);
  return characterRegistry[id].assetAlias;
};
