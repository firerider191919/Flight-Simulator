import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Afterburner({ z = 0 }: { z?: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = Math.sin(clock.getElapsedTime() * 22) * 0.5 + 0.5;
    if (coreRef.current) { coreRef.current.scale.z = 0.75 + t * 0.5; coreRef.current.scale.x = coreRef.current.scale.y = 0.85 + t * 0.15; }
    if (glowRef.current) { glowRef.current.scale.z = 0.65 + t * 0.55; glowRef.current.scale.x = glowRef.current.scale.y = 0.8 + t * 0.2; }
  });
  return (
    <group position={[0, 0, z]}>
      {/* Nozzle petals */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.22, 0.18, 14]} />
        <meshStandardMaterial color="#181818" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Core flame — pale blue-white */}
      <mesh ref={coreRef} position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.14, 0.9, 8]} />
        <meshBasicMaterial color="#d0eeff" transparent opacity={0.92} depthWrite={false} />
      </mesh>
      {/* Outer flame — orange */}
      <mesh ref={glowRef} position={[0, 0, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.26, 1.3, 8]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <pointLight color="#ff9944" intensity={5} distance={10} />
    </group>
  );
}

function WingMissile({ x }: { x: number }) {
  return (
    <group position={[x, -0.22, 0.6]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 1.3, 8]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.075, 0.28, 8]} />
        <meshStandardMaterial color="#b03020" />
      </mesh>
      {[0, 90].map((deg) => (
        <mesh key={deg} position={[0, 0, 0.5]} rotation={[0, 0, (deg * Math.PI) / 180]}>
          <boxGeometry args={[0.32, 0.04, 0.2]} />
          <meshStandardMaterial color="#888" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * F-16 Fighting Falcon style agile multirole fighter.
 * Nose points along local -Z.
 */
export default function FighterModel() {
  return (
    <group>
      {/* Main fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[0.38, 3.4, 4, 10]} />
        <meshStandardMaterial color="#6a7480" metalness={0.55} roughness={0.32} />
      </mesh>
      {/* Nose — long pointed radome */}
      <mesh position={[0, -0.02, -2.3]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.32, 1.4, 10]} />
        <meshStandardMaterial color="#50585f" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, -0.02, -2.98]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial color="#3a4248" metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Pitot tube */}
      <mesh position={[0.22, -0.06, -2.9]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.012, 0.55, 6]} />
        <meshStandardMaterial color="#bbb" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Bubble canopy */}
      <mesh position={[0, 0.46, -0.72]} castShadow>
        <sphereGeometry args={[0.3, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial color="#7dd6ff" transparent opacity={0.68} metalness={0.25} roughness={0.05} />
      </mesh>
      {/* Canopy frame */}
      <mesh position={[0, 0.32, -0.9]}>
        <boxGeometry args={[0.62, 0.06, 0.7]} />
        <meshStandardMaterial color="#3a4248" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Chin air intake */}
      <mesh position={[0, -0.42, -1.55]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.62, 0.32, 1.1]} />
        <meshStandardMaterial color="#3a4248" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.52, -2.0]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.12, 12]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* LERX — Leading Edge Root Extensions blend wing into fuselage */}
      <mesh position={[0.48, -0.08, -0.3]} rotation={[0, 0.28, 0.06]}>
        <boxGeometry args={[1.0, 0.1, 1.6]} />
        <meshStandardMaterial color="#5e6a74" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.48, -0.08, -0.3]} rotation={[0, -0.28, -0.06]}>
        <boxGeometry args={[1.0, 0.1, 1.6]} />
        <meshStandardMaterial color="#5e6a74" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Main swept wings */}
      <mesh position={[2.2, -0.14, 0.85]} rotation={[0.05, -0.22, -0.06]} castShadow>
        <boxGeometry args={[3.9, 0.09, 1.65]} />
        <meshStandardMaterial color="#58636b" metalness={0.45} roughness={0.45} />
      </mesh>
      <mesh position={[-2.2, -0.14, 0.85]} rotation={[0.05, 0.22, 0.06]} castShadow>
        <boxGeometry args={[3.9, 0.09, 1.65]} />
        <meshStandardMaterial color="#58636b" metalness={0.45} roughness={0.45} />
      </mesh>

      {/* All-moving tailplanes */}
      <mesh position={[1.05, -0.02, 2.0]} rotation={[0, -0.18, -0.12]}>
        <boxGeometry args={[1.85, 0.08, 0.72]} />
        <meshStandardMaterial color="#50585f" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[-1.05, -0.02, 2.0]} rotation={[0, 0.18, 0.12]}>
        <boxGeometry args={[1.85, 0.08, 0.72]} />
        <meshStandardMaterial color="#50585f" metalness={0.4} roughness={0.45} />
      </mesh>

      {/* Single vertical stabilizer */}
      <mesh position={[0, 0.72, 1.95]} castShadow>
        <boxGeometry args={[0.09, 1.25, 0.88]} />
        <meshStandardMaterial color="#3a4248" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Ventral strakes */}
      <mesh position={[0.28, -0.32, 2.0]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.06, 0.45, 0.6]} />
        <meshStandardMaterial color="#303840" />
      </mesh>
      <mesh position={[-0.28, -0.32, 2.0]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.06, 0.45, 0.6]} />
        <meshStandardMaterial color="#303840" />
      </mesh>

      {/* Engine exhaust section */}
      <mesh position={[0, 0, 1.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.30, 0.35, 12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Nose gun port */}
      <mesh position={[0.2, -0.18, -2.65]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.028, 0.6, 6]} />
        <meshStandardMaterial color="#181818" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Under-wing missiles */}
      <WingMissile x={2.0} />
      <WingMissile x={-2.0} />

      <Afterburner z={2.3} />
    </group>
  );
}
