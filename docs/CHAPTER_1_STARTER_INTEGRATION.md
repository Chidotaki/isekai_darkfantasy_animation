# Chapter 1 starter sheet integration

The three supplied references were accessible in `references/chapter-01/` and visually inspected before implementation. Their approved designs now supply the default layered appearances for Asakura Yuu, Tachibana Kairyū and Minase Shiori. PR #2 was merged; this work branches from `main` at `9ff6882` on `feat/chapter-one-starter-sheets`. The PR targets `main`; it must not be merged automatically.

## Completed implementation

The source PNGs are copied unchanged into `public/assets/characters/chapter-01-starter-v1/`. Each is 1376×768. No outside artwork, generated replacement designs or new dependencies were used. Original source pixels retain the silhouettes, outfits, hair, faces, accessories and palette. Yuu's bracelet remains ordinary and unlit. The technical test has no story, dialogue or romantic staging.

| Character | Source registration | Runtime appearance / rig registration | Body layers |
| --- | --- | --- | --- |
| Asakura Yuu | `sheet.asakura-yuu` | `art.starter-yuu` / `rig.starter-yuu` | Hood/cape, tunic, belt/pouch/hem, articulated arms, hands/bracelet/bracer, thighs, shins, boots |
| Tachibana Kairyū | `sheet.tachibana-kairyu` | `art.starter-kairyu` / `rig.starter-kairyu` | Blue cape, cuirass, tassets/belt, pauldrons, arms/bracers/gloves, legs/greaves/boots, sheathed sword |
| Minase Shiori | `sheet.minase-shiori` | `art.starter-shiori` / `rig.starter-shiori` | Rear robe panels, bodice/collar, embroidered skirt, shoulder pieces, sleeves/hands, legs/boots, hanging hair |

The sheet itself is not placed flat in the scene. Each part uses a source-pixel rectangle, manual outline and paper-removal contour. Separate transforms animate these parts with the existing humanoid solver. Inverse rest bindings preserve the supplied drawing's neutral layout. Four portrait regions per character provide painted facial changes; closed-lid and mouth overlays supply the smallest technical additions required for blinking/talking. No hidden views or costume surfaces are invented.

`source sheet` and `runtime appearance` entries record approval scoped to the supplied Chapter 1 starter references/technical implementation. The derived rig entries remain provisional. **Approved starter sheet does not mean a complete final master for every pose, angle or later arc.** Future expanded artwork can be approved separately.

The registry now points `artwork`, `rig`, `layeredAppearance`, `layeredRig` and `starterReference` to the new entries. The costume is `chapter-01`. Canonical IDs and aliases (`ren`, `elias`, `mira`) are preserved. Explicit provisional pins and procedural mode remain compatibility options; they are not the default for the three canonical layered characters. The original four compositions continue using their historical renderer and choreography.

## Expressions and motion

| Runtime request | Yuu | Kairyū | Shiori |
| --- | --- | --- | --- |
| Neutral | Neutral portrait | Neutral portrait | Neutral portrait |
| Determined / serious | Determined portrait | Serious portrait | Reserved/subdued portrait |
| Exhausted / sad | Tired portrait | Serious portrait (nearest available) | Reserved/subdued portrait |
| Surprised / fear | Startled portrait | Surprised portrait | Concerned/startled portrait |
| Worried | Tired portrait (subtle concern) | Surprised/concerned portrait | Concerned portrait |
| Happy / amused / relieved | Neutral portrait plus restrained smile overlay | Friendly neutral portrait | Gentle smile portrait |

Other existing runtime names map to these same available drawings; they are not 19 independently painted emotions. Native eyes, brows and hair are part of the portrait. Facial replacements crossfade through the existing layer source API. Seven existing mouth IDs use simple, character-colored overlays; motion is not phoneme lip-sync.

`sampleStarterPerformance` reuses the deterministic sampler with reduced breathing/head tilt/secondary movement, small arm gestures and posture shifts appropriate to single-view artwork. `CharacterVisualTest` remains 720 frames / 24 seconds at 1920×1080, 30 FPS. Frames 0–119 show all three; the next three six-second windows inspect each character's six expression requests, blinks, arms and talking; the final two seconds show a subtle posture change with all three visible. Close-up camera moves remain frame-driven. Title/status text is Studio-editable.

## Files

- Added: three public source PNGs; `src/visual/starterSheets.ts`; generated `src/visual/starterMaskRuns.ts`; `scripts/build-starter-masks.py`; this report.
- Updated renderer contracts: `src/visual/{types,assets,rig}.ts`, `LayeredCharacter.tsx`, `CharacterRenderer.tsx` for regions, optional rest bindings and blink/speech layer activity.
- Updated integration: `src/production/{assetRegistry,characterRegistry}.ts`, `src/CharacterVisualTest.tsx`, `scripts/check-visual.cjs`.
- Updated docs: README, artwork pipeline, rig standard, visual bible, character registry and a historical note in the previous Phase 2 report.

`provisionalArtwork.ts`, the four prototype compositions, combat/magic/acting systems, package manifest and lockfile are unchanged. User-provided reference directories remain untouched and outside this commit; the runtime copies make the feature branch self-contained.

## Reproducibility and verification

Source SHA-256 values, checked against the registered public files by `check-visual.cjs`:

```text
asakura-yuu.png       156d93ed3d4ebd97f9bf6f8ccb505ddf7aeda13ca4ee5d1e8b77e57611b4664b
tachibana-kairyu.png   51e129edca9c05be81a5258a41de5f013300f9b60ecd581b8651a8d148535094
minase-shiori.png     a031bb4be9f6e6b11549ab2378cf24caa29a13e0a1f1051a4bcf9a82e18bc115
```

The reviewed local mask script reads those PNGs with Pillow and writes TypeScript scanline metadata only. Runtime traces closed contours once at module initialization and caches them. Normal preview/render requires no Python; optional mask regeneration uses `python scripts/build-starter-masks.py` with an existing Pillow installation. No external skill scripts, credentials, secrets or outside artwork were accessed.

Validation performed:

- Clean install: `npm ci --no-audit --no-fund --cache .remotion/npm-cache --offline` using the pinned lockfile and local cache. An initial locked esbuild file was resolved by stopping the earlier Studio process; the subsequent install succeeded.
- `npm run check`, `npm run check:production`, `npm run check:assets`.
- `node scripts/check-acting.cjs`, `node scripts/check-combat.cjs`, `node scripts/check-magic.cjs`.
- `node scripts/check-visual.cjs`: existing 2880 hybrid/contact/format poses plus 2160 deterministic starter poses, default resolution, approved source hashes, actual masked file layers, expression maps and invalid version/cross-character pin rejection.
- Bundled-browser composition enumeration and actual PNG rendering. Studio starts at `http://localhost:3000`; visual inspection was performed on rendered PNGs, not claimed as interactive playback review.

| Composition | Frames / seconds | Representative rendered file |
| --- | --- | --- |
| IsekaiDemo | 1200 / 40 | `out/starter-isekai-check.png` — frame 1155 |
| CombatDemo | 450 / 15 | `out/starter-combat-check.png` — frame 147 |
| MagicCombatDemo | 540 / 18 | `out/starter-magic-check.png` — frame 240 |
| EmotionalDemo | 900 / 30 | `out/starter-emotional-check.png` — frame 132 |
| CharacterVisualTest | 720 / 24 | `out/starter-full/element-030.png` — all three, native 1080p |

All five remain 1920×1080, 30 FPS. The four original demo PNGs are pixel-identical to the corresponding Phase 1 `out/production-*-check.png` baselines at half scale. This is sampled visual regression evidence, not a claim to have watched full exports.

Native 1920×1080 inspection frames in `out/starter-full/`: `element-030.png`, `element-162.png`, `element-225.png`, `element-277.png`, `element-342.png`, `element-405.png`, `element-457.png`, `element-522.png`, `element-585.png`, `element-637.png`, `element-700.png`. They cover the full cast, blinks on all three, startled faces, mouth movement and final posture variation. `contact-sheet.jpg` summarizes them. `out/starter-compatibility.jpg` summarizes the four original demos. Additional sampled expressions are in `out/starter-final/` at half scale, with `motion-review.jpg` for head/arm/blink/talk comparison. Outputs are local verification artifacts, not committed source assets. No new full MP4 was requested for this integration.

```sh
npm run preview
node scripts/check-visual.cjs
npx remotion render src/index.ts CharacterVisualTest out/starter-full --frames=30,162,225,277,342,405,457,522,585,637,700 --image-format=png --concurrency=2 --is-production=false
```

Visual inspection caught and corrected retained paper fragments, horizontal scanline-mask seams a duplicated portrait collar on Yuu, and blink alignment on turned portraits. Blink overlays now use per-portrait landmarks and sampled complexion colors. The final examples preserve recognizable approved costumes and expressions. The limitations below remain visible at large close-up scales.

## Current limitations and future work

Current: frontal cutouts with small movements; no reliable extreme turns, full seated robe/armor folds, large gestures, mesh deformation, finger articulation or automatic occlusion. Portrait hair/collar joins are technical cuts, and the finite source resolution limits close-up detail. Blinks and talk mouths are approximate overlays; facial features cannot all move independently. Expression crossfades can briefly ghost contours where supplied head shapes differ. Original combat contacts assume their original rig proportions and are not retargeted to these bodies.

Future, outside this task: separately approved higher-resolution transparent parts with joint overlap, additional views, hand poses, expression-specific closed eyes and painted mouths, isolated eyes/brows/hair, expanded costumes and shot-specific performance review. No full Episode 001, new canon, romance, bracelet power, audio production or dependency expansion is included.
