export type BiomeId =
  | 'countryside'
  | 'city'
  | 'desert'
  | 'arctic'
  | 'ocean'
  | 'mountains'
  | 'volcanic'
  | 'tropical';

export interface WorldLocation {
  /** Unique slug — used as React key and for lookups. */
  slug: string;
  /** Controls which terrain/environment is rendered. */
  id: BiomeId;
  airportName: string;
  icao: string;
  /** Runway alignment in degrees (0=N/S strip, 90=E/W strip). Visual only. */
  runwayHeading: number;
  name: string;
  region: string;
  description: string;
  originLat: number;
  originLon: number;
  skyColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  groundColor: string;
}

export const WORLD_LOCATIONS: WorldLocation[] = [
  // ── Countryside ─────────────────────────────────────────────
  {
    slug: 'countryside',
    id: 'countryside',
    airportName: 'Green Valley Airfield',
    icao: 'KGVA',
    runwayHeading: 270,
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
    slug: 'london-heathrow',
    id: 'countryside',
    airportName: 'Heathrow International',
    icao: 'EGLL',
    runwayHeading: 270,
    name: 'Thames Valley',
    region: 'Southern England',
    description: 'Overcast English countryside with a busy intercontinental hub.',
    originLat: 51.47,
    originLon: -0.46,
    skyColor: '#aabccc',
    fogColor: '#b0bfcc',
    fogNear: 300,
    fogFar: 2800,
    groundColor: '#4a7a42',
  },
  // ── City ────────────────────────────────────────────────────
  {
    slug: 'city',
    id: 'city',
    airportName: 'Metro Bay International',
    icao: 'KMBI',
    runwayHeading: 90,
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
    slug: 'tokyo',
    id: 'city',
    airportName: 'Tokyo Haneda',
    icao: 'RJTT',
    runwayHeading: 160,
    name: 'Tokyo Bay',
    region: 'Kantō, Japan',
    description: 'Glittering megacity skyline over Tokyo Bay at dusk.',
    originLat: 35.55,
    originLon: 139.78,
    skyColor: '#8faec8',
    fogColor: '#9cb0c4',
    fogNear: 280,
    fogFar: 2400,
    groundColor: '#555a62',
  },
  // ── Desert ──────────────────────────────────────────────────
  {
    slug: 'desert',
    id: 'desert',
    airportName: 'Sahara Desert Strip',
    icao: 'DAAS',
    runwayHeading: 0,
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
    slug: 'dubai',
    id: 'desert',
    airportName: 'Dubai International',
    icao: 'OMDB',
    runwayHeading: 300,
    name: 'Dubai Sands',
    region: 'United Arab Emirates',
    description: 'Ultramodern towers rising from the golden desert sands.',
    originLat: 25.25,
    originLon: 55.36,
    skyColor: '#e8d5a0',
    fogColor: '#dcc88c',
    fogNear: 450,
    fogFar: 3800,
    groundColor: '#c4894a',
  },
  // ── Arctic ──────────────────────────────────────────────────
  {
    slug: 'arctic',
    id: 'arctic',
    airportName: 'Frostpoint Polar Base',
    icao: 'BGBW',
    runwayHeading: 180,
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
  // ── Ocean ───────────────────────────────────────────────────
  {
    slug: 'ocean',
    id: 'ocean',
    airportName: 'Pacific Fleet Carrier',
    icao: 'N/A',
    runwayHeading: 90,
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
    slug: 'bermuda',
    id: 'ocean',
    airportName: 'Bermuda Royal Naval Air',
    icao: 'TXKF',
    runwayHeading: 300,
    name: 'Bermuda Triangle Zone',
    region: 'North Atlantic, Bermuda',
    description: 'Mysterious turquoise seas and scattered cloud banks.',
    originLat: 32.36,
    originLon: -64.68,
    skyColor: '#7ab8d8',
    fogColor: '#80bcd6',
    fogNear: 480,
    fogFar: 3800,
    groundColor: '#1a5270',
  },
  // ── Mountains ───────────────────────────────────────────────
  {
    slug: 'mountains',
    id: 'mountains',
    airportName: 'Highland Alps Airstrip',
    icao: 'LSZB',
    runwayHeading: 280,
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
    slug: 'himalaya',
    id: 'mountains',
    airportName: 'Himalayan High Pass',
    icao: 'VNLK',
    runwayHeading: 60,
    name: 'Roof of the World',
    region: 'Himalayas, Nepal',
    description: 'The world\'s most extreme runway — razor-thin mountain pass.',
    originLat: 27.69,
    originLon: 86.73,
    skyColor: '#c2daea',
    fogColor: '#ccd9e4',
    fogNear: 320,
    fogFar: 2800,
    groundColor: '#7a8870',
  },
  // ── Volcanic ────────────────────────────────────────────────
  {
    slug: 'volcanic',
    id: 'volcanic',
    airportName: 'Ember Archipelago Strip',
    icao: 'AYPY',
    runwayHeading: 120,
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
  // ── Tropical ────────────────────────────────────────────────
  {
    slug: 'phuket',
    id: 'tropical',
    airportName: 'Phuket Tropical Paradise',
    icao: 'VTSP',
    runwayHeading: 90,
    name: 'Phuket Lagoon',
    region: 'Andaman Sea, Thailand',
    description: 'Turquoise lagoons, palm-fringed beaches, and a coastal airstrip.',
    originLat: 8.11,
    originLon: 98.3,
    skyColor: '#7ed6f5',
    fogColor: '#88dcf8',
    fogNear: 500,
    fogFar: 4200,
    groundColor: '#3a8f5e',
  },
];

export function getLocationBySlug(slug: string): WorldLocation {
  const loc = WORLD_LOCATIONS.find((l) => l.slug === slug);
  if (!loc) throw new Error(`Unknown location slug: ${slug}`);
  return loc;
}

/** @deprecated use getLocationBySlug for new code */
export function getLocationById(id: BiomeId): WorldLocation {
  const loc = WORLD_LOCATIONS.find((l) => l.id === id);
  if (!loc) throw new Error(`Unknown location id: ${id}`);
  return loc;
}

const METERS_PER_WORLD_UNIT = 3;
const METERS_PER_DEGREE = 111_320;

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
