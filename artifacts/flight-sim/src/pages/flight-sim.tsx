import { useCallback, useEffect, useState } from 'react';
import { KeyboardControls } from '@react-three/drei';
import Scene from '@/game/Scene';
import HUD from '@/game/HUD';
import SelectScreen from '@/game/SelectScreen';
import { controlsMap } from '@/game/controls';
import { INITIAL_HUD_STATE, type FlightHudState } from '@/game/types';
import type { PlaneDefinition } from '@/game/planes';
import type { WorldLocation } from '@/game/world';
import CommandMenu from '@/game/CommandMenu';
import type { CameraMode } from '@/game/types';
import WarningAudio from '@/game/WarningAudio';

type FlowStep = 'plane' | 'location' | 'ready' | 'flying';

export default function FlightSimPage() {
  const [hud, setHud] = useState<FlightHudState>(INITIAL_HUD_STATE);
  const [step, setStep] = useState<FlowStep>('plane');
  const [plane, setPlane] = useState<PlaneDefinition | null>(null);
  const [location, setLocation] = useState<WorldLocation | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [cameraMode, setCameraMode] = useState<CameraMode>('chase');
  const [creditVisible, setCreditVisible] = useState(true);

  const handleCameraModeChange = useCallback((mode: CameraMode) => {
    setCameraMode(mode);
    setHud((prev) => ({ ...prev, cameraMode: mode }));
  }, []);

  const handleHudUpdate = useCallback(
    (partial: Partial<FlightHudState>) => {
      setHud((prev) => ({ ...prev, ...partial }));
    },
    [],
  );

  const handleCrashChange = useCallback((crashed: boolean) => {
    setHud((prev) => ({ ...prev, crashed }));
  }, []);

  const handleLandChange = useCallback((landed: boolean) => {
    setHud((prev) => ({ ...prev, landed }));
  }, []);

  const handleSelectPlane = useCallback((p: PlaneDefinition) => {
    setPlane(p);
    setMenuOpen(false);
    setStep('location');
  }, []);

  const handleSelectLocation = useCallback(
    (loc: WorldLocation) => {
      setLocation(loc);

      if (step === 'flying' || mapOpen) {
        setResetToken((t) => t + 1);
        setHud((prev) => ({
          ...prev,
          crashed: false,
          landed: false,
        }));
        setMapOpen(false);
        setMenuOpen(false);
      } else {
        setStep('ready');
      }
    },
    [step, mapOpen],
  );

  const handleStart = useCallback(() => {
    setHud((prev) => ({
      ...prev,
      started: true,
      crashed: false,
      landed: false,
    }));
    setStep('flying');
    setMenuOpen(false);
  }, []);

  const handleBackToLocation = useCallback(() => {
    setStep('location');
  }, []);

  const handleBackToPlane = useCallback(() => {
    setStep('plane');
  }, []);

  useEffect(() => {
    if (step !== 'flying') return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyM') {
        setMapOpen((open) => !open);
        setMenuOpen(false);
      }
      if (e.code === 'Escape') {
        setMenuOpen((open) => !open);
        setMapOpen(false);
      }
      if (e.code === 'KeyC') {
        const modes: CameraMode[] = ['chase', 'cockpit', 'wide', 'side', 'nose'];
        handleCameraModeChange(
          modes[(modes.indexOf(cameraMode) + 1) % modes.length],
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [cameraMode, handleCameraModeChange, step]);

  useEffect(() => {
    const timer = window.setTimeout(() => setCreditVisible(false), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  const active =
    step === 'flying' &&
    hud.started &&
    !hud.crashed &&
    !mapOpen &&
    !menuOpen;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {plane && location && (
        <KeyboardControls map={controlsMap}>
          <Scene
            active={active}
            plane={plane}
            location={location}
            resetToken={resetToken}
            cameraMode={cameraMode}
            onHudUpdate={handleHudUpdate}
            onCrashChange={handleCrashChange}
            onLandChange={handleLandChange}
          />
        </KeyboardControls>
      )}

      {plane && location && step === 'flying' && (
        <HUD
          state={hud}
          plane={plane}
          location={location}
          onOpenMap={() => {
            setMapOpen(true);
            setMenuOpen(false);
          }}
          onOpenMenu={() => {
            setMenuOpen(true);
            setMapOpen(false);
          }}
        />
      )}

      {step === 'flying' && <WarningAudio state={hud} />}

      {step === 'plane' && (
        <SelectScreen
          step="plane"
          selectedPlane={plane}
          onSelectPlane={handleSelectPlane}
          onSelectLocation={handleSelectLocation}
        />
      )}

      {step === 'location' && (
        <SelectScreen
          step="location"
          selectedPlane={plane}
          onSelectPlane={handleSelectPlane}
          onSelectLocation={handleSelectLocation}
          onBack={handleBackToPlane}
        />
      )}

      {step === 'ready' && (
        <SelectScreen
          step="ready"
          selectedPlane={plane}
          selectedLocation={location}
          onSelectPlane={handleSelectPlane}
          onSelectLocation={handleSelectLocation}
          onBack={handleBackToLocation}
          onStart={handleStart}
        />
      )}

      {step === 'flying' && mapOpen && (
        <SelectScreen
          step="location"
          selectedPlane={plane}
          onSelectPlane={handleSelectPlane}
          onSelectLocation={handleSelectLocation}
          onResume={() => setMapOpen(false)}
        />
      )}

      {step === 'flying' && menuOpen && plane && location && (
        <CommandMenu
          plane={plane}
          location={location}
          cameraMode={cameraMode}
          onCameraModeChange={handleCameraModeChange}
          onResume={() => setMenuOpen(false)}
          onOpenAirports={() => {
            setMenuOpen(false);
            setMapOpen(true);
          }}
          onChangeAircraft={() => {
            setMenuOpen(false);
            setMapOpen(false);
            setStep('plane');
          }}
          onRestart={() => {
            setResetToken((token) => token + 1);
            setHud((prev) => ({ ...prev, crashed: false, landed: false }));
            setMenuOpen(false);
          }}
        />
      )}

      {creditVisible && (
        <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="rounded-2xl border border-amber-400/40 bg-zinc-950/95 px-10 py-8 text-center shadow-2xl shadow-black/70">
            <div className="mb-2 text-[10px] font-bold tracking-[0.35em] text-amber-400">
              SKYBOUND FLIGHT SIMULATOR
            </div>
            <div className="text-2xl font-bold text-white">Made by Ayaan</div>
            <button
              type="button"
              onClick={() => setCreditVisible(false)}
              className="mt-5 rounded-lg bg-amber-400 px-5 py-2 text-xs font-bold text-zinc-950 transition-colors hover:bg-amber-300"
            >
              Enter hangar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}