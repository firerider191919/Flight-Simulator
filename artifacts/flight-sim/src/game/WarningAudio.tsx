import { useEffect, useRef } from 'react';
import type { FlightHudState } from './types';

interface WarningAudioProps {
  state: FlightHudState;
}

/**
 * Lightweight cockpit warning tones using the browser Web Audio API.
 * Audio is unlocked by the first user key/click so it works with autoplay
 * policies without requiring an external sound asset or service.
 */
export default function WarningAudio({ state }: WarningAudioProps) {
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const unlock = () => {
      if (!contextRef.current) {
        contextRef.current = new AudioContext();
      }
      if (contextRef.current.state === 'suspended') {
        void contextRef.current.resume();
      }
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    if (!state.started || state.crashed || state.landed) return;
    const context = contextRef.current;
    if (!context) return;

    const tone = (frequency: number, duration: number, volume: number) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration + 0.02);
    };

    const interval = state.stalling ? 480 : state.lowAltitude ? 820 : 0;
    if (!interval) return;

    tone(state.stalling ? 880 : 440, 0.13, state.stalling ? 0.045 : 0.035);
    const timer = window.setInterval(
      () => tone(state.stalling ? 880 : 440, 0.13, state.stalling ? 0.045 : 0.035),
      interval,
    );
    return () => window.clearInterval(timer);
  }, [state.crashed, state.landed, state.lowAltitude, state.stalling, state.started]);

  return null;
}