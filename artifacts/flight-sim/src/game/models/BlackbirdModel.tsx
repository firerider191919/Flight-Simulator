import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Afterburner({ x = 0 }: { x?: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = Math.sin(clock.getElapsedTime() * 26 + x) * 0.5 + 0.5;
    if (coreRef.current) { coreRef.current.scale.z = 0.8 + t * 0.5; coreRef.current.scale.x = coreRef.current.scale.y = 0.85 + t * 0.15; }
    if (glowRef.current) { glowRef.current.scale.z = 0.7 + t * 0.7; glowRef.current.scale.x = glowRef.current.scale.y = 0.78 + t * 0.22; }
  });
  return (
    <group position={[x, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.26, 0.2, 12]} />
        <meshStandardMaterial color="#100f0e" metalness={0.88} roughness={0.18} />
      </mesh>
      {/* Core — bright blue-white (very hot) */}
      <mesh ref={coreRef} position={[0, 0, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.14, 1.0, 8]} />
        <meshBasicMaterial color="#b0d8ff" transparent opacity={0.96} depthWrite={false} />
      </mesh>
      {/* Outer glow — deep orange */}
      <mesh ref={glowRef} position={[0, 0, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 1.55, 8]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.48} depthWrite={false} />
      </mesh>
      <pointLight color="#ff8822" intensity={6} distance={14} />
    </group>
  );
}

/**
 * SR-71 Blackbird style hypersonic reconnaissance aircraft.
 * Distinctive chined fuselage and large blended delta wings.
 * Nose points along local -Z.
 */
export default function BlackbirdModel() {
  return (
    <group>
      {/* Needle nose — very long and slim */}
      <mesh position={[0, 0, -4.5]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.14, 2.8, 8]} />
        <meshStandardMaterial color="#0e0e0e" metalness={0.75} roughness={0.22} />
      </mesh>

      {/* Main fuselage body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.45, 4.2, 4, 10]} />
        <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Fuselage rear taper */}
      <mesh position={[0, 0, 2.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.4, 0.8, 10]} />
        <meshStandardMaterial color="#0e0e0e" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Chines — flat-sided lifting body panels characteristic of SR-71 */}
      <mesh position={[0.52, -0.14, -1.5]} rotation={[0, 0, 0.42]}>
        <boxGeometry args={[0.28, 0.82, 5.8]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.72} roughness={0.22} />
      </mesh>
      <mesh position={[-0.52, -0.14, -1.5]} rotation={[0, 0, -0.42]}>
        <boxGeometry args={[0.28, 0.82, 5.8]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.72} roughness={0.22} />
      </mesh>

      {/* Canopy — small tinted blister */}
      <mesh position={[0, 0.52, -1.2]} castShadow>
        <sphereGeometry args={[0.22, 12, 8, 0, Math.PI * 2, 0, Math.PI / 1.9]} />
        <meshStandardMaterial color="#3ad8e8" transparent opacity={0.6} metalness={0.35} roughness={0.05} />
      </mesh>
      {/* Second seat canopy (RSO) */}
      <mesh position={[0, 0.52, -0.45]} castShadow>
        <sphereGeometry args={[0.22, 12, 8, 0, Math.PI * 2, 0, Math.PI / 1.9]} />
        <meshStandardMaterial color="#3ad8e8" transparent opacity={0.6} metalness={0.35} roughness={0.05} />
      </mesh>

      {/* Blended delta wings */}
      <mesh position={[2.8, -0.16, 1.3]} rotation={[0.04, -0.36, -0.03]} castShadow>
        <boxGeometry args={[5.5, 0.09, 2.5]} />
        <meshStandardMaterial color="#101010" metalness={0.68} roughness={0.28} />
      </mesh>
      <mesh position={[-2.8, -0.16, 1.3]} rotation={[0.04, 0.36, 0.03]} castShadow>
        <boxGeometry args={[5.5, 0.09, 2.5]} />
        <meshStandardMaterial color="#101010" metalness={0.68} roughness={0.28} />
      </mesh>
      {/* Wing-fuselage blend center */}
      <mesh position={[1.0, -0.15, 1.2]}>
        <boxGeometry args={[2.0, 0.09, 2.6]} />
        <meshStandardMaterial color="#101010" metalness={0.68} roughness={0.28} />
      </mesh>
      <mesh position={[-1.0, -0.15, 1.2]}>
        <boxGeometry args={[2.0, 0.09, 2.6]} />
        <meshStandardMaterial color="#101010" metalness={0.68} roughness={0.28} />
      </mesh>

      {/* Twin engine nacelles — large, prominent, with shock cones */}
      <group position={[1.55, -0.06, 0.95]}>
        {/* Nacelle body */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.33, 3.0, 12]} />
          <meshStandardMaterial color="#0e0e0e" metalness={0.75} roughness={0.2} />
        </mesh>
        {/* Shock cone (characteristic pointed spike inside intake) */}
        <mesh position={[0, 0, -1.56]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 0.7, 8]} />
          <meshStandardMaterial color="#181818" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Intake ring */}
        <mesh position={[0, 0, -1.52]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.36, 0.05, 8, 14]} />
          <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.18} />
        </mesh>
      </group>
      <group position={[-1.55, -0.06, 0.95]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.33, 3.0, 12]} />
          <meshStandardMaterial color="#0e0e0e" metalness={0.75} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -1.56]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 0.7, 8]} />
          <meshStandardMaterial color="#181818" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -1.52]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.36, 0.05, 8, 14]} />
          <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.18} />
        </mesh>
      </group>

      {/* Twin afterburners */}
      <group position={[0, -0.06, 2.45]}>
        <Afterburner x={1.55} />
        <Afterburner x={-1.55} />
      </group>

      {/* Small canted twin fins on nacelles */}
      <mesh position={[1.55, 0.55, 1.7]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.08, 0.95, 0.7]} />
        <meshStandardMaterial color="#0c0c0c" metalness={0.72} roughness={0.25} />
      </mesh>
      <mesh position={[-1.55, 0.55, 1.7]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.08, 0.95, 0.7]} />
        <meshStandardMaterial color="#0c0c0c" metalness={0.72} roughness={0.25} />
      </mesh>

      {/* Futuristic blue sensor glow at nose */}
      <mesh position={[0, 0, -3.2]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#00d8ff" />
      </mesh>
      <pointLight position={[0, 0, -3.2]} color="#00d8ff" intensity={1.5} distance={4} />
    </group>
  );
}
