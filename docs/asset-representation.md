# Asset Representation

## Current Decision

Crystal Runner is a 3D Babylon.js game with 2.5D animated billboard sprites for characters, collectibles, hazards, and effects.

The game keeps:

- Babylon.js `Engine`
- Babylon.js `Scene`
- 3D camera
- 3D path geometry
- 3D lane movement
- 3D collision proxies
- render-loop animation and validation

The sprite artwork is not drawn as a flat 2D canvas game and is not rotated onto the floor. Gameplay entities use an invisible collision proxy with a child visible billboard created through `src/rendering/AnimatedBillboard.ts`:

```text
entityRoot or collisionProxy
  -> visible AnimatedBillboard
```

## Reasons

- Fast iteration with the current Kenney sprite assets.
- Readable visuals from the 3D camera.
- Works in browser and remains suitable for later mobile testing.
- Collision boxes stay fair and independent from transparent sprite pixels.
- Visuals can later be replaced without rewriting gameplay logic.

## Supported Asset Classes

### 3D assets

- GLB/glTF models.
- World geometry, path, environment props, and later character or obstacle models.
- Must follow the mobile performance budget for triangle count, texture memory, draw calls, loading time, and disposal.

### 2.5D sprite assets

- PNG spritesheets or individual transparent PNG frames on upright billboard planes.
- Player, pickup, hazard, and cheap effect visuals during fast iteration.
- Must use alpha-aware materials, avoid opaque boxes, stay upright in the 3D scene, and remain separate from collision proxies.
- Spritesheet animation uses configurable rows, columns, frame ranges, looping, and frames per second.

## Decision Table

| Asset type | Immediate representation | Future representation | Reason |
| --- | --- | --- | --- |
| Player | Animated billboard sprite | GLB character model | Fast visible animation now, model later |
| Crystal | Billboard or simple mesh | GLB/mesh crystal | Must be readable as collectible |
| Obstacle | Billboard or simple mesh | GLB/mesh obstacle | Must be readable as hazard |
| Path | 3D mesh | 3D mesh | Core spatial reference |
| Effects | Billboard sprite/particles | Particles/sprites | Cheap and readable |

## Future Upgrade Path

- Replace the player billboard with a GLB/glTF ship or character model.
- Replace cannon hazards and crest pickups with GLB/glTF models or simple low-poly meshes.
- Keep the collision proxy pattern so visual assets can change without changing gameplay collision rules.
- Keep mobile performance budgets for triangle count, texture count, draw calls, and loading time.
