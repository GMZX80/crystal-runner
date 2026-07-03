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
- Selected runtime payload added is under 15 KB before build copying.
- Runtime sprites are displayed as unlit alpha billboard planes so they read correctly in the 3D camera.
- Gameplay entities use invisible collision proxies so transparent sprite pixels do not create unfair collisions.

## Supported Visual Asset Classes

### 3D assets

- GLB/glTF models.
- Used for world geometry, path, environment props, and later character/ship models.
- Must follow mobile performance budgets for triangles, materials, textures, draw calls, and loading time.

### 2.5D sprite assets

- Transparent PNG sprites or spritesheets.
- Used for fast iteration, pickups, hazards, characters, and effects where 3D models are not yet justified.
- Must use alpha-aware unlit materials and vertical billboard planes unless deliberately used as a floor decal.
- Must use a separate collision proxy for gameplay.

## References Updated

- `src/main.ts` now loads selected Kenney sprites as Babylon.js textured planes.
- `public/assets/assets.manifest.json` records runtime asset roles and source.
- `README.md` and `docs/asset-source.md` record source and licence.

## Checks Required

- `npm run build`: passed locally after billboard refactor.
- Local browser preview visual check: passed for upright sprites, collision/restart, and mobile-sized viewport.
- GitHub Pages deployment check: passed for commit `9c8dc6925475f9903c5d47428e97f966421bdecb`.
- Deployed URL visual check: passed for desktop and mobile-sized viewports.

## Remaining Risks

- The game still relies on a large Babylon.js runtime bundle.
- Real mobile device testing is still required.
- Sprite readability should be checked with human players on small screens.
