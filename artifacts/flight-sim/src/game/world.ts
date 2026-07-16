export type BiomeId =
  | 'countryside'
  | 'city'
  | 'desert'
  | 'arctic'
  | 'ocean'
  | 'mountains'
  | 'volcanic';

export interface WorldLocation {
  id: BiomeId;
  name: string;
  region: string;
  description: string;
  /** Approximate real-world reference point used to synthesize a lat/long readout. */
  originLat: number;
  originLon: number;
  skyColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  groundColor: string;
}

export const WORLD_LOCATIONS: WorldLocation[] = [
  {
    id: 'countryside',
    name: 'Green Valley',
    region: 'Midwest Countryside',
    description: 'Rolling hills, forests, and a quiet grass airstrip.',
    originLat: 41.5,
    originLon: -93.6,
    skyColor: '#bcdcf0',
    fogColor: '#bcdcf0',
    fogNear: 400,
    fogFar: 3200,
    groundColor: '#4a8f4a',
  },
  {
    id: 'city',
    name: 'Metro Bay',
    region: 'Coastal Metropolis',
    description: 'A dense downtown skyline beside the harbor airport.',
    originLat: 40.71,
    originLon: -74.0,
    skyColor: '#a9c4dd',
    fogColor: '#a9c4dd',
    fogNear: 300,
    fogFar: 2600,
    groundColor: '#6b6f76',
  },
  {
    id: 'desert',
    name: 'Sahara Canyon',
    region: 'North African Desert',
    description: 'Sun-baked mesas and canyons over an old dirt strip.',
    originLat: 24.2,
    originLon: 9.5,
    skyColor: '#e7c98a',
    fogColor: '#e0b878',
    fogNear: 400,
    fogFar: 3400,
    groundColor: '#c98f4e',
  },
  {
    id: 'arctic',
    name: 'Frostpoint Station',
    region: 'Arctic Circle',
    description: 'Ice fields and glaciers around a polar research base.',
    originLat: 78.9,
    originLon: 11.9,
    skyColor: '#dfeaf2',
    fogColor: '#e7f1f7',
    fogNear: 350,
    fogFar: 3000,
    groundColor: '#e8f1f6',
  },
  {
    id: 'ocean',
    name: 'Pacific Fleet Waters',
    region: 'Open Pacific Ocean',
    description: 'Open sea with an aircraft carrier and scattered islands.',
    originLat: 15.0,
    originLon: 165.0,
    skyColor: '#8fc7e8',
    fogColor: '#8fc7e8',
    fogNear: 500,
    fogFar: 4000,
    groundColor: '#1c5f82',
  },
  {
    id: 'mountains',
    name: 'Highland Alps',
    region: 'European Alpine Range',
    description: 'Jagged snow-capped peaks over a narrow valley airstrip.',
    originLat: 46.5,
    originLon: 9.8,
    skyColor: '#cfe2f0',
    fogColor: '#d7e6f1',
    fogNear: 350,
    fogFar: 3000,
    groundColor: '#7f9163',
  },
  {
    id: 'volcanic',
    name: 'Ember Archipelago',
    region: 'South Pacific Volcanic Islands',
    description: 'Black rock islands and smoking volcanoes over dark seas.',
    originLat: -8.5,
    originLon: 148.0,
    skyColor: '#e3b98a',
    fogColor: '#d99a6c',
    fogNear: 380,
    fogFar: 3200,
    groundColor: '#233042',
  },
];

export function getLocationById(id: BiomeId): WorldLocation {
  const loc = WORLD_LOCATIONS.find((l) => l.id === id);
  if (!loc) throw new Error(`Unknown location id: ${id}`);
  return loc;
}

const METERS_PER_WORLD_UNIT = 3;
const METERS_PER_DEGREE = 111_320;

/** Synthesizes a plausible lat/long readout from in-world X/Z position. */
export function worldPositionToLatLon(
  location: WorldLocation,
  x: number,
  z: number,
): { lat: number; lon: number } {
  const metersNorth = -z * METERS_PER_WORLD_UNIT;
  const metersEast = x * METERS_PER_WORLD_UNIT;
  const dLat = metersNorth / METERS_PER_DEGREE;
  const dLon =
    metersEast / (METERS_PER_DEGREE * Math.cos((location.originLat * Math.PI) / 180));
  return { lat: location.originLat + dLat, lon: location.originLon + dLon };
}

export function formatLatLon(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(3)}\u00b0${latDir} ${Math.abs(lon).toFixed(3)}\u00b0${lonDir}`;
}
