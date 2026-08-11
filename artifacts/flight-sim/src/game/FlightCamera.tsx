import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { CameraMode } from './types';

interface FlightCameraProps {
  targetRef: React.RefObject<THREE.Group | null>;
  active: boolean;
  mode: CameraMode;
}

const _desiredPos = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _offset = new THREE.Vector3();
const _lookOff = new THREE.Vector3();

const MODES: Record<
  CameraMode,
  { offset: [number, number, number]; look: [number, number, number]; smooth: number }
> = {
  chase: { offset: [0, 3.2, 11], look: [0, 1, -8], smooth: 4.5 },
  cockpit: { offset: [0, 0.8, -0.5], look: [0, 0.5, -30], smooth: 25 },
  wide: { offset: [5, 9, 30], look: [0, 1.5, -12], smooth: 2.5 },
  side: { offset: [22, 4, 0], look: [0, 0, 0], smooth: 4 },
  nose: { offset: [0, 0.4, -4], look: [0, 0.3, 10], smooth: 14 },
};

export default function FlightCamera({ targetRef, active, mode }: FlightCameraProps) {
  const { camera } = useThree();
  const initialized = useRef(false);

  useFrame((_, rawDelta) => {
    const target = targetRef.current;
    if (!target) return;

    const delta = Math.min(rawDelta, 0.05);
    const config = MODES[mode];
    _offset.set(...config.offset);
    _lookOff.set(...config.look);

    _desiredPos.copy(_offset).applyQuaternion(target.quaternion).add(target.position);
    _lookTarget.copy(_lookOff).applyQuaternion(target.quaternion).add(target.position);

    if (!initialized.current) {
      camera.position.copy(_desiredPos);
      initialized.current = true;
    } else {
      const smoothing = active ? config.smooth : config.smooth * 0.6;
      camera.position.lerp(_desiredPos, 1 - Math.exp(-smoothing * delta));
    }

    camera.lookAt(_lookTarget);
  });

  return null;
}