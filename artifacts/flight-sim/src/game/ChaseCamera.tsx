import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ChaseCameraProps {
  targetRef: React.RefObject<THREE.Group | null>;
  active: boolean;
}

const OFFSET = new THREE.Vector3(0, 3.2, 11);
const LOOK_OFFSET = new THREE.Vector3(0, 1, -8);

const _desiredPos = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();

export default function ChaseCamera({ targetRef, active }: ChaseCameraProps) {
  const { camera } = useThree();
  const initialized = useRef(false);

  useFrame((_, rawDelta) => {
    const target = targetRef.current;
    if (!target) return;
    const delta = Math.min(rawDelta, 0.05);

    _desiredPos.copy(OFFSET).applyQuaternion(target.quaternion).add(target.position);
    _lookTarget.copy(LOOK_OFFSET).applyQuaternion(target.quaternion).add(target.position);

    if (!initialized.current) {
      camera.position.copy(_desiredPos);
      initialized.current = true;
    } else {
      const smoothing = active ? 4.5 : 2;
      camera.position.lerp(_desiredPos, 1 - Math.exp(-smoothing * delta));
    }

    camera.lookAt(_lookTarget);
  });

  return null;
}
