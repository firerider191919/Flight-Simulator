import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TaperedWing } from './AircraftParts';

function Afterburner({ x = 0 }: { x?: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = Math.sin(clock.getElapsedTime() * 24 + x) * 0.5 + 0.5;
    if (coreRef.current) { coreRef.current.scale.z = 0.7 + t * 0.6; coreRef.current.scale.x = coreRef.current.scale.y = 0.8 + t * 0.2; }
    if (glowRef.current) { glowRef.current.scale.z = 0.6 + t * 0.7; glowRef.current.scale.x = glowRef.current.scale.y = 0.75 + t * 0.25; }
  });
  return (
    <group position={[x, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.19, 0.16, 12]} />
        <meshStandardMaterial color="#111" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh ref={coreRef} position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.11, 0.75, 8]} />
        <meshBasicMaterial color="#c0e8ff" transparent opacity={0.95} depthWrite={false} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.22, 1.1, 8]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <pointLight color="#ff8844" intensity={4} distance={9} />
    </group>
  );
}

/**
 * F-22 Raptor style twin-engine stealth fighter.
 * Nose points along local -Z.
 */
export default function StealthModel() {
  return (
    <group>
      {/* Chined faceted fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[0.4, 3.5, 4, 6]} />
        <meshStandardMaterial color="#1c1f24" metalness={0.65} roughness={0.28} />
      </mesh>
      {/* Nose — diamond-faceted */}
      <mesh position={[0, 0, -2.2]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.38, 1.6, 4]} />
        <meshStandardMaterial color="#141618" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, 0, -3.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.22, 6]} />
        <meshStandardMaterial color="#0d0e10" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Chine flats (flat side panels for stealth faceting) */}
      <mesh position={[0.44, -0.1, -0.5]} rotation={[0, 0, 0.38]}>
        <boxGeometry args={[0.22, 0.72, 4.0]} />
        <meshStandardMaterial color="#191c21" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.44, -0.1, -0.5]} rotation={[0, 0, -0.38]}>
        <boxGeometry args={[0.22, 0.72, 4.0]} />
        <meshStandardMaterial color="#191c21" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Bubble canopy — tinted blue */}
      <mesh position={[0, 0.5, -0.65]} castShadow>
        <sphereGeometry args={[0.28, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.75]} />
        <meshStandardMaterial color="#2adcff" transparent opacity={0.6} metalness={0.3} roughness={0.05} />
      </mesh>
      {/* Canopy frame */}
      <mesh position={[0, 0.36, -0.85]}>
        <boxGeometry args={[0.56, 0.055, 0.65]} />
        <meshStandardMaterial color="#111418" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* DSI intakes (bumped) on sides */}
      <mesh position={[0.52, -0.16, -0.9]} rotation={[0.1, 0.12, 0.08]}>
        <boxGeometry args={[0.35, 0.26, 0.9]} />
        <meshStandardMaterial color="#16191e" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.52, -0.16, -0.9]} rotation={[0.1, -0.12, -0.08]}>
        <boxGeometry args={[0.35, 0.26, 0.9]} />
        <meshStandardMaterial color="#16191e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* F-22 trapezoidal diamond-planform main wings */}
      <TaperedWing side={1} rootX={0.15} span={4.6} rootChord={2.05} tipChord={0.42} sweep={1.25} y={-0.12} z={0.65} color="#1a1d22" metalness={0.55} roughness={0.4} thickness={0.09} />
      <TaperedWing side={-1} rootX={0.15} span={4.6} rootChord={2.05} tipChord={0.42} sweep={1.25} y={-0.12} z={0.65} color="#1a1d22" metalness={0.55} roughness={0.4} thickness={0.09} />

      {/* All-moving horizontal tails */}
      <TaperedWing side={1} rootX={0.1} span={1.35} rootChord={0.8} tipChord={0.18} sweep={0.32} y={-0.06} z={2.1} color="#161820" metalness={0.5} roughness={0.45} thickness={0.07} />
      <TaperedWing side={-1} rootX={0.1} span={1.35} rootChord={0.8} tipChord={0.18} sweep={0.32} y={-0.06} z={2.1} color="#161820" metalness={0.5} roughness={0.45} thickness={0.07} />

      {/* Twin canted vertical tails */}
      <mesh position={[0.52, 0.75, 2.05]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.1, 1.3, 0.85]} />
        <meshStandardMaterial color="#111318" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.52, 0.75, 2.05]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.1, 1.3, 0.85]} />
        <meshStandardMaterial color="#111318" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Internal weapons bay doors */}
      <mesh position={[0, -0.41, 0.2]}>
        <boxGeometry args={[0.7, 0.06, 1.5]} />
        <meshStandardMaterial color="#0d0e10" />
      </mesh>

      {/* Twin afterburners */}
      <group position={[0, 0, 2.2]}>
        <Afterburner x={0.46} />
        <Afterburner x={-0.46} />
      </group>
    </group>
  );
}
