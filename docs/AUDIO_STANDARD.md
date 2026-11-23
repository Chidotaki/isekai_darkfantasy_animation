# Audio production standard

These are proposed production requirements for later voice/mixing work. Phase 1 supplies cue interfaces and simple local playback; it supplies no new voice takes, dialogue, narration, TTS provider or mixing pipeline.

| Category | Production responsibility |
| --- | --- |
| Narration | Approved adaptation text and narrator performance; source/revision reference |
| Dialogue | Approved lines, canonical speaker ID, selected take and timing sheet |
| SFX | Authorized reusable effects placed at authored action/contact frames |
| Ambience | Consistent room/environment bed across adjoining shots |
| BGM | Authorized music, cue intent and reviewed voice balance |

Keep lossless source masters and versioned selected takes. Proposed recording delivery is PCM WAV at 48 kHz, with consistent channel layout, no clipping and enough head/tail room for editing. Confirm final loudness/peak targets with the delivery specification; this foundation does not impose an unverified platform standard. Existing `prepare-speech.mjs` accepts 16-bit PCM and produces a 24 kHz prototype mix; it is not the future production mastering tool.

New distributable assets may use `public/audio/<episode-id>/<category>/<cue-id>-v<version>.wav`. Shared licensed assets may use `public/audio/shared/`. Do not move `public/audio/isekai-score.wav`. Avoid committing unpublished voice/story material without explicit authorization. Paths in file-backed registry entries are relative to `public/`, use forward slashes and must not be URLs or traversal paths.

Register narration, dialogue, SFX, ambience and BGM with their corresponding asset category, version, approval status and optional provenance metadata. A `planned` source can record a missing future deliverable without fabricating a file. `npm run check:assets` fails for missing/unsafe file-backed entries; planned entries are reported separately. It does not verify media length, rights or mastering quality.

`AudioCue.from` and `durationInFrames` use 30 FPS frames relative to the owning scene or shot. `trimBefore` is a source-file frame offset; do not add it to the timeline start. Cues must fit inside their owner. Place a cue on the scene to span a shot cut; cross-scene beds currently require explicit split cues with matching source trims. Scene gain multiplies individual cue gain. Overlap is permitted for different audio layers; intentional dialogue turn-taking is an adaptation/QC responsibility.

Keep lip-sync timing alongside its approved voice take and stable cue ID. The existing amplitude-based mouth system may be used for prototypes, but it does not identify phonemes. Advanced lip-sync, automated ducking, mastering and multi-character voice production belong to Phase 3. QC must listen for intelligibility, clipping, cut-off words, discontinuous ambience and speaker/mouth mismatch at the final frame rate.
