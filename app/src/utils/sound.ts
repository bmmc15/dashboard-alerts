declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContextClass();

export const playAlertSound = (type: 'buy' | 'sell') => {
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for buy and sell
    oscillator.frequency.value = type === 'buy' ? 800 : 400;
    
    // Short beep
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.error('Error playing alert sound:', error);
  }
};

export const initializeAudio = () => {
  // Initialize audio context on user interaction
  try {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};
