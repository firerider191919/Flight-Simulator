import { PLANES, type PlaneDefinition } from './planes';
import { WORLD_LOCATIONS, type WorldLocation } from './world';

interface SelectScreenProps {
  step: 'plane' | 'location' | 'ready';
  selectedPlane: PlaneDefinition | null;
  selectedLocation?: WorldLocation | null;
  onSelectPlane: (plane: PlaneDefinition) => void;
  onSelectLocation: (location: WorldLocation) => void;
  onBack?: () => void;
  onResume?: () => void;
  onStart?: () => void;
}

function categoryLabel(category: PlaneDefinition['category']) {
  return category === 'commercial' ? 'Commercial' : 'Fighter Jet';
}

export default function SelectScreen({
  step,
  selectedPlane,
  selectedLocation,
  onSelectPlane,
  onSelectLocation,
  onBack,
  onResume,
  onStart,
}: SelectScreenProps) {
  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/80 p-4">
      <div className="max-w-3xl w-full rounded-xl border border-white/15 bg-zinc-900/90 p-8 shadow-2xl">
        {step === 'plane' && (
          <>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              Skybound
            </h1>
            <p className="text-sm text-zinc-400 mb-6">
              Choose your aircraft.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLANES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectPlane(p)}
                  className="text-left rounded-lg border border-white/10 bg-black/30 hover:bg-black/50 hover:border-amber-400/50 transition-colors p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{p.name}</span>
                    <span
                      className={`text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full ${
                        p.category === 'fighter'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {categoryLabel(p.category)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-2">{p.tagline}</p>
                  <div className="flex gap-4 text-[11px] text-zinc-500">
                    <span>
                      Top speed{' '}
                      <span className="text-zinc-300">
                        {Math.round(p.stats.maxSpeed * 3.4)} kt
                      </span>
                    </span>
                    {p.weapons && (
                      <span>
                        Armed{' '}
                        <span className="text-zinc-300">
                          guns + {p.weapons.missileAmmo} missiles
                        </span>
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'ready' && selectedPlane && selectedLocation && (
          <>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Ready for takeoff
            </h1>
            <p className="text-sm text-zinc-400 mb-6">
              <span className="text-white font-medium">{selectedPlane.name}</span>{' '}
              at{' '}
              <span className="text-white font-medium">
                {selectedLocation.name}
              </span>
              , {selectedLocation.region}.
            </p>
            <div className="text-left text-xs text-zinc-300 space-y-1.5 mb-6 bg-black/30 rounded-lg p-4 border border-white/10">
              <div className="flex justify-between">
                <span className="text-zinc-500">Pitch</span>
                <span>W / S or &uarr; / &darr;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Roll (bank)</span>
                <span>A / D or &larr; / &rarr;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Yaw (rudder)</span>
                <span>Q / E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Throttle</span>
                <span>Shift / Ctrl</span>
              </div>
              {selectedPlane.weapons && (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Fire guns</span>
                    <span>Space</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Fire missile</span>
                    <span>X</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500">World map</span>
                <span>M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Reset flight</span>
                <span>R</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  &larr; Change destination
                </button>
              )}
              <button
                type="button"
                onClick={onStart}
                className="flex-1 rounded-lg bg-amber-400 hover:bg-amber-300 active:bg-amber-500 transition-colors py-2.5 font-semibold text-zinc-900 tracking-wide"
              >
                Take off
              </button>
            </div>
          </>
        )}

        {step === 'location' && (
          <>
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Choose your destination
              </h1>
              <div className="flex items-center gap-3">
                {onResume && (
                  <button
                    type="button"
                    onClick={onResume}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Resume flight (M)
                  </button>
                )}
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    &larr; Change aircraft
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-zinc-400 mb-6">
              Flying the{' '}
              <span className="text-white font-medium">
                {selectedPlane?.name}
              </span>
              . Pick anywhere in the world to take off.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WORLD_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => onSelectLocation(loc)}
                  className="text-left rounded-lg border border-white/10 bg-black/30 hover:bg-black/50 hover:border-amber-400/50 transition-colors p-4"
                >
                  <div
                    className="w-full h-14 rounded-md mb-3"
                    style={{ backgroundColor: loc.groundColor }}
                  />
                  <div className="font-semibold text-white mb-0.5">
                    {loc.name}
                  </div>
                  <div className="text-[11px] text-amber-400/80 mb-1.5">
                    {loc.region}
                  </div>
                  <p className="text-xs text-zinc-400">{loc.description}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
