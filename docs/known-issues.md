# Known Issues

## Current Known Issues

- Real-device Android Chrome testing not yet completed.
- Real-device iOS Safari testing not yet completed.
- Reduced-motion toggle not yet implemented.
- Colour-blind safe patterning could be improved by adding more shape/animation distinction.
- Capacitor project has not been generated yet.
- Production bundle still includes a large Babylon chunk. It is much smaller after switching away from root barrel imports, but Vite still warns about a chunk over 500 kB.
- GitHub Actions currently emits a Node 20 deprecation warning from upstream actions running under Node 24. Build and deployment still pass.

## Accepted Pilot Constraints

- Placeholder/generated assets only.
- No final art or music.
- No online services or telemetry.
