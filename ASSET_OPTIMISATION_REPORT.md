# Asset Optimisation Report

Date: 2026-07-03

## Scope

- Audited `public/` before adding runtime sprites.
- Downloaded Kenney Pirate Pack to `.tmp/kenney-pirate/` for inspection only.
- Added selected default-size PNG sprites to `public/assets/kenney-pirate/`.

## Starting State

- `public/` file count: 1
- `public/` size: 12K
- Runtime assets before change: `assets.manifest.json`

## Source Pack

- Source: https://kenney.nl/assets/pirate-pack
- Licence: Creative Commons CC0
- ZIP size: about 2.5 MB
- Pack contents: 190 2D assets plus previews/vector/source material

## Runtime Assets Added

- `player-ship.png` - 4,184 bytes
- `collectible-gold-crest.png` - 2,055 bytes
- `obstacle-cannon.png` - 507 bytes
- `obstacle-cannonball.png` - 290 bytes
- `explosion-1.png` - 2,156 bytes
- `explosion-2.png` - 1,704 bytes
- `explosion-3.png` - 854 bytes
- `fire-1.png` - 441 bytes
- `LICENSE.txt` - 480 bytes

## Optimisation Decision

- No new image optimisation dependency was added.
- Files are already very small default-size transparent PNGs.
- The full ZIP, previews, vector sources, retina files, and unused sprites are not committed.
- Selected Kenney sprite payload is under 15 KB before build copying, but those images are no longer required by the active gameplay runtime.
- The active runtime uses procedural 3D Babylon.js meshes for player, crystals, hazards, runway markers, and effects.
- Gameplay entities use invisible collision proxies where useful so visual representation can change without changing collision rules.

## Supported Visual Asset Classes

### 3D assets

- Procedural Babylon.js meshes for current prototype visuals.
- GLB/glTF models for future world geometry, path, environment props, and later character/vehicle models.
- Must follow mobile performance budgets for triangles, materials, textures, draw calls, and loading time.

### 2.5D sprite assets

- Transparent PNG sprites or spritesheets.
- Optional future/fallback representation for fast art experiments, UI-world markers, and cheap effects.
- Must use alpha-aware unlit materials and vertical billboard planes unless deliberately used as a floor decal.
- Must use a separate collision proxy for gameplay.

## References Updated

- `src/main.ts` now uses lightweight procedural 3D meshes plus limited dynamic runway point lights.
- `public/assets/assets.manifest.json` records the previously selected Kenney sprite roles and source.
- `README.md` and `docs/asset-source.md` record source and licence.

## Checks Required

- `npm run build`: passed locally after the 3D mesh/runway-light refactor.
- Local browser preview visual check: passed for 3D runner, crystal meshes, hazard meshes, runway lights, controls, and score updates.
- GitHub Pages deployment check: pending for the 3D mesh/runway-light refactor at time of note.

## Remaining Risks

- The game still relies on a large Babylon.js runtime bundle.
- Real mobile device testing is still required.
- Dynamic lighting intensity and hazard readability should be checked with human players on small screens.
