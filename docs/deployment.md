# Deployment

Repository URL: https://github.com/GMZX80/crystal-runner

GitHub Pages URL: https://gmzx80.github.io/crystal-runner/

Vite base path:

```ts
base: "/crystal-runner/"
```

## GitHub Pages

Deployment uses `.github/workflows/deploy.yml`.

The repository settings should use GitHub Pages deployment from GitHub Actions.

## Browser Deployment Checklist

- [x] Public repository suitability reviewed
- [x] `npm install` passes
- [x] `npm run build` passes
- [x] `npm run preview` passes
- [x] Workflow runs on push to `main`
- [x] Pages deployment succeeds
- [x] Deployed URL tested directly

## Latest Deployment

- Commit: `eedf39b701ff16719ccccd76e67aba103ce11722`
- Workflow: `https://github.com/GMZX80/crystal-runner/actions/runs/28656028435`
- Note: first deploy job returned a transient GitHub Pages failure after artifact upload; rerunning failed jobs succeeded.

## Android/iOS

GitHub Pages is not Android or iOS deployment. Later mobile packaging should start only after browser playtesting and performance checks are stable enough.
