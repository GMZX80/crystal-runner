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
Feedback summary: Graham reported that left input moved the runner right and right input moved the runner left. Local visual validation confirmed the control direction needed to be inverted for the camera-facing view.
Bugs found: screen-facing input direction was reversed for keyboard, touch buttons, and swipe gestures; fixed in iteration 2.
Design issues found: early obstacle patterns may be demanding; needs human playtest tuning
Accessibility issues found: reduced-motion toggle and stronger non-colour distinctions not yet implemented
Performance issues found: Vite warns about a large Babylon chunk over 500 kB
Priority fixes: add reduced-motion option, improve visual distinction, tune first 30 seconds after human playtest
Next iteration goal: Tune mobile controls, add reduced-motion option, improve hazard/collectible visual distinction.

Iteration number: 2
Date: 2026-07-03
Git commit: pending at time of note
GitHub Pages URL: https://gmzx80.github.io/crystal-runner/
Build status: local build passed; deployment pending at time of note
Test objective: Fix and verify the playtester-reported input direction bug.
Target playtesters: Graham / early collaborators
Devices tested: desktop Chromium through Playwright automation
Browser/device notes: visual screenshots confirmed ArrowLeft moves the runner left on screen and ArrowRight moves the runner right on screen.
Feedback summary: Input direction now matches the visible lane direction.
Bugs found: no remaining input reversal found in local validation.
Design issues found: none newly discovered.
Accessibility issues found: none newly discovered.
Performance issues found: existing Babylon chunk-size warning remains.
Priority fixes: deploy input fix and retest from GitHub Pages.
Next iteration goal: Run real player testing from the corrected public build.

Iteration number: 3
Date: 2026-07-03
Git commit: pending at time of note
GitHub Pages URL: https://gmzx80.github.io/crystal-runner/
Build status: local build passed; deployment pending at time of note
Test objective: Replace flat floor-laid sprites with upright 2.5D billboard sprites in the Babylon.js 3D scene.
Target playtesters: Graham / early collaborators
Devices tested: desktop Chromium and mobile-sized Chromium viewport through Playwright automation
Browser/device notes: upright Y-axis billboard sprites render clearly from the main 3D camera; no critical console errors in local preview.
Feedback summary: Sprite artwork is no longer flattened onto the path; gameplay stays 3D with invisible collision proxies.
Bugs found: flat-sprite visibility issue fixed locally.
Design issues found: sea path still needs stronger pirate/environment theme.
Accessibility issues found: real-device small-screen readability still needs human testing.
Performance issues found: existing Babylon chunk-size warning remains.
Priority fixes: deploy and validate from GitHub Pages.
Next iteration goal: tune sprite scale/readability from real playtest feedback and theme the path/environment.
