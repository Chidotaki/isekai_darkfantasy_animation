# Chapter 1 V1 roster (noncanonical)

`ChapterOneFacialRenderer` renders Kairyū, Shiori or the elder in a 512px SVG
canvas. Pass `characterId`, `expression`, `blink` (0–1) and optional `mouth`
(0–1, closed/small/wide). Omitting `mouth` preserves the expression's mouth.
Character-specific anchors and clips live in `chapterOneFaces.ts`. Yuu continues
to use his unchanged renderer. Existing demos are not opted into these new faces.

`NPCCharacter` supports all 14 IDs in `npcAssets.ts`, bottom-center `x`/`y`,
`scale`, `facing` (1/-1), `opacity`, and optional `idle`. Animate x/y with Remotion
interpolation for whole-cutout translation. These are standing images, not rigs.

The source package was found at
`public/isekai_darkfantasy_ch01_all_characters_and_mobs_v1/`. Runtime files were
copied byte-for-byte into `public/assets/`; reference sheets stay in the source
package. Identical Yuu files were not duplicated. No artwork was regenerated.

Important source limitations:

- Kairyū/Shiori manifests describe 5×4 cells, but their atlases actually contain
  4 columns × 5 rows. The supplied cells split features. The renderer therefore
  clips measured regions of the unchanged original atlases; the top-right
  assembled preview is never sampled. Original manifests are retained as provenance.
- These blank bases lack a nose layer; Kairyū has a head/neck only. No replacement
  heads or invented body parts are used. Fine source alpha/edge residue remains.
- The elder's base includes hair, beard and a closed-mouth stroke. Small mouth
  overlays fit within the beard opening, but this is limited lip movement, not
  a deforming jaw. His stern-brow cell also contains eyes; a fixed brow mask
  excludes those eyes. Some thin pale edges remain on his bust and feature patches.
- Knights retain baked pale ground shadows; knight-04 retains a small source mark.
  The roster exposes these draft artifacts instead of repainting the supplied art.

Validation: `npm run check`. Five 1920×1080 PNGs cover all five student expressions,
closed eyes, small/wide speech mouths, all three elder expressions and all 14 NPCs.
Faces and hair stay fixed; no missing files or split-cell holes were observed.
The roster is driven by data/code, not individual Studio timeline controls.

```sh
npm run preview
npx remotion render src/index.ts CharacterRosterTest out/character-roster --frames=15,99,162,219,291 --image-format=png --concurrency=2 --is-production=false
```
