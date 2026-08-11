---
name: Flight sim conventions
description: Key conventions for the flight-sim artifact — model geometry, effect pools, and TS quirks.
---

## Cone rotation convention
- Nose cone pointing forward (-Z): `rotation={[-Math.PI / 2, 0, 0]}`
- Afterburner / exhaust flame pointing backward (+Z): `rotation={[Math.PI / 2, 0, 0]}`
- Cylinders along Z axis (engine pods): `rotation={[Math.PI / 2, 0, 0]}`

**Why:** Three.js ConeGeometry has apex at +Y. R_x(-PI/2) maps +Y→-Z (forward); R_x(+PI/2) maps +Y→+Z (backward).

## Effect pools (Weapons.tsx)
All bullets/missiles/explosions/smoke use object pools with imperative refs — no per-frame React state.
Multi-layer explosions use 4 refs per slot: flash (white), fire (orange), smoke (dark), pointLight.
MuzzleMeshRefs are `THREE.Group` (not Mesh) — do NOT access `.material` on them directly.

**Why:** Avoids React reconciliation overhead in the render loop; confirmed working pattern.

## Afterburner sub-component pattern
Fighter model files define a local `function Afterburner({ x })` with `useRef` + `useFrame` for animated flame pulsing. This is valid — R3F hooks work inside any function component rendered inside a Canvas.

## PlaneModelId registry
9 planes: cessna, airliner, jumbo, falcon (F-16), raven (F-22 style), vortex (Eurofighter), warthog (A-10), eagle (F-15), blackbird (SR-71). Registry is in `models/index.tsx`.

## "Anywhere in the world"
Implemented as 7 stylized biome regions (not real map data) with synthesized lat/lon display.

## TS quirk
Using `ReactElement` (not `JSX.Element`) as the return type in model registry avoids namespace errors under this project's tsconfig.

## Flight controls and command menu
Pitch is intentionally inverted: `S` / `ArrowDown` pitches the nose up, while `W` / `ArrowUp` pitches the nose down. The in-flight command menu is opened with `Esc`; `C` cycles camera views and `M` opens airport selection.

**Why:** The pilot requested conventional stick-style inverted pitch plus menu actions for camera, diversion, aircraft change, and sortie restart.

**How to apply:** Keep the control hint visible in the ready screen and command menu whenever pitch bindings change.

## Aircraft silhouette geometry
The main wings on the fighter, A320, and 747 models use tapered custom prism geometry with swept leading edges instead of rectangular box slabs.

**Why:** Planform taper and sweep make the aircraft read as their specific real-world class from the chase and selection cameras without adding a heavy model asset dependency.

**How to apply:** Reuse the shared tapered-wing part for new aircraft; keep nose direction local -Z and preserve the existing cone rotation convention.
