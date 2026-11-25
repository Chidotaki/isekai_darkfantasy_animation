# Puppet rig standard

The Phase 2 system is a small humanoid cutout rig. It reuses the existing deterministic idle/talk/walk/blink samplers, face presets and combat IK helpers. It does not replace the combat, magic or acting choreography and does not implement physics or a general skeleton editor.

## Files and responsibilities

| File | Responsibility |
| --- | --- |
| `src/visual/types.ts` | Layer sources, appearances, rig measurements and sampled performance types. |
| `provisionalArtwork.ts` | Static original art and source swaps, prepared once; no frame sampling. |
| `starterSheets.ts`, `starterMaskRuns.ts` | Approved starter source regions, masks, rest bindings, expression maps and restrained performance sampler. |
| `assets.ts` | Local-path/geometry preflight, drawing order and source selection. |
| `performance.ts` | Frame-based motion, smooth face mixing, talk shape crossfades and authored-pose adapter. |
| `rig.ts` | Bone matrices, configurable proportions, forward arms and inverse legs. |
| `LayeredCharacter.tsx` | Paint ordered SVG/file layers, clip pupils, mirror facing and attach an object. |
| `CharacterRenderer.tsx` | Canonical registry lookup, version validation and procedural compatibility mode. |
| `style.ts`, `StageLighting.tsx` | Outline/cel-shading tokens, shot color correction and inexpensive lighting/depth planes. |

## Coordinates and anchors

`facing=-1` mirrors the entire puppet; it does not generate an alternate view. Starter art is frontal. X grows right; Y grows down. `x/y/scale` place the character's feet origin in the shot. SVG is the host; no canvas drawing or frame-time filesystem access is required.

The provisional rig has torso pivot `(0,-88)`, neck `(0,-162)`, shoulders `(-29,-145)/(29,-145)`, hips `(-16,-85)/(16,-85)`, and ankle targets `(-23,-7)/(23,-7)`. Upper arms are 34 units, forearms 30, hand offset 6, thighs/shins 40. These are provisional measurements, not canonical proportions.

- `torso` and `hips` art uses the feet-origin frame. Torso lean/breathing moves shoulders and head together; feet do not inherit the breath scale.
- `head`/`backHair` art is relative to the neck. Head tilt and small offsets carry the face. `frontHair` adds restrained lagged secondary rotation around the rig's hair pivot. `scarf` follows the torso around its own rig pivot.
- `upperArmL/R` begins at the shoulder; `forearmL/R` at the elbow; `handL/R` at the grip. Limb artwork points down local +Y. Art rectangles must overlap the joint to avoid seams.
- `thighL/R` begins at the hip; `shinL/R` at the knee; `footL/R` at the ankle. Feet follow explicit targets in feet-origin coordinates. Unreachable targets are clamped to limb reach; this is not a promise to plant an impossible pose.
- `eyeL/R`, `browL/R` and `mouth` positions are relative to the neck. Eye closure scales whites/pupils/lid together; brows remain independent. Pupils move inside their declared clip. Head yaw is a small facial offset, not a generated profile view.
- A layer's `offset/size` places its art rectangle. `anchor`, `rotation` and `scale` then transform that rectangle in its bone's local space. The bone matrix and global facing/placement apply last.

New proportions must provide matching artwork and rig measurements together. Length changes do not stretch existing painted sleeves automatically. Multiple layers can share a bone; unused conceptual layers may be omitted. New bone topologies require a small explicit rig extension, not an arbitrary parent graph.

Starter parts share source-sheet coordinates translated to their character's feet origin. Each layer stores `bind = inverse(restBoneMatrix)`. The renderer applies `currentBoneMatrix × bind`, so the neutral drawing retains its original layout while articulated parts follow the rig. Region clipping combines the manual part outline and cached paper-removal contour. These rigs are roughly 630–680 source units tall and have individual proportions; do not apply the old rig's scale or combat contact coordinates unchanged.

## Performance workflow

`samplePerformance(frame,{fps,seed,pose,expression,...})` samples idle, talk, walk or sit. It includes breathing, seeded irregular blinks, restrained head/torso accents, delayed secondary motion and a cubic-eased gait from the original helpers. `walkTime` can be scene-relative while breathing and blinks retain continuous shot time. Everything is reproducible when seeking out of order.

Author transitions by easing numeric body channels with `ease`/`mix`; do not abruptly switch a planted stand to a seated pelvis. `sampleStarterPerformance` reuses the existing sampler with reduced breathing/tilt/secondary motion, a small arm gesture and eased posture shifts. The current test uses these supported motions; extreme sit/walk poses need additional costume separations. The older samplers remain available. There is no automatic pose-transition planner.

The gait has a 1.1-second cycle and 0.66-second stance, moving the planted foot 18 units backward. For forward travel, advance the character origin by `18/.66` local units/second times character scale and facing. Match root acceleration to walk strength at starts/stops. A stationary walk sampler alone is an in-place gait; arbitrary scene travel will slide.

`body` accepts the existing `CombatPose`. Arms retain its angle convention and hand grip. `withExistingPose()` disables extra breathing scale so existing `gripPoint`/`aimContact` geometry remains exact. The adapter does not reinterpret choreography. For different proportions, author IK using the matching measurements; the old combat authoring helper assumes the old human anatomy.

`heldItem` attaches at `handR` origin and follows the wrist. It paints after character layers, appropriate for the test card; complex finger wrapping or a prop passing behind the body needs authored layer/order changes and approved hand art. Procedural mode forwards the same item to the old hand attachment.

## Face and style

All existing presets and aliases remain available. The provisional artwork has independent eyes, brows, pupils, mouth and hair, including the existing fear blend. The starter appearances instead map the names to four supplied painted portraits per character. Their eyes/brows/hair move with the painted head; independent gaze and brow movement are not separated. Closed lids and seven mouth IDs use minimal character-colored vector overlays. Yuu also has a restrained smile overlay. Crossfades preserve the existing source-selection interface; these are limited talk cycles, not phoneme alignment. See the integration report for mappings and fallback emotions.

`VisualStyle` controls shadow/highlight strength, opacity and optional brightness/saturation. Outlines and base colors belong to the artwork/tokens. Use shot-selected light planes, a ground shadow, value contrast and framing for depth. No default bloom, blur, particles or camera shake is applied.

## Verification and limits

`CharacterVisualTest` is a 720-frame/24-second noncanonical test at 1920×1080, 30 FPS. It shows all three approved starter characters, breathing/tilt/blinks, six expression requests per character, talking, arm gestures, close-ups and a posture shift. Its title/status text is Studio-editable; sampled rig transforms, layer maps and computed status labels are code-driven rather than individual timeline controls.

Run `node scripts/check-visual.cjs` for the existing 2880 deterministic poses/contact/format checks plus 2160 starter poses, canonical defaults, source hashes, masked parts, facial mappings and version isolation. Inspect actual rendered frames as well; numeric checks cannot approve art quality.

The starter designs are approved for current Chapter 1 implementation. The derived rig bindings and overlays remain technical interpretations; they do not establish complete final production masters. Extreme turns, perspective shortening, elbow folds, hand articulation, automatic occlusion swaps and squash/deformation need further separations or authored art. Painted hair/collar joins and raster softness can show in large close-ups; no hidden costume surfaces are synthesized. No audio production, full episode or asset manager is included.
