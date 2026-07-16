import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BiomeId } from './world';

const TARGET_COUNT = 10;
const TARGET_HP = 20;
const FIELD_HALF = 1400;
const MIN_ALTITUDE = 40;
const MAX_ALTITUDE = 220;

export interface TargetHandle {
  getPosition: () => THREE.Vector3;
  isAlive: () => boolean;
  hit: (amount: number) => boolean; // returns true if this hit destroyed it
  radius: number;
}

export interface TargetsHandle {
  getAll: () => TargetHandle[];
}

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

function randomSpawn(rand: () => number): THREE.Vector3 {
  const angle = rand() * Math.PI * 2;
  const dist = 150 + rand() * FIELD_HALF;
  const altitude = MIN_ALTITUDE + rand() * (MAX_ALTITUDE - MIN_ALTITUDE);
  return new THREE.Vector3(Math.cos(angle) * dist, altitude, Math.sin(angle) * dist);
}

interface DroneState {
  position: THREE.Vector3;
  hp: number;
  alive: boolean;
  bobPhase: number;
  respawnTimer: number;
}

const Targets = forwardRef<TargetsHandle, { biome: BiomeId }>(function Targets(
  { biome },
  ref,
) {
  const rand = useMemo(() => mulberry32(biome.length * 7919 + 17), [biome]);
  const drones = useMemo<DroneState[]>(() => {
    return Array.from({ length: TARGET_COUNT }, (_, i) => ({
      position: randomSpawn(rand),
      hp: TARGET_HP,
      alive: true,
      bobPhase: (i / TARGET_COUNT) * Math.PI * 2,
      respawnTimer: 0,
    }));
  }, [rand]);

  const meshRefs = useRef<(THREE.Group | null)[]>([]);
  const timeRef = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      getAll: () =>
        drones.map((d, i) => ({
          getPosition: () => d.position,
          isAlive: () => d.alive,
          radius: 3.2,
          hit: (amount: number) => {
            if (!d.alive) return false;
            d.hp -= amount;
            if (d.hp <= 0) {
              d.alive = false;
              d.respawnTimer = 4;
              const mesh = meshRefs.current[i];
              if (mesh) mesh.visible = false;
              return true;
            }
            return false;
          },
        })),
    }),
    [drones],
  );

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    timeRef.current += delta;
    drones.forEach((d, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      if (!d.alive) {
        d.respawnTimer -= delta;
        if (d.respawnTimer <= 0) {
          d.position.copy(randomSpawn(rand));
          d.hp = TARGET_HP;
          d.alive = true;
          mesh.visible = true;
        } else {
          return;
        }
      }
      mesh.position.copy(d.position);
      mesh.position.y += Math.sin(timeRef.current * 1.4 + d.bobPhase) * 1.5;
      mesh.rotation.y += delta * 0.6;
    });
  });

  return (
    <group>
      {drones.map((d, i) => (
        <group
          key={i}
          ref={(node) => {
            meshRefs.current[i] = node;
          }}
          position={d.position}
        >
          <mesh>
            <octahedronGeometry args={[2.2, 0]} />
            <meshStandardMaterial color="#e0343f" emissive="#4a0000" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[2.8, 0.12, 8, 16]} />
            <meshStandardMaterial color="#ffb000" emissive="#502e00" />
          </mesh>
        </group>
      ))}
    </group>
  );
});

export default Targets;
export { TARGET_COUNT };
