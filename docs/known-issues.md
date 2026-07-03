# Known Issues

## Current Known Issues

- Real-device Android Chrome testing not yet completed.
- Real-device iOS Safari testing not yet completed.
- Reduced-motion toggle not yet implemented.
- Colour-blind safe patterning is improved by distinct ship/cannon/crest sprites, but still needs real-player accessibility feedback.
- Capacitor project has not been generated yet.
- Production bundle still includes a large Babylon chunk. It is much smaller after switching away from root barrel imports, but Vite still warns about a chunk over 500 kB.
- GitHub Actions currently emits a Node 20 deprecation warning from upstream actions running under Node 24. Build and deployment still pass.

## Fixed During Pilot

- Keyboard, touch button, and swipe inputs initially moved the runner in the opposite visible screen direction because the camera-facing view mirrored the lane coordinate direction. This was fixed by mapping inputs to screen-facing movement helpers.
- Kenney sprite artwork was initially displayed as textured planes that read like floor decals in the 3D camera view. Player, collectibles, hazards, and explosion effects now use upright Y-axis billboard planes through `src/rendering/AnimatedBillboard.ts`, with alpha-aware unlit materials and separate invisible collision proxy boxes.

## Accepted Pilot Constraints

- No final music.
- No online services or telemetry.
