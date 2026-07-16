/** Boeing 747-400 style four-engine jumbo jet. Nose points along local -Z. */

function EnginePod({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, -0.78, z]}>
      {/* Nacelle */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.44, 2.1, 14]} />
        <meshStandardMaterial color="#d5dae0" metalness={0.5} roughness={0.38} />
      </mesh>
      {/* Intake lip */}
      <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.07, 8, 16]} />
        <meshStandardMaterial color="#b8c0c8" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Fan disc */}
      <mesh position={[0, 0, -0.98]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.05, 16]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Fan hub */}
      <mesh position={[0, 0, -0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 10]} />
        <meshStandardMaterial color="#222" metalness={0.8} />
      </mesh>
      {/* Exhaust nozzle */}
      <mesh position={[0, 0, 1.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.42, 0.3, 14]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Pylon */}
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[0.14, 0.8, 1.9]} />
        <meshStandardMaterial color="#c8cdd4" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function Jumbo747Model() {
  return (
    <group scale={1.15}>
      {/* Main fuselage — wide body */}
      <mesh castShadow>
        <capsuleGeometry args={[1.02, 8.6, 4, 14]} />
        <meshStandardMaterial color="#f5f7f9" metalness={0.12} roughness={0.48} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, -0.06, -5.1]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[1.0, 1.7, 14]} />
        <meshStandardMaterial color="#edf0f4" metalness={0.1} roughness={0.5} />
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, -0.06, -5.82]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.28, 0.45, 10]} />
        <meshStandardMaterial color="#dde0e4" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Signature upper-deck hump */}
      <mesh position={[0, 1.06, -3.5]} castShadow>
        <capsuleGeometry args={[0.6, 2.8, 4, 12]} />
        <meshStandardMaterial color="#f5f7f9" metalness={0.12} roughness={0.48} />
      </mesh>
      {/* Upper deck front taper */}
      <mesh position={[0, 1.0, -4.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.55, 0.65, 12]} />
        <meshStandardMaterial color="#f0f2f6" metalness={0.12} roughness={0.48} />
      </mesh>

      {/* Cockpit windows */}
      <mesh position={[0, 1.22, -4.52]} rotation={[0.32, 0, 0]}>
        <boxGeometry args={[1.3, 0.4, 0.65]} />
        <meshStandardMaterial color="#1e3040" metalness={0.3} roughness={0.1} />
      </mesh>

      {/* Red livery cheatline */}
      <mesh position={[0, -0.28, 0.3]}>
        <boxGeometry args={[2.1, 0.32, 9.0]} />
        <meshStandardMaterial color="#c0302a" />
      </mesh>

      {/* Main cabin window rows */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`wr-${i}`} position={[1.04, 0.22, -4.0 + i * 0.62]}>
          <boxGeometry args={[0.06, 0.24, 0.32]} />
          <meshStandardMaterial color="#c0dcf0" metalness={0.1} roughness={0.1} />
        </mesh>
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`wl-${i}`} position={[-1.04, 0.22, -4.0 + i * 0.62]}>
          <boxGeometry args={[0.06, 0.24, 0.32]} />
          <meshStandardMaterial color="#c0dcf0" metalness={0.1} roughness={0.1} />
        </mesh>
      ))}

      {/* Main wings — swept 37°, dihedral */}
      <mesh position={[3.5, -0.52, 1.1]} rotation={[0.09, -0.22, 0.05]} castShadow>
        <boxGeometry args={[7.0, 0.2, 2.75]} />
        <meshStandardMaterial color="#e8ecf0" metalness={0.15} roughness={0.55} />
      </mesh>
      <mesh position={[-3.5, -0.52, 1.1]} rotation={[0.09, 0.22, -0.05]} castShadow>
        <boxGeometry args={[7.0, 0.2, 2.75]} />
        <meshStandardMaterial color="#e8ecf0" metalness={0.15} roughness={0.55} />
      </mesh>
      {/* Wing root fill */}
      <mesh position={[1.05, -0.5, 1.1]}>
        <boxGeometry args={[2.1, 0.2, 2.8]} />
        <meshStandardMaterial color="#e8ecf0" metalness={0.15} roughness={0.55} />
      </mesh>
      <mesh position={[-1.05, -0.5, 1.1]}>
        <boxGeometry args={[2.1, 0.2, 2.8]} />
        <meshStandardMaterial color="#e8ecf0" metalness={0.15} roughness={0.55} />
      </mesh>

      {/* Winglets */}
      <mesh position={[7.0, 0.65, 2.0]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.12, 1.1, 0.65]} />
        <meshStandardMaterial color="#c0302a" />
      </mesh>
      <mesh position={[-7.0, 0.65, 2.0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.12, 1.1, 0.65]} />
        <meshStandardMaterial color="#c0302a" />
      </mesh>

      {/* Four engines */}
      <EnginePod x={2.4} z={0.5} />
      <EnginePod x={5.2} z={0.7} />
      <EnginePod x={-2.4} z={0.5} />
      <EnginePod x={-5.2} z={0.7} />

      {/* Horizontal stabilizer */}
      <mesh position={[0, 0.24, 4.55]} castShadow>
        <boxGeometry args={[5.0, 0.13, 1.55]} />
        <meshStandardMaterial color="#e8ecf0" />
      </mesh>
      {/* Elevator trailing edge */}
      <mesh position={[0, 0.24, 5.25]}>
        <boxGeometry args={[4.4, 0.1, 0.35]} />
        <meshStandardMaterial color="#c0302a" />
      </mesh>
      {/* Vertical stabilizer */}
      <mesh position={[0, 1.95, 4.7]} castShadow>
        <boxGeometry args={[0.14, 3.1, 1.7]} />
        <meshStandardMaterial color="#c0302a" />
      </mesh>
      {/* Tail cone */}
      <mesh position={[0, -0.9, 5.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.75, 0.95, 12]} />
        <meshStandardMaterial color="#edf0f4" metalness={0.15} roughness={0.45} />
      </mesh>
    </group>
  );
}
