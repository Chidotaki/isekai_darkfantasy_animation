# Phase 2 visual system review

Historical Phase 2 baseline report. The subsequent [Chapter 1 starter integration](CHAPTER_1_STARTER_INTEGRATION.md) replaces the three canonical defaults and the test artwork with user-approved starter sheets. References below to missing approvals, the old test choreography and provisional defaults describe the earlier PR, not the current state.

Status: technically implemented and visually inspected with **provisional artwork**. Final production artwork is not approved. Phase 1 PR #1 was merged; this work branches from latest `main` (`57553c9`) on `feat/hybrid-anime-characters`. The Phase 2 PR targets `main` and must not be automatically merged.

## Implemented

- Data-described layered PNG, WebP, external SVG and procedural SVG, with Remotion image loading, transparent canvases, drawing order, per-layer anchors/transforms, mirrored facing, visibility, costume selection and optional shading/highlights.
- Separate static appearances, configurable humanoid rig measurements, deterministic performance sampling and painting. Canonical registry selection plus explicit artwork/rig version validation and optional episode/shot pins.
- Connected arm/leg transforms, old combat grip compatibility, hand-held item attachment, breathing, seeded blinks, head/torso accents, eased gait/stance, sitting, restrained hair/scarf motion, independent gaze/eyes/brows/mouth, existing expressions/mouth IDs and a new fear blend.
- Smooth expression/source changes and talk activity crossfades. A procedural compatibility mode remains available. The four existing demos still use their original renderer and choreography.
- A 720-frame **CharacterVisualTest**, 1920×1080 at 30 FPS: three priority characters, neutral/full-body pose, head tilt, blink, talk, hand-held technical card, close-up, eight face states, sit/stand transition and walk. It is explicitly noncanonical.

No dependencies, paid/cloud services, new story scenes, final character designs, audio production or full episode were added. Three bundled image files total about 18 KB and come solely from original project art.

## Files

New rendering code: `src/visual/{types,assets,rig,performance,style,provisionalArtwork}.ts`, `src/visual/{LayeredCharacter,CharacterRenderer,StageLighting}.tsx`, and `src/CharacterVisualTest.tsx`.

New assets: `public/assets/characters/provisional-v1/{eye-white.png,yuu-hair.webp,yuu-jacket.svg}`. The eye PNG is shared; Yuu's hair WebP and jacket SVG demonstrate actual file-backed layers alongside vector parts.

New tooling: `scripts/check-visual.cjs`, `scripts/export-provisional-svg.cjs`, `scripts/artwork-export.tsx`. These use existing project dependencies; optional local Pillow is only needed to regenerate the committed WebP.

Modified integration: `src/Root.tsx`, `src/production/{assetRegistry,characterRegistry,episodeTypes,timeline}.ts`, `src/production/EpisodeCompositions.tsx`, and `scripts/check-production.cjs`. Existing prototype source, animation helpers, combat and magic code, dependency manifest and lockfile are unchanged.

Documentation: new `ARTWORK_PIPELINE.md`, `PUPPET_RIG_STANDARD.md` and this report; updated `README.md` and `VISUAL_BIBLE.md`.

## Validation evidence

Passed:

- `npm ci --no-audit --no-fund --cache .remotion/npm-cache --offline` (clean installation from the existing lockfile/cache).
- `npm run check`, `npm run check:production`, `npm run check:assets`.
- `node scripts/check-acting.cjs`, `node scripts/check-combat.cjs`, `node scripts/check-magic.cjs`.
- `node scripts/check-visual.cjs`: 2880 deterministic hybrid poses; connected upper/lower limbs; unequal proportions and unreachable-target clamping; authored hand-grip parity; world-space planted stance; registered PNG/WebP/SVG; expression/mouth/intensity/visibility/costume selection; procedural attachment rendering; version mismatches.
- Actual bundled-browser composition enumeration and selected PNG rendering. Studio server also started; interactive UI inspection was unavailable in this environment, so review used actual rendered PNGs.

| Composition | Frames / seconds | Compatibility render |
| --- | --- | --- |
| IsekaiDemo | 1200 / 40 | `out/hybrid-isekai-check.png`, frame 1155 |
| CombatDemo | 450 / 15 | `out/hybrid-combat-check.png`, frame 147 |
| MagicCombatDemo | 540 / 18 | `out/hybrid-magic-check.png`, frame 240 |
| EmotionalDemo | 900 / 30 | `out/hybrid-emotional-check.png`, frame 132 |
| CharacterVisualTest | 720 / 24 | `out/character-visual/element-*.png` |

All five register at 1920×1080, 30 FPS. The four compatibility PNGs are **pixel-identical** to the corresponding Phase 1 `out/production-*-check.png` baselines at half scale. This verifies sampled visual compatibility, alongside the broader existing motion/contact checks.

Visual review outputs (local, not committed):

- `out/character-visual/contact-sheet.jpg`: full-body, head/arm, blink, smile, amusement, concern, surprise, fear, frustration, sadness, seated, rising and walking frames.
- `out/character-visual/motion-review.jpg`: gesture frames and adjacent samples around walk onset (599–601 and 614–616).
- `out/character-visual-full/element-045.png`, `element-403.png`, `element-525.png`: native 1920×1080 full-body, face and seated inspection.
- `out/hybrid-compatibility.jpg`: four original prototype comparison frames.

Inspection found no detached limbs, unintentional art clipping, opaque bitmap backgrounds, facial misalignment or incorrectly scaled raster layers in those frames. The bench seat height was corrected to match the seated pelvis. Talking now fades at activity boundaries. Technical frame labels are intentional. No MP4 was exported, as requested for this phase.

## Approval boundary and technical limits

Yuu, Kairyū and Shiori are ready for **technical animation with provisional art**, including the existing hair/clothing/palette. None is ready for final episode artwork approval. Toma/Lina also have provisional layer definitions but are not priority master-sheet candidates in this task. No canonical redesign or relationship was invented; Yuu's bracelet remains ordinary and unlit.

Still required: approved original master/turnaround sheets, final palettes/proportions/outfits, expression and hand sheets, separated costume art, occlusion planning, close-up detail and scene-specific visual approval. The current source art remains a simplified chibi cutout; it does not establish the final anime design.

Technical limits: fixed humanoid attachments rather than a general bone graph; front-facing artwork with simple mirroring/yaw offsets; no true profile turns, mesh deformation, perspective foreshortening, finger articulation or automatic occlusion. Sitting remains a simplified frontal puppet pose. Held items paint above the character unless deliberately integrated into the layer structure. Gait travel must match stance speed; impossible targets clamp rather than stretch. Talk cycles are not phoneme lip-sync. Existing combat IK authoring assumes its original proportions. Version checks require honest version bumps and retained files; they are not content hashes or a historical asset database.

See [artwork import/export](ARTWORK_PIPELINE.md) and [rig coordinates/performance](PUPPET_RIG_STANDARD.md) before replacing art or authoring future shots.
