# Magic combat prototype

`MagicCombatDemo`: 18 seconds / 540 frames, 1920 × 1080 at 30 fps. Start with `npm run preview`, then open http://localhost:3000/MagicCombatDemo. The existing `npm run render` command still targets IsekaiDemo. No magic-combat MP4 was rendered.

## What works

| Time | Action |
| --- | --- |
| 0–5 s | A hooded enemy mage anticipates, charges the staff, and launches a visible fire projectile. Ren ducks behind a broken pillar. The projectile hits stone at frame 118 and leaves hot, glowing cracks. |
| 5–10 s | Ren retrieves one parchment from his belt pouch, unrolls it between his hands, and tilts it over the cover. Existing water runes illuminate; a short, small pour cools the stone. Steam rises into the sightline. The inscription drains and fractures; Ren discards the spent parchment. |
| 10–15 s | Ren moves around the near side of the pillar and draws his sword. The mage raises a shield; Ren's strike creates a ripple and cracks the barrier. The mage starts another cast, but Ren closes in and strikes the staff shaft, interrupting the spell and knocking the staff away. |
| 15–18 s | Ren holds a guarded stance; the mage recoils with empty hands. The staff rests on the paving and the exhausted parchment fades. |

## Reuse and story rules

- `src/components/Character.tsx`: the original rig now has optional costume, sword visibility, and hand-item props. The mage uses the same articulated body with a hood, robe, beard, and staff. Existing student defaults are preserved.
- `src/magic/spells.ts`: a small typed configuration distinguishes an authorized direct caster from Ren's scroll activation. Direct casting accepts only the enemy mage and the fire/shield spells. Create Water has one charge, a short duration, a nominal 1.5-liter utility quantity, and `offensive: false`.
- `src/magic/Scroll.tsx`: reusable retrieval-to-spent parchment visuals. Runes exist before activation; illumination is confined to the parchment. There is no aura or spell circle on Ren. The absolute activation window never resets during the composition.
- `src/magic/Effects.tsx`: staff casting runes, traveling projectile, heated impact, finite water, drifting steam, and shield ripple/fade. Casting and shield components check caster authorization. Water ends after 38 frames; no water projectile targets the mage.
- `src/magic/timeline.ts`: authored pose keys, root paths, attachment coordinates, projectile path, and two solved sword contacts. It reuses the existing combat poses, IK, easing, and grounded-foot helpers rather than adding a simulation engine.
- `src/magic/Courtyard.tsx`: original layered stone ruins, cover pillar, moonlight, paving, debris, and foreground plants. The composition reuses the existing camera, particles, shadows, sparks, dust, and cinematic framing.

Only one basic scroll appears. Ren wins position through cover, observation, and physical movement. Scroll cost is a story constraint, not an economy or inventory feature; no additional supply, recharge, divine blessing, or personal magic is implied.

## Verification

Run `npm run check`, `node scripts/check-magic.cjs`, and `node scripts/check-combat.cjs`.

- TypeScript passes. The focused magic check covers 1,080 deterministic poses, limb reach, sword clearance, casting restrictions, permanent spent state, projectile launch/arrival, and exact shield/staff contacts. Largest sampled joint change is 32.6 degrees per frame during the fast strike.
- Remotion lists all three compositions at their expected resolutions, frame rates, and durations.
- Twenty-two selected frames were rendered and reviewed across all four story beats, followed by six additional frames around the refined sword contacts. The final verbose render log contains no SVG attribute errors. Full-resolution stills are `out/magic-preview.png` (water scroll) and `out/magic-shield-preview.png` (shield contact).
- IsekaiDemo frame 1155 and CombatDemo frame 147 remain pixel-identical to their pre-change reference images.
- Studio builds successfully and the MagicCombatDemo route returns HTTP 200 with the Studio markup. Direct interactive playback inspection could not be completed because the browser access host is unavailable. The local Remotion renderer successfully loads and draws the composition.

## Remaining limitations

Silent visual prototype; no narration or combat sound effects. Water, steam, cloth, and staff flight are authored SVG animation rather than fluid/rigid-body simulation. Hands and three-quarter turns retain the simplified cutout style. The one-charge lifecycle is deterministic choreography, not persistent inventory or a general spell runtime. A different encounter needs new paths/contact poses. Named groups appear in Studio, while the computed rig and effects are edited in source.

The relevant installed Remotion skills were reviewed. No external scripts, new packages, paid services, or cloud rendering were used. Review playback in Studio before requesting an MP4 export.
