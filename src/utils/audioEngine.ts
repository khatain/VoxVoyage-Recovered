import type { ResolvedAppearance } from '../types/game';

export type SfxKind = 'click' | 'select' | 'mode' | 'complete' | 'reward';
export type WorldAudioProfile = 'default' | 'kenya' | 'scotland' | 'australia' | 'egypt';

/**
 * Procedural Web Audio synthesizer for VoxVoyage.
 * Zero external audio files; strictly user-gesture activated; supports Day & Night sound profiles.
 */
class VoxAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private ambienceSource: AudioBufferSourceNode | null = null;
  private ambienceFilter: BiquadFilterNode | null = null;
  private droneOscLow: OscillatorNode | null = null;
  private droneOscFifth: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private droneGain: GainNode | null = null;
  private schedulerId: number | null = null;
  private stepIndex = 0;

  private isMusicPlaying = false;
  private isDialogueDucked = false;
  private currentTheme: ResolvedAppearance = 'day';
  private reducedMotion = false;
  private worldProfile: WorldAudioProfile = 'default';

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (this.ctx && (this.ctx.state as string) === 'closed') {
      this.ctx = null;
      this.masterGain = null;
      this.musicGain = null;
      this.ambienceGain = null;
    }

    if (!this.ctx) {
      try {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.72;
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.0;
        this.musicGain.connect(this.masterGain);

        this.ambienceGain = this.ctx.createGain();
        this.ambienceGain.gain.value = 0.0;
        this.ambienceGain.connect(this.masterGain);
      } catch {
        this.ctx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.ambienceGain = null;
        return null;
      }
    }

    if (this.ctx.state === 'suspended') {
      try {
        const resumeResult = this.ctx.resume();
        if (resumeResult && typeof resumeResult.catch === 'function') {
          resumeResult.catch(() => {
            if (this.isMusicPlaying && this.ctx?.state === 'suspended') {
              this.stopMusic();
            }
          });
        }
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  private getTargetMusicGain(): number {
    return this.isDialogueDucked ? 0.22 : 0.65;
  }

  private getTargetAmbienceFilterFreq(): number {
    if (this.currentTheme === 'day') {
      if (this.worldProfile === 'kenya') return 620;
      if (this.worldProfile === 'scotland') return 460;
      if (this.worldProfile === 'australia') return 580;
      if (this.worldProfile === 'egypt') return 500;
      return 520;
    }
    if (this.worldProfile === 'kenya') return 320;
    if (this.worldProfile === 'scotland') return 300;
    if (this.worldProfile === 'australia') return 315;
    if (this.worldProfile === 'egypt') return 290;
    return 280;
  }

  private getTargetAmbienceGain(): number {
    if (this.currentTheme === 'day') {
      if (this.worldProfile === 'kenya') return 0.068;
      if (this.worldProfile === 'scotland') return 0.064;
      if (this.worldProfile === 'australia') return 0.058;
      if (this.worldProfile === 'egypt') return 0.054;
      return 0.055;
    }
    return this.worldProfile === 'egypt' ? 0.042 : 0.038;
  }

  private getStepIntervalMs(): number {
    if (this.currentTheme === 'day') {
      if (this.worldProfile === 'scotland') return this.reducedMotion ? 840 : 580;
      if (this.worldProfile === 'australia') return this.reducedMotion ? 820 : 540;
      if (this.worldProfile === 'egypt') return this.reducedMotion ? 880 : 620;
      return this.reducedMotion ? 950 : 720;
    }
    return this.reducedMotion ? 1350 : 1100;
  }

  private getTargetScotlandDroneGain(): number {
    if (this.worldProfile !== 'scotland') return 0.0;
    const base = this.currentTheme === 'day' ? 0.022 : 0.011;
    return this.isDialogueDucked ? base * 0.35 : base;
  }

  private startScotlandDroneLayer(ctx: AudioContext) {
    if (!this.masterGain) return;
    this.stopScotlandDroneLayer();
    if (this.worldProfile !== 'scotland') return;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = this.currentTheme === 'day' ? 350 : 250;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.setTargetAtTime(this.getTargetScotlandDroneGain(), ctx.currentTime, 0.55);

    const oscLow = ctx.createOscillator();
    oscLow.type = 'sawtooth';
    oscLow.frequency.value = 146.83; // D3 bagpipe-like warm drone

    const oscFifth = ctx.createOscillator();
    oscFifth.type = 'triangle';
    oscFifth.frequency.value = 220.0; // A3 open fifth

    oscLow.connect(filter);
    oscFifth.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    oscLow.start();
    oscFifth.start();

    this.droneOscLow = oscLow;
    this.droneOscFifth = oscFifth;
    this.droneFilter = filter;
    this.droneGain = gain;
  }

  private stopScotlandDroneLayer() {
    for (const osc of [this.droneOscLow, this.droneOscFifth]) {
      if (osc) {
        try {
          osc.stop();
        } catch {
          // Ignore if already stopped
        }
        osc.disconnect();
      }
    }
    this.droneOscLow = null;
    this.droneOscFifth = null;
    if (this.droneFilter) {
      this.droneFilter.disconnect();
      this.droneFilter = null;
    }
    if (this.droneGain) {
      this.droneGain.disconnect();
      this.droneGain = null;
    }
  }

  private startAmbienceLayer(ctx: AudioContext) {
    if (!this.ambienceGain) return;
    this.stopAmbienceLayer();

    const sampleRate = ctx.sampleRate > 0 ? ctx.sampleRate : 44100;
    const length = sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.03 * white) / 1.03;
      data[i] = lastOut * 1.4;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = this.getTargetAmbienceFilterFreq();

    source.connect(filter);
    filter.connect(this.ambienceGain);
    source.start();

    this.ambienceSource = source;
    this.ambienceFilter = filter;
  }

  private stopAmbienceLayer() {
    if (this.ambienceSource) {
      try {
        this.ambienceSource.stop();
      } catch {
        // Ignore if already stopped
      }
      this.ambienceSource.disconnect();
      this.ambienceSource = null;
    }
    if (this.ambienceFilter) {
      this.ambienceFilter.disconnect();
      this.ambienceFilter = null;
    }
  }

  private playMusicTone(freq: number, duration: number, type: OscillatorType, peakGain: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    const attack = this.currentTheme === 'day' ? 0.04 : 0.28;
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(peakGain, now + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(env);
    env.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  private playSoftBodhranPulse(accented: boolean) {
    if (!this.ctx || !this.musicGain || this.reducedMotion || this.currentTheme !== 'day') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(accented ? 118 : 142, now);
    osc.frequency.exponentialRampToValueAtTime(accented ? 58 : 72, now + 0.12);

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(accented ? 0.045 : 0.025, now + 0.014);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(env);
    env.connect(this.musicGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  private playSavannaBirdChirp() {
    if (!this.ctx || !this.musicGain || this.reducedMotion || this.currentTheme !== 'day') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    const baseFreq =
      this.worldProfile === 'scotland'
        ? 1420 + (this.stepIndex % 3) * 160
        : 1680 + (this.stepIndex % 3) * 210;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.24, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.94, now + 0.14);

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.015, now + 0.025);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);

    osc.connect(env);
    env.connect(this.musicGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  private scheduleNextStep() {
    if (!this.isMusicPlaying || !this.ctx) return;

    // Original D-Mixolydian / Highland Pentatonic fiddle motif for Scotland
    const scotlandDayPhrase = [
      293.66, 369.99, 440.0, 523.25, 493.88, 440.0, 369.99, 329.63,
      293.66, 440.0, 493.88, 587.33, 493.88, 440.0, 369.99, 293.66,
    ];
    const scotlandNightPhrase = [
      293.66, 329.63, 440.0, 369.99, 293.66, 220.0, 293.66, 329.63,
    ];

    // Original sunlit Sydney harbour coastal-urban synth phrase (zero copyrighted music)
    const australiaDayPhrase = [
      261.63, 329.63, 392.0, 493.88, 587.33, 493.88, 392.0, 329.63,
      293.66, 369.99, 440.0, 523.25, 440.0, 392.0, 329.63, 293.66,
    ];
    const australiaNightPhrase = [
      220.0, 261.63, 329.63, 392.0, 493.88, 392.0, 329.63, 293.66,
    ];

    // Original D-Hijaz / Phrygian-dominant archaeological motif for Egypt (zero copyrighted audio)
    const egyptDayPhrase = [
      293.66, 311.13, 369.99, 392.0, 440.0, 466.16, 440.0, 392.0,
      369.99, 311.13, 293.66, 392.0, 440.0, 369.99, 311.13, 293.66,
    ];
    const egyptNightPhrase = [
      220.0, 293.66, 311.13, 369.99, 440.0, 369.99, 311.13, 293.66,
    ];

    const dayScale =
      this.worldProfile === 'kenya'
        ? [293.66, 329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63]
        : this.worldProfile === 'scotland'
          ? scotlandDayPhrase
          : this.worldProfile === 'australia'
            ? australiaDayPhrase
            : this.worldProfile === 'egypt'
              ? egyptDayPhrase
              : [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 392.0, 329.63];
    const nightScale =
      this.worldProfile === 'kenya'
        ? [220.0, 246.94, 293.66, 329.63, 392.0, 329.63, 293.66, 246.94]
        : this.worldProfile === 'scotland'
          ? scotlandNightPhrase
          : this.worldProfile === 'australia'
            ? australiaNightPhrase
            : this.worldProfile === 'egypt'
              ? egyptNightPhrase
              : [220.0, 261.63, 293.66, 349.23, 392.0, 440.0, 349.23, 293.66];

    const scale = this.currentTheme === 'day' ? dayScale : nightScale;
    const idx = this.stepIndex % scale.length;
    const note = scale[idx];
    this.stepIndex += 1;

    if (this.currentTheme === 'day') {
      if (this.worldProfile === 'scotland') {
        // Fiddle-like expressive triangle voice + subtle grace shimmer
        this.playMusicTone(note, 0.72, 'triangle', this.reducedMotion ? 0.038 : 0.056);
        if (idx % 4 === 0) {
          this.playSoftBodhranPulse(true);
        } else if (idx % 4 === 2) {
          this.playSoftBodhranPulse(false);
        }
        if (this.stepIndex % 8 === 0) {
          this.playSavannaBirdChirp();
        }
      } else if (this.worldProfile === 'australia') {
        // Warm bright electric-marimba harbour melody + breezy bass pad + subtle seabird chime
        this.playMusicTone(note, 0.68, 'sine', this.reducedMotion ? 0.042 : 0.062);
        this.playMusicTone(note * 2, 0.24, 'triangle', this.reducedMotion ? 0.014 : 0.022);
        if (idx % 4 === 0) {
          this.playMusicTone(note * 0.5, 1.45, 'triangle', 0.038);
        }
        if (this.stepIndex % 10 === 0) {
          this.playSavannaBirdChirp();
        }
      } else if (this.worldProfile === 'egypt') {
        // Plucked oud-like warm triangle + gentle D3 drone + breathy ney-like sine shimmer
        this.playMusicTone(note, 0.62, 'triangle', this.reducedMotion ? 0.04 : 0.058);
        if (idx % 4 === 0) {
          this.playMusicTone(146.83, 1.55, 'sine', 0.042);
          this.playSoftBodhranPulse(true);
        } else if (idx % 4 === 2) {
          this.playSoftBodhranPulse(false);
        }
        if (idx % 8 === 3) {
          this.playMusicTone(note * 2, 0.9, 'sine', this.reducedMotion ? 0.016 : 0.024);
        } else if (idx % 8 === 7) {
          this.playMusicTone(note * 1.5, 0.75, 'sine', this.reducedMotion ? 0.012 : 0.018);
        }
      } else {
        this.playMusicTone(note, 0.95, 'triangle', this.reducedMotion ? 0.045 : 0.068);
        if (this.stepIndex % 4 === 1) {
          this.playMusicTone(note * 0.5, 1.55, 'sine', 0.048);
        }
        if (this.worldProfile === 'kenya' && this.stepIndex % 6 === 0) {
          this.playSavannaBirdChirp();
        }
      }
    } else if (this.worldProfile === 'egypt') {
      // Quiet starry desert D-Hijaz nocturne with gentle D3/A3 drone pad
      this.playMusicTone(note, 1.9, 'sine', this.reducedMotion ? 0.028 : 0.044);
      if (idx % 4 === 0) {
        this.playMusicTone(146.83, 2.5, 'triangle', 0.024);
      } else if (idx % 4 === 2) {
        this.playMusicTone(220.0, 2.1, 'sine', 0.016);
      }
    } else {
      this.playMusicTone(note, 1.85, 'sine', this.reducedMotion ? 0.03 : 0.048);
      if (this.stepIndex % 4 === 1) {
        this.playMusicTone(note * 0.5, 2.4, 'sine', 0.036);
      }
    }
  }

  public setDialogueDucking(ducked: boolean): void {
    this.isDialogueDucked = ducked;
    if (!this.isMusicPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.musicGain) {
      this.musicGain.gain.setTargetAtTime(this.getTargetMusicGain(), now, 0.25);
    }
    if (this.droneGain) {
      this.droneGain.gain.setTargetAtTime(this.getTargetScotlandDroneGain(), now, 0.25);
    }
  }

  public setEnvironmentProfile(profile: WorldAudioProfile): void {
    const profileChanged = this.worldProfile !== profile;
    this.worldProfile = profile;
    if (!this.isMusicPlaying || !this.ctx) return;

    if (profileChanged) {
      if (profile === 'scotland') {
        this.startScotlandDroneLayer(this.ctx);
      } else {
        this.stopScotlandDroneLayer();
      }
    }

    if (this.ambienceFilter) {
      this.ambienceFilter.frequency.setTargetAtTime(
        this.getTargetAmbienceFilterFreq(),
        this.ctx.currentTime,
        0.5,
      );
    }
    if (this.ambienceGain) {
      this.ambienceGain.gain.setTargetAtTime(
        this.getTargetAmbienceGain(),
        this.ctx.currentTime,
        0.5,
      );
    }

    if (profileChanged) {
      this.stepIndex = 0;
      if (this.schedulerId !== null) {
        window.clearInterval(this.schedulerId);
      }
      this.schedulerId = window.setInterval(() => {
        this.scheduleNextStep();
      }, this.getStepIntervalMs());
    }
  }

  public startMusic(theme: ResolvedAppearance, reducedMotion: boolean): boolean {
    const ctx = this.ensureContext();
    if (!ctx || !this.musicGain || !this.ambienceGain) return false;

    const wasPlaying = this.isMusicPlaying;
    this.currentTheme = theme;
    this.reducedMotion = reducedMotion;
    this.isMusicPlaying = true;
    if (!wasPlaying) {
      this.stepIndex = 0;
    }

    this.startAmbienceLayer(ctx);
    if (this.worldProfile === 'scotland') {
      this.startScotlandDroneLayer(ctx);
    } else {
      this.stopScotlandDroneLayer();
    }

    const now = ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setTargetAtTime(this.getTargetMusicGain(), now, 0.35);

    this.ambienceGain.gain.cancelScheduledValues(now);
    this.ambienceGain.gain.setTargetAtTime(this.getTargetAmbienceGain(), now, 0.45);

    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
    }

    const intervalMs = this.getStepIntervalMs();
    this.scheduleNextStep();
    this.schedulerId = window.setInterval(() => {
      this.scheduleNextStep();
    }, intervalMs);

    return true;
  }

  public updateAtmosphere(theme: ResolvedAppearance, reducedMotion: boolean): void {
    const prevTheme = this.currentTheme;
    const prevReduced = this.reducedMotion;
    this.currentTheme = theme;
    this.reducedMotion = reducedMotion;

    if (!this.isMusicPlaying || !this.ctx) return;

    if (this.droneFilter) {
      this.droneFilter.frequency.setTargetAtTime(theme === 'day' ? 350 : 250, this.ctx.currentTime, 0.4);
    }
    if (this.droneGain) {
      this.droneGain.gain.setTargetAtTime(this.getTargetScotlandDroneGain(), this.ctx.currentTime, 0.4);
    }

    if (this.ambienceFilter) {
      this.ambienceFilter.frequency.setTargetAtTime(
        this.getTargetAmbienceFilterFreq(),
        this.ctx.currentTime,
        0.5,
      );
    }
    if (this.ambienceGain) {
      this.ambienceGain.gain.setTargetAtTime(
        this.getTargetAmbienceGain(),
        this.ctx.currentTime,
        0.5,
      );
    }

    if (prevTheme !== theme || prevReduced !== reducedMotion) {
      if (this.schedulerId !== null) {
        window.clearInterval(this.schedulerId);
      }
      this.schedulerId = window.setInterval(() => {
        this.scheduleNextStep();
      }, this.getStepIntervalMs());
    }
  }

  public stopMusic(): void {
    this.isMusicPlaying = false;
    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
    if (this.ctx && this.musicGain && this.ambienceGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setTargetAtTime(0.0, now, 0.15);
      this.ambienceGain.gain.cancelScheduledValues(now);
      this.ambienceGain.gain.setTargetAtTime(0.0, now, 0.15);
    }
    this.stopScotlandDroneLayer();
    this.stopAmbienceLayer();
  }

  public getStateSnapshot() {
    return {
      worldProfile: this.worldProfile,
      isMusicPlaying: this.isMusicPlaying,
      isDialogueDucked: this.isDialogueDucked,
      currentTheme: this.currentTheme,
      reducedMotion: this.reducedMotion,
      contextState: this.ctx?.state ?? 'uninitialized',
      hasScheduler: this.schedulerId !== null,
      hasAmbienceSource: this.ambienceSource !== null,
      hasScotlandDrone: this.droneOscLow !== null,
      targetAmbienceFilterFreq: this.getTargetAmbienceFilterFreq(),
      targetAmbienceGain: this.getTargetAmbienceGain(),
      stepIntervalMs: this.getStepIntervalMs(),
    };
  }

  private playEnvelopeNote(
    ctx: AudioContext,
    freq: number,
    startOffset: number,
    duration: number,
    type: OscillatorType,
    peak: number,
  ) {
    if (!this.masterGain) return;
    const start = ctx.currentTime + startOffset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  public playSfx(kind: SfxKind, enabled: boolean, theme: ResolvedAppearance): void {
    if (!enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    if (kind === 'mode') {
      this.playEnvelopeNote(ctx, theme === 'day' ? 523.25 : 392.0, 0, 0.16, 'sine', 0.07);
      this.playEnvelopeNote(ctx, theme === 'day' ? 659.25 : 493.88, 0.07, 0.2, 'sine', 0.07);
      return;
    }

    if (kind === 'select') {
      this.playEnvelopeNote(ctx, theme === 'day' ? 587.33 : 493.88, 0, 0.16, 'triangle', 0.075);
      return;
    }

    if (kind === 'complete') {
      this.playEnvelopeNote(ctx, 523.25, 0, 0.14, 'triangle', 0.08);
      this.playEnvelopeNote(ctx, 659.25, 0.09, 0.16, 'triangle', 0.08);
      this.playEnvelopeNote(ctx, 783.99, 0.18, 0.28, 'sine', 0.09);
      return;
    }

    if (kind === 'reward') {
      this.playEnvelopeNote(ctx, 659.25, 0, 0.12, 'sine', 0.075);
      this.playEnvelopeNote(ctx, 880.0, 0.08, 0.22, 'sine', 0.08);
      return;
    }

    // Default button click
    this.playEnvelopeNote(ctx, 480, 0, 0.08, 'sine', 0.05);
  }

  /**
   * Original synthesized Scottish instrument audio cues for Highland Games discovery (zero copyrighted audio).
   */
  public playScotlandInstrumentCue(kind: 'bagpipe' | 'fiddle' | 'bodhran'): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;

    if (kind === 'bagpipe') {
      // Warm continuous Highland drone + bright chanter motif (no harsh clipping)
      const drone = ctx.createOscillator();
      const fifthDrone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      const droneFilter = ctx.createBiquadFilter();

      drone.type = 'sawtooth';
      drone.frequency.setValueAtTime(146.83, now); // D3
      fifthDrone.type = 'sawtooth';
      fifthDrone.frequency.setValueAtTime(220.0, now); // A3

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(620, now);

      droneGain.gain.setValueAtTime(0.0001, now);
      droneGain.gain.linearRampToValueAtTime(0.05, now + 0.14);
      droneGain.gain.setValueAtTime(0.048, now + 1.15);
      droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.48);

      drone.connect(droneFilter);
      fifthDrone.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(this.masterGain);

      drone.start(now);
      fifthDrone.start(now);
      drone.stop(now + 1.52);
      fifthDrone.stop(now + 1.52);

      // Chanter reel phrase (D4 -> E4 -> F#4 -> A4 -> F#4 -> D4)
      const chanterNotes = [
        { freq: 587.33, offset: 0.12, dur: 0.2 },
        { freq: 659.25, offset: 0.34, dur: 0.18 },
        { freq: 739.99, offset: 0.54, dur: 0.22 },
        { freq: 880.0, offset: 0.78, dur: 0.24 },
        { freq: 739.99, offset: 1.04, dur: 0.18 },
        { freq: 587.33, offset: 1.24, dur: 0.24 },
      ];
      for (const n of chanterNotes) {
        this.playEnvelopeNote(ctx, n.freq, n.offset, n.dur, 'triangle', 0.065);
      }
      return;
    }

    if (kind === 'fiddle') {
      // Lively Highland fiddle triplet lilt
      const notes = [
        { freq: 440.0, offset: 0.0, dur: 0.13 },
        { freq: 493.88, offset: 0.14, dur: 0.13 },
        { freq: 587.33, offset: 0.28, dur: 0.16 },
        { freq: 659.25, offset: 0.45, dur: 0.13 },
        { freq: 587.33, offset: 0.59, dur: 0.13 },
        { freq: 739.99, offset: 0.73, dur: 0.18 },
        { freq: 880.0, offset: 0.92, dur: 0.28 },
      ];
      for (const n of notes) {
        this.playEnvelopeNote(ctx, n.freq, n.offset, n.dur, 'triangle', 0.085);
      }
      return;
    }

    // Bodhran frame drum: resonant low-tom pulse + brisk off-beat tap pattern
    const beats = [0.0, 0.32, 0.48, 0.8, 1.12, 1.28];
    beats.forEach((offset, idx) => {
      const start = now + offset;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      const accented = idx === 0 || idx === 3;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(accented ? 128 : 156, start);
      osc.frequency.exponentialRampToValueAtTime(accented ? 56 : 74, start + 0.14);

      env.gain.setValueAtTime(0.0001, start);
      env.gain.linearRampToValueAtTime(accented ? 0.18 : 0.11, start + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0001, start + 0.17);

      osc.connect(env);
      env.connect(this.masterGain!);
      osc.start(start);
      osc.stop(start + 0.2);
    });
  }

  public dispose(): void {
    this.stopMusic();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}

export const voxAudio = new VoxAudioEngine();
