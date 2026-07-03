# Testing

## Local Commands

```bash
npm install
npm run build
npm run preview
```

## Browser QA Checklist

- [ ] Game loads locally with `npm run dev`
- [ ] Production build passes
- [ ] Preview opens
- [ ] GitHub Pages URL opens
- [ ] Assets load correctly
- [ ] No critical console errors
- [ ] Keyboard controls work
- [ ] Touch controls work
- [ ] Score updates
- [ ] Crest collection works
- [ ] Collision/failure works
- [ ] Restart works
- [ ] Sprite planes are upright billboards, not floor decals
- [ ] Collision uses invisible proxies rather than transparent sprite rectangles
- [ ] Desktop layout works
- [ ] Mobile browser layout works
- [ ] Audio/visual feedback works where implemented

## Current Evidence

Validated on 2026-07-03:

- `npm install`: passed. In this local container, the first install omitted dev dependencies; `npm install --include=dev` installed Vite/TypeScript and GitHub Actions `npm ci` installed successfully.
- `npm run build`: passed.
- `npm run preview`: passed at `http://localhost:4173/crystal-runner/`.
- GitHub Pages: passed at `https://gmzx80.github.io/crystal-runner/`.
- Workflow: `https://github.com/GMZX80/crystal-runner/actions/runs/28656028435`.

## 2026-07-03 Billboard Sprite Iteration

- `npm run build`: passed.
- Local preview: passed at `http://localhost:4173/crystal-runner/`.
- Console errors: none in local preview.
- Desktop viewport: upright billboard player, crests, and hazards visible.
- Mobile-sized viewport: HUD/buttons fit and upright sprites remain readable.
- Collision/game-over/restart: passed locally.
- Deployment commit: `eedf39b701ff16719ccccd76e67aba103ce11722`.

## Deployed URL Checks

- [x] Game loads from GitHub Pages
- [x] Assets load correctly
- [x] No critical console errors; only normal Babylon startup log observed
- [x] Keyboard controls work
- [x] Touch button controls work in browser automation
- [x] Score updates
- [x] Collision/failure works
- [x] Restart works
- [x] Desktop layout works
- [x] Mobile viewport layout works in browser automation
- [x] Audio/visual feedback works where implemented

## Not Yet Completed

- Real Android Chrome device test.
- Real iOS Safari device test.
- Tablet browser test.
