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

## References Updated

- `src/main.ts` now loads selected Kenney sprites as Babylon.js textured planes.
- `public/assets/assets.manifest.json` records runtime asset roles and source.
- `README.md` and `docs/asset-source.md` record source and licence.

## Checks Required

- `npm run build`
- Local browser preview visual check
- GitHub Pages deployment check
- Deployed URL visual check

## Remaining Risks

- The game still relies on a large Babylon.js runtime bundle.
- Real mobile device testing is still required.
- Sprite readability should be checked with human players on small screens.
