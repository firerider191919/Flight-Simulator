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

const GRAVITY = 9;
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
const _up = new THREE.Vector3();
const _localVelocity = new THREE.Vector3();
const _lift = new THREE.Vector3();
const _engineForce = new THREE.Vector3();
const _forwardVelocity = new THREE.Vector3();
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
    const velocityRef = useRef(new THREE.Vector3());
    const angularVelocityRef = useRef(new THREE.Vector3());
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
      const initialSpeed =
        plane.stats.minSpeed + (plane.stats.maxSpeed - plane.stats.minSpeed) * 0.3;
      speedRef.current = initialSpeed;
      _forward.set(0, 0, -1).applyQuaternion(group.quaternion);
      velocityRef.current.copy(_forward).multiplyScalar(initialSpeed);
      angularVelocityRef.current.set(0, 0, 0);
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

      // Rotational inertia: inputs move angular velocity rather than snapping
      // the aircraft. Releasing the stick lets the aircraft settle naturally;
      // it does not auto-level like the old arcade controller.
      const pitchInput = keys.pitchUp ? 1 : keys.pitchDown ? -1 : 0;
      const rollInput = keys.rollLeft ? 1 : keys.rollRight ? -1 : 0;
      const yawInput = keys.yawLeft ? 1 : keys.yawRight ? -1 : 0;
      const response = Math.min(1, 5.5 * delta);
      angularVelocityRef.current.x +=
        (pitchInput * stats.pitchRate - angularVelocityRef.current.x) * response;
      angularVelocityRef.current.z +=
        (rollInput * stats.rollRate - angularVelocityRef.current.z) * response;
      angularVelocityRef.current.y +=
        (yawInput * stats.yawRate - angularVelocityRef.current.y) * response;

      // Small aerodynamic damping keeps the simulator controllable but still
      // leaves bank and pitch inertia visible to the pilot.
      angularVelocityRef.current.multiplyScalar(Math.exp(-0.22 * delta));
      group.rotateX(angularVelocityRef.current.x * delta);
      group.rotateZ(angularVelocityRef.current.z * delta);
      group.rotateY(angularVelocityRef.current.y * delta);

      _forward.set(0, 0, -1).applyQuaternion(group.quaternion);
      _right.set(1, 0, 0).applyQuaternion(group.quaternion);
      _up.set(0, 1, 0).applyQuaternion(group.quaternion);

      const airspeed = velocityRef.current.length();
      speedRef.current = airspeed;
      _localVelocity.copy(velocityRef.current).applyQuaternion(group.quaternion.clone().invert());
      const forwardAirflow = Math.max(0.1, -_localVelocity.z);
      const angleOfAttack = Math.atan2(_localVelocity.y, forwardAirflow);

      // Thrust, parasite drag, gravity, and lift. Values are tuned to this
      // stylized world scale while preserving real flight relationships.
      _engineForce.copy(_forward).multiplyScalar(
        stats.accel * (0.35 + throttleRef.current * 1.45),
      );
      velocityRef.current.addScaledVector(_engineForce, delta);

      const speedRatio = THREE.MathUtils.clamp(airspeed / stats.maxSpeed, 0, 1.5);
      const drag = 0.045 + speedRatio * speedRatio * 0.16;
      velocityRef.current.multiplyScalar(Math.exp(-drag * delta));

      const liftCurve = THREE.MathUtils.clamp(0.95 + angleOfAttack * 3.4, -0.35, 1.45);
      const liftMagnitude = GRAVITY * speedRatio * speedRatio * 3.0 * liftCurve;
      _lift.copy(_up).multiplyScalar(liftMagnitude);
      velocityRef.current.addScaledVector(_lift, delta);
      velocityRef.current.y -= GRAVITY * delta;

      // Induced drag grows rapidly with angle of attack, making steep pulls
      // bleed energy and eventually produce a believable stall.
      const inducedDrag = Math.min(0.4, Math.abs(angleOfAttack) * 0.8);
      velocityRef.current.multiplyScalar(Math.exp(-inducedDrag * delta));

      const stalling =
        airspeed < stats.stallSpeed || angleOfAttack > THREE.MathUtils.degToRad(16);
      if (stalling) {
        velocityRef.current.y -= GRAVITY * 0.35 * delta;
      }

      const displacement = velocityRef.current.clone().multiplyScalar(delta);
      group.position.add(displacement);

      if (group.position.y <= GROUND_LEVEL) {
        group.position.y = GROUND_LEVEL;
        const verticalSpeed = delta > 0 ? displacement.y / delta : 0;
        const softTouchdown =
          airspeed < stats.stallSpeed * 2.2 &&
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
        const speedMs = airspeed * WORLD_UNIT_TO_METERS;
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
        const lowAltitude =
          group.position.y * WORLD_UNIT_TO_FEET < 240 && displacement.y < -0.08;

        onHudUpdate({
          speed: Math.round(airspeed * SPEED_TO_KNOTS),
          altitude: Math.round(group.position.y * WORLD_UNIT_TO_FEET),
          throttle: throttleRef.current,
          heading: Math.round(headingDeg),
          vSpeed: Math.round((displacement.y * WORLD_UNIT_TO_FEET) / Math.max(delta, 0.0001)),
          gForce: Math.round(gForce * 10) / 10,
          mach: Math.round((airspeed / SPEED_OF_SOUND) * 100) / 100,
          latLon: formatLatLon(lat, lon),
          stalling,
          lowAltitude,
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
