# Core Loop

## Playable Slice

- One scene: floating path with three lanes.
- One action: switch lane.
- One challenge: avoid red obstacles.
- One reward: collect gold crests and increase score.
- One failure condition: collide with an obstacle.
- One retry loop: game-over overlay with restart.

## Repeatable Loop

1. Player starts run.
2. Cannon hazards and crests spawn ahead.
3. Player reads the lane pattern.
4. Player switches lanes with keyboard, swipe, or touch buttons.
5. Player collects crests or collides.
6. Score updates or run ends.
7. Player restarts immediately.

## Debug Overlay

The debug overlay shows FPS, current speed, state, and short collection feedback.
