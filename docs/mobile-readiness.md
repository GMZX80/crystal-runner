# Mobile Readiness

## Current Status

Browser-first mobile testing is prepared through responsive layout, touch buttons, swipe controls, safe-area CSS, and capped Babylon device pixel ratio.

## Performance Budget

- Target frame rate: 60 FPS where possible.
- Geometry: generated low-poly meshes only.
- Textures: none.
- Audio: short WebAudio tones only.
- Initial asset payload: no external assets.

## Checks Required

- Android Chrome real-device test.
- iOS Safari real-device test.
- Tablet browser test if tablet support is claimed.
- Touch latency and missed swipe rate.
- Orientation and safe-area review.
- Audio unlock behaviour.
- Pause/resume through visibility changes.

## Capacitor Preparation

The project builds to `dist`, which is suitable as a future Capacitor `webDir`. Capacitor is not installed or synced in this pilot.
