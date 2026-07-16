import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Afterburner({ x = 0 }: { x?: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = Math.sin(clock.getElapsedTime() * 20 + x) * 0.5 + 0.5;
    if (coreRef.current) { coreRef.current.scale.z = 0.72 + t * 0.55; coreRef.current.scale.x = coreRef.current.scale.y = 0.82 + t * 0.18; }
    if (glowRef.current) { glowRef.current.scale.z = 0.62 + t * 0.65; glowRef.current.scale.x = glowRef.current.scale.y = 0.78 + t * 0.22; }
  });
  return (
    <group position={[x, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.27, 0.22, 0.18, 12]} />
        <meshStandardMaterial color="#151515" metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh ref={coreRef} position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.82, 8]} />
        <meshBasicMaterial color="#c8e8ff" transparent opacity={0.95} depthWrite={false} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0, 0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.24, 1.2, 8]} />
        <meshBasicMaterial color="#ff6200" transparent opacity={0.52} depthWrite={false} />
      </mesh>
      <pointLight color="#ff9944" intensity={4.5} distance={10} />
    </group>
  );
}

function WingMissile({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, -0.24, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 8]} />
        <meshStandardMaterial color="#c0c4c8" metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.75]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.28, 8]} />
        <meshStandardMaterial color="#b02820" />
      </mesh>
      {[0, 90].map((deg) => (
        <mesh key={deg} position={[0, 0, 0.55]} rotation={[0, 0, (deg * Math.PI) / 180]}>
          <boxGeometry args={[0.34, 0.03, 0.2]} />
          <meshStandardMaterial color="#888" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * F-15 Eagle style heavy air-superiority twin-engine fighter.
 * Nose points along local -Z.
 */
export default function EagleModel() {
  return (
    <group>
      {/* Main fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[0.46, 3.8, 4, 10]} />
        <meshStandardMaterial color="#8090a0" metalness={0.5} roughness={0.32} />
      </mesh>
      {/* Nose — long tapered */}
      <mesh position={[0, -0.02, -2.55]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.4, 1.65, 10]} />
        <meshStandardMaterial color="#66788a" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, -0.02, -3.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.28, 8]} />
        <meshStandardMaterial color="#506070" metalness={0.6} roughness={0.25} />
      </mesh>

      {/* Large bubble canopy */}
      <mesh position={[0, 0.56, -0.8]} castShadow>
        <sphereGeometry args={[0.36, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.68]} />
        <meshStandardMaterial color="#80d4ff" transparent opacity={0.65} metalness={0.25} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.4, -0.95]}>
        <boxGeometry args={[0.74, 0.06, 0.78]} />
        <meshStandardMaterial color="#3a4a58" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Twin rectangular side intakes */}
      <mesh position={[0.52, -0.08, -1.2]} rotation={[0.06, 0.06, 0]}>
        <boxGeometry args={[0.4, 0.52, 1.4]} />
        <meshStandardMaterial color="#3c4a58" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[-0.52, -0.08, -1.2]} rotation={[0.06, -0.06, 0]}>
        <boxGeometry args={[0.4, 0.52, 1.4]} />
        <meshStandardMaterial color="#3c4a58" metalness={0.45} roughness={0.4} />
      </mesh>
      {/* Intake lips */}
      <mesh position={[0.52, -0.08, -1.92]}>
        <boxGeometry args={[0.42, 0.54, 0.08]} />
        <meshStandardMaterial color="#2c3848" metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[-0.52, -0.08, -1.92]}>
        <boxGeometry args={[0.42, 0.54, 0.08]} />
        <meshStandardMaterial color="#2c3848" metalness={0.55} roughness={0.35} />
      </mesh>

      {/* LERX blending */}
      <mesh position={[0.58, -0.04, -0.5]} rotation={[0, 0.3, 0.05]}>
        <boxGeometry args={[1.1, 0.1, 1.8]} />
        <meshStandardMaterial color="#7080908" metalness={0.45} roughness={0.42} />
      </mesh>
      <mesh position={[-0.58, -0.04, -0.5]} rotation={[0, -0.3, -0.05]}>
        <boxGeometry args={[1.1, 0.1, 1.8]} />
        <meshStandardMaterial color="#7080908" metalness={0.45} roughness={0.42} />
      </mesh>

      {/* Large swept wings */}
      <mesh position={[3.0, -0.1, 0.95]} rotation={[0.06, -0.28, -0.04]} castShadow>
        <boxGeometry args={[5.6, 0.12, 2.15]} />
        <meshStandardMaterial color="#788898" metalness={0.45} roughness={0.45} />
      </mesh>
      <mesh position={[-3.0, -0.1, 0.95]} rotation={[0.06, 0.28, 0.04]} castShadow>
        <boxGeometry args={[5.6, 0.12, 2.15]} />
        <meshStandardMaterial color="#788898" metalness={0.45} roughness={0.45} />
      </mesh>
      {/* Wing root fill */}
      <mesh position={[1.0, -0.1, 1.0]}>
        <boxGeometry args={[2.0, 0.12, 2.2]} />
        <meshStandardMaterial color="#788898" metalness={0.45} roughness={0.45} />
      </mesh>
      <mesh position={[-1.0, -0.1, 1.0]}>
        <boxGeometry args={[2.0, 0.12, 2.2]} />
        <meshStandardMaterial color="#788898" metalness={0.45} roughness={0.45} />
      </mesh>

      {/* All-moving horizontal tails */}
      <mesh position={[1.2, -0.04, 2.2]} rotation={[0, -0.18, -0.1]}>
        <boxGeometry args={[2.4, 0.09, 0.85]} />
        <meshStandardMaterial color="#6a7a8a" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[-1.2, -0.04, 2.2]} rotation={[0, 0.18, 0.1]}>
        <boxGeometry args={[2.4, 0.09, 0.85]} />
        <meshStandardMaterial color="#6a7a8a" metalness={0.4} roughness={0.45} />
      </mesh>

      {/* Twin vertical tails — slightly canted outward */}
      <mesh position={[0.5, 0.88, 2.1]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.1, 1.7, 1.0]} />
        <meshStandardMaterial color="#506070" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[-0.5, 0.88, 2.1]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.1, 1.7, 1.0]} />
        <meshStandardMaterial color="#506070" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Engine section */}
      <mesh position={[0.46, 0, 2.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.24, 0.3, 12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh position={[-0.46, 0, 2.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.24, 0.3, 12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Gun port */}
      <mesh position={[0.52, -0.1, -2.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.026, 0.55, 6]} />
        <meshStandardMaterial color="#181818" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Under-wing missiles */}
      <WingMissile x={2.8} z={0.85} />
      <WingMissile x={1.5} z={0.75} />
      <WingMissile x={-1.5} z={0.75} />
      <WingMissile x={-2.8} z={0.85} />

      {/* Twin afterburners */}
      <group position={[0, 0, 2.45]}>
        <Afterburner x={0.46} />
        <Afterburner x={-0.46} />
      </group>
    </group>
  );
}
