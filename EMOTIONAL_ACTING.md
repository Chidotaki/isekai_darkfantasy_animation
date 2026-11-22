# Phase 5 — Character acting

`EmotionalDemo` is a 900-frame, 30 fps, 1920 × 1080 bus conversation. The existing character component, body rig, backgrounds and rendering pipeline are reused. All three earlier compositions retain their durations and scene flow. Their characters now share the upgraded faces; Yuu wears his silver bracelet.

## What changed

- `src/components/faceRig.ts` defines 16 expression presets, adjustable intensity, continuous blending, independent gaze, eyelids, eyebrows, mouth and head controls. `CharacterFace.tsx` draws the same facial geometry throughout transitions instead of replacing it with icons.
- `src/acting/acting.ts` supplies small, event-driven posture adjustments, listening, hesitation, nervous hands, gaze avoidance, sighing and relaxation. Existing breathing and deterministic blinking remain in use. Performances settle during pauses.
- `src/acting/speech.ts` and the existing `characterMotion.ts` use seven mouth shapes: rest, closed, A, E, O, U and F. Speech adds restrained facial and head movement. Imported amplitude envelopes close the mouth during quiet passages.
- `src/acting/interactions.ts` provides facing-aware gaze, delayed reactions, hand targets and object handoffs. Breakfast changes ownership at frame 132 with matching world-space contact points. The bracelet adjustment targets Yuu's actual wrist.
- `src/acting/camera.ts` provides close-up, medium, two-shot, over-the-shoulder and reaction framing, plus slow push/pull moves. The demo keeps one screen axis, including a rear-view foreground shoulder.
- `src/acting/emotionalTimeline.ts` coordinates the five requested beats on one frame clock. Shiori's familiarity is platonic; the bracelet sequence has no explanatory caption. `characterMetadata` supplies the canonical names while retaining the original IDs.

The shared `Character` accepts `expression`, `expressionIntensity`, `expressionBlend` and partial `face` controls. For example:

```tsx
<Character id="ren" x={900} y={940} t={frame / 30}
  expression="restrained" expressionIntensity={0.6}
  expressionBlend={{expression: 'amused', weight: 0.3}}
  face={{gazeX: -0.4, gazeY: 0.1, headTilt: 1.5}} />
```

## Preview and local speech

```sh
npm run preview
# Open http://localhost:3000/EmotionalDemo
npm run check
node scripts/check-acting.cjs
```

The default preview is silent, with brief dialogue captions. Set `showDialogue` to `false` in a props JSON to hide them. No usable local Windows speech-synthesis voice was available, so no synthetic voice is bundled.

To use your own recordings, put **16-bit PCM WAV** clips in `public/audio/`. Create a project-local JSON manifest; `from` is the start frame and actor IDs stay `ren`, `mira` and `elias`:

```json
[
  {"actor":"elias","from":30,"file":"public/audio/breakfast.wav","text":"Skipped breakfast? Here."},
  {"actor":"ren","from":142,"file":"public/audio/thanks.wav","text":"Thanks. Good timing."}
]
```

```sh
node scripts/prepare-speech.mjs dialogue.json
npm run preview -- --props=out/emotional-audio.props.json
```

The helper trims quiet edges, mixes a 30-second local WAV at `public/audio/emotional-dialogue.wav`, and writes frame-aligned RMS mouth envelopes and captions into `out/emotional-audio.props.json`. It rejects overlapping lines and clips extending past 900 frames. Match recordings to the dialogue windows in `src/acting/dialogue.ts`; body acting remains authored to those windows. Missing manifest lines are silent. No provider, API, phoneme model or extra dependency is required.

## Verification and limits

TypeScript and the focused acting, combat and magic checks pass. Acting checks cover 16 presets, seven mouth shapes, 2,700 deterministic poses, handoff ownership/contact, wrist contact, gaze, pauses and character spacing. PCM import was checked with a local generated fixture containing both sound and silence. Selected rendered frames were inspected across all five story beats, including the handoff, over-the-shoulder shot and sleeve adjustment. Preview images are in `out/emotional-preview.png`, `out/emotional-bracelet-preview.png` and `out/expression-presets.png`.

Regression stills from IsekaiDemo (frame 1155), CombatDemo (147) and MagicCombatDemo (240) also rendered and were visually inspected. The Studio route responds locally and the Remotion bundle registers all four compositions. Interactive browser inspection was unavailable because the browser access host could not connect; rendered frame inspection provides the visual check.

Speech shapes approximate articulation from amplitude and a deterministic shape cycle; they do not identify phonemes. The face is a stylized frontal/three-quarter cutout with a simple rear view, not a continuously rotating 3D head. Hand shapes and sleeve motion are deliberately limited. No full MP4 was generated or refreshed in this phase; existing MP4 files predate these changes.
