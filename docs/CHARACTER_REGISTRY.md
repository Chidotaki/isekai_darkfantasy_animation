# Character identities and prototype assets

`src/production/characterRegistry.ts` separates stable story IDs from the legacy IDs expected by `Character.tsx`. `CharacterId` is derived from registry keys; episode modules do not maintain their own character unions.

| Stable ID | Canonical display name | Japanese | Existing art alias | Identity status |
| --- | --- | --- | --- | --- |
| `asakura-yuu` | Asakura Yuu | 朝倉 悠 | `ren` | approved |
| `tachibana-kairyu` | Tachibana Kairyū | 橘 海龍 | `elias` | approved |
| `minase-shiori` | Minase Shiori | 水瀬 栞 | `mira` | approved |
| `prototype-toma` | Toma (prototype label) | — | `toma` | provisional |
| `prototype-lina` | Lina (prototype label) | — | `lina` | provisional |

Identity approval records the supplied names; **it does not approve the prototype visual design**. Current art/rig entries in `assetRegistry.ts` remain provisional. No new story role is assigned to Toma or Lina. The goblin rig is catalogued as a prototype asset, without inventing a canonical identity. The enemy mage costume remains in its existing implementation.

Each entry has an asset alias, rig/artwork reference, asset version and optional costume/expression availability. An omitted expression list means the rig's existing expressions apply; it is not an approved list of how a character behaves. The old `characterMetadata` export remains compatible for prototype consumers. New production modules use this registry.

Use `characterAssetId('asakura-yuu')` when rendering the existing puppet. Adding a story identity requires one registry entry. A genuinely new visual asset also needs a rig/artwork implementation and alias in its owning component; do not force it into an unrelated existing silhouette. Current IDs, palettes and component APIs remain unchanged in Phase 1.

Design approval requires author/art direction review of master sheets, proportions, costume, palette, turn views and expression range against the approved source. Record approval and a new asset version only after review. Keep identity, artwork and rig approvals distinct. Never mark a design approved just because TypeScript or a render succeeds.
