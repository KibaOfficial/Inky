// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export class AudioManager {
  private music: Map<string, HTMLAudioElement>;
  private sounds: Map<string, HTMLAudioElement>;
  private activeSounds: HTMLAudioElement[];
  private currentMusic: HTMLAudioElement | null;
  private musicVolume: number = 1.0;
  private soundVolume: number = 1.0;

  constructor() {
    this.music = new Map();
    this.sounds = new Map();
    this.activeSounds = [];
    this.currentMusic = null;
  }

  public playMusic(path: string, loop: boolean, fadeIn: number): void  {
    if (this.currentMusic) {
      this.stopMusic();
    }

    let audio = this.music.get(path);
    if (!audio) {
      audio = new Audio(path);
      audio.loop = loop;
      this.music.set(path, audio);
    }

    if (fadeIn > 0) {
      audio.volume = 0;
    } else {
      audio.volume = this.musicVolume;
    }

    audio.play().catch(err => {
      console.error(`[AudioManager] Failed to play music: ${err}`);
    });

    this.currentMusic = audio;

    if (fadeIn > 0) {
      this.fadeIn(audio, fadeIn);
    }


  }

  public stopMusic(fadeOutDuration?: number): void {
    if (!this.currentMusic) return;

    const audio = this.currentMusic;

    if (fadeOutDuration && fadeOutDuration > 0) {
      this.fadeOut(audio, fadeOutDuration, () => {
        audio.pause();
        audio.currentTime = 0;
        this.currentMusic = null;
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
      this.currentMusic = null;
    }
  }

  public playSound(path: string, loop: boolean = false, volume?: number): void {
    let sound = this.sounds.get(path);
    if (!sound) {
      sound = new Audio(path);
      this.sounds.set(path, sound);
    }

    const soundClone = sound.cloneNode(true) as HTMLAudioElement;
    soundClone.loop = loop;
    soundClone.volume = volume !== undefined ? Math.max(0, Math.min(1, volume)) : this.soundVolume;

    soundClone.play().catch(err => {
      console.error(`[AudioManager] Failed to play sound: ${err}`);
    });

    // Track active sound
    this.activeSounds.push(soundClone);

    if (!loop) {
      soundClone.addEventListener('ended', () => {
        this.activeSounds = this.activeSounds.filter(s => s !== soundClone);
        soundClone.remove();
      });
    }
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume;
    }
  }

  public setSoundVolume(volume: number): void {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  public stopSound(fadeOutDuration?: number): void {
    if (this.activeSounds.length === 0) return;

    // Stop all active sounds
    const soundsToStop = [...this.activeSounds];
    
    soundsToStop.forEach(sound => {
      if (fadeOutDuration && fadeOutDuration > 0) {
        this.fadeOut(sound, fadeOutDuration, () => {
          sound.pause();
          sound.currentTime = 0;
          this.activeSounds = this.activeSounds.filter(s => s !== sound);
          sound.remove();
        });
      } else {
        sound.pause();
        sound.currentTime = 0;
        this.activeSounds = this.activeSounds.filter(s => s !== sound);
        sound.remove();
      }
    });
  }

  public pauseMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
    }
  }

  public resumeMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.play().catch(err => {
        console.error(`[AudioManager] Failed to resume music: ${err}`);
      });
    }
  }

  private fadeIn(audio: HTMLAudioElement, duration: number): void {
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = this.musicVolume / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, this.musicVolume);

      if (currentStep >= steps) {
        clearInterval(interval);
        audio.volume = this.musicVolume;
      }
    }, stepDuration);
  }

  private fadeOut(audio: HTMLAudioElement, duration: number, onComplete: () => void): void {
    const steps = 50;
    const stepDuration = duration / steps;
    const startVolume = audio.volume;
    const volumeStep = audio.volume / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);

      if (currentStep >= steps) {
        clearInterval(interval);
        audio.volume = 0;
        onComplete();
      }
    }, stepDuration);
  }


}