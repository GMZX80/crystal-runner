# Skill Pilot Gap Report

Pilot project: Crystal Runner

Date: 2026-07-03

## Skills Used

- 00 Pipeline Orchestrator
- 01 Game Concept and Player Experience
- 02 Core Loop Prototype
- 03 Babylon Project Scaffold
- 04 Babylon Scene Architecture
- 05 Game Systems Architecture
- 06 Input and Controls
- 07 Asset Pipeline and Optimisation
- 08 Game Feel, Feedback, and Juice
- 09 Flow, Difficulty, and Progression
- 10 Onboarding and First-Hour Retention
- 11 Mobile Performance
- 12 Capacitor Packaging
- 15 Testing and Quality Assurance
- 16 Accessibility and Inclusive Design
- 17 Ethical Engagement
- 18 CI/CD and Release Automation
- 19 Documentation and Project Handoff
- 20 GitHub Repository, Pages Deployment, and Human Playtesting Iteration

## Where The Skills Were Clear

- The required pipeline order was clear: local browser build, GitHub repository, GitHub Pages deployment, deployed URL testing, then mobile packaging preparation.
- The Vite base path requirement was explicit and easy to apply.
- The GitHub Pages workflow template mapped directly into the project.
- The core loop and input skills helped keep the first game scope small and touch-first.

## Where The Skills Were Vague

- The scene architecture skill gives lifecycle method names, but not a concrete minimal Vite/Babylon TypeScript file pattern.
- The mobile performance skill asks for real devices but does not define a fallback validation pattern when the pilot environment lacks physical Android/iOS devices.
- The Capacitor packaging skill is clear, but for a pilot that should only document preparation, it could include a lighter "not yet packaging" checklist.

## Missing Templates

- A compact one-page production pilot checklist would reduce overhead.
- A minimal Babylon arcade scene template would speed up first implementation.
- A deployed-URL QA result template would be useful.

## Incorrect Assumptions

- No blocking incorrect assumptions discovered so far.

## Technical Problems

- The local environment's first `npm install` passed but did not install dev dependencies, so `npm run build` initially failed with `vite: not found`. Running `npm install --include=dev` fixed the local environment, and GitHub Actions `npm ci` worked.
- Importing Babylon from the root `@babylonjs/core` barrel produced a roughly 5.98 MB minified JS chunk. Switching to more granular Babylon imports reduced the main built JS chunk to roughly 1.12 MB, but Vite still warns about a chunk over 500 kB.

## Deployment Problems

- The first GitHub Pages deployment created the artifact and deployment but returned `Deployment failed, try again later.` Rerunning failed jobs succeeded without workflow changes. This should be recorded as a possible transient first-time Pages issue.

## Recommended Fixes To game-production-skills/

- Add a minimal `scene-template.ts` that is directly compatible with Vite and `@babylonjs/core`.
- Add a `deployed-url-test-results.md` template under skill 15 or 20.
- Add a "browser pilot only; Capacitor later" subsection to skill 12.
- Add a note in skill 03 or 07 warning that Babylon root barrel imports can create very large bundles; prefer granular imports for browser/mobile pilots.
- Add a note in skill 20 that first-time GitHub Pages deployment can fail transiently after enabling Pages and may pass on rerun if the artifact was created successfully.
