import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Propeller() {
  const propRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (propRef.current) propRef.current.rotation.z += delta * 22;
  });
  return (
    <group ref={propRef} position={[0, 0, -2.42]}>
      <mesh>
        <boxGeometry args={[0.07, 1.72, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.07, 1.72, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Spinner hub */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.14, 0.26, 10]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Cessna 172 Skyhawk — high-wing monoplane.
 * Nose points along local -Z.
 */
export default function PlaneModel() {
  return (
    <group>
      {/* Fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[0.42, 2.5, 4, 10]} />
        <meshStandardMaterial color="#e8452c" metalness={0.15} roughness={0.5} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 0, -1.82]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.42, 0.72, 10]} />
        <meshStandardMaterial color="#2b2b2b" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Cockpit windows — slightly recessed */}
      <mesh position={[0, 0.28, -0.2]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.76, 0.44, 0.56]} />
        <meshStandardMaterial color="#b8dff5" transparent opacity={0.72} metalness={0.1} roughness={0.05} />
      </mesh>
      {/* Cockpit frame sides */}
      <mesh position={[0.35, 0.3, -0.2]}>
        <boxGeometry args={[0.06, 0.46, 0.56]} />
        <meshStandardMaterial color="#c03018" />
      </mesh>
      <mesh position={[-0.35, 0.3, -0.2]}>
        <boxGeometry args={[0.06, 0.46, 0.56]} />
        <meshStandardMaterial color="#c03018" />
      </mesh>

      {/* High-mounted main wings */}
      <mesh position={[0, 0.38, 0.1]} castShadow>
        <boxGeometry args={[5.8, 0.1, 1.05]} />
        <meshStandardMaterial color="#f0f0ee" metalness={0.1} roughness={0.6} />
      </mesh>
      {/* Wing leading-edge taper (inner) */}
      <mesh position={[1.4, 0.38, -0.2]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[2.0, 0.09, 0.5]} />
        <meshStandardMaterial color="#e8e8e6" />
      </mesh>
      <mesh position={[-1.4, 0.38, -0.2]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[2.0, 0.09, 0.5]} />
        <meshStandardMaterial color="#e8e8e6" />
      </mesh>
      {/* Red wing-tip accent */}
      <mesh position={[2.78, 0.38, 0.1]}>
        <boxGeometry args={[0.25, 0.09, 1.05]} />
        <meshStandardMaterial color="#e8452c" />
      </mesh>
      <mesh position={[-2.78, 0.38, 0.1]}>
        <boxGeometry args={[0.25, 0.09, 1.05]} />
        <meshStandardMaterial color="#e8452c" />
      </mesh>

      {/* Strut braces wing→fuselage */}
      <mesh position={[1.0, 0.0, 0.22]} rotation={[0, 0, -0.55]}>
        <cylinderGeometry args={[0.025, 0.025, 0.82, 6]} />
        <meshStandardMaterial color="#aaa" metalness={0.5} />
      </mesh>
      <mesh position={[-1.0, 0.0, 0.22]} rotation={[0, 0, 0.55]}>
        <cylinderGeometry args={[0.025, 0.025, 0.82, 6]} />
        <meshStandardMaterial color="#aaa" metalness={0.5} />
      </mesh>

      {/* Fuselage white stripe */}
      <mesh position={[0, -0.05, 0.1]}>
        <boxGeometry args={[0.86, 0.15, 3.0]} />
        <meshStandardMaterial color="#f8f8f6" />
      </mesh>

      {/* Horizontal stabilizer */}
      <mesh position={[0, 0.06, 1.78]} castShadow>
        <boxGeometry args={[1.9, 0.07, 0.52]} />
        <meshStandardMaterial color="#f0f0ee" />
      </mesh>
      {/* Elevators (slightly different shade) */}
      <mesh position={[0, 0.06, 1.95]}>
        <boxGeometry args={[1.7, 0.065, 0.2]} />
        <meshStandardMaterial color="#e8452c" />
      </mesh>
      {/* Vertical stabilizer */}
      <mesh position={[0, 0.52, 1.85]} castShadow>
        <boxGeometry args={[0.07, 0.86, 0.52]} />
        <meshStandardMaterial color="#f0f0ee" />
      </mesh>
      <mesh position={[0, 0.52, 1.96]}>
        <boxGeometry args={[0.07, 0.8, 0.2]} />
        <meshStandardMaterial color="#e8452c" />
      </mesh>

      {/* Landing gear — left */}
      <mesh position={[0.85, -0.6, 0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.85, -0.87, 0.3]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Wheel fairing (spat) */}
      <mesh position={[0.85, -0.74, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.28, 8]} />
        <meshStandardMaterial color="#e8452c" />
      </mesh>
      {/* Landing gear — right */}
      <mesh position={[-0.85, -0.6, 0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.85, -0.87, 0.3]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.85, -0.74, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.28, 8]} />
        <meshStandardMaterial color="#e8452c" />
      </mesh>
      {/* Nose gear */}
      <mesh position={[0, -0.68, -1.5]}>
        <cylinderGeometry args={[0.035, 0.035, 0.42, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, -0.9, -1.5]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      <Propeller />
    </group>
  );
}
