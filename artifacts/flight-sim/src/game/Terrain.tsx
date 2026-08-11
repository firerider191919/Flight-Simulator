import { useMemo, type ReactElement } from 'react';
import type { BiomeId, WorldLocation } from './world';

const GROUND_SIZE = 20000;
const FIELD_HALF = 2400;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Placement {
  position: [number, number, number];
  scale: number;
  rotationY: number;
}

function usePlacements(biome: BiomeId, count: number, minDist: number): Placement[] {
  return useMemo(() => {
    const rand = mulberry32(biome.length * 4242 + count);
    const items: Placement[] = [];
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * FIELD_HALF * 2;
      const z = (rand() - 0.5) * FIELD_HALF * 2;
      if (Math.hypot(x, z) < minDist) continue;
      items.push({
        position: [x, 0, z],
        scale: 0.7 + rand() * 1.1,
        rotationY: rand() * Math.PI * 2,
      });
    }
    return items;
  }, [biome, count, minDist]);
}

function Tree({ position, scale, rotationY }: Placement) {
  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 2.4, 6]} />
        <meshStandardMaterial color="#5b4432" />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <coneGeometry args={[1.4, 2.6, 8]} />
        <meshStandardMaterial color="#2f6b3a" />
      </mesh>
      <mesh position={[0, 4.4, 0]}>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color="#357a41" />
      </mesh>
    </group>
  );
}

function Hill({ position, scale, rotationY }: Placement) {
  const radius = 60 + scale * 90;
  return (
    <mesh position={[position[0], -radius * 0.3, position[2]]} rotation={[0, rotationY, 0]}>
      <coneGeometry args={[radius, radius * (1.1 + scale * 0.4), 7]} />
      <meshStandardMaterial color="#6f7d4f" />
    </mesh>
  );
}

function Skyscraper({ position, scale, rotationY }: Placement) {
  const height = 60 + scale * 160;
  const width = 18 + scale * 14;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial color="#7d8794" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, height + 2, 0]}>
        <boxGeometry args={[width * 0.15, 4, width * 0.15]} />
        <meshStandardMaterial color="#c94b4b" emissive="#4a0000" />
      </mesh>
    </group>
  );
}

function Mesa({ position, scale, rotationY }: Placement) {
  const radius = 50 + scale * 100;
  return (
    <mesh
      position={[position[0], radius * 0.25, position[2]]}
      rotation={[0, rotationY, 0]}
    >
      <cylinderGeometry args={[radius, radius * 1.3, radius * 0.6, 8]} />
      <meshStandardMaterial color="#b5642f" />
    </mesh>
  );
}

function Iceberg({ position, scale, rotationY }: Placement) {
  const height = 20 + scale * 60;
  return (
    <mesh position={[position[0], height / 2 - 6, position[2]]} rotation={[0, rotationY, 0.1]}>
      <coneGeometry args={[18 + scale * 20, height, 6]} />
      <meshStandardMaterial color="#eaf6fb" metalness={0.1} roughness={0.2} />
    </mesh>
  );
}

function Island({ position, scale, rotationY }: Placement) {
  const radius = 30 + scale * 60;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[radius, radius * 1.1, 6, 10]} />
        <meshStandardMaterial color="#d8c98a" />
      </mesh>
      <mesh position={[0, radius * 0.3, 0]}>
        <coneGeometry args={[radius * 0.5, radius * 0.7, 8]} />
        <meshStandardMaterial color="#357a41" />
      </mesh>
    </group>
  );
}

function Peak({ position, scale, rotationY }: Placement) {
  const height = 140 + scale * 260;
  const radius = 70 + scale * 90;
  return (
    <group position={[position[0], 0, position[2]]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, height * 0.42, 0]}>
        <coneGeometry args={[radius, height, 6]} />
        <meshStandardMaterial color="#8a8f7d" />
      </mesh>
      <mesh position={[0, height * 0.72, 0]}>
        <coneGeometry args={[radius * 0.42, height * 0.4, 6]} />
        <meshStandardMaterial color="#f5f8fa" />
      </mesh>
    </group>
  );
}

function Volcano({ position, scale, rotationY }: Placement) {
  const height = 60 + scale * 120;
  const radius = 40 + scale * 70;
  return (
    <group position={[position[0], -6, position[2]]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, height * 0.45, 0]}>
        <coneGeometry args={[radius, height, 8]} />
        <meshStandardMaterial color="#2c2320" />
      </mesh>
      <mesh position={[0, height * 0.86, 0]}>
        <coneGeometry args={[radius * 0.25, height * 0.12, 8, 1, true]} />
        <meshStandardMaterial color="#ff5a1f" emissive="#ff3300" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

function PalmTree({ position, scale, rotationY }: Placement) {
  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      {/* Trunk — slightly curved via rotation */}
      <mesh position={[0, 2.5, 0]} rotation={[0.08, 0, 0.12]}>
        <cylinderGeometry args={[0.16, 0.22, 5, 7]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>
      {/* Fronds */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh
            key={i}
            position={[Math.sin(rad) * 1.8, 5.4, Math.cos(rad) * 1.8]}
            rotation={[-0.5, rad, 0.35]}
          >
            <coneGeometry args={[0.08, 3.6, 4]} />
            <meshStandardMaterial color="#2d8c3e" />
          </mesh>
        );
      })}
      {/* Coconuts cluster */}
      <mesh position={[0, 5.1, 0]}>
        <sphereGeometry args={[0.32, 6, 6]} />
        <meshStandardMaterial color="#5a3e1b" />
      </mesh>
    </group>
  );
}

function Runway({ color, stripeColor }: { color: string; stripeColor: string }) {
  return (
    <group position={[0, 0.03, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 340]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -150 + i * 28]}>
          <planeGeometry args={[1.4, 12]} />
          <meshStandardMaterial color={stripeColor} />
        </mesh>
      ))}
      {/* Threshold markings */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[side * 12, 0.01, 165]}>
          <planeGeometry args={[4, 24]} />
          <meshStandardMaterial color={stripeColor} />
        </mesh>
      ))}
    </group>
  );
}

function BeachRunway() {
  return (
    <group position={[0, 0.03, 0]}>
      {/* Sandy runway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 340]} />
        <meshStandardMaterial color="#d4b483" />
      </mesh>
      {/* Stripes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -150 + i * 28]}>
          <planeGeometry args={[1.4, 12]} />
          <meshStandardMaterial color="#f5e8c0" />
        </mesh>
      ))}
    </group>
  );
}

function AircraftCarrier() {
  return (
    <group position={[0, -1.4, 0]}>
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[40, 6, 260]} />
        <meshStandardMaterial color="#3a3f45" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[38, 250]} />
        <meshStandardMaterial color="#4d5257" />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 2.65, -100 + i * 28]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 10]} />
          <meshStandardMaterial color="#f4d35e" />
        </mesh>
      ))}
      <mesh position={[16, 8, -20]}>
        <boxGeometry args={[6, 12, 20]} />
        <meshStandardMaterial color="#565c63" />
      </mesh>
    </group>
  );
}

const BIOME_DECOR: Record<
  BiomeId,
  { component: (p: Placement) => ReactElement; count: number; minDist: number }
> = {
  countryside: { component: Tree, count: 260, minDist: 120 },
  city: { component: Skyscraper, count: 90, minDist: 200 },
  desert: { component: Mesa, count: 60, minDist: 220 },
  arctic: { component: Iceberg, count: 80, minDist: 150 },
  ocean: { component: Island, count: 22, minDist: 300 },
  mountains: { component: Peak, count: 46, minDist: 220 },
  volcanic: { component: Volcano, count: 30, minDist: 260 },
  tropical: { component: PalmTree, count: 200, minDist: 100 },
};

const BIOME_HILLS: Record<BiomeId, boolean> = {
  countryside: true,
  city: false,
  desert: true,
  arctic: false,
  ocean: false,
  mountains: false,
  volcanic: false,
  tropical: true,
};

export default function Terrain({ location }: { location: WorldLocation }) {
  const decor = BIOME_DECOR[location.id];
  const placements = usePlacements(location.id, decor.count, decor.minDist);
  const hills = usePlacements(
    `${location.id}-hills` as BiomeId,
    BIOME_HILLS[location.id] ? 26 : 0,
    250,
  );
  const Decor = decor.component;

  const runwayColor =
    location.id === 'desert'
      ? '#8a6a45'
      : location.id === 'arctic'
        ? '#c9d6dd'
        : location.id === 'volcanic'
          ? '#1c1815'
          : '#3a3a3d';

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE, 1, 1]} />
        <meshStandardMaterial color={location.groundColor} />
      </mesh>

      {location.id === 'ocean' ? (
        <AircraftCarrier />
      ) : location.id === 'tropical' ? (
        <BeachRunway />
      ) : (
        <Runway color={runwayColor} stripeColor="#f4f4f2" />
      )}

      {placements.map((p, i) => (
        <Decor key={i} {...p} />
      ))}
      {hills.map((h, i) => (
        <Hill key={i} {...h} />
      ))}
    </group>
  );
}

export { GROUND_SIZE };
