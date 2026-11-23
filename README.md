# Isekai — The Unblessed

A local Remotion production foundation for an original Japanese-style 2D dark fantasy series, built around four working SVG cutout animation prototypes. Production defaults are **1920 × 1080 at 30 FPS**. Episodes will target roughly 8–12 minutes, adjusted to the approved adaptation. No paid API or cloud rendering is required.

The approved light novel is the single source of story truth. Prototype plots and dialogue are technical demonstrations, not approved episode scripts. Chapter 1, “Chuyến dã ngoại”, is planned for Episode 001; its complete approved text is not supplied here. No Episode 001 content or unpublished manuscript has been added.

## Preview and render

Requires Node.js 22+ and npm. From this folder:

```sh
npm ci
npm run preview
npm run render
```

Preview: http://localhost:3000/IsekaiDemo. Output: `out/isekai-demo.mp4` (H.264, with AAC audio). Remotion downloads its bundled browser on the first render; later preview and rendering work offline. Dependencies are pinned in `package-lock.json`.

The **CombatDemo** prototype is available at http://localhost:3000/CombatDemo: 15 seconds, 1920 × 1080, 30 fps. It adds a forest encounter with a goblin using the existing cutout character system. Review it in Studio first; no combat MP4 is generated automatically. See [the combat implementation report](COMBAT_PROTOTYPE.md) for the reusable clips, checks and limitations. `npm run render` continues to render `IsekaiDemo`.

The **MagicCombatDemo** prototype is available at http://localhost:3000/MagicCombatDemo: 18 seconds, 1920 × 1080, 30 fps. Yuu uses a single pre-enchanted Create Water scroll to turn heated stone into temporary steam cover, then physically disarms an enemy mage. Only the mage casts directly. See [the magic implementation report](MAGIC_COMBAT_PROTOTYPE.md). No full MP4 is generated for this preview.

The **EmotionalDemo** is available at http://localhost:3000/EmotionalDemo: 30 seconds, 1920 × 1080, 30 fps. It adds a quiet bus conversation, breakfast handoff and bracelet gesture using the shared facial rig. Preview is silent with optional dialogue captions; local recorded speech can drive mouth motion. See [the acting report and audio instructions](EMOTIONAL_ACTING.md). No new MP4 was rendered for Phase 5.

Canonical names are **Asakura Yuu (朝倉 悠)**, **Minase Shiori (水瀬 栞)** and **Tachibana Kairyū (橘 海龍)**. Existing art IDs `ren`, `mira` and `elias` remain stable; older reports use their former placeholder names.

```sh
npm run check      # TypeScript validation
npm run audio      # Rebuild the original, deterministic WAV soundtrack
```

## The demo

| Time | Action |
| --- | --- |
| 0–8s | Mountain road tracking shot; cut inside to chatting students and Yuu at the rear window |
| 8–15s | Kairyū gestures to his classmates; Yuu glances over, then turns back to the passing landscape |
| 15–23s | A rotating sigil forms under the bus, the landscape shifts, and a flash carries the class away |
| 23–32s | Students rise from the floor of a vaulted hall; gold particles gather most strongly around Kairyū |
| 32–40s | Yuu offers his empty hand, lowers it, and watches the others as the camera moves closer |

Yuu keeps his dark hair, navy jacket and teal scarf in every shot. Kairyū keeps his swept copper hair, pale jacket and gold badge. Shiori, Toma and Lina reuse the same designs throughout. The framing uses cinematic bars within the full 1920 × 1080 image. IsekaiDemo has no title cards or dialogue overlays.

## Local narration

The delivered version has music and ambience, **no spoken narration**. Place a recorded WAV or MP3 in `public/audio/`, then create `narration.props.json`:

```json
{
  "narrationFile": "audio/narration.wav",
  "narrationStartSeconds": 0,
  "soundtrackVolume": 0.6
}
```

```sh
npm run preview -- --props=narration.props.json
npm run render -- --props=narration.props.json
```

Record against the scene boundaries above (0, 8, 15, 23, 32, 40 seconds). `narrationStartSeconds` supplies a frame-rounded offset; adding narration automatically halves the soundtrack level. Scene boundaries live on the named `Sequence` nodes in `src/IsekaiDemo.tsx`. Edit those timings if a recording needs different cues, keeping the total 1200 frames for this demo. Narration is timeline-aligned; mouth motion is a stylized talk cycle, not phoneme-based lip sync.

## Small reusable pieces

- `src/components/Character.tsx`: a shared cutout rig with shaped clothing, hips, articulated sleeves and trousers, hands and boots; preserves the existing cast and pose API.
- `src/components/CharacterFace.tsx`: distinctive hairstyles, expressive eyes and brows, blinking, gaze and talking mouths.
- `src/components/characterMotion.ts`: deterministic idle, talk and walk samplers, staggered blinking and limb joint helpers. See [the character upgrade report](CHARACTER_UPGRADE.md).
- `src/components/Background.tsx`: parallax mountain layers, road, trees, vaulted hall, perspective floor and animated torches.
- `src/components/Bus.tsx`: shared bus exterior, seats and moving window environment.
- `src/components/Atmosphere.tsx`: camera transforms, frame-driven shake, magical circles, seeded particles, lighting and cinematic framing.
- `src/scenes.tsx`: five shots/scenes, gestures and camera choreography; fade-in, cutaways and a flash transition.
- `scripts/make-audio.mjs`: reproducible oscillator/noise synthesis for music, road rumble and summoning effects.

All motion depends on the Remotion frame, with no CSS animation, wall-clock time or unseeded randomness. The scene groups are named in Studio. Rig geometry and procedural effects are intentionally edited in source rather than through visual path controls. This is a compact film prototype, not a timeline editor or full animation engine.

The installed Remotion Agent Skills in `.agents/skills/` were reviewed for the rendering and character upgrades. No external skill scripts were executed.

## Production architecture — Phase 1

**Implemented:** centralized defaults; typed episode → scene → shot manifests; derived frame timelines; reusable Remotion sequencing with scene/shot audio cues; canonical character and asset registries; local asset preflight; production documentation. Existing prototype code, appearance, choreography, audio paths, durations and commands are preserved. No new dependencies or full MP4 exports are part of this phase.

| Module | Responsibility |
| --- | --- |
| `src/production/config.ts` | Defaults, naming conventions and seconds/frame conversion |
| `episodeTypes.ts`, `timeline.ts` | Typed manifests, derived duration, nested offsets and reference/timing validation |
| `EpisodeComposition.tsx` | Reusable scene/shot sequences; local audio cues; module-scope episode definition |
| `episodeRegistry.ts`, `EpisodeCompositions.tsx` | Opt-in production registrations; currently empty |
| `characterRegistry.ts` | Canonical identities mapped to unchanged legacy art IDs |
| `assetRegistry.ts` | Version/status/category and local file, logical component or planned asset references |
| `src/episodes/` | Future approved episode modules and an isolated noncanonical timing fixture |

To add an approved episode, create a manifest and explicit shot renderer table under `src/episodes/<episode-id>/`, export `defineEpisode(manifest, animations)`, then add it to `episodeRegistry`. The existing Root registers its component with duration derived from all shots. A renderer's `useCurrentFrame()` is shot-local; use its supplied offsets for scene/episode clocks. Camera, placement and animation metadata are consumed by the shot renderer, keeping existing rigs reusable. See the [implementation contract and workflow](docs/PRODUCTION_BIBLE.md) before authoring an episode.

Future episode export uses an explicitly selected registered ID:

```sh
npx remotion render src/index.ts <episode-id> out/<episode-id>-v<version>.mp4
```

`npm run preview` still opens the normal Studio list. `npm run render` still targets **IsekaiDemo**. No fake Episode 001 is registered. The development fixture can be opened separately with `npx remotion studio scripts/production-fixture.tsx`; it contains only a four-second frame counter for checking two scenes and three shots.

## Validation

```sh
npm ci
npm run check
node scripts/check-acting.cjs
node scripts/check-combat.cjs
node scripts/check-magic.cjs
npm run check:production
npm run check:assets
npx remotion compositions src/index.ts --is-production=false
```

On Windows PowerShell, use `npm.cmd` / `npx.cmd` if the shell blocks their `.ps1` wrappers. The focused production check covers nested cut boundaries, derived totals, audio bounds, canonical aliases, asset references and original composition metadata. File preflight checks all registered file-backed assets under `public/`; planned assets do not need fake files. Neither check substitutes for visual, audio or story QC.

For a few fixture frames without an MP4:

```sh
npx remotion render scripts/production-fixture.tsx DevelopmentTimingFixture out/production-timing --frames=29,30,89,90 --image-format=png --is-production=false
```

## Production documents and remaining work

- [Production bible](docs/PRODUCTION_BIBLE.md): workflow, adding episodes, timing and integration.
- [Visual bible](docs/VISUAL_BIBLE.md): proposed direction and visual approval boundaries.
- [Continuity](docs/CONTINUITY.md): source fidelity, reset mechanics and reveal order.
- [Character registry](docs/CHARACTER_REGISTRY.md): canonical IDs, legacy aliases and design approval.
- [Audio standard](docs/AUDIO_STANDARD.md): future voice, cue, organization and QC requirements.

Phase 1 provides the foundation; it does not produce an episode. Phase 2 adds the hybrid puppet renderer described below; approved anime artwork/master sheets remain outstanding. Later work is **3: narration, dialogue mixing and advanced lip-sync**, **4: Episode 001 vertical slice**, and **5: full Episode 001**. These production phase numbers are separate from the historical prototype phases in the older reports. Work on those phases requires the approved story/adaptation and assets; none is inferred here.

## Phase 2: hybrid character visual test

`CharacterVisualTest` is a **24-second, 1920×1080, 30 FPS noncanonical technical test**. It reuses original provisional character art, with a PNG eye layer, WebP hair layer and SVG jacket layer alongside procedural vector layers. No approved final character designs or extra dependencies were added. The four existing demos and their durations remain unchanged.

```sh
npm run preview
node scripts/check-visual.cjs
npx remotion render src/index.ts CharacterVisualTest out/character-visual --frames=45,180,210,240,314,330,359,381,403,425,447,525,570,660,705 --image-format=png --scale=0.5 --concurrency=2 --is-production=false
```

Select `CharacterVisualTest` in Studio. Its sampled poses/layer maps are code-driven; title/status copy is editable. No full MP4 is needed for this phase. `npm run render` retains the original Isekai MP4 pipeline.

`src/visual/CharacterRenderer.tsx` resolves canonical IDs and artwork version pins; `LayeredCharacter` paints configurable parts, while `samplePerformance` supplies motion independently. `withExistingPose` preserves authored combat grip geometry, and `mode="procedural"` uses the existing character renderer. Future shot placements can select `appearance: {id, version}` and `costume`; episode `assetPins` reject declared version mismatches.

See [Artwork pipeline](docs/ARTWORK_PIPELINE.md) for import/export, provenance and approval requirements, [Puppet rig standard](docs/PUPPET_RIG_STANDARD.md) for coordinates, animation and limitations, and [Phase 2 review](docs/PHASE_2_VISUAL_REPORT.md) for validation evidence. Yuu, Kairyū and Shiori are technically animatable with provisional art; **none is approved for final episode production**.
