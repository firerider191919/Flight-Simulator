import { useMemo } from 'react';
import * as THREE from 'three';

interface TaperedWingProps {
  /** 1 for the right wing, -1 for the left wing. */
  side: 1 | -1;
  span: number;
  rootX: number;
  rootChord: number;
  tipChord: number;
  sweep: number;
  y: number;
  z: number;
  thickness?: number;
  color: string;
  metalness?: number;
  roughness?: number;
}

/**
 * A real wing has a tapered planform and a swept leading edge, not a box.
 * This small custom prism keeps the model lightweight while making the
 * silhouette read correctly from chase, side, and selection cameras.
 */
export function TaperedWing({
  side,
  span,
  rootX,
  rootChord,
  tipChord,
  sweep,
  y,
  z,
  thickness = 0.08,
  color,
  metalness = 0.3,
  roughness = 0.5,
}: TaperedWingProps) {
  const geometry = useMemo(() => {
    const rootLead = -rootChord * 0.56;
    const rootTrail = rootChord * 0.44;
    const tipLead = sweep - tipChord * 0.5;
    const tipTrail = sweep + tipChord * 0.5;
    const half = thickness / 2;
    const positions = new Float32Array([
      0, -half, rootLead, 0, -half, rootTrail, span, -half, tipLead, span, -half, tipTrail,
      0, half, rootLead, 0, half, rootTrail, span, half, tipLead, span, half, tipTrail,
    ]);
    const indices = [
      0, 2, 1, 1, 2, 3, // bottom
      4, 5, 6, 5, 7, 6, // top
      0, 4, 6, 0, 6, 2, // leading edge
      1, 3, 7, 1, 7, 5, // trailing edge
      0, 1, 5, 0, 5, 4, // root
      2, 6, 7, 2, 7, 3, // tip
    ];
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    buffer.setIndex(indices);
    buffer.computeVertexNormals();
    return buffer;
  }, [rootChord, span, sweep, thickness, tipChord]);

  return (
    <mesh
      geometry={geometry}
      position={[side * rootX, y, z]}
      scale={[side, 1, 1]}
      castShadow
    >
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

export function VerticalTail({
  height,
  chord,
  y,
  z,
  color,
  cant = 0,
}: {
  height: number;
  chord: number;
  y: number;
  z: number;
  color: string;
  cant?: number;
}) {
  return (
    <mesh position={[0, y + height / 2, z]} rotation={[0, 0, cant]} castShadow>
      <boxGeometry args={[0.1, height, chord]} />
      <meshStandardMaterial color={color} metalness={0.42} roughness={0.42} />
    </mesh>
  );
}