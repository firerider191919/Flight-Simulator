import { useMemo } from 'react';
import type { FlightHudState } from './types';
import type { PlaneDefinition } from './planes';
import type { WorldLocation } from './world';

interface HUDProps {
  state: FlightHudState;
  plane: PlaneDefinition;
  location: WorldLocation;
  onOpenMap: () => void;
}

function CompassBar({ heading }: { heading: number }) {
  const ticks = useMemo(() => {
    const labels: Record<number, string> = {
      0: 'N',
      45: 'NE',
      90: 'E',
      135: 'SE',
      180: 'S',
      225: 'SW',
      270: 'W',
      315: 'NW',
    };
    const arr: { deg: number; label?: string }[] = [];
    for (let d = 0; d < 360; d += 15) arr.push({ deg: d, label: labels[d] });
    return arr;
  }, []);

  return (
    <div className="relative w-72 h-8 overflow-hidden rounded-md bg-black/50 border border-white/20">
      <div
        className="absolute top-0 left-1/2 h-full flex items-center"
        style={{ transform: `translateX(${-heading * 4}px)` }}
      >
        {ticks.concat(ticks).map((t, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-white/80 text-[10px] font-mono"
            style={{ width: '60px' }}
          >
            <span>{t.label ?? t.deg}</span>
            <span className="w-px h-2 bg-white/50" />
          </div>
        ))}
      </div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-full bg-amber-400" />
    </div>
  );
}

export default function HUD({ state, plane, location, onOpenMap }: HUDProps) {
  const {
    speed,
    altitude,
    throttle,
    heading,
    vSpeed,
    gForce,
    mach,
    latLon,
    stalling,
    crashed,
    started,
    gunAmmo,
    gunAmmoMax,
    missileAmmo,
    missileAmmoMax,
    missileLocked,
    hasWeapons,
  } = state;

  if (!started) return null;

  return (
    <div className="pointer-events-none absolute inset-0 select-none font-mono">
      {/* Top center: compass + location */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <CompassBar heading={heading} />
        <div className="text-[11px] text-white/70 bg-black/40 rounded px-2 py-0.5 mt-1">
          {location.name} &middot; {location.region}
        </div>
      </div>

      {/* Top right: map button + plane name */}
      <div className="absolute top-4 right-6 flex flex-col items-end gap-2">
        <div className="text-xs text-white/70 bg-black/40 rounded px-2 py-1">
          {plane.name}
        </div>
        <button
          type="button"
          onClick={onOpenMap}
          className="pointer-events-auto rounded-md bg-black/55 border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-black/70 transition-colors"
        >
          World Map (M)
        </button>
      </div>

      {/* Bottom left: airspeed / mach */}
      <div className="absolute bottom-6 left-6 rounded-lg bg-black/50 border border-white/20 px-4 py-3 text-white">
        <div className="text-[10px] tracking-widest text-white/50 mb-0.5">
          AIRSPEED
        </div>
        <div className="text-2xl font-bold tabular-nums">
          {speed}
          <span className="text-xs font-normal text-white/50 ml-1">kt</span>
        </div>
        <div className="text-[11px] text-white/50 tabular-nums mt-0.5">
          Mach {mach.toFixed(2)}
        </div>
        {stalling && (
          <div className="text-amber-400 text-[11px] font-bold tracking-wide mt-1 animate-pulse">
            STALL
          </div>
        )}
      </div>

      {/* Bottom left-center: G-force */}
      <div className="absolute bottom-6 left-[196px] rounded-lg bg-black/50 border border-white/20 px-4 py-3 text-white">
        <div className="text-[10px] tracking-widest text-white/50 mb-0.5">
          G-FORCE
        </div>
        <div
          className={`text-2xl font-bold tabular-nums ${
            gForce > 6 ? 'text-rose-400' : gForce > 4 ? 'text-amber-400' : ''
          }`}
        >
          {gForce.toFixed(1)}
          <span className="text-xs font-normal text-white/50 ml-1">G</span>
        </div>
      </div>

      {/* Bottom right: altitude / vspeed / coordinates */}
      <div className="absolute bottom-6 right-6 rounded-lg bg-black/50 border border-white/20 px-4 py-3 text-white text-right">
        <div className="text-[10px] tracking-widest text-white/50 mb-0.5">
          ALTITUDE
        </div>
        <div className="text-2xl font-bold tabular-nums">
          {altitude.toLocaleString()}
          <span className="text-xs font-normal text-white/50 ml-1">ft</span>
        </div>
        <div
          className={`text-[11px] mt-1 tabular-nums ${
            vSpeed >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {vSpeed >= 0 ? '+' : ''}
          {vSpeed} fpm
        </div>
        <div className="text-[10px] text-white/40 mt-1 tabular-nums">{latLon}</div>
      </div>

      {/* Bottom center: throttle */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 rounded-lg bg-black/50 border border-white/20 px-4 py-3">
        <div className="text-[10px] tracking-widest text-white/50">
          THROTTLE
        </div>
        <div className="w-28 h-2 rounded-full bg-white/15 overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-[width]"
            style={{ width: `${Math.round(throttle * 100)}%` }}
          />
        </div>
      </div>

      {/* Weapons panel */}
      {hasWeapons && (
        <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col items-end gap-2 rounded-lg bg-black/50 border border-white/20 px-4 py-3 text-white">
          <div className="text-[10px] tracking-widest text-white/50">
            WEAPONS
          </div>
          <div className="text-sm tabular-nums">
            <span className="text-white/50">GUN</span> {gunAmmo}/{gunAmmoMax}
          </div>
          <div className="text-sm tabular-nums">
            <span className="text-white/50">MSL</span> {missileAmmo}/{missileAmmoMax}
          </div>
          <div
            className={`text-xs font-bold tracking-wide ${
              missileLocked ? 'text-rose-400 animate-pulse' : 'text-white/30'
            }`}
          >
            {missileLocked ? 'LOCKED' : 'NO LOCK'}
          </div>
        </div>
      )}

      {/* Reticle */}
      {hasWeapons && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 pointer-events-none">
          <div
            className={`absolute inset-0 rounded-full border-2 ${
              missileLocked ? 'border-rose-400' : 'border-white/50'
            }`}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/70" />
        </div>
      )}

      {/* Center: fixed pitch reference (non-weapon planes) */}
      {!hasWeapons && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-white/70" />
          <div className="absolute top-1/2 right-0 w-3 h-0.5 bg-white/70" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/70" />
        </div>
      )}

      {crashed && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="max-w-sm w-full mx-4 rounded-xl border border-white/15 bg-zinc-900/90 p-8 text-center shadow-2xl">
            <h2 className="text-xl font-bold text-rose-400 mb-2">
              You've crashed
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              Watch your altitude and airspeed near the ground.
            </p>
            <div className="text-xs text-zinc-500 mb-4">
              Press <span className="text-white font-semibold">R</span> to
              try again
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
