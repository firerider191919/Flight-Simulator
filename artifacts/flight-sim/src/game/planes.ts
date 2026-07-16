export type PlaneCategory = 'commercial' | 'fighter';
export type PlaneModelId =
  | 'cessna'
  | 'airliner'
  | 'jumbo'
  | 'falcon'
  | 'raven'
  | 'vortex'
  | 'warthog'
  | 'eagle'
  | 'blackbird';

export interface PlaneStats {
  /** World units / second at full throttle. */
  maxSpeed: number;
  /** World units / second, minimum forward drift speed. */
  minSpeed: number;
  /** Below this speed the plane starts to stall. */
  stallSpeed: number;
  /** How quickly speed eases toward the throttle-derived target. */
  accel: number;
  pitchRate: number;
  rollRate: number;
  yawRate: number;
}

export interface WeaponStats {
  gunFireRate: number; // shots / second
  gunAmmo: number;
  gunDamage: number;
  gunRange: number;
  missileAmmo: number;
  missileSpeed: number;
  missileTurnRate: number;
  missileRange: number;
}

export interface PlaneDefinition {
  id: PlaneModelId;
  name: string;
  category: PlaneCategory;
  tagline: string;
  stats: PlaneStats;
  weapons: WeaponStats | null;
}

export const PLANES: PlaneDefinition[] = [
  {
    id: 'cessna',
    name: 'Skyhawk 172',
    category: 'commercial',
    tagline: 'Light trainer. Forgiving and easy to fly.',
    stats: {
      maxSpeed: 46,
      minSpeed: 6,
      stallSpeed: 14,
      accel: 10,
      pitchRate: 0.9,
      rollRate: 1.6,
      yawRate: 0.5,
    },
    weapons: null,
  },
  {
    id: 'airliner',
    name: 'Atlas A320',
    category: 'commercial',
    tagline: 'Twin-engine airliner. Fast but heavy on the controls.',
    stats: {
      maxSpeed: 92,
      minSpeed: 22,
      stallSpeed: 30,
      accel: 5,
      pitchRate: 0.4,
      rollRate: 0.6,
      yawRate: 0.22,
    },
    weapons: null,
  },
  {
    id: 'jumbo',
    name: 'Skyfreight 747',
    category: 'commercial',
    tagline: 'Four-engine jumbo jet. Massive, stable, and slow to turn.',
    stats: {
      maxSpeed: 100,
      minSpeed: 26,
      stallSpeed: 34,
      accel: 3.5,
      pitchRate: 0.3,
      rollRate: 0.42,
      yawRate: 0.16,
    },
    weapons: null,
  },
  {
    id: 'falcon',
    name: 'Falcon F-16',
    category: 'fighter',
    tagline: 'Agile multirole fighter armed with guns and missiles.',
    stats: {
      maxSpeed: 165,
      minSpeed: 24,
      stallSpeed: 26,
      accel: 16,
      pitchRate: 1.7,
      rollRate: 3.2,
      yawRate: 0.9,
    },
    weapons: {
      gunFireRate: 12,
      gunAmmo: 500,
      gunDamage: 8,
      gunRange: 900,
      missileAmmo: 6,
      missileSpeed: 220,
      missileTurnRate: 2.4,
      missileRange: 2500,
    },
  },
  {
    id: 'raven',
    name: 'Raven Stealth',
    category: 'fighter',
    tagline: 'Fastest jet in the fleet. Built for hit-and-run strikes.',
    stats: {
      maxSpeed: 210,
      minSpeed: 26,
      stallSpeed: 28,
      accel: 20,
      pitchRate: 1.9,
      rollRate: 3.6,
      yawRate: 1.0,
    },
    weapons: {
      gunFireRate: 15,
      gunAmmo: 400,
      gunDamage: 10,
      gunRange: 1000,
      missileAmmo: 4,
      missileSpeed: 260,
      missileTurnRate: 2.8,
      missileRange: 3000,
    },
  },
  {
    id: 'vortex',
    name: 'Vortex Interceptor',
    category: 'fighter',
    tagline: 'Delta-wing interceptor with the heaviest missile payload.',
    stats: {
      maxSpeed: 185,
      minSpeed: 28,
      stallSpeed: 32,
      accel: 14,
      pitchRate: 1.5,
      rollRate: 2.6,
      yawRate: 0.8,
    },
    weapons: {
      gunFireRate: 10,
      gunAmmo: 450,
      gunDamage: 9,
      gunRange: 950,
      missileAmmo: 8,
      missileSpeed: 230,
      missileTurnRate: 2.2,
      missileRange: 2700,
    },
  },
  {
    id: 'warthog',
    name: 'Thunderhog A-10',
    category: 'fighter',
    tagline: 'Ground attack legend. Armored, slow, and absolutely devastating.',
    stats: {
      maxSpeed: 120,
      minSpeed: 18,
      stallSpeed: 22,
      accel: 8,
      pitchRate: 1.2,
      rollRate: 2.0,
      yawRate: 0.7,
    },
    weapons: {
      gunFireRate: 20,
      gunAmmo: 1350,
      gunDamage: 15,
      gunRange: 800,
      missileAmmo: 6,
      missileSpeed: 200,
      missileTurnRate: 2.0,
      missileRange: 2000,
    },
  },
  {
    id: 'eagle',
    name: 'Eagle F-15',
    category: 'fighter',
    tagline: 'Heavy air superiority fighter with unmatched firepower.',
    stats: {
      maxSpeed: 195,
      minSpeed: 26,
      stallSpeed: 28,
      accel: 18,
      pitchRate: 1.6,
      rollRate: 2.8,
      yawRate: 0.85,
    },
    weapons: {
      gunFireRate: 12,
      gunAmmo: 940,
      gunDamage: 9,
      gunRange: 950,
      missileAmmo: 8,
      missileSpeed: 240,
      missileTurnRate: 2.6,
      missileRange: 2800,
    },
  },
  {
    id: 'blackbird',
    name: 'Blackbird SR-71',
    category: 'fighter',
    tagline: 'Hypersonic recon jet. No guns — it just outruns everything.',
    stats: {
      maxSpeed: 280,
      minSpeed: 35,
      stallSpeed: 40,
      accel: 22,
      pitchRate: 1.1,
      rollRate: 1.8,
      yawRate: 0.55,
    },
    weapons: {
      gunFireRate: 1,
      gunAmmo: 0,
      gunDamage: 0,
      gunRange: 0,
      missileAmmo: 2,
      missileSpeed: 320,
      missileTurnRate: 1.8,
      missileRange: 4500,
    },
  },
];

export function getPlaneById(id: PlaneModelId): PlaneDefinition {
  const plane = PLANES.find((p) => p.id === id);
  if (!plane) throw new Error(`Unknown plane id: ${id}`);
  return plane;
}
