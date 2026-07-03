# Asset Representation

## Current Decision

Crystal Runner is a 3D Babylon.js game using lightweight procedural 3D meshes for the active gameplay visuals.

The game keeps:

- Babylon.js `Engine`
- Babylon.js `Scene`
- 3D camera
- 3D path geometry
- 3D lane movement
- 3D collision proxies
- render-loop animation and validation
- dynamic runway lighting

The current runtime does not use billboard sprites for gameplay entities. Gameplay entities still use invisible collision proxies where useful, with visible meshes parented to the proxy:

```text
collisionProxy
  -> visible 3D mesh
```

## Reasons

- Stronger depth and readability in the 3D camera.
- No flat-sprite/floor-decal ambiguity.
- Very small runtime asset footprint.
- Fast iteration without needing final GLB/glTF models yet.
- Collision boxes stay independent from the visual mesh.
- Visuals can later be replaced without rewriting gameplay collision rules.

## Supported Asset Classes

### 3D assets

- Procedural Babylon.js meshes for prototype/runtime primitives.
- GLB/glTF models for future production characters, pickups, obstacles, path pieces, and environment props.
- Must follow the mobile performance budget for triangle count, texture memory, draw calls, loading time, and disposal.

### 2.5D sprite assets

- Optional future or fallback representation for effects, UI-world markers, or fast art experiments.
- Must use alpha-aware materials and upright billboard planes if used in the 3D world.
- Must not be used as gameplay collision objects.

## Decision Table

| Asset type | Immediate representation | Future representation | Reason |
| --- | --- | --- | --- |
| Player | Glowing capsule/sphere mesh | GLB character or vehicle model | Clear 3D presence now, model later |
| Crystal | Faceted cylinder mesh | GLB/mesh crystal | Must be readable as collectible |
| Obstacle | Solid box mesh | GLB/mesh obstacle | Must be readable as hazard |
| Path | 3D mesh runway | 3D mesh runway | Core spatial reference |
| Runway lights | Emissive marker meshes plus limited point lights | Mesh lights/particles/post effects | Adds motion and depth without heavy assets |
| Effects | Emissive mesh pulse | Particles/sprites/mesh effects | Cheap and readable |

## Future Upgrade Path

- Replace the player mesh with a GLB/glTF runner, ship, or abstract avatar.
- Replace hazards and crystals with GLB/glTF models or more polished low-poly meshes.
- Keep the collision proxy pattern so visual assets can change without changing gameplay collision rules.
- Keep the number of active point lights limited for mobile performance.
