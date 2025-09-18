import { useCallback, useRef } from 'react';

type AudioCue = {
  frequency: number;
  type: OscillatorType;
  duration: number;
  volume: number;
  pitchBend: number;
};

const useMatchingAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const cuesRef = useRef<Map<string, AudioCue>>(new Map());

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioContextRef.current = new AudioContext();
            } else {
                console.warn("Web Audio API not supported. Matching game sounds will be disabled.");
                return null;
            }
        } catch(e) {
            console.error("Could not create AudioContext for matching game:", e);
            return null;
        }
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playSoundWithCue = useCallback((cue: AudioCue) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const now = audioContext.currentTime;

    oscillator.type = cue.type;
    oscillator.frequency.setValueAtTime(cue.frequency, now);
    oscillator.frequency.linearRampToValueAtTime(cue.frequency + cue.pitchBend, now + cue.duration);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(cue.volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, now + cue.duration);

    oscillator.start(now);
    oscillator.stop(now + cue.duration);
  }, [getAudioContext]);
  
  const generateCues = useCallback((itemIds: string[]) => {
      const newCues = new Map<string, AudioCue>();
      const baseFrequency = 150;
      const types: OscillatorType[] = ['square', 'sawtooth', 'triangle'];
      
      itemIds.forEach((id, index) => {
          const frequency = baseFrequency + (index * 50) + (Math.random() * 20);
          const type = types[index % types.length];
          const duration = 0.1 + (Math.random() * 0.1);
          const volume = 0.15 + (Math.random() * 0.1);
          const pitchBend = (Math.random() - 0.5) * 400; // Random upward or downward chirp

          newCues.set(id, { frequency, type, duration, volume, pitchBend });
      });
      cuesRef.current = newCues;
  }, []);
  
  const playCardSound = useCallback((itemId: string) => {
      const cue = cuesRef.current.get(itemId);
      if(cue) {
          playSoundWithCue(cue);
      }
  }, [playSoundWithCue]);
  
  const playMatchSuccessSound = useCallback(() => {
      const audioContext = getAudioContext();
      if (!audioContext) return;
      
      const cue1: AudioCue = { frequency: 523.25, type: 'sine', duration: 0.15, volume: 0.3, pitchBend: 300 };
      const cue2: AudioCue = { frequency: 659.25, type: 'sine', duration: 0.2, volume: 0.3, pitchBend: 400 };
      playSoundWithCue(cue1);
      setTimeout(() => playSoundWithCue(cue2), 100);
  }, [getAudioContext, playSoundWithCue]);
  
  const playMatchFailSound = useCallback(() => {
    const cue: AudioCue = { frequency: 120, type: 'sawtooth', duration: 0.4, volume: 0.15, pitchBend: -80 };
    playSoundWithCue(cue);
  }, [playSoundWithCue]);
  
  const playWinSound = useCallback(() => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const c5: AudioCue = { frequency: 523.25, type: 'sine', duration: 0.1, volume: 0.2, pitchBend: 0 };
    const e5: AudioCue = { frequency: 659.25, type: 'sine', duration: 0.1, volume: 0.2, pitchBend: 0 };
    const g5: AudioCue = { frequency: 783.99, type: 'sine', duration: 0.1, volume: 0.2, pitchBend: 0 };
    const c6: AudioCue = { frequency: 1046.50, type: 'sine', duration: 0.2, volume: 0.2, pitchBend: 0 };

    playSoundWithCue(c5);
    setTimeout(() => playSoundWithCue(e5), 100);
    setTimeout(() => playSoundWithCue(g5), 200);
    setTimeout(() => playSoundWithCue(c6), 300);
  }, [getAudioContext, playSoundWithCue]);

  return { generateCues, playCardSound, playMatchSuccessSound, playMatchFailSound, playWinSound };
};

export default useMatchingAudio;
