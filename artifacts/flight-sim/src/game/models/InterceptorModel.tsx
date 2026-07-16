import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Afterburner() {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = Math.sin(clock.getElapsedTime() * 20) * 0.5 + 0.5;
    if (coreRef.current) { coreRef.current.scale.z = 0.78 + t * 0.45; coreRef.current.scale.x = coreRef.current.scale.y = 0.88 + t * 0.12; }
    if (glowRef.current) { glowRef.current.scale.z = 0.68 + t * 0.55; glowRef.current.scale.x = glowRef.current.scale.y = 0.8 + t * 0.2; }
  });
  return (
    <group position={[0, 0, 2.25]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.26, 0.16, 12]} />
        <meshStandardMaterial color="#141414" metalness={0.88} roughness={0.2} />
      </mesh>
      <mesh ref={coreRef} position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.13, 0.85, 8]} />
        <meshBasicMaterial color="#d4f0ff" transparent opacity={0.95} depthWrite={false} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.25, 1.25, 8]} />
        <meshBasicMaterial color="#ff5800" transparent opacity={0.52} depthWrite={false} />
      </mesh>
      <pointLight color="#ff9955" intensity={5} distance={11} />
    </group>
  );
}

function PylonMissile({ x }: { x: number }) {
  return (
    <group position={[x, -0.22, 0.6]}>
      {/* Pylon */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.1, 0.28, 0.85]} />
        <meshStandardMaterial color="#555" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 1.45, 8]} />
        <meshStandardMaterial color="#c0c4c8" metalness={0.65} roughness={0.35} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0, -0.78]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.085, 0.3, 8]} />
        <meshStandardMaterial color="#aa2820" />
      </mesh>
      {/* Fins */}
      {[0, 90].map((deg) => (
        <mesh key={deg} position={[0, 0, 0.6]} rotation={[0, 0, (deg * Math.PI) / 180]}>
          <boxGeometry args={[0.38, 0.04, 0.22]} />
          <meshStandardMaterial color="#888" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Eurofighter Typhoon-style delta-canard interceptor.
 * Nose points along local -Z.
 */
export default function InterceptorModel() {
  return (
    <group>
      {/* Fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[0.44, 3.5, 4, 10]} />
        <meshStandardMaterial color="#3e4a56" metalness={0.58} roughness={0.28} />
      </mesh>
      {/* Nose — slim radome */}
      <mesh position={[0, -0.03, -2.2]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.38, 1.5, 10]} />
        <meshStandardMaterial color="#2a3038" metalness={0.45} roughness={0.38} />
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, -0.03, -2.96]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.09, 0.28, 8]} />
        <meshStandardMaterial color="#1e2428" metalness={0.55} roughness={0.25} />
      </mesh>

      {/* Canopy */}
      <mesh position={[0, 0.48, -0.55]} castShadow>
        <sphereGeometry args={[0.3, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.75]} />
        <meshStandardMaterial color="#50d8ff" transparent opacity={0.65} metalness={0.25} roughness={0.06} />
      </mesh>
      <mesh position={[0, 0.34, -0.75]}>
        <boxGeometry args={[0.62, 0.055, 0.7]} />
        <meshStandardMaterial color="#232c34" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* Under-chin rectangular intake */}
      <mesh position={[0, -0.5, -1.2]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.72, 0.28, 1.0]} />
        <meshStandardMaterial color="#1e252c" metalness={0.45} roughness={0.42} />
      </mesh>
      {/* Intake lip */}
      <mesh position={[0, -0.56, -1.72]}>
        <boxGeometry args={[0.74, 0.08, 0.1]} />
        <meshStandardMaterial color="#151c22" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Forward canards */}
      <mesh position={[0.9, -0.04, -1.45]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[1.25, 0.07, 0.55]} />
        <meshStandardMaterial color="#4a5660" metalness={0.45} roughness={0.45} />
      </mesh>
      <mesh position={[-0.9, -0.04, -1.45]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[1.25, 0.07, 0.55]} />
        <meshStandardMaterial color="#4a5660" metalness={0.45} roughness={0.45} />
      </mesh>

      {/* Large delta main wings */}
      <mesh position={[2.4, -0.15, 0.95]} rotation={[0.04, -0.32, -0.04]} castShadow>
        <boxGeometry args={[4.6, 0.08, 2.2]} />
        <meshStandardMaterial color="#4a5660" metalness={0.42} roughness={0.48} />
      </mesh>
      <mesh position={[-2.4, -0.15, 0.95]} rotation={[0.04, 0.32, 0.04]} castShadow>
        <boxGeometry args={[4.6, 0.08, 2.2]} />
        <meshStandardMaterial color="#4a5660" metalness={0.42} roughness={0.48} />
      </mesh>
      {/* Wing root */}
      <mesh position={[0.9, -0.14, 1.0]}>
        <boxGeometry args={[1.8, 0.08, 2.3]} />
        <meshStandardMaterial color="#4a5660" metalness={0.42} roughness={0.48} />
      </mesh>
      <mesh position={[-0.9, -0.14, 1.0]}>
        <boxGeometry args={[1.8, 0.08, 2.3]} />
        <meshStandardMaterial color="#4a5660" metalness={0.42} roughness={0.48} />
      </mesh>

      {/* Single vertical stabilizer */}
      <mesh position={[0, 0.72, 2.0]} castShadow>
        <boxGeometry args={[0.1, 1.3, 0.92]} />
        <meshStandardMaterial color="#252d36" metalness={0.45} roughness={0.4} />
      </mesh>

      {/* Pylons with missiles — 4 hardpoints */}
      <PylonMissile x={2.2} />
      <PylonMissile x={1.1} />
      <PylonMissile x={-1.1} />
      <PylonMissile x={-2.2} />

      <Afterburner />
    </group>
  );
}
