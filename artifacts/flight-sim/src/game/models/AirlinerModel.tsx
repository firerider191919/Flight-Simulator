/** A320-style twin-engine commercial airliner. Nose points along local -Z. */

function EnginePod({ x }: { x: number }) {
  return (
    <group position={[x, -0.48, 0.55]}>
      {/* Nacelle body */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.32, 1.85, 14]} />
        <meshStandardMaterial color="#d8dde2" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* Intake lip */}
      <mesh position={[0, 0, -0.98]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.36, 0.06, 8, 16]} />
        <meshStandardMaterial color="#bfc5ca" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Fan disc */}
      <mesh position={[0, 0, -0.88]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.04, 16]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Exhaust nozzle */}
      <mesh position={[0, 0, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.32, 0.28, 14]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Pylon */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.12, 0.55, 1.5]} />
        <meshStandardMaterial color="#c8cdd2" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function AirlinerModel() {
  return (
    <group>
      {/* Main fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[0.82, 6.8, 4, 12]} />
        <meshStandardMaterial color="#f5f7f9" metalness={0.15} roughness={0.45} />
      </mesh>
      {/* Nose radome — tapered */}
      <mesh position={[0, -0.04, -4.1]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.78, 1.5, 12]} />
        <meshStandardMaterial color="#e8edf2" metalness={0.1} roughness={0.5} />
      </mesh>
      {/* Nose radome tip */}
      <mesh position={[0, -0.04, -4.84]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.22, 0.4, 10]} />
        <meshStandardMaterial color="#d0d5da" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* Cockpit windshield */}
      <mesh position={[0, 0.55, -3.6]} rotation={[0.32, 0, 0]}>
        <boxGeometry args={[1.05, 0.38, 0.55]} />
        <meshStandardMaterial color="#1e3040" metalness={0.3} roughness={0.1} />
      </mesh>
      {/* Cockpit side windows */}
      <mesh position={[0.55, 0.42, -3.3]} rotation={[0.2, 0.3, 0]}>
        <boxGeometry args={[0.24, 0.22, 0.22]} />
        <meshStandardMaterial color="#1e3040" metalness={0.3} roughness={0.1} />
      </mesh>
      <mesh position={[-0.55, 0.42, -3.3]} rotation={[0.2, -0.3, 0]}>
        <boxGeometry args={[0.24, 0.22, 0.22]} />
        <meshStandardMaterial color="#1e3040" metalness={0.3} roughness={0.1} />
      </mesh>

      {/* Blue cheatline (livery stripe along fuselage) */}
      <mesh position={[0, -0.1, 0.2]}>
        <boxGeometry args={[1.68, 0.28, 7.4]} />
        <meshStandardMaterial color="#1565c0" />
      </mesh>

      {/* Window row — right */}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={`wr-${i}`} position={[0.84, 0.2, -3.0 + i * 0.58]}>
          <boxGeometry args={[0.06, 0.2, 0.28]} />
          <meshStandardMaterial color="#c8e4f8" metalness={0.1} roughness={0.1} />
        </mesh>
      ))}
      {/* Window row — left */}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={`wl-${i}`} position={[-0.84, 0.2, -3.0 + i * 0.58]}>
          <boxGeometry args={[0.06, 0.2, 0.28]} />
          <meshStandardMaterial color="#c8e4f8" metalness={0.1} roughness={0.1} />
        </mesh>
      ))}

      {/* Main wings — swept back, slight dihedral */}
      <mesh position={[2.6, -0.38, 0.7]} rotation={[0.07, -0.18, 0.04]} castShadow>
        <boxGeometry args={[5.2, 0.14, 1.95]} />
        <meshStandardMaterial color="#eaeef2" metalness={0.15} roughness={0.55} />
      </mesh>
      <mesh position={[-2.6, -0.38, 0.7]} rotation={[0.07, 0.18, -0.04]} castShadow>
        <boxGeometry args={[5.2, 0.14, 1.95]} />
        <meshStandardMaterial color="#eaeef2" metalness={0.15} roughness={0.55} />
      </mesh>
      {/* Wing root fillets */}
      <mesh position={[0.9, -0.35, 0.75]}>
        <boxGeometry args={[1.8, 0.14, 2.0]} />
        <meshStandardMaterial color="#eaeef2" metalness={0.15} roughness={0.55} />
      </mesh>
      <mesh position={[-0.9, -0.35, 0.75]}>
        <boxGeometry args={[1.8, 0.14, 2.0]} />
        <meshStandardMaterial color="#eaeef2" metalness={0.15} roughness={0.55} />
      </mesh>

      {/* Winglets — angled ~65° */}
      <mesh position={[5.05, 0.46, 1.35]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.1, 0.95, 0.48]} />
        <meshStandardMaterial color="#1565c0" />
      </mesh>
      <mesh position={[-5.05, 0.46, 1.35]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.1, 0.95, 0.48]} />
        <meshStandardMaterial color="#1565c0" />
      </mesh>

      <EnginePod x={2.3} />
      <EnginePod x={-2.3} />

      {/* Horizontal stabilizer */}
      <mesh position={[0, 0.18, 3.35]} castShadow>
        <boxGeometry args={[3.8, 0.1, 1.1]} />
        <meshStandardMaterial color="#eaeef2" />
      </mesh>
      {/* Elevator trailing edge */}
      <mesh position={[0, 0.18, 3.85]}>
        <boxGeometry args={[3.4, 0.08, 0.3]} />
        <meshStandardMaterial color="#1565c0" />
      </mesh>
      {/* Vertical stabilizer */}
      <mesh position={[0, 1.25, 3.5]} castShadow>
        <boxGeometry args={[0.11, 2.1, 1.2]} />
        <meshStandardMaterial color="#1565c0" />
      </mesh>
      {/* APU exhaust at tail */}
      <mesh position={[0, -0.8, 3.85]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.62, 0.7, 10]} />
        <meshStandardMaterial color="#e8edf2" metalness={0.2} roughness={0.4} />
      </mesh>
    </group>
  );
}
