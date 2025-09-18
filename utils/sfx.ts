class Sfx {
  private audioContext: AudioContext | undefined;
  private masterGain: GainNode | undefined;

  constructor() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        
        const savedVolume = localStorage.getItem('sfxVolume');
        if (this.masterGain) {
          this.masterGain.gain.value = savedVolume ? parseFloat(savedVolume) : 0.5;
        }
      } else {
        console.warn("Web Audio API not supported. SFX features will be disabled.");
      }
    } catch (e) {
      console.error("Could not create AudioContext: ", e);
    }
  }

  private playSound(type: OscillatorType, frequency: number, duration: number, volume: number = 0.5, attack: number = 0.01, decay: number = 0.01) {
    if (!this.audioContext || !this.masterGain) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
      
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    gainNode.gain.setValueAtTime(volume, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration + decay);
  }
  
  public setVolume(level: number) {
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(level, this.audioContext.currentTime);
    }
  }

  public playClick() {
    this.playSound('triangle', 500, 0.08, 0.1, 0.001, 0.05);
  }

  public playTyping() {
    this.playSound('square', 1200 + Math.random() * 100, 0.05, 0.05, 0.001, 0.02);
  }

  public playEnter() {
    this.playSound('sine', 600, 0.1, 0.2);
    setTimeout(() => this.playSound('sine', 800, 0.1, 0.2), 50);
  }

  public playToggle() {
    this.playSound('square', 700, 0.08, 0.15);
  }

  public playSuccess() {
    this.playSound('sine', 523.25, 0.1, 0.2);
    setTimeout(() => this.playSound('sine', 659.25, 0.1, 0.2), 100);
  }

  public playError() {
    this.playSound('sawtooth', 200, 0.2, 0.3);
  }

  public playTrash() {
    this.playSound('sawtooth', 150, 0.2, 0.2, 0.01, 0.15);
  }

  public playJump() {
    this.playSound('triangle', 440, 0.1, 0.2);
    this.playSound('triangle', 880, 0.1, 0.2);
  }

  public playLand() {
    this.playSound('sine', 220, 0.15, 0.3);
  }

  public playDeath() {
    this.playSound('sawtooth', 200, 0.5, 0.4);
    setTimeout(() => this.playSound('sawtooth', 100, 0.5, 0.4), 100);
  }
  
  public playCoin() {
    this.playSound('square', 880, 0.05, 0.3);
    setTimeout(() => this.playSound('square', 1046.50, 0.1, 0.3), 50);
  }
  
  public playPowerUp() {
      this.playSound('sine', 523.25, 0.1, 0.3);
      setTimeout(() => this.playSound('sine', 659.25, 0.1, 0.3), 100);
      setTimeout(() => this.playSound('sine', 783.99, 0.1, 0.3), 200);
  }

  public playWinLevel() {
      this.playPowerUp();
      setTimeout(() => this.playSound('sine', 1046.50, 0.2, 0.3), 300);
  }
  
  // Chess sounds
  public playMove() {
      this.playSound('triangle', 800, 0.05, 0.15, 0.001, 0.04);
  }

  public playCapture() {
      this.playSound('sawtooth', 300, 0.1, 0.25, 0.005, 0.08);
  }

  public playCheck() {
      this.playSound('square', 1200, 0.15, 0.2, 0.01, 0.1);
  }

  public playGameOver() {
      this.playSound('sine', 440, 0.1, 0.3);
      setTimeout(() => this.playSound('sine', 330, 0.1, 0.3), 100);
      setTimeout(() => this.playSound('sine', 220, 0.2, 0.3), 200);
  }

  public playPromote() {
      this.playPowerUp();
  }
}

export const sfx = new Sfx();