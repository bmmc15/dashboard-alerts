import React, { createContext, useContext, useState, useCallback } from 'react';
import { playAlertSound, initializeAudio } from '../utils/sound';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (type: 'buy' | 'sell') => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  playSound: () => {},
});

export const useSoundSettings = () => useContext(SoundContext);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      if (!prev) {
        // Initialize audio when enabling sound
        initializeAudio();
      }
      return !prev;
    });
  }, []);

  const playSound = useCallback((type: 'buy' | 'sell') => {
    if (soundEnabled) {
      playAlertSound(type);
    }
  }, [soundEnabled]);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};
