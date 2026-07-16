import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TargetsHandle } from './Targets';

const BULLET_POOL = 60;
const MISSILE_POOL = 8;
const EXPLOSION_POOL = 14;
const MUZZLE_POOL = 16;
const SMOKE_POOL = 120;
const BULLET_SPEED = 420;
const BULLET_LIFE = 1.6;
const EXPLOSION_LIFE = 0.9;
const MUZZLE_FLASH_LIFE = 0.07;
const SMOKE_LIFE = 1.1;
const SMOKE_INTERVAL = 0.032;

interface Bullet {
  active: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  damage: number;
  range: number;
  traveled: number;
}

interface Missile {
  active: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  quaternion: THREE.Quaternion;
  speed: number;
  turnRate: number;
  targetGetter: (() => THREE.Vector3 | null) | null;
  life: number;
  damage: number;
  range: number;
  traveled: number;
  onExpire: (() => void) | null;
  spin: number;
  smokeTimer: number;
}

interface Explosion {
  active: boolean;
  position: THREE.Vector3;
  life: number;
}

interface MuzzleFlash {
  active: boolean;
  position: THREE.Vector3;
  forward: THREE.Vector3;
  life: number;
}

interface Smoke {
  active: boolean;
  position: THREE.Vector3;
  life: number;
  scale: number;
}

export interface WeaponsHandle {
  fireGun: (
    position: THREE.Vector3,
    forward: THREE.Vector3,
    damage: number,
    range: number,
  ) => void;
  fireMissile: (
    position: THREE.Vector3,
    forward: THREE.Vector3,
    speed: number,
    turnRate: number,
    range: number,
    damage: number,
    targetGetter: (() => THREE.Vector3 | null) | null,
    onExpire?: () => void,
  ) => void;
}

interface WeaponsProps {
  targetsRef: React.RefObject<TargetsHandle | null>;
  onHit?: (destroyed: boolean) => void;
}

const _tmp = new THREE.Vector3();
const _desired = new THREE.Vector3();

const Weapons = forwardRef<WeaponsHandle, WeaponsProps>(function Weapons(
  { targetsRef, onHit },
  ref,
) {
  const bulletsRef = useRef<Bullet[]>(
    Array.from({ length: BULLET_POOL }, () => ({
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      life: 0,
      damage: 0,
      range: 0,
      traveled: 0,
    })),
  );
  const missilesRef = useRef<Missile[]>(
    Array.from({ length: MISSILE_POOL }, () => ({
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      speed: 0,
      turnRate: 0,
      targetGetter: null,
      life: 0,
      damage: 0,
      range: 0,
      traveled: 0,
      onExpire: null,
      spin: 0,
      smokeTimer: 0,
    })),
  );
  const explosionsRef = useRef<Explosion[]>(
    Array.from({ length: EXPLOSION_POOL }, () => ({
      active: false,
      position: new THREE.Vector3(),
      life: 0,
    })),
  );
  const muzzleFlashesRef = useRef<MuzzleFlash[]>(
    Array.from({ length: MUZZLE_POOL }, () => ({
      active: false,
      position: new THREE.Vector3(),
      forward: new THREE.Vector3(0, 0, -1),
      life: 0,
    })),
  );
  const smokeRef = useRef<Smoke[]>(
    Array.from({ length: SMOKE_POOL }, () => ({
      active: false,
      position: new THREE.Vector3(),
      life: 0,
      scale: 1,
    })),
  );

  // Mesh refs
  const bulletMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const missileMeshRefs = useRef<(THREE.Group | null)[]>([]);
  // Multi-layer explosion refs
  const explosionGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const explosionFlashRefs = useRef<(THREE.Mesh | null)[]>([]);
  const explosionFireRefs = useRef<(THREE.Mesh | null)[]>([]);
  const explosionSmokeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const explosionLightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const muzzleMeshRefs = useRef<(THREE.Group | null)[]>([]);
  const smokeMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const spawnExplosion = (position: THREE.Vector3) => {
    const explosion = explosionsRef.current.find((e) => !e.active);
    if (!explosion) return;
    explosion.active = true;
    explosion.position.copy(position);
    explosion.life = EXPLOSION_LIFE;
  };

  const spawnMuzzleFlash = (position: THREE.Vector3, forward: THREE.Vector3) => {
    const flash = muzzleFlashesRef.current.find((f) => !f.active);
    if (!flash) return;
    flash.active = true;
    flash.position.copy(position);
    flash.forward.copy(forward);
    flash.life = MUZZLE_FLASH_LIFE;
  };

  const spawnSmoke = (position: THREE.Vector3) => {
    const smoke = smokeRef.current.find((s) => !s.active);
    if (!smoke) return;
    smoke.active = true;
    smoke.position.copy(position);
    smoke.life = SMOKE_LIFE;
    smoke.scale = 0.45 + Math.random() * 0.35;
  };

  const checkTargetHits = (
    position: THREE.Vector3,
    hitRadius: number,
    damage: number,
  ): boolean => {
    const targets = targetsRef.current?.getAll() ?? [];
    for (const target of targets) {
      if (!target.isAlive()) continue;
      const dist = position.distanceTo(target.getPosition());
      if (dist <= target.radius + hitRadius) {
        const destroyed = target.hit(damage);
        spawnExplosion(target.getPosition());
        // Spawn secondary debris explosions
        for (let k = 0; k < 3; k++) {
          const debris = target.getPosition().clone().add(
            new THREE.Vector3((Math.random() - 0.5) * 4, Math.random() * 2, (Math.random() - 0.5) * 4),
          );
          spawnExplosion(debris);
        }
        onHit?.(destroyed);
        return true;
      }
    }
    return false;
  };

  useImperativeHandle(ref, () => ({
    fireGun: (position, forward, damage, range) => {
      const bullet = bulletsRef.current.find((b) => !b.active);
      if (!bullet) return;
      bullet.active = true;
      bullet.position.copy(position);
      bullet.velocity.copy(forward).multiplyScalar(BULLET_SPEED);
      bullet.life = BULLET_LIFE;
      bullet.damage = damage;
      bullet.range = range;
      bullet.traveled = 0;
      spawnMuzzleFlash(position, forward);
    },
    fireMissile: (
      position,
      forward,
      speed,
      turnRate,
      range,
      damage,
      targetGetter,
      onExpire,
    ) => {
      const missile = missilesRef.current.find((m) => !m.active);
      if (!missile) return;
      missile.active = true;
      missile.position.copy(position);
      missile.velocity.copy(forward).multiplyScalar(speed);
      missile.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), forward);
      missile.speed = speed;
      missile.turnRate = turnRate;
      missile.targetGetter = targetGetter;
      missile.life = range / speed + 1;
      missile.damage = damage;
      missile.range = range;
      missile.traveled = 0;
      missile.onExpire = onExpire ?? null;
      missile.spin = 0;
      missile.smokeTimer = 0;
      spawnMuzzleFlash(position, forward);
      spawnSmoke(position);
    },
  }));

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    // Bullets
    bulletsRef.current.forEach((bullet, i) => {
      const mesh = bulletMeshRefs.current[i];
      if (!bullet.active) {
        if (mesh) mesh.visible = false;
        return;
      }
      bullet.life -= delta;
      _tmp.copy(bullet.velocity).multiplyScalar(delta);
      bullet.position.add(_tmp);
      bullet.traveled += _tmp.length();
      const hit = checkTargetHits(bullet.position, 1.2, bullet.damage);
      if (hit || bullet.life <= 0 || bullet.traveled >= bullet.range) {
        bullet.active = false;
        if (mesh) mesh.visible = false;
        return;
      }
      if (mesh) {
        mesh.visible = true;
        mesh.position.copy(bullet.position);
        mesh.lookAt(bullet.position.clone().add(bullet.velocity));
      }
    });

    // Missiles
    missilesRef.current.forEach((missile, i) => {
      const mesh = missileMeshRefs.current[i];
      if (!missile.active) {
        if (mesh) mesh.visible = false;
        return;
      }
      missile.life -= delta;

      const targetPos = missile.targetGetter?.();
      if (targetPos) {
        _desired.copy(targetPos).sub(missile.position).normalize();
        const currentDir = missile.velocity.clone().normalize();
        currentDir.lerp(_desired, Math.min(1, missile.turnRate * delta));
        currentDir.normalize();
        missile.velocity.copy(currentDir).multiplyScalar(missile.speed);
      }

      _tmp.copy(missile.velocity).multiplyScalar(delta);
      missile.position.add(_tmp);
      missile.traveled += _tmp.length();
      missile.spin += delta * 14;

      missile.smokeTimer -= delta;
      if (missile.smokeTimer <= 0) {
        missile.smokeTimer = SMOKE_INTERVAL;
        spawnSmoke(missile.position);
      }

      const hit = checkTargetHits(missile.position, 2.5, missile.damage);
      if (hit || missile.life <= 0 || missile.traveled >= missile.range) {
        if (!hit) spawnExplosion(missile.position);
        missile.active = false;
        missile.onExpire?.();
        if (mesh) mesh.visible = false;
        return;
      }
      if (mesh) {
        mesh.visible = true;
        mesh.position.copy(missile.position);
        mesh.lookAt(missile.position.clone().add(missile.velocity));
        mesh.rotateZ(missile.spin);
      }
    });

    // Multi-layer explosions
    explosionsRef.current.forEach((explosion, i) => {
      const group = explosionGroupRefs.current[i];
      const flash = explosionFlashRefs.current[i];
      const fire = explosionFireRefs.current[i];
      const smoke = explosionSmokeRefs.current[i];
      const light = explosionLightRefs.current[i];

      if (!explosion.active) {
        if (group) group.visible = false;
        return;
      }
      explosion.life -= delta;
      if (explosion.life <= 0) {
        explosion.active = false;
        if (group) group.visible = false;
        return;
      }

      const t = 1 - explosion.life / EXPLOSION_LIFE; // 0=start, 1=end

      if (group) {
        group.visible = true;
        group.position.copy(explosion.position);
      }

      // White/yellow inner flash — rapid burst in first 25%
      if (flash) {
        const p = Math.min(1, t / 0.25);
        flash.scale.setScalar(1 + p * 4.5);
        (flash.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - p * 1.1);
      }

      // Orange/red fireball — peaks at t=0.4, fades by t=1
      if (fire) {
        fire.scale.setScalar(1 + t * 8);
        const fireOpacity = t < 0.45 ? (t / 0.45) : Math.max(0, 1 - (t - 0.45) / 0.55);
        (fire.material as THREE.MeshBasicMaterial).opacity = fireOpacity * 0.92;
      }

      // Black/grey smoke — appears at t=0.2, expands slowly
      if (smoke) {
        const st = Math.max(0, (t - 0.2) / 0.8);
        smoke.scale.setScalar(0.6 + st * 9);
        const smokeOpacity = Math.min(0.55, st * 0.75) * (1 - st * 0.55);
        (smoke.material as THREE.MeshBasicMaterial).opacity = Math.max(0, smokeOpacity);
      }

      // Dynamic light — bright orange, fades after first half
      if (light) {
        light.intensity = Math.max(0, (1 - t * 1.8) * 28);
      }
    });

    // Muzzle flashes
    muzzleFlashesRef.current.forEach((flash, i) => {
      const mesh = muzzleMeshRefs.current[i];
      if (!flash.active) {
        if (mesh) mesh.visible = false;
        return;
      }
      flash.life -= delta;
      if (flash.life <= 0) {
        flash.active = false;
        if (mesh) mesh.visible = false;
        return;
      }
      if (mesh) {
        mesh.visible = true;
        mesh.position.copy(flash.position);
        mesh.lookAt(flash.position.clone().add(flash.forward));
        const t = 1 - flash.life / MUZZLE_FLASH_LIFE;
        mesh.scale.setScalar(1.4 - t * 0.6);
      }
    });

    // Missile smoke trail
    smokeRef.current.forEach((smoke, i) => {
      const mesh = smokeMeshRefs.current[i];
      if (!smoke.active) {
        if (mesh) mesh.visible = false;
        return;
      }
      smoke.life -= delta;
      if (smoke.life <= 0) {
        smoke.active = false;
        if (mesh) mesh.visible = false;
        return;
      }
      if (mesh) {
        mesh.visible = true;
        mesh.position.copy(smoke.position);
        const t = 1 - smoke.life / SMOKE_LIFE;
        mesh.scale.setScalar(smoke.scale * (0.5 + t * 2.2));
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = Math.max(0, (1 - t) * 0.5);
      }
    });
  });

  return (
    <group>
      {/* Bullet tracers */}
      {Array.from({ length: BULLET_POOL }).map((_, i) => (
        <mesh
          key={`b-${i}`}
          ref={(node) => { bulletMeshRefs.current[i] = node; }}
          visible={false}
        >
          <boxGeometry args={[0.1, 0.1, 1.6]} />
          <meshBasicMaterial color="#ffe880" />
        </mesh>
      ))}

      {/* Missiles — detailed with body, nose, fins, and engine glow */}
      {Array.from({ length: MISSILE_POOL }).map((_, i) => (
        <group
          key={`m-${i}`}
          ref={(node) => { missileMeshRefs.current[i] = node; }}
          visible={false}
        >
          {/* Body */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 2.1, 10]} />
            <meshStandardMaterial color="#c0c4ca" metalness={0.72} roughness={0.28} />
          </mesh>
          {/* Warhead nose — red */}
          <mesh position={[0, 0, -1.12]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.12, 0.42, 8]} />
            <meshStandardMaterial color="#cc2020" metalness={0.45} roughness={0.4} />
          </mesh>
          {/* Nose tip */}
          <mesh position={[0, 0, -1.38]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.03, 0.14, 6]} />
            <meshStandardMaterial color="#991616" />
          </mesh>
          {/* Rear fins — 4 × 90° */}
          {[0, 45, 90, 135].map((deg) => (
            <mesh key={`f${deg}`} position={[0, 0, 0.88]} rotation={[0, 0, (deg * Math.PI) / 180]}>
              <boxGeometry args={[0.55, 0.04, 0.28]} />
              <meshStandardMaterial color="#909498" metalness={0.5} roughness={0.45} />
            </mesh>
          ))}
          {/* Mid guidance fins */}
          {[0, 90].map((deg) => (
            <mesh key={`g${deg}`} position={[0, 0, -0.3]} rotation={[0, 0, (deg * Math.PI) / 180]}>
              <boxGeometry args={[0.3, 0.03, 0.18]} />
              <meshStandardMaterial color="#848890" metalness={0.5} roughness={0.4} />
            </mesh>
          ))}
          {/* Engine exhaust disc */}
          <mesh position={[0, 0, 1.08]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.13, 0.07, 10]} />
            <meshBasicMaterial color="#ff7700" />
          </mesh>
          {/* Engine glow */}
          <pointLight color="#ff7722" intensity={3.5} distance={12} />
        </group>
      ))}

      {/* Multi-layer explosions */}
      {Array.from({ length: EXPLOSION_POOL }).map((_, i) => (
        <group
          key={`e-${i}`}
          ref={(node) => { explosionGroupRefs.current[i] = node; }}
          visible={false}
        >
          {/* Inner white flash */}
          <mesh ref={(node) => { explosionFlashRefs.current[i] = node; }}>
            <sphereGeometry args={[1.1, 10, 10]} />
            <meshBasicMaterial color="#fffbe0" transparent opacity={1} depthWrite={false} />
          </mesh>
          {/* Fireball */}
          <mesh ref={(node) => { explosionFireRefs.current[i] = node; }}>
            <sphereGeometry args={[1.6, 10, 10]} />
            <meshBasicMaterial color="#ff4d00" transparent opacity={0} depthWrite={false} />
          </mesh>
          {/* Smoke cloud */}
          <mesh ref={(node) => { explosionSmokeRefs.current[i] = node; }}>
            <sphereGeometry args={[1.9, 8, 8]} />
            <meshBasicMaterial color="#1e1e1e" transparent opacity={0} depthWrite={false} />
          </mesh>
          {/* Dynamic point light */}
          <pointLight
            ref={(node) => { explosionLightRefs.current[i] = node as THREE.PointLight; }}
            color="#ff8800"
            intensity={0}
            distance={45}
          />
        </group>
      ))}

      {/* Muzzle flashes */}
      {Array.from({ length: MUZZLE_POOL }).map((_, i) => (
        <group
          key={`mf-${i}`}
          ref={(node) => { muzzleMeshRefs.current[i] = node; }}
          visible={false}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.5]}>
            <coneGeometry args={[0.28, 1.0, 8]} />
            <meshBasicMaterial color="#fff5cc" transparent opacity={1} depthWrite={false} />
          </mesh>
        </group>
      ))}

      {/* Missile smoke puffs */}
      {Array.from({ length: SMOKE_POOL }).map((_, i) => (
        <mesh
          key={`sm-${i}`}
          ref={(node) => { smokeMeshRefs.current[i] = node; }}
          visible={false}
        >
          <sphereGeometry args={[0.5, 6, 6]} />
          <meshBasicMaterial color="#d0d0d0" transparent opacity={0.45} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
});

export default Weapons;
