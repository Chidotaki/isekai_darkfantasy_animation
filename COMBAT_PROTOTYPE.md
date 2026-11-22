# Phase 3: Combat prototype

`CombatDemo` is a separate 15-second, 1920 × 1080 composition at 30 fps (450 frames). Open **http://localhost:3000/CombatDemo** after `npm run preview`. No combat MP4 has been rendered; this phase is ready for review in Studio.

## Completed

- Extended the existing `Character` with optional `rig` and `facing` inputs. Ordinary scene poses remain compatible. Combat adds independent torso/hip rotation, articulated shoulders/elbows/wrists and hips/knees/ankles, weight transfer, grounded footprints, hand-attached weapons, and a brief turn pose. Ren keeps his existing body, outfit, scarf, hair and facial system, with an additional determined expression.
- Added a reusable green goblin with broad shoulders, short bowed legs, pointed ears, tusks, leather armor and a wooden club. Its crouch, roar, charge, heavy swing, recoil and fall differ from Ren's movements.
- Added all ten requested human clips and seven goblin clips in `src/combat/animations.ts`. Clips use normalized keyframes and can be sampled with `sampleClip(action, progress)`. Root movement and planted footfalls are coordinated separately by `timeline.ts`.
- Added sword, scabbard and club components; trails sampled from the actual blade trajectory; collision sparks, dust, directional speed lines, ground shadows, restrained camera shake and synchronized hit-stops.
- Added an original layered forest clearing with foreground occlusion, ruins, foliage, light shafts, drifting particles and a closing camera pullback. The choreography covers encounter, dodge, blocked counterattack, sword block/backward slide, flank and finishing slash, defeat, sheathing and departure.

## Synchronization and reuse

`timeline.ts` owns both fighters, root paths, footfalls, impact frames and contact poses. Ground impact is frame 108, the first clash 147, the sword block 216, and the finishing strike 330. Both fighters share the same hit-stop clock. Contact poses are solved once per authored event and smoothly blended; blocked attacks recoil instead of continuing through the defender. The dropped club starts at its actual release position.

`rig.ts` contains shared joint and attachment math; `Goblin.tsx`, `Weapons.tsx`, `CombatEffects.tsx` and `Forest.tsx` contain reusable artwork. Existing camera, particles, framing, character face and limb components are reused. Studio exposes named environment/fighter/effect groups. Computed joint paths and coordinated choreography are edited in source, not with Studio path controls.

## Verification

- `npm run check` — TypeScript.
- `node scripts/check-combat.cjs` — six weapon contacts within 0.01 px, 900 finite/deterministic fighter poses, leg reach, a planted stance, weapon ground clearance, bounded joint changes, shared hit-stops and the defeated hold.
- Remotion lists both `CombatDemo` (450 frames) and the preserved `IsekaiDemo` (1,200 frames).
- Selected frames across each action were rendered and visually reviewed. Studio's composition route returns HTTP 200. Direct inspection/playback of the Studio window was unavailable: browser access failed and native window access timed out.
- An `IsekaiDemo` regression frame at 38.5 seconds is pixel-identical to its pre-combat reference.

## Remaining limitations

This is an authored cutout fight, with mirrored three-quarter views and simplified hands, turns and sheathing. It does not provide general collision detection, arbitrary terrain contact or physical weapon dynamics; new encounters need authored spacing/contact cues. The combat preview is silent. No dependencies, external assets, services, game systems or editor were added.
