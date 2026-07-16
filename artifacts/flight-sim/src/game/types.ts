export interface FlightHudState {
  speed: number; // knots
  altitude: number; // feet
  throttle: number; // 0..1
  heading: number; // degrees, 0-360
  vSpeed: number; // feet per minute, +up/-down
  gForce: number;
  mach: number;
  latLon: string;
  stalling: boolean;
  crashed: boolean;
  started: boolean;
  gunAmmo: number;
  gunAmmoMax: number;
  missileAmmo: number;
  missileAmmoMax: number;
  missileLocked: boolean;
  hasWeapons: boolean;
}

export const INITIAL_HUD_STATE: FlightHudState = {
  speed: 0,
  altitude: 0,
  throttle: 0.55,
  heading: 0,
  vSpeed: 0,
  gForce: 1,
  mach: 0,
  latLon: '',
  stalling: false,
  crashed: false,
  started: false,
  gunAmmo: 0,
  gunAmmoMax: 0,
  missileAmmo: 0,
  missileAmmoMax: 0,
  missileLocked: false,
  hasWeapons: false,
};
