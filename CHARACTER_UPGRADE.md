# Character upgrade

The existing `Character` component now draws a reusable stylized cutout puppet. Fuller jackets, separate hips, tapered sleeves and trousers, mitten hands, and shaped boots replace narrow stick limbs. Ren retains his dark hair, navy jacket, and teal scarf; the other four students retain their individual palettes and hairstyles.

`CharacterFace.tsx` supplies outlined eyes with pupils and highlights, expressive eyebrows, mouth poses, and staggered blinks with quick closure, softer release, and occasional double blinks. Hair fringes and Ren's scarf have subtle delayed secondary motion.

`characterMotion.ts` provides pure time-based helpers:

- Idle: slow chest expansion, slight pelvis sway, and independent head movement.
- Talk: short phrase envelopes with pauses, varying mouth opening, head nods, torso motion, and arm gestures.
- Walk: alternating stance and lifted recovery phases, pelvis weight shift, body rise and fall, arm swing, and eased blending into standing. Two-bone leg positioning keeps joints connected.

The existing feet-origin coordinates, cast IDs, pose names, and timing props remain compatible. All five `IsekaiDemo` scenes use the upgraded rig without changing scene flow, duration, camera choreography, audio support, or render commands. No dependencies were added.

Limitations: this is a frontal/three-quarter puppet rather than a full rotation rig. Hands use simple relaxed/open silhouettes. Walking approximates planted feet without solving world-space contact or collisions. Talking remains procedural rather than synchronized to recorded phonemes. The supplied soundtrack has no spoken narration.

Validation: TypeScript passed, as did 6,000 character/time motion samples and targeted joint checks. Seated, awakening, walking, blessing, waiting, and close-up frames were reviewed. The final local render took 93.8 seconds. `out/isekai-demo.mp4` contains 1,200 frames at 1920 × 1080, 30 fps, with 40 seconds of stereo AAC audio. Full video/audio decoding completed without errors.
