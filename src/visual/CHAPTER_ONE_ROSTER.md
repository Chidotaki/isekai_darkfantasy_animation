# Chapter 1 V1 roster (noncanonical)

`ChapterOneFacialRenderer` renders Kairyū, Shiori or the elder in a 512px SVG
canvas. Pass `characterId`, `expression`, `blink` (0–1) and optional `mouth`
(0–1, closed/small/wide, or `mouth_neutral` / `mouth_open_small` /
`mouth_open_wide` / `mouth_o`). Omitting `mouth` preserves the expression's mouth.
Character-specific anchors and clips live in `chapterOneFaces.ts`. Yuu continues
to use his unchanged renderer. Existing demos are not opted into these new faces.
All three main characters support `CharacterRenderer facialMode="sprites-v1"`
on their existing starter bodies. The adapter reuses Yuu's performance mapping;
legacy portraits, eyelids, mouths and Shiori's old hair tails are excluded only
in this mode. The default `starter` mode and original body rigs are unchanged.

`NPCCharacter` supports all 14 IDs in `npcAssets.ts`, bottom-center `x`/`y`,
`scale`, `facing` (1/-1), `opacity`, and optional `idle`. Animate x/y with Remotion
interpolation for whole-cutout translation. These are standing images, not rigs.

The source package was found at
`public/isekai_darkfantasy_ch01_all_characters_and_mobs_v1/`. Runtime files were
copied byte-for-byte into `public/assets/`; reference sheets stay in the source
package. Identical Yuu files were not duplicated. The sole corrected runtime asset
is the elder's `base_head_neck_clean.png`: a localized mouth-removal edit blended
into 552 changed pixels, with original alpha and every pixel outside that area preserved.
The original base and all mouth sprites are retained unchanged.

Important source limitations:

- Kairyū/Shiori manifests describe 5×4 cells, but their atlases actually contain
  4 columns × 5 rows. The supplied cells split features. The renderer therefore
  clips measured regions of the unchanged original atlases; the top-right
  assembled preview is never sampled. Original manifests are retained as provenance.
- These blank bases lack a nose layer; Kairyū has a head/neck only. No replacement
  heads or invented body parts are used. Fine source alpha/edge residue remains.
- The corrected elder base includes fixed hair and beard without baked mouth
  strokes. Mouth overlays fit within the beard opening, but this is limited lip movement, not
  a deforming jaw. His stern-brow cell also contains eyes; a fixed brow mask
  excludes those eyes. Some thin pale edges remain on his bust and feature patches.
- Knights retain baked pale ground shadows; knight-04 retains a small source mark.
  The roster exposes these draft artifacts instead of repainting the supplied art.

Validation: `npm run check`. Five 1920×1080 PNGs show all three main faces attached
through CharacterRenderer (neutral, talking and blinking), all 14 NPCs, plus elder
neutral/wide-open close-ups with all four mouth shapes alongside. No duplicated
features, split-cell gaps or baked-mouth overlap were observed.
The roster is driven by data/code, not individual Studio timeline controls.

```sh
npm run preview
npx remotion render src/index.ts CharacterRosterTest out/character-roster-final --frames=15,99,162,255,315 --image-format=png --concurrency=2 --is-production=false
```
