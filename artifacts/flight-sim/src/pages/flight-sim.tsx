import { useCallback, useEffect, useState } from 'react';
import { KeyboardControls } from '@react-three/drei';
import Scene from '@/game/Scene';
import HUD from '@/game/HUD';
import SelectScreen from '@/game/SelectScreen';
import { controlsMap } from '@/game/controls';
import { INITIAL_HUD_STATE, type FlightHudState } from '@/game/types';
import type { PlaneDefinition } from '@/game/planes';
import type { WorldLocation } from '@/game/world';

type FlowStep = 'plane' | 'location' | 'ready' | 'flying';

export default function FlightSimPage() {
  const [hud, setHud] = useState<FlightHudState>(INITIAL_HUD_STATE);
  const [step, setStep] = useState<FlowStep>('plane');
  const [plane, setPlane] = useState<PlaneDefinition | null>(null);
  const [location, setLocation] = useState<WorldLocation | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [resetToken, setResetToken] = useState(0);

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
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [step]);

  const active =
    step === 'flying' &&
    hud.started &&
    !hud.crashed &&
    !mapOpen;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {plane && location && (
        <KeyboardControls map={controlsMap}>
          <Scene
            active={active}
            plane={plane}
            location={location}
            resetToken={resetToken}
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
          onOpenMap={() => setMapOpen(true)}
        />
      )}

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
    </div>
  );
}