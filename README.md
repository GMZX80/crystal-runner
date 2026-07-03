# Crystal Runner

Crystal Runner is a small mobile-first Babylon.js 3D arcade game. The player controls a glowing runner on a narrow floating runway, dodges solid hazards, collects crystals, and tries to survive as speed increases.

## Play

- GitHub Pages: https://gmzx80.github.io/crystal-runner/
- Repository: https://github.com/GMZX80/crystal-runner
- Current status: playable browser pilot

## Controls

- Keyboard: `A` / `D` or left/right arrows
- Start/restart: `Space`, `Enter`, or the on-screen button
- Touch: swipe left/right or use the on-screen lane buttons

## Local Setup

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deployment

The Vite base path is configured for a GitHub Pages project site:

```ts
base: "/crystal-runner/"
```

GitHub Pages deploys from `.github/workflows/deploy.yml` using GitHub Actions. GitHub Pages is the browser playtesting stage, not Android or iOS deployment.

Latest validated deployment before the 3D runway-light iteration:

- Live URL: https://gmzx80.github.io/crystal-runner/
- GitHub Pages deploys automatically from `main`.

## Assets

The active game build uses lightweight procedural Babylon.js mesh primitives:

- Player: glowing capsule/sphere mesh.
- Collectibles: faceted crystal-like mesh.
- Hazards: solid mesh obstacles.
- Path: 3D mesh runway with rails and animated runway lights.
- Effects: simple emissive mesh pulse.

The Kenney Pirate Pack assets remain documented from the earlier sprite experiment, but the current runtime no longer depends on them.

## Mobile Packaging Preparation

The project is structured for later Capacitor preparation through the `dist` web build. Android and iOS packaging are documented but not performed in this pilot.

## Documentation

- `docs/game-concept.md`
- `docs/core-loop.md`
- `docs/player-experience.md`
- `docs/flow-progression.md`
- `docs/onboarding.md`
- `docs/input-map.md`
- `docs/mobile-readiness.md`
- `docs/testing.md`
- `docs/playtesting.md`
- `docs/deployment.md`
- `docs/known-issues.md`
- `docs/iteration-log.md`
- `docs/skill-pilot-gap-report.md`
- `docs/asset-representation.md`
- `ASSET_OPTIMISATION_REPORT.md`
