# Yuu facial sprites v1

The supplied package was found at `public/asakura_yuu_facial_assets_4x5/`, not the requested path. Its manifest and PNGs were inspected, then copied unchanged to `public/assets/characters/asakura-yuu/facial-v1/sprites/`. The original package is untouched. `assembled_preview.png` is retained only as a reference; it is never loaded by the renderer.

`YuuFacialRenderer` uses one fixed base head, back hair and front hair. Expressions select only eyes, eyebrows and mouth. `yuuFacialSprites.ts` records explicit source landmarks, target landmarks, per-sprite scales and constant source-space clips. The manifest's independently centered cells are not treated as aligned layers. The eye cells include brow marks; the clips remove those upper marks for separate eyebrow control. A constant hidden-crown crop prevents the bald base from showing between hair wisps. No full-head expression replacements or new painted assets are used.

Use inside an SVG:

```tsx
<YuuFacialRenderer expression="worried" blink={0} mouth="mouth_open_small"/>
```

Coordinates use a 512-unit canvas. The neck anchor is `(253,356)`. `yuuFaceFromPerformance(performance)` adapts the existing facial/talk channels. The renderer supports neutral, happy, worried, serious and surprised, discrete open/half/closed eye swaps, and eight mouth sprites. Only mouth and feature sprites change; base/head/hair sources and anchors remain constant.

For Yuu's existing starter body, opt in with `CharacterRenderer facialMode="sprites-v1"`. It removes the old portrait/overlay layers and attaches the new face at the existing head bone, at scale `0.32`. `neckOnly` clips the supplied school-uniform bust so it does not overwrite the fantasy outfit. Unsupported characters/body appearances fail explicitly; there is no silent full-head fallback. Existing compositions keep their current defaults, and Kairyū/Shiori art and performance data are untouched.

`YuuFacialTest` is a 12-second, 1920×1080, 30 FPS noncanonical fixture: a large face, the existing body integration, and five static expression specimens. It demonstrates expression changes, blinking and deterministic mouth cycling without audio.

```sh
npm run preview
npm run check
npx remotion render src/index.ts YuuFacialTest out/yuu-facial-v1 --frames=15,112,272 --image-format=png --concurrency=2 --is-production=false
```

Verification uses only three representative PNG files: `out/yuu-facial-v1/element-015.png` (neutral), `element-112.png` (happy/blink), `element-272.png` (surprised/talk). The expression specimens allow all five mappings to be inspected in those same frames. TypeScript, production/assets and the existing visual checks pass. A focused source/markup check verifies all 19 runtime sprites against the supplied files and fixed head/hair sources across five expressions and three blink states; actual image loading is checked in Remotion's browser renders.

Limits: these are independently drawn sprite cells, not an artist-rigged layered master. Cropping the extra brow marks trims some upper-eye detail; mouths retain their supplied lip shading, and the closed-eye asset reads as a soft squint. The hair/nose/base stay fixed rather than turning in perspective. Head-to-body skin/neck joins remain approximate. Talking is sprite cycling, not phoneme lip-sync. The calibrated assembly is a technical integration; it does not reproduce every detail of the separately drawn assembled preview. No Chapter 1, other-character changes, dependency additions, new audio or MP4 export is included.
