import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import Terrain from './Terrain';
import Clouds from './Clouds';
import FlightController from './FlightController';
import FlightCamera from './FlightCamera';
import Targets, { type TargetsHandle } from './Targets';
import Weapons, { type WeaponsHandle } from './Weapons';
import type { PlaneDefinition } from './planes';
import type { WorldLocation } from './world';
import type { FlightHudState, CameraMode } from './types';

interface SceneProps {
  active: boolean;
  plane: PlaneDefinition;
  location: WorldLocation;
  resetToken: number;
  cameraMode?: CameraMode;
  onHudUpdate: (state: Partial<FlightHudState>) => void;
  onCrashChange: (crashed: boolean) => void;
  onLandChange: (landed: boolean) => void;
}

export default function Scene({
  active,
  plane,
  location,
  resetToken,
  cameraMode = 'chase',
  onHudUpdate,
  onCrashChange,
  onLandChange,
}: SceneProps) {
  const planeRef = useRef<THREE.Group>(null);
  const targetsRef = useRef<TargetsHandle>(null);
  const weaponsRef = useRef<WeaponsHandle>(null);

  return (
    <Canvas
      shadows={false}
      camera={{ fov: 62, near: 0.5, far: 6000, position: [0, 3, 155] }}
      gl={{
        antialias: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      }}
    >
      <Sky
        distance={4500}
        sunPosition={[600, 350, -400]}
        turbidity={3}
        rayleigh={1.2}
        mieCoefficient={0.006}
        mieDirectionalG={0.85}
      />
      <fog attach="fog" args={[location.fogColor, location.fogNear, location.fogFar]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[600, 350, -400]} intensity={1.4} />
      <hemisphereLight args={[location.skyColor, location.groundColor, 0.5]} />

      <Terrain location={location} />
      <Clouds />
      {plane.weapons && (
        <>
          <Targets ref={targetsRef} biome={location.id} />
          <Weapons ref={weaponsRef} targetsRef={targetsRef} />
        </>
      )}
      <FlightController
        ref={planeRef}
        active={active}
        plane={plane}
        location={location}
        resetToken={resetToken}
        onHudUpdate={onHudUpdate}
        onCrashChange={onCrashChange}
        onLandChange={onLandChange}
        targetsRef={targetsRef}
        weaponsRef={weaponsRef}
      />
      <FlightCamera targetRef={planeRef} active={active} mode={cameraMode} />
    </Canvas>
  );
}
