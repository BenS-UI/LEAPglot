class TTS {
  private synth: SpeechSynthesis | undefined;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private keepAliveInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        this.synth = window.speechSynthesis;
        // The onvoiceschanged event is not reliably fired in all browsers.
        // We'll poll for voices as a fallback.
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = this.loadVoices;
        }
        this.startKeepAlive();
    } else {
        console.warn("Speech Synthesis API not supported. TTS features will be disabled.");
    }
  }

  private loadVoices = () => {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();

    if(this.voices.length === 0) {
        // If voices are not ready, try again shortly.
        setTimeout(this.loadVoices, 100);
        return;
    }
    // Auto-select a preferred voice if none is selected or the current one is gone
    if (!this.selectedVoice || !this.voices.find(v => v.name === this.selectedVoice?.name)) {
        this.selectedVoice = this.voices.find(voice => voice.name.includes('Google US English')) || this.voices[0];
    }
  };
  
  private startKeepAlive() {
    if (!this.synth) return;
    if (this.keepAliveInterval) {
        clearInterval(this.keepAliveInterval);
    }
    this.keepAliveInterval = window.setInterval(() => {
      if (this.synth && !this.synth.speaking) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 10000); // every 10 seconds
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
          resolve();
          return;
      }
      
      this.synth.cancel();

      setTimeout(() => {
        if (!this.synth || !text || text.trim() === '') {
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onend = () => {
          resolve();
        };

        utterance.onerror = (event) => {
          console.error(`SpeechSynthesisUtterance.onerror: ${event.error}`, event);
          resolve(); 
        };

        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }
        utterance.pitch = 1;
        utterance.rate = 1;
        
        this.synth.speak(utterance);
      }, 50);
    });
  }

  cancel() {
    if (this.synth) {
        this.synth.cancel();
    }
  }

  getVoices() {
    if (!this.synth) return [];
    if (this.voices.length === 0) {
        this.loadVoices();
    }
    return this.voices;
  }
  
  setVoice(voiceName: string) {
      if (!this.synth) return;
      const voice = this.voices.find(v => v.name === voiceName);
      if(voice) {
          this.selectedVoice = voice;
      }
  }
}

export const tts = new TTS();
