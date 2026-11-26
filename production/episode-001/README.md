# Episode 001 production handoff (Chapter 1)

This **production plan**, not a finished video or approved spoken adaptation, is based on Chapter 1 (pages 1–21) of the privately held approved manuscript *Isekai Dark Fantasy Project.docx*.

- `chapter1-plan.json` identifies all 10 ordered story beats and their intended camera/acting work, needed poses, source pages, and meaningful silence. The shot IDs are stable planning identifiers for Antigravity/Remotion; they are **not** yet registered production compositions.
- `voice-cues.template.json` provides stable per-scene voice and silent-action IDs **without publishing the manuscript**. An authorized local agent fills a private copy of the cue sheet using the actual manuscript. Each generated WAV is individually named and measured.
- Start visually with `s001`, then `s002`, not the entire episode. Implement under `src/episodes/episode-001/` using existing `defineEpisode`, `EpisodeManifest`, `EpisodeComposition` and typed audio cues, but register only genuinely previewable compositions.
- There must be **no new character dialogue or fake audio** invented from these outlines; consult the full local manuscript before writing spoken lines.
- The video and voice agents may work in parallel **after** the shot IDs and cue IDs are agreed, but not heavy CPU/GPU synthesis and Chromium rendering at the same time on a 16 GB RAM machine.
- Voice: one selected female Vietnamese VieNeu-TTS voice; `Asakura Yuu` is shown in subtitles and written manuscript, while `Asakura Yu` is the tested model input. Check other names manually.
- Asset continuity: school uniforms on the bus and in the summoning hall. The existing old fantasy bodies are not approved replacements for the school-uniform costumes.
- The elderly ritual official's mouth sprite is still imperfect: keep him in medium/wide framings and prefer neutral lips or cutaways; avoid dramatic mouth closeups.
- Provisional scene seconds are only planning estimates. Actual durations follow spoken WAV files, acting and intentional silence, and can exceed the 8–12 minute target if needed for faithful adaptation.

## Suggested local audio handoff

```text
production/episode-001/voice-cues.private.json     # local, do not commit
public/audio/episode-001/narration/s001-v01.wav     # local output, review before committing
public/audio/episode-001/narration/s001-v02.wav
production/episode-001/timing.private.json          # measured durations and silence
```

Make sure private production text and unreviewed WAV files remain excluded from public commits.

## First implementation milestone

1. Build genuine Japanese-uniform seated Yuu and an accompanying student/bus environment from approved references; no fantasy costume substitutions.
2. Animate the four planned `s001` shots with eye/head/arm and camera movement; include a real quiet reaction hold.
3. Preview short segments using low-resolution render, `--concurrency=1` and without TTS running.
4. Generate only the speech cues for `s001` with VieNeu-TTS on the local machine; measure WAV timing.
5. Adjust visual shot durations around narration and silence, then complete the opening scene before repeating the workflow across the other nine.
