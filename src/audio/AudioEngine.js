/**
 * AUDIO ENGINE
 *  master ─┬─ music bus   (tracks: file → <audio>, or procedural placeholder)
 *          └─ ambient bus (weather loops: file or procedural placeholder)
 * Rules: never autoplays (the AudioContext is only created on a user gesture),
 * music and ambience are independent, master mute, pauses when the tab is hidden,
 * missing files fall back silently.
 */
import { MUSIC_TRACKS, AMBIENT_SOUNDS, AUDIO_DEFAULTS } from '../config/audio.js';
import { MUSIC_SYNTHS, AMBIENT_SYNTHS } from './synths.js';
import { assetUrl } from '../core/dom.js';
import { prefs } from '../core/prefs.js';
import { bus } from '../core/events.js';

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.tracks = MUSIC_TRACKS;
    this.index = 0;
    this.playing = false;
    this.music = null;          // { stop() , el? }
    this.ambient = null;
    this.ambientId = null;
    this.ambientEnabled = false; // never on by default
    this.musicVolume = prefs.get('musicVolume', AUDIO_DEFAULTS.musicVolume);
    this.ambientVolume = prefs.get('ambientVolume', AUDIO_DEFAULTS.ambientVolume);
    this.muted = prefs.get('muted', AUDIO_DEFAULTS.masterMuted);
    this.wasRunning = false;
    document.addEventListener('visibilitychange', () => this.onVisibility());
  }

  /** Must be called from a user gesture. */
  ensure() {
    if (this.ctx) { if (this.ctx.state === 'suspended' && !document.hidden) this.ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.musicBus = this.ctx.createGain();
    this.ambientBus = this.ctx.createGain();
    this.musicBus.connect(this.master); this.ambientBus.connect(this.master); this.master.connect(this.ctx.destination);
    this.applyVolumes(true);
    return true;
  }

  applyVolumes(instant) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime, k = instant ? 0.001 : 0.08;
    this.master.gain.setTargetAtTime(this.muted ? 0 : 1, t, k);
    this.musicBus.gain.setTargetAtTime(this.musicVolume * (this.tracks[this.index]?.volume ?? 1), t, k);
    this.ambientBus.gain.setTargetAtTime(this.ambientVolume, t, k);
  }

  setMusicVolume(v) { this.musicVolume = v; prefs.set('musicVolume', v); this.applyVolumes(); this.emit(); }
  setAmbientVolume(v) { this.ambientVolume = v; prefs.set('ambientVolume', v); this.applyVolumes(); this.emit(); }
  setMuted(m) { this.muted = m; prefs.set('muted', m); this.applyVolumes(); this.emit(); }

  /* ---------- music ---------- */
  get track() { return this.tracks[this.index]; }

  play() {
    if (!this.ensure()) return;
    this.playing = true;
    if (this.muted) this.setMuted(false);
    this.startTrack();
    this.emit();
  }
  pause() { this.playing = false; this.stopMusic(); this.emit(); }
  toggle() { this.playing ? this.pause() : this.play(); }
  next() { this.index = (this.index + 1) % this.tracks.length; this.restartIfPlaying(); }
  prev() { this.index = (this.index - 1 + this.tracks.length) % this.tracks.length; this.restartIfPlaying(); }
  restartIfPlaying() { this.applyVolumes(); if (this.playing) this.startTrack(); this.emit(); }

  stopMusic() {
    const m = this.music; this.music = null;
    if (!m) return;
    if (m.el) {
      const el = m.el, g = m.gain;
      g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      setTimeout(() => { el.pause(); el.src = ''; g.disconnect(); }, 600);
    } else m.stop(0.6);
  }

  startTrack() {
    this.stopMusic();
    const tr = this.track;
    const token = Symbol('track');
    this.musicToken = token;
    const useSynth = () => {
      if (this.musicToken !== token || !this.playing) return;
      const f = MUSIC_SYNTHS[tr.synth] || MUSIC_SYNTHS.lofi;
      const s = f(this.ctx); s.output.connect(this.musicBus); this.music = s;
    };
    const url = assetUrl(tr.src);
    if (!url) return useSynth();
    const el = new Audio();
    el.loop = tr.loop !== false; el.preload = 'auto'; el.crossOrigin = 'anonymous';
    const gain = this.ctx.createGain(); gain.gain.value = 1;
    let settled = false;
    el.addEventListener('error', () => { if (!settled) { settled = true; gain.disconnect(); useSynth(); } }, { once: true });
    el.src = url;
    try { this.ctx.createMediaElementSource(el).connect(gain); gain.connect(this.musicBus); } catch { /* ignore */ }
    el.play().then(() => { settled = true; if (this.musicToken === token) this.music = { el, gain }; else el.pause(); })
      .catch(() => { if (!settled) { settled = true; gain.disconnect(); useSynth(); } });
  }

  /* ---------- ambience ---------- */
  setAmbientEnabled(on) {
    if (on && !this.ensure()) return;
    this.ambientEnabled = on;
    if (on && this.muted) this.setMuted(false);
    if (on) this.startAmbient(this.ambientId); else this.stopAmbient();
    this.emit();
  }

  setAmbient(id) {
    if (id === this.ambientId) return;
    this.ambientId = id;
    if (this.ambientEnabled && this.ctx) this.startAmbient(id);
  }

  stopAmbient() {
    const a = this.ambient; this.ambient = null;
    if (!a) return;
    if (a.el) { a.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4); setTimeout(() => { a.el.pause(); a.el.src = ''; }, 1800); }
    else a.stop(AUDIO_DEFAULTS.ambientFade / 1000);
  }

  startAmbient(id) {
    this.stopAmbient();
    const def = AMBIENT_SOUNDS[id];
    if (!def || !this.ctx) return;
    const token = Symbol('amb'); this.ambToken = token;
    const vol = def.volume ?? 1;
    const useSynth = () => {
      if (this.ambToken !== token || !this.ambientEnabled) return;
      const s = (AMBIENT_SYNTHS[def.synth] || AMBIENT_SYNTHS.rain)(this.ctx);
      const g = this.ctx.createGain(); g.gain.value = vol; s.output.connect(g); g.connect(this.ambientBus);
      this.ambient = s;
    };
    const url = assetUrl(def.src);
    if (!url) return useSynth();
    const el = new Audio(); el.loop = true; el.crossOrigin = 'anonymous';
    const gain = this.ctx.createGain(); gain.gain.value = 0;
    let settled = false;
    el.addEventListener('error', () => { if (!settled) { settled = true; useSynth(); } }, { once: true });
    el.src = url;
    try { this.ctx.createMediaElementSource(el).connect(gain); gain.connect(this.ambientBus); } catch {}
    el.play().then(() => {
      settled = true;
      if (this.ambToken !== token) return el.pause();
      gain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.6);
      this.ambient = { el, gain };
    }).catch(() => { if (!settled) { settled = true; useSynth(); } });
  }

  /* ---------- lifecycle ---------- */
  onVisibility() {
    if (!this.ctx) return;
    if (document.hidden) {
      this.wasRunning = this.ctx.state === 'running';
      this.music?.el?.pause(); this.ambient?.el?.pause();
      this.ctx.suspend();
    } else if (this.wasRunning) {
      this.ctx.resume();
      this.music?.el?.play().catch(() => {}); this.ambient?.el?.play().catch(() => {});
    }
  }

  emit() { bus.emit('audio:changed', this); }
}
