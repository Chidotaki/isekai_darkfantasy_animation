# Production bible — Phase 1 foundation

The approved light novel is the sole source of story truth. Engine prototypes demonstrate techniques; they are not approved episode adaptations. Episode 001 is planned to adapt Chapter 1, **“Chuyến dã ngoại”**. Its complete approved text is not supplied here. Keep unpublished manuscripts outside this repository; store only authorized source references and revision identifiers in manifests.

## Workflow

Approved chapter → Adaptation script → Scene breakdown → Storyboard / Animatic → Asset preparation → Voice production → Remotion animation → Audio mixing → QC → Final render.

| Stage | Reviewable output |
| --- | --- |
| Approved chapter | Author-approved source reference and revision; permitted reveal order |
| Adaptation script | Approved narration/dialogue and action mapping to the source; no inferred dialogue |
| Scene breakdown | Locations, cast, continuity, ordered shots and provisional durations |
| Storyboard / Animatic | Composition, screen direction, blocking and pacing review |
| Asset preparation | Versioned, approved rig/art/background/prop references |
| Voice production | Approved takes and timing sheets; see [audio standard](AUDIO_STANDARD.md) |
| Remotion animation | Deterministic acting and shot implementations using approved material |
| Audio mixing | Intelligible voices, controlled effects/music, reviewed transitions |
| QC | Source fidelity, reveal order, continuity, missing assets, sync, visual and technical checks |
| Final render | Reviewed episode version and explicit export; retain reproducible source/asset versions |

The expected duration is about 8–12 minutes, adjustable to the approved adaptation. This is guidance, not a fixed runtime or a reason to pad/remove story events. Scene durations are sums of shot frame counts; episode duration is the sum of scenes.

## Implementation contract

`src/production/config.ts` supplies 1920×1080, 30 FPS defaults, naming conventions and frame conversion helpers. The four prototype registrations keep their original inline metadata for Studio compatibility; `check:production` verifies that they match these defaults. Do not rewrite their authored frame constants.

`EpisodeManifest` → `SceneManifest[]` → `ShotManifest[]` forms the data model. `buildTimeline()` validates IDs, references and timing, then calculates offsets once. Intervals include their start and exclude their end. A scene has independent background/audio settings and continuity notes. Shots reference camera settings, reusable animation renderers, cast placements, expressions/motion, audio cues and assets.

`defineEpisode(manifest, animations)` runs at module scope and returns the manifest, computed timeline and a React component. Its renderer table maps explicit animation IDs to components; nothing is evaluated from a string. `EpisodeComposition` uses nested Remotion `Sequence`s. A renderer receives its scene, shot and offsets:

- `useCurrentFrame()` is **shot-local** (starts at zero at each cut).
- Scene frame = local frame + `shotStart`.
- Episode frame = local frame + `episodeStart` (`sceneStart + shotStart`).
- Use `useVideoConfig().fps` to sample existing second-based animation helpers.

Renderers decide how to draw camera/character/asset references. The shell does not reinterpret existing combat choreography or apply camera transforms twice. Reuse `Character`, `Camera`, `frameShot`, acting helpers and environments inside those renderers. Map canonical identity through `characterAssetId()` before passing `id` to `Character`. Logical registry references are documentation/lookup keys, not automatic imports.

## Adding an approved episode

1. Confirm the source/adaptation approval and permitted material for source control. Do not copy the manuscript into a manifest.
2. Register available assets and cast in the existing registries; review status/version metadata. Planned assets may be catalogued but cannot be used as playable audio.
3. Add a module under `src/episodes/<episode-id>/`. Create an `EpisodeManifest` with `satisfies EpisodeManifest`, using the production defaults and approved ordered scenes/shots. Use `secondsToFrames()` only at authoring boundaries.
4. Implement reusable `ShotRendererProps` components. Export `defineEpisode(manifest, {'animation-id': Renderer})`. Keep the manifest immutable and the renderer table outside frame-dependent React functions.
5. Import that definition into `episodeRegistry`. `EpisodeCompositions` registers it through the existing Root with derived duration. IDs must be unique, including against the four prototypes. Only `kind: 'production'` entries belong here.
6. Run the checks in README, preview the actual episode, then explicitly render the selected episode ID after QC.

The four-second `developmentManifest.ts` / `developmentFixture.tsx` demonstrates two scenes and three shots with no story, speech or artwork. Its separate entry is `scripts/production-fixture.tsx`; it is deliberately absent from the production registry and normal Studio list.

## Scope boundaries

Phase 1 implements configuration, manifests, registry/preflight, sequencing and documentation. It does not implement scene transitions with overlapping durations, a universal shot renderer, an asset uploader, automated approvals, advanced audio mixing or production storytelling. Approval status is metadata and a human review responsibility, not a claim that current prototype artwork is final.

Later production phases (distinct from older prototype phase numbers): **2** approved anime artwork/master sheets/hybrid puppets; **3** full narration, dialogue mixing and advanced lip-sync; **4** approved Episode 001 vertical slice; **5** complete Episode 001 production. None is implemented by this foundation change.
