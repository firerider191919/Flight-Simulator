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
const GRAVITY_DROP = 9;
const GROUND_LEVEL = 0.9;
const START_ALTITUDE = 70;
const WORLD_UNIT_TO_FEET = 12;
const SPEED_TO_KNOTS = 3.4;
const SPEED_OF_SOUND = 340;
const G = 9.81;
const WORLD_UNIT_TO_METERS = 3;

interface FlightControllerProps {
  active: boolean;
  plane: PlaneDefinition;
  location: WorldLocation;
  resetToken: number;
  onHudUpdate: (state: Partial<FlightHudState>) => void;
  onCrashChange: (crashed: boolean) => void;
  onLandChange?: (landed: boolean) => void;
  targetsRef: React.RefObject<TargetsHandle | null>;
  weaponsRef: React.RefObject<WeaponsHandle | null>;
}

const _forward = new THREE.Vector3();
const _prevForward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _euler = new THREE.Euler();
const _muzzle = new THREE.Vector3();
const _lockCandidate = new THREE.Vector3();

const FlightController = forwardRef<THREE.Group | null, FlightControllerProps>(
  function FlightController(
    {
      active,
      plane,
      location,
      resetToken,
      onHudUpdate,
      onCrashChange,
      onLandChange,
      targetsRef,
      weaponsRef,
    },
    groupRefOut,
  ) {
    const groupRef = useRef<THREE.Group>(null);
    const throttleRef = useRef(0.55);
    const speedRef = useRef(
      plane.stats.minSpeed + (plane.stats.maxSpeed - plane.stats.minSpeed) * 0.3,
    );
    const hudTimerRef = useRef(0);
    const crashedRef = useRef(false);
    const landedRef = useRef(false);
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
      speedRef.current =
        plane.stats.minSpeed + (plane.stats.maxSpeed - plane.stats.minSpeed) * 0.3;
      throttleRef.current = 0.55;
      crashedRef.current = false;
      if (landedRef.current) {
        landedRef.current = false;
        onLandChange?.(false);
      }
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

      if (keys.reset && (crashedRef.current || landedRef.current)) {
        resetPlane();
        onCrashChange(false);
        return;
      }
      if (!active || crashedRef.current || landedRef.current) return;

      const stats = plane.stats;
      if (keys.throttleUp) {
        throttleRef.current = Math.min(1, throttleRef.current + delta * 0.6);
      }
      if (keys.throttleDown) {
        throttleRef.current = Math.max(0, throttleRef.current - delta * 0.6);
      }

      if (keys.pitchUp) group.rotateX(stats.pitchRate * delta);
      if (keys.pitchDown) group.rotateX(-stats.pitchRate * delta);

      let rolling = false;
      if (keys.rollLeft) {
        group.rotateZ(stats.rollRate * delta);
        rolling = true;
      }
      if (keys.rollRight) {
        group.rotateZ(-stats.rollRate * delta);
        rolling = true;
      }
      if (keys.yawLeft) group.rotateY(stats.yawRate * delta);
      if (keys.yawRight) group.rotateY(-stats.yawRate * delta);

      _right.set(1, 0, 0).applyQuaternion(group.quaternion);
      const bankSin = THREE.MathUtils.clamp(_right.y, -1, 1);
      group.rotateY(BANK_TURN_COUPLING * bankSin * delta);

      if (!rolling && Math.abs(bankSin) > 0.01) {
        const correction = Math.sign(bankSin) * AUTO_LEVEL_ROLL * delta;
        const applied =
          Math.abs(correction) > Math.abs(bankSin) * 0.6
            ? Math.sign(bankSin) * Math.abs(bankSin) * 0.6
            : correction;
        group.rotateZ(-applied);
      }

      const targetSpeed = stats.minSpeed + throttleRef.current * (stats.maxSpeed - stats.minSpeed);
      speedRef.current += (targetSpeed - speedRef.current) * Math.min(1, stats.accel * delta);
      const stalling = speedRef.current < stats.stallSpeed;

      _prevForward.set(0, 0, -1).applyQuaternion(group.quaternion);
      _forward.set(0, 0, -1).applyQuaternion(group.quaternion);
      const displacement = _forward.clone().multiplyScalar(speedRef.current * delta);
      group.position.add(displacement);

      if (stalling) {
        const stallFactor = 1 - speedRef.current / stats.stallSpeed;
        group.position.y -= GRAVITY_DROP * stallFactor * delta;
      }

      if (group.position.y <= GROUND_LEVEL) {
        group.position.y = GROUND_LEVEL;
        const verticalSpeed = delta > 0 ? displacement.y / delta : 0;
        const softTouchdown =
          speedRef.current < stats.stallSpeed * 2.2 &&
          verticalSpeed > -5 &&
          _forward.y > -0.25;
        if (softTouchdown) {
          landedRef.current = true;
          onLandChange?.(true);
        } else {
          crashedRef.current = true;
          onCrashChange(true);
        }
      }

      const weapons = plane.weapons;
      let missileLocked = false;
      const targets = targetsRef.current?.getAll() ?? [];

      if (weapons && weaponsRef.current) {
        let bestId: number | null = null;
        let bestDot = 0.985;
        targets.forEach((target, index) => {
          if (!target.isAlive()) return;
          _lockCandidate.copy(target.getPosition()).sub(group.position);
          const distance = _lockCandidate.length();
          if (distance > weapons.missileRange) return;
          _lockCandidate.normalize();
          const dot = _lockCandidate.dot(_forward);
          if (dot > bestDot) {
            bestDot = dot;
            bestId = index;
          }
        });
        lockedTargetIdRef.current = bestId;
        missileLocked = bestId !== null;

        gunCooldownRef.current -= delta;
        if (keys.fireGuns && gunCooldownRef.current <= 0 && gunAmmoRef.current > 0) {
          gunCooldownRef.current = 1 / weapons.gunFireRate;
          gunAmmoRef.current -= 1;
          _muzzle.copy(_forward).multiplyScalar(2.4).add(group.position);
          weaponsRef.current.fireGun(_muzzle, _forward, weapons.gunDamage, weapons.gunRange);
        }

        const missilePressed = keys.fireMissile && !prevMissileKeyRef.current;
        if (missilePressed && missileAmmoRef.current > 0) {
          missileAmmoRef.current -= 1;
          const targetId = lockedTargetIdRef.current;
          _muzzle.copy(_forward).multiplyScalar(2.6).add(group.position);
          const targetGetter =
            targetId !== null
              ? () => {
                  const target = targetsRef.current?.getAll()[targetId];
                  return target && target.isAlive() ? target.getPosition() : null;
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

      hudTimerRef.current += delta;
      if (hudTimerRef.current >= 0.1) {
        hudTimerRef.current = 0;
        _euler.setFromQuaternion(group.quaternion, 'YXZ');
        let headingDeg = THREE.MathUtils.radToDeg(_euler.y);
        headingDeg = ((180 - headingDeg) % 360 + 360) % 360;

        const turnAngle = _prevForward.angleTo(_forward);
        const turnRate = delta > 0 ? turnAngle / delta : 0;
        const speedMs = speedRef.current * WORLD_UNIT_TO_METERS;
        const gForce = 1 + (turnRate * speedMs) / G;
        const { lat, lon } = worldPositionToLatLon(location, group.position.x, group.position.z);
        const pitchDeg = THREE.MathUtils.radToDeg(
          Math.asin(THREE.MathUtils.clamp(_forward.y, -1, 1)),
        );
        const radarTargets = targets.map((target) => ({
          relX: target.getPosition().x - group.position.x,
          relZ: target.getPosition().z - group.position.z,
          alive: target.isAlive(),
        }));

        onHudUpdate({
          speed: Math.round(speedRef.current * SPEED_TO_KNOTS),
          altitude: Math.round(group.position.y * WORLD_UNIT_TO_FEET),
          throttle: throttleRef.current,
          heading: Math.round(headingDeg),
          vSpeed: Math.round((displacement.y * WORLD_UNIT_TO_FEET) / Math.max(delta, 0.0001)),
          gForce: Math.round(gForce * 10) / 10,
          mach: Math.round((speedRef.current / SPEED_OF_SOUND) * 100) / 100,
          latLon: formatLatLon(lat, lon),
          stalling,
          pitch: Math.round(pitchDeg * 10) / 10,
          bank: Math.round(THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(-_right.y, -1, 1))) * 10) / 10,
          hasWeapons: !!weapons,
          gunAmmo: gunAmmoRef.current,
          gunAmmoMax: weapons?.gunAmmo ?? 0,
          missileAmmo: missileAmmoRef.current,
          missileAmmoMax: weapons?.missileAmmo ?? 0,
          missileLocked,
          radarTargets,
        });
      }
    });

    const PlaneMesh = getPlaneModelComponent(plane.id);

    return (
      <group ref={groupRef} position={[0, START_ALTITUDE, 140]} rotation={[0, Math.PI, 0]}>
        <PlaneMesh />
      </group>
    );
  },
);

export default FlightController;
