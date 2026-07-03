# Known Issues

## Current Known Issues

- Real-device Android Chrome testing not yet completed.
- Real-device iOS Safari testing not yet completed.
- Reduced-motion toggle not yet implemented.
- Colour-blind safe patterning is improved by distinct 3D crystal/hazard/player meshes, but still needs real-player accessibility feedback.
- Capacitor project has not been generated yet.
- Production bundle still includes a large Babylon chunk. It is much smaller after switching away from root barrel imports, but Vite still warns about a chunk over 500 kB.
- GitHub Actions currently emits a Node 20 deprecation warning from upstream actions running under Node 24. Build and deployment still pass.

## Fixed During Pilot

- Keyboard, touch button, and swipe inputs initially moved the runner in the opposite visible screen direction because the camera-facing view mirrored the lane coordinate direction. This was fixed by mapping inputs to screen-facing movement helpers.
- Kenney sprite artwork was initially displayed as textured planes that read like floor decals in the 3D camera view. This was fixed temporarily with upright Y-axis billboard planes, then superseded by the current lightweight 3D mesh primitive pass.
- The sprite-billboard experiment was superseded by lightweight 3D mesh primitives plus dynamic runway lighting, restoring the original 3D-shape direction while keeping the 3D scene/collision structure.

## Accepted Pilot Constraints

- No final music.
- No online services or telemetry.
