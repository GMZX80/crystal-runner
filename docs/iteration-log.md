# Iteration Log

Iteration number: 1
Date: 2026-07-03
Git commit: `eedf39b701ff16719ccccd76e67aba103ce11722`
GitHub Pages URL: https://gmzx80.github.io/crystal-runner/
Build status: passed after rerunning a transient failed Pages deploy job
Test objective: Validate that the first playable browser build loads, can be played with keyboard and touch controls, scores correctly, fails clearly, and restarts.
Target playtesters: Graham / early collaborators
Devices tested: desktop Chromium viewport and mobile-sized Chromium viewport through Playwright automation
Browser/device notes: GitHub Pages loaded with no critical console errors; normal Babylon startup log observed
Feedback summary: No human playtester feedback yet; automation confirms basic loop works
Bugs found: none blocking in automated browser checks
Design issues found: early obstacle patterns may be demanding; needs human playtest tuning
Accessibility issues found: reduced-motion toggle and stronger non-colour distinctions not yet implemented
Performance issues found: Vite warns about a large Babylon chunk over 500 kB
Priority fixes: add reduced-motion option, improve visual distinction, tune first 30 seconds after human playtest
Next iteration goal: Tune mobile controls, add reduced-motion option, improve obstacle/crystal visual distinction.
