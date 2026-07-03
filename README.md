# Crystal Runner

Crystal Runner is a small mobile-first Babylon.js 3D arcade game. The player controls a pirate ship on a narrow floating sea path, dodges cannon hazards, collects gold pirate crests, and tries to survive as speed increases.

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

Latest validated deployment before the Kenney sprite iteration:

- Commit: `30d02dbe6d51ab50b70f3c973ce58ce3b4b8525d`
- Workflow: https://github.com/GMZX80/crystal-runner/actions/runs/28656784958
- Result: passed after rerunning the initial Pages deploy job

## Assets

Selected sprites come from Kenney's Pirate Pack:

- Source: https://kenney.nl/assets/pirate-pack
- Licence: Creative Commons CC0
- Runtime files: `public/assets/kenney-pirate/`
- Notes: only selected default-size PNG delivery assets are committed; the full source ZIP is not committed.
- Representation: upright 2.5D billboard sprites inside the Babylon.js 3D scene with separate invisible collision proxies.

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
