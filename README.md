# Isekai — The Unblessed

A local Remotion proof of concept: **40 seconds, 1920 × 1080, 30 fps**, composition **IsekaiDemo**. Original SVG artwork and synthesized stereo music; no paid API, downloaded visual assets, or cloud rendering.

## Preview and render

Requires Node.js 22+ and npm. From this folder:

```sh
npm install
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
