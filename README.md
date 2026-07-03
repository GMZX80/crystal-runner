# Crystal Runner

Crystal Runner is a small mobile-first Babylon.js 3D arcade game. The player controls a glowing runner on a narrow floating path, dodges red obstacles, collects blue crystals, and tries to survive as speed increases.

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

Latest validated deployment:

- Commit: `eedf39b701ff16719ccccd76e67aba103ce11722`
- Workflow: https://github.com/GMZX80/crystal-runner/actions/runs/28656028435
- Result: passed after rerunning the initial Pages deploy job

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
