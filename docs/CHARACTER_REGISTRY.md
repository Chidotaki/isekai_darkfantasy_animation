# Character identities and prototype assets

`src/production/characterRegistry.ts` separates stable story IDs from the legacy IDs expected by `Character.tsx`. `CharacterId` is derived from registry keys; episode modules do not maintain their own character unions.

| Stable ID | Canonical display name | Japanese | Existing art alias | Identity status |
| --- | --- | --- | --- | --- |
| `asakura-yuu` | Asakura Yuu | 朝倉 悠 | `ren` | approved |
| `tachibana-kairyu` | Tachibana Kairyū | 橘 海龍 | `elias` | approved |
| `minase-shiori` | Minase Shiori | 水瀬 栞 | `mira` | approved |
| `prototype-toma` | Toma (prototype label) | — | `toma` | provisional |
| `prototype-lina` | Lina (prototype label) | — | `lina` | provisional |

Identity approval records the supplied names; **it does not approve the old prototype visual design**. The three supplied Chapter 1 starter source sheets are now explicitly approved for current implementation. Their derived appearances carry that scoped approval; the technical rig bindings remain provisional. Toma/Lina and the old compatibility assets remain provisional. No new story role is assigned to them. The goblin and enemy mage remain prototype implementations.

| Canonical character | Source sheet | Default appearance / rig | Costume |
| --- | --- | --- | --- |
| `asakura-yuu` | `sheet.asakura-yuu` | `art.starter-yuu` / `rig.starter-yuu` | `chapter-01` |
| `tachibana-kairyu` | `sheet.tachibana-kairyu` | `art.starter-kairyu` / `rig.starter-kairyu` | `chapter-01` |
| `minase-shiori` | `sheet.minase-shiori` | `art.starter-shiori` / `rig.starter-shiori` | `chapter-01` |

All are version `1.0.0`; `starterReference` pins the registered source independently from `layeredAppearance` and `layeredRig`. `resolveAppearance(canonicalId)` returns the new artwork by default. Explicit `art.layered-students` pins and procedural mode preserve compatibility; aliases `ren`, `elias`, `mira` still identify the same people in historical consumers. The four original demos continue to use their original renderer.

Each entry has an asset alias, rig/artwork reference, asset version and optional costume/expression availability. An omitted expression list means the rig's existing expressions apply; it is not an approved list of how a character behaves. The old `characterMetadata` export remains compatible for prototype consumers. New production modules use this registry.

Use `characterAssetId('asakura-yuu')` when rendering the existing puppet. Adding a story identity requires one registry entry. A genuinely new visual asset also needs a rig/artwork implementation and alias in its owning component; do not force it into an unrelated existing silhouette. Current IDs, palettes and component APIs remain unchanged in Phase 1.

The user approved these three sheets before implementation; checks did not confer that approval. They define the current starter designs, not full final production masters for all future arcs. Expanded turnarounds, costumes, close-up art and separated facial layers still need review and new versions. Keep identity, source artwork and derived rig approvals distinct. See [the integration report](CHAPTER_1_STARTER_INTEGRATION.md).
