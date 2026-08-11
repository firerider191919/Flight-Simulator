import type { CameraMode } from './types';
import type { PlaneDefinition } from './planes';
import type { WorldLocation } from './world';

interface CommandMenuProps {
  plane: PlaneDefinition;
  location: WorldLocation;
  cameraMode: CameraMode;
  onCameraModeChange: (mode: CameraMode) => void;
  onResume: () => void;
  onOpenAirports: () => void;
  onChangeAircraft: () => void;
  onRestart: () => void;
}

const CAMERA_OPTIONS: { id: CameraMode; label: string; hint: string }[] = [
  { id: 'chase', label: 'Chase', hint: 'third-person follow' },
  { id: 'cockpit', label: 'Cockpit', hint: 'pilot view' },
  { id: 'wide', label: 'Wide', hint: 'cinematic follow' },
  { id: 'side', label: 'Side', hint: 'formation profile' },
  { id: 'nose', label: 'Nose', hint: 'forward exterior' },
];

export default function CommandMenu({
  plane,
  location,
  cameraMode,
  onCameraModeChange,
  onResume,
  onOpenAirports,
  onChangeAircraft,
  onRestart,
}: CommandMenuProps) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-black/65 p-4 font-mono">
      <div className="w-full max-w-2xl rounded-2xl border border-emerald-400/25 bg-zinc-950/95 p-5 text-white shadow-2xl shadow-black/60">
        <div className="mb-5 flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] font-bold tracking-[0.3em] text-emerald-400">
              FLIGHT OPERATIONS
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight">Command menu</h2>
            <p className="mt-1 text-xs text-zinc-500">
              {plane.name} &middot; {location.airportName} ({location.icao})
            </p>
          </div>
          <button
            type="button"
            onClick={onResume}
            className="rounded-lg border border-emerald-400/40 px-3 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-400/15"
          >
            Resume flight <span className="text-emerald-400/60">[Esc]</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 text-[10px] tracking-[0.22em] text-zinc-500">
              CAMERA ANGLE
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CAMERA_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onCameraModeChange(option.id)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    cameraMode === option.id
                      ? 'border-amber-400/70 bg-amber-400/15 text-amber-200'
                      : 'border-white/10 bg-black/20 text-zinc-300 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold">{option.label}</div>
                  <div className="mt-0.5 text-[10px] text-zinc-500">{option.hint}</div>
                </button>
              ))}
            </div>
            <div className="mt-3 text-[10px] text-zinc-600">
              Press <span className="text-zinc-300">C</span> in flight to cycle views.
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 text-[10px] tracking-[0.22em] text-zinc-500">
              FLIGHT ACTIONS
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenAirports}
                className="w-full rounded-lg border border-sky-400/25 bg-sky-400/10 px-3 py-2.5 text-left text-xs text-sky-200 transition-colors hover:bg-sky-400/20"
              >
                <span className="font-bold">Divert to another airport</span>
                <span className="block text-[10px] text-sky-300/55">Choose a new runway or carrier deck</span>
              </button>
              <button
                type="button"
                onClick={onChangeAircraft}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-left text-xs text-zinc-200 transition-colors hover:bg-white/10"
              >
                <span className="font-bold">Change aircraft</span>
                <span className="block text-[10px] text-zinc-500">Return to the aircraft hangar</span>
              </button>
              <button
                type="button"
                onClick={onRestart}
                className="w-full rounded-lg border border-rose-400/25 bg-rose-400/10 px-3 py-2.5 text-left text-xs text-rose-200 transition-colors hover:bg-rose-400/20"
              >
                <span className="font-bold">Restart sortie</span>
                <span className="block text-[10px] text-rose-300/55">Reset position, altitude, and weapons</span>
              </button>
            </div>
          </section>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-[10px] text-zinc-500 sm:grid-cols-4">
          <span><b className="text-zinc-300">S / ↓</b> pitch up</span>
          <span><b className="text-zinc-300">W / ↑</b> pitch down</span>
          <span><b className="text-zinc-300">M</b> airports</span>
          <span><b className="text-zinc-300">R</b> reset after crash</span>
        </div>
      </div>
    </div>
  );
}