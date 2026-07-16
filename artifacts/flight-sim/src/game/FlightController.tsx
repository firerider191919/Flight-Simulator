import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Controls } from './controls';
import { getPlaneModelComponent } from './models';
import type { PlaneDefinition } from './planes';
import type { TargetsHandle } from './Targets';
import type { WeaponsHandle } from './Weapons';
import { worldPositionToLatLon, formatLatLon, type WorldLocation } from './world';
import type { FlightHudState } from './types';

const BANK_TURN_COUPLING = 0.65;
const AUTO_LEVEL_ROLL = 0.35;
const GRAVITY_DROP = 9; // world units / s^2 applied when stalling
const GROUND_LEVEL = 0.9;
const START_ALTITUDE = 70;

const WORLD_UNIT_TO_FEET = 12;
const SPEED_TO_KNOTS = 3.4;
const SPEED_OF_SOUND = 340; // world units / second, tuned for HUD flavor
const G = 9.81;
const WORLD_UNIT_TO_METERS = 3;

interface FlightControllerProps {
  active: boolean;
  plane: PlaneDefinition;
  location: WorldLocation;
  resetToken: number;
  onHudUpdate: (state: Partial<FlightHudState>) => void;
  onCrashChange: (crashed: boolean) => void;
  targetsRef: React.RefObject<TargetsHandle | null>;
  weaponsRef: React.RefObject<WeaponsHandle | null>;
}

const _forward = new THREE.Vector3();
const _prevForward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _euler = new THREE.Euler();
const _muzzle = new THREE.Vector3();
const _lockCandidate = new THREE.Vector3();

const FlightController = forwardRef<
  THREE.Group | null,
  FlightControllerProps
>(function FlightController(
  {
    active,
    plane,
    location,
    resetToken,
    onHudUpdate,
    onCrashChange,
    targetsRef,
    weaponsRef,
  },
  groupRefOut,
) {
  const groupRef = useRef<THREE.Group>(null);
  const throttleRef = useRef(0.55);
  const speedRef = useRef(plane.stats.minSpeed + (plane.stats.maxSpeed - plane.stats.minSpeed) * 0.3);
  const hudTimerRef = useRef(0);
  const crashedRef = useRef(false);
  const gunCooldownRef = useRef(0);
  const gunAmmoRef = useRef(plane.weapons?.gunAmmo ?? 0);
  const missileAmmoRef = useRef(plane.weapons?.missileAmmo ?? 0);
  const prevMissileKeyRef = useRef(false);
  const lockedTargetIdRef = useRef<number | null>(null);

  const [, getKeys] = useKeyboardControls<Controls>();

  useImperativeHandle(groupRefOut, () => groupRef.current as THREE.Group);

  const resetPlane = () => {
    const group = groupRef.current;
    if (!group) return;
    group.position.set(0, START_ALTITUDE, 140);
    group.quaternion.identity();
    group.rotateY(Math.PI);
    speedRef.current = plane.stats.minSpeed + (plane.stats.maxSpeed - plane.stats.minSpeed) * 0.3;
    throttleRef.current = 0.55;
    crashedRef.current = false;
    gunAmmoRef.current = plane.weapons?.gunAmmo ?? 0;
    missileAmmoRef.current = plane.weapons?.missileAmmo ?? 0;
    lockedTargetIdRef.current = null;
  };

  useEffect(() => {
    resetPlane();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetToken]);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, 0.05);

    const keys = getKeys();

    if (keys.reset && crashedRef.current) {
      resetPlane();
      onCrashChange(false);
      return;
    }

    if (!active || crashedRef.current) return;

    const stats = plane.stats;

    // Throttle
    if (keys.throttleUp) {
      throttleRef.current = Math.min(1, throttleRef.current + delta * 0.6);
    }
    if (keys.throttleDown) {
      throttleRef.current = Math.max(0, throttleRef.current - delta * 0.6);
    }

    // Pitch (local X axis): positive = nose up / climb
    if (keys.pitchUp) group.rotateX(stats.pitchRate * delta);
    if (keys.pitchDown) group.rotateX(-stats.pitchRate * delta);

    // Roll (local Z axis): positive = bank left
    let rolling = false;
    if (keys.rollLeft) {
      group.rotateZ(stats.rollRate * delta);
      rolling = true;
    }
    if (keys.rollRight) {
      group.rotateZ(-stats.rollRate * delta);
      rolling = true;
    }

    // Manual yaw (local Y axis): positive = turn left
    if (keys.yawLeft) group.rotateY(stats.yawRate * delta);
    if (keys.yawRight) group.rotateY(-stats.yawRate * delta);

    // Extract current bank from the local right vector's world Y component
    _right.set(1, 0, 0).applyQuaternion(group.quaternion);
    const bankSin = THREE.MathUtils.clamp(_right.y, -1, 1);

    // Coordinated turn: banking yaws the plane automatically
    group.rotateY(BANK_TURN_COUPLING * bankSin * delta);

    // Gentle auto-level when the player isn't actively rolling
    if (!rolling && Math.abs(bankSin) > 0.01) {
      const correction = Math.sign(bankSin) * AUTO_LEVEL_ROLL * delta;
      const applied =
        Math.abs(correction) > Math.abs(bankSin) * 0.6
          ? Math.sign(bankSin) * Math.abs(bankSin) * 0.6
          : correction;
      group.rotateZ(-applied);
    }

    // Speed dynamics: eases toward a throttle-derived target
    const targetSpeed = stats.minSpeed + throttleRef.current * (stats.maxSpeed - stats.minSpeed);
    speedRef.current += (targetSpeed - speedRef.current) * Math.min(1, stats.accel * delta);

    const stalling = speedRef.current < stats.stallSpeed;

    // Track previous forward vector to estimate turn-induced G-force
    _prevForward.set(0, 0, -1).applyQuaternion(group.quaternion);

    // Move forward along the plane's nose direction (local -Z)
    _forward.set(0, 0, -1).applyQuaternion(group.quaternion);
    const displacement = _forward.clone().multiplyScalar(speedRef.current * delta);
    group.position.add(displacement);

    // Extra gravity drop when under stall speed (nose-up mush / stall feel)
    if (stalling) {
      const stallFactor = 1 - speedRef.current / stats.stallSpeed;
      group.position.y -= GRAVITY_DROP * stallFactor * delta;
    }

    // Ground collision
    if (group.position.y <= GROUND_LEVEL) {
      group.position.y = GROUND_LEVEL;
      crashedRef.current = true;
      onCrashChange(true);
    }

    // --- Weapons ---
    const weapons = plane.weapons;
    let missileLocked = false;

    if (weapons && weaponsRef.current) {
      // Gun lock candidate search (used for both HUD reticle lock and missile targeting)
      const targets = targetsRef.current?.getAll() ?? [];
      let bestId: number | null = null;
      let bestDot = 0.985; // ~10 degree cone
      targets.forEach((t, i) => {
        if (!t.isAlive()) return;
        _lockCandidate.copy(t.getPosition()).sub(group.position);
        const dist = _lockCandidate.length();
        if (dist > weapons.missileRange) return;
        _lockCandidate.normalize();
        const dot = _lockCandidate.dot(_forward);
        if (dot > bestDot) {
          bestDot = dot;
          bestId = i;
        }
      });
      lockedTargetIdRef.current = bestId;
      missileLocked = bestId !== null;

      // Guns: fire continuously while held, limited by fire rate and ammo
      gunCooldownRef.current -= delta;
      if (keys.fireGuns && gunCooldownRef.current <= 0 && gunAmmoRef.current > 0) {
        gunCooldownRef.current = 1 / weapons.gunFireRate;
        gunAmmoRef.current -= 1;
        _muzzle.copy(_forward).multiplyScalar(2.4).add(group.position);
        weaponsRef.current.fireGun(_muzzle, _forward, weapons.gunDamage, weapons.gunRange);
      }

      // Missiles: single fire on key press edge
      const missilePressed = keys.fireMissile && !prevMissileKeyRef.current;
      if (missilePressed && missileAmmoRef.current > 0) {
        missileAmmoRef.current -= 1;
        const targetId = lockedTargetIdRef.current;
        _muzzle.copy(_forward).multiplyScalar(2.6).add(group.position);
        const targetGetter =
          targetId !== null
            ? () => {
                const t = targetsRef.current?.getAll()[targetId];
                return t && t.isAlive() ? t.getPosition() : null;
              }
            : null;
        weaponsRef.current.fireMissile(
          _muzzle,
          _forward,
          weapons.missileSpeed,
          weapons.missileTurnRate,
          weapons.missileRange,
          weapons.gunDamage * 6,
          targetGetter,
        );
      }
      prevMissileKeyRef.current = keys.fireMissile;
    }

    // Report HUD state at ~10Hz to avoid excessive re-renders
    hudTimerRef.current += delta;
    if (hudTimerRef.current >= 0.1) {
      hudTimerRef.current = 0;
      _euler.setFromQuaternion(group.quaternion, 'YXZ');
      let headingDeg = THREE.MathUtils.radToDeg(_euler.y);
      headingDeg = ((180 - headingDeg) % 360 + 360) % 360;

      // Approximate G-force from how quickly the forward vector is turning
      const turnAngle = _prevForward.angleTo(_forward);
      const turnRate = delta > 0 ? turnAngle / delta : 0;
      const speedMs = speedRef.current * WORLD_UNIT_TO_METERS;
      const centripetal = (turnRate * speedMs) / G;
      const gForce = 1 + centripetal;

      const { lat, lon } = worldPositionToLatLon(location, group.position.x, group.position.z);

      onHudUpdate({
        speed: Math.round(speedRef.current * SPEED_TO_KNOTS),
        altitude: Math.round(group.position.y * WORLD_UNIT_TO_FEET),
        throttle: throttleRef.current,
        heading: Math.round(headingDeg),
        vSpeed: Math.round(displacement.y * (60 / Math.max(delta, 0.0001)) * WORLD_UNIT_TO_FEET / 60),
        gForce: Math.round(gForce * 10) / 10,
        mach: Math.round((speedRef.current / SPEED_OF_SOUND) * 100) / 100,
        latLon: formatLatLon(lat, lon),
        stalling,
        hasWeapons: !!weapons,
        gunAmmo: gunAmmoRef.current,
        gunAmmoMax: weapons?.gunAmmo ?? 0,
        missileAmmo: missileAmmoRef.current,
        missileAmmoMax: weapons?.missileAmmo ?? 0,
        missileLocked,
      });
    }
  });

  const PlaneMesh = getPlaneModelComponent(plane.id);

  return (
    <group ref={groupRef} position={[0, START_ALTITUDE, 140]} rotation={[0, Math.PI, 0]}>
      <PlaneMesh />
    </group>
  );
});

export default FlightController;
