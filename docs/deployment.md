# Deployment

Repository URL: pending creation

GitHub Pages URL: pending deployment

Vite base path:

```ts
base: "/crystal-runner/"
```

## GitHub Pages

Deployment uses `.github/workflows/deploy.yml`.

The repository settings should use GitHub Pages deployment from GitHub Actions.

## Browser Deployment Checklist

- [ ] Public repository suitability reviewed
- [ ] `npm install` passes
- [ ] `npm run build` passes
- [ ] `npm run preview` passes
- [ ] Workflow runs on push to `main`
- [ ] Pages deployment succeeds
- [ ] Deployed URL tested directly

## Android/iOS

GitHub Pages is not Android or iOS deployment. Later mobile packaging should start only after browser playtesting and performance checks are stable enough.
