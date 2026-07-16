import { useMemo } from 'react';

interface CloudInstance {
  position: [number, number, number];
  scale: number;
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

function useCloudField(count: number): CloudInstance[] {
  return useMemo(() => {
    const rand = mulberry32(90210);
    const clouds: CloudInstance[] = [];
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const dist = 200 + rand() * 1800;
      clouds.push({
        position: [
          Math.cos(angle) * dist,
          140 + rand() * 260,
          Math.sin(angle) * dist,
        ],
        scale: 14 + rand() * 26,
      });
    }
    return clouds;
  }, [count]);
}

function CloudPuff({ position, scale }: CloudInstance) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.9, 0.1, 0.2]}>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.9, 0.05, -0.1]}>
        <sphereGeometry args={[0.75, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.4, -0.4]}>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

export default function Clouds() {
  const clouds = useCloudField(40);
  return (
    <group>
      {clouds.map((c, i) => (
        <CloudPuff key={i} {...c} />
      ))}
    </group>
  );
}
