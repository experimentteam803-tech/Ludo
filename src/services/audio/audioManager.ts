class DualAudioManager {
  private ctx: AudioContext | null = null;
  public isSfxMuted: boolean = false;
  public isMusicMuted: boolean = false;
  public sfxVolume: number = 0.8;
  public musicVolume: number = 0.5;

  private currentBgmAudio: HTMLAudioElement | null = null;
  private bgmInterval: number | null = null;

  private audioManifest: Record<string, string> = {
    'bgm-home': '/assets/audio/bgm-home.mp3',
    'bgm-game': '/assets/audio/bgm-game.mp3',
    'game-open': '/assets/audio/game-open.mp3',
    'dice-roll': '/assets/audio/dice-roll.mp3',
    'token-move': '/assets/audio/token-move.mp3',
    'token-capture': '/assets/audio/token-capture.mp3',
    'token-home': '/assets/audio/token-home.mp3',
    'game-win': '/assets/audio/game-win.mp3',
    'game-lose': '/assets/audio/game-lose.mp3',
  };

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Attempts to play actual uploaded MP3; falls back to code-generated sound
  private async playTrack(trackKey: string, fallbackSynth: () => void) {
    if (this.isSfxMuted) return;
    const path = this.audioManifest[trackKey];

    if (path) {
      try {
        const audio = new Audio(path);
        audio.volume = this.sfxVolume;
        await audio.play();
        return;
      } catch {
        // Fallback to procedural synth if file is not found
        fallbackSynth();
      }
    } else {
      fallbackSynth();
    }
  }

  // --- Sound Effects ---

  public playDiceRoll() {
    this.playTrack('dice-roll', () => {
      this.initCtx();
      if (!this.ctx) return;
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(160 + Math.random() * 260, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.25 * this.sfxVolume, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.05);
        }, i * 45);
      }
    });
  }

  public playStepHop(stepIndex: number = 0) {
    this.playTrack('token-move', () => {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = 540 + (stepIndex % 4) * 40;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 100, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.22 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    });
  }

  public playTokenExit() {
    this.playTrack('token-home', () => {
      this.initCtx();
      if (!this.ctx) return;
      [440, 554.37, 659.25].forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.2 * this.sfxVolume, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.12);
        }, idx * 50);
      });
    });
  }

  public playCapture() {
    this.playTrack('token-capture', () => {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.35 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    });
  }

  public playVictory() {
    this.playTrack('game-win', () => {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.3 * this.sfxVolume, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.35);
        }, idx * 110);
      });
    });
  }

  // --- UI Procedural Sounds ---
  public playUiTap() {
    if (this.isSfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12 * this.sfxVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // --- Background Music ---
  public playBGM(scene: 'home' | 'game') {
    this.stopBGM();
    if (this.isMusicMuted) return;

    const trackKey = scene === 'home' ? 'bgm-home' : 'bgm-game';
    const path = this.audioManifest[trackKey];

    if (path) {
      try {
        const audio = new Audio(path);
        audio.loop = true;
        audio.volume = this.musicVolume;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.currentBgmAudio = audio;
            })
            .catch(() => {
              this.startProceduralBgm();
            });
          return;
        }
      } catch {
        this.startProceduralBgm();
        return;
      }
    }
    this.startProceduralBgm();
  }

  private startProceduralBgm() {
    this.initCtx();
    const melody = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
    let noteIdx = 0;

    this.bgmInterval = window.setInterval(() => {
      if (this.isMusicMuted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(melody[noteIdx % melody.length], this.ctx.currentTime);

      gain.gain.setValueAtTime(0.02 * this.musicVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
      noteIdx = (noteIdx + 1) % melody.length;
    }, 420);
  }

  public stopBGM() {
    if (this.currentBgmAudio) {
      this.currentBgmAudio.pause();
      this.currentBgmAudio.currentTime = 0;
      this.currentBgmAudio = null;
    }
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audioManager = new DualAudioManager();
