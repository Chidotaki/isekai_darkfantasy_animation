# Layered artwork pipeline

Phase 2 implements a local hybrid renderer. **Three user-approved Chapter 1 starter sheets are now active** for Yuu, Kairyū and Shiori. Their unchanged PNGs live in `public/assets/characters/chapter-01-starter-v1/`. Source images, runtime appearances and derived rigs have separate registry entries. Approval covers these starter designs for current implementation, not full final master sheets for every angle or arc.

`starterSheets.ts` assembles individually masked source regions into front-view puppets with the supplied outfits, proportions and faces. Yuu (`ren`), Kairyū (`elias`) and Shiori (`mira`) retain their canonical IDs and aliases. The older provisional appearances remain explicit compatibility choices; Toma and Lina still default to them. Yuu's silver bracelet remains an ordinary accessory with no lighting effect or invented history. The test contains no relationship or story beats.

## Authoring and export contract

| Item | Contract |
| --- | --- |
| Formats | Transparent PNG, lossless WebP, standalone SVG, or original programmatic SVG shape data. |
| Paths | Files under `public/assets/characters/<appearance-version>/`; data paths omit `public/`. No URLs, traversal, external scripts or runtime file reads. |
| Canvas | Export each part on a fixed rectangle, or use a file `region` with source-pixel `rect`, part `mask`, optional paper-removal `silhouette`, and `sheetSize`. Store logical `offset/size`; facial replacements share the target rectangle. |
| Scale | Logical units are independent of export pixels. The provisional rig is approximately 250 units tall. Export at least 8 pixels per unit for this test's 3× character scale and 2.25× close-up; inspect the largest intended shot at 1080p. |
| Transparency | RGBA, transparent outside the part; no baked background, matte fringe or crop that removes joint overlap. SVG needs `xmlns` and a matching `viewBox`. |
| Coordinates | X right, Y down, degrees; origin between the feet. Normally `offset` is bone-local. An optional inverse-rest `bind` lets source-sheet parts use a common feet-origin frame. See the rig standard. |
| Names/order | Stable unique IDs, e.g. `sleeve-R`, `pupil-L`, `front-hair`; numeric `order` paints back to front. Source filenames include the part, view and variant where applicable. |
| Registration | Appearance ID/version/status/provenance, rig ID/version and measurements, costume IDs, layers with source/format, bone/order/offset/size. Optional anchor, rotation, scale, visibility, opacity and shadow/highlight role. |
| Faces | Fully separated art can use independent whites/pupils/lids/brows/mouth. The starter sheets use four painted head variants per character plus technical blink/talk overlays. `expressions` and `mouths` map to aligned replacement sources; missing keys use the base source. |
| Costumes | Declare costume IDs. Per-layer `costumes` replaces a source; `null` hides it. Unsupported IDs fail. Starter appearances use `chapter-01`; old layered art uses `student`. |
| Versioning | Publish a new version/directory when any part, rig, proportions or palette changes. Keep previous assets if episodes reference them. Pin the bundle and rig in manifests. Never overwrite approved versions in place. |

Review SVG exports as data: remove scripts, event handlers, foreign objects, network references and embedded fonts from imported SVGs. The renderer loads external SVG through Remotion `Img`, without injecting raw SVG text into the DOM. Project-authored vector data is trusted TypeScript, so review it as code. Do not run artists' export scripts without review.

## Import an approved appearance

For the present starter sheets, no layered masters were supplied. `scripts/build-starter-masks.py` reads their pixels locally and records pale boundary-connected paper as exclusions in `starterMaskRuns.ts`; it never edits the PNGs. At module initialization, the runtime converts those runs to cached closed SVG contours. Manual part masks isolate limbs/costumes; portrait masks also discard disconnected guide marks and trim a one-pixel paper fringe. This is a technical separation of existing pixels, not newly painted or generated views. The source hashes are checked by `check-visual.cjs`.

Normal preview/render needs only npm dependencies. Regenerating mask metadata optionally uses an existing local Python/Pillow installation: `python scripts/build-starter-masks.py`. Review this small local script before running it; it has no network, shell or credential access. See [the integration report](CHAPTER_1_STARTER_INTEGRATION.md) for the exact approval boundary and expression map.

1. Obtain original master sheets and explicit approval for palette, costume, face, proportions and required views. Record provenance and license/ownership.
2. Export overlapping parts and aligned facial variants. Do not flatten shadows/highlights into every part when the shot needs separate lighting control.
3. Create a `CharacterAppearance`, supply matching `CharacterRig` measurements, then call `prepareAppearance()` once at module scope. Different characters can omit/add layers on the supported humanoid attachments.
4. Register each local file and the appearance/rig versions in `assetRegistry`. Add an explicit loader in `resolveAppearance`; update the character's `layeredAppearance` and `layeredRig` references. Registry source strings are metadata, never evaluated code.
5. Use the same `samplePerformance()` or authored `CombatPose` on the new artwork. No animation function should contain the new paths or palette.
6. Run checks and inspect neutral, limb extremes, blinking, expression transitions, sitting, gait stance, mirrored facing and the largest close-up. Review a short motion sequence as well as stills before production adoption.
7. Approve the visual sheet and rendered performance separately. Update approval metadata only after that review. Scene/story approval remains a separate gate.

## Shot integration and reproducibility

`CharacterPlacement.appearance` optionally pins an artwork asset/version and `costume` selects a declared variant. `EpisodeManifest.assetPins` optionally locks any art/rig/motion/audio references. `buildTimeline()` rejects mismatches; old manifests remain valid. The scene's canonical character list and shot placement IDs are unchanged.

A shot for a starter character uses its manifest placement and shot-local frame (`starterId` is that placement's typed `StarterId`):

```tsx
// For these three starter characters, keep the supplied single-view art in its supported range.
const performance = sampleStarterPerformance(starterId, frame, {
  fps, expression: placement.expression,
});
return <CharacterRenderer {...placement} appearance={placement.appearance}
  frame={frame} fps={fps} performance={performance}/>;
```

Place this inside the shot's SVG/camera. Motion IDs remain explicit cues interpreted by that shot renderer, not automatic arbitrary function execution. For existing authored poses, use `withExistingPose(performance, pose)` to preserve arm contact geometry. `mode="procedural"` selects the original Character renderer; existing demos continue using it directly.

Version pins detect declared version mismatches. The three starter source files additionally have SHA-256 checks; other assets are not universally content-hashed. Retain assets and the Git revision/lockfile for reproducibility. This is not a historical asset store.

## Reproduce the provisional file exports

These three files are small format-verification assets derived only from original project geometry. They are not proposed production master sheets. Run from the repository root; the conversion command uses local Python Pillow only when regenerating WebP, not for normal preview/render.

```sh
node scripts/export-provisional-svg.cjs
npx remotion still scripts/artwork-export.tsx ExportEye public/assets/characters/provisional-v1/eye-white.png --is-production=false
npx remotion still scripts/artwork-export.tsx ExportHair out/provisional-hair.png --is-production=false
python -c "from PIL import Image; Image.open('out/provisional-hair.png').save('public/assets/characters/provisional-v1/yuu-hair.webp',lossless=True)"
```

PNG and WebP retain alpha; SVG remains vector. Future artwork needs original front/three-quarter/profile/back sheets, expression sheets, hand poses, costume layers, joint overlap/occlusion planning and close-up detail. The present front-facing art cannot replace those assets.
