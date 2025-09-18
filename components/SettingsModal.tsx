import React, { useState, useEffect } from 'react';
import { tts } from '../utils/tts';
import { sfx } from '../utils/sfx';
import StyledButton from './StyledButton';
import CloseIcon from './icons/CloseIcon';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [sfxVolume, setSfxVolume] = useState(() => {
      const savedVolume = localStorage.getItem('sfxVolume');
      return savedVolume ? parseFloat(savedVolume) : 0.5;
  });

  useEffect(() => {
    const availableVoices = tts.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0].name);
    }
  }, []);

  useEffect(() => {
    sfx.setVolume(sfxVolume);
    localStorage.setItem('sfxVolume', sfxVolume.toString());
  }, [sfxVolume]);

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sfx.playToggle();
    const voiceName = e.target.value;
    setSelectedVoice(voiceName);
    tts.setVoice(voiceName);
    tts.speak(`Voice changed to ${voiceName.split('(')[0]}`);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSfxVolume(parseFloat(e.target.value));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--highlight-neon)] font-display">Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="voice-select" className="block text-lg font-medium text-zinc-500 mb-2">Text-to-Speech Voice</label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={handleVoiceChange}
              className="w-full p-2 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-[var(--highlight-neon)] focus:ring-2 focus:ring-[var(--highlight-neon-glow)] text-white"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
           <div>
            <label htmlFor="volume-slider" className="block text-lg font-medium text-zinc-500 mb-2">
                Sound Effects Volume: {Math.round(sfxVolume * 100)}%
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sfxVolume}
              onChange={handleVolumeChange}
              className="w-full accent-[var(--highlight-neon)]"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <StyledButton onClick={onClose}>Close</StyledButton>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;