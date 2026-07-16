import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function TurbofanPod({ x }: { x: number }) {
  return (
    <group position={[x, 0.62, 1.55]}>
      {/* Pod body */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.28, 2.0, 12]} />
        <meshStandardMaterial color="#8a9080" metalness={0.45} roughness={0.5} />
      </mesh>
      {/* Intake lip */}
      <mesh position={[0, 0, -1.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.055, 8, 14]} />
        <meshStandardMaterial color="#707868" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Fan disc */}
      <mesh position={[0, 0, -0.92]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 14]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Exhaust */}
      <mesh position={[0, 0, 1.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 0.22, 12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function HardpointBomb({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, -0.38, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.9, 8]} />
        <meshStandardMaterial color="#556a44" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.28, 8]} />
        <meshStandardMaterial color="#556a44" metalness={0.3} roughness={0.6} />
      </mesh>
      {[0, 90].map((deg) => (
        <mesh key={deg} position={[0, 0, 0.32]} rotation={[0, 0, (deg * Math.PI) / 180]}>
          <boxGeometry args={[0.32, 0.03, 0.18]} />
          <meshStandardMaterial color="#445538" />
        </mesh>
      ))}
    </group>
  );
}

function GatlingCannon() {
  const spinRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.z += delta * 8;
  });
  return (
    <group position={[0, -0.28, -2.55]}>
      {/* 7-barrel GAU-8 Avenger */}
      <group ref={spinRef}>
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i / 7) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.1, Math.sin(angle) * 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 1.0, 6]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.2} />
            </mesh>
          );
        })}
      </group>
      {/* Housing drum */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.05, 10]} />
        <meshStandardMaterial color="#2a2a28" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * A-10 Thunderbolt II style ground-attack aircraft.
 * Nose points along local -Z.
 */
export default function WarthogModel() {
  return (
    <group>
      {/* Armored fuselage — boxy cross-section */}
      <mesh castShadow>
        <capsuleGeometry args={[0.48, 3.2, 4, 8]} />
        <meshStandardMaterial color="#7a8870" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Fuselage underside flats (armor panels) */}
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[0.85, 0.12, 3.8]} />
        <meshStandardMaterial color="#606858" metalness={0.3} roughness={0.65} />
      </mesh>

      {/* Nose — stubby blunt shape */}
      <mesh position={[0, -0.04, -2.0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.44, 0.95, 8]} />
        <meshStandardMaterial color="#6a7868" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Cockpit — raised, large canopy for good visibility */}
      <mesh position={[0, 0.6, -0.55]} castShadow>
        <sphereGeometry args={[0.35, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.65]} />
        <meshStandardMaterial color="#a0d8f8" transparent opacity={0.7} metalness={0.15} roughness={0.06} />
      </mesh>
      {/* Canopy frame */}
      <mesh position={[0, 0.44, -0.7]}>
        <boxGeometry args={[0.72, 0.055, 0.72]} />
        <meshStandardMaterial color="#444840" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Straight high-mounted wings */}
      <mesh position={[0, 0.28, 0.3]} castShadow>
        <boxGeometry args={[8.8, 0.14, 1.7]} />
        <meshStandardMaterial color="#788070" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Wing chord taper pieces */}
      <mesh position={[3.6, 0.28, 0.55]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[2.0, 0.13, 1.0]} />
        <meshStandardMaterial color="#728070" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[-3.6, 0.28, 0.55]} rotation={[0, -0.1, 0]}>
        <boxGeometry args={[2.0, 0.13, 1.0]} />
        <meshStandardMaterial color="#728070" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Twin engine pods on upper rear fuselage */}
      <TurbofanPod x={0.78} />
      <TurbofanPod x={-0.78} />

      {/* Twin vertical tails (canted slightly outward) */}
      <mesh position={[0.8, 0.75, 1.95]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.1, 1.4, 0.92]} />
        <meshStandardMaterial color="#606858" metalness={0.3} roughness={0.55} />
      </mesh>
      <mesh position={[-0.8, 0.75, 1.95]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.1, 1.4, 0.92]} />
        <meshStandardMaterial color="#606858" metalness={0.3} roughness={0.55} />
      </mesh>

      {/* Horizontal stabilizer */}
      <mesh position={[0, 0.08, 2.05]} castShadow>
        <boxGeometry args={[3.6, 0.1, 0.9]} />
        <meshStandardMaterial color="#788070" />
      </mesh>

      {/* Hardpoints with bombs */}
      <HardpointBomb x={2.5} z={0.4} />
      <HardpointBomb x={-2.5} z={0.4} />
      <HardpointBomb x={1.2} z={0.3} />
      <HardpointBomb x={-1.2} z={0.3} />

      <GatlingCannon />
    </group>
  );
}
