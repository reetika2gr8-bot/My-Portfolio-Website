/**
 * Applies an ambience preset (src/config/ambiences.js) to every system:
 * sky cross-fade, lighting rig, weather particles, curtain wind, environmental
 * audio and a small character reaction. Nothing else hardcodes ambience logic.
 */
import { AMBIENCES, getAmbience } from '../config/ambiences.js';
import { DIALOGUE } from '../config/dialogue.js';
import { bus } from '../core/events.js';
import { prefs } from '../core/prefs.js';
import { motion } from '../core/motion.js';

export class AmbienceManager {
  constructor({ room, refs, weather, audio, character }) {
    this.room = room;
    this.refs = refs;
    this.weather = weather;
    this.audio = audio;
    this.character = character;
    this.current = null;
    this.committed = null;
    this.lampOn = true;
    const L = refs.lighting;
    this.lt = {
      tint: L.querySelector('.lt-tint'), haze: L.querySelector('.lt-haze'),
      lamp: L.querySelector('.lt-lamp'), monitor: L.querySelector('.lt-monitor'),
      sun: L.querySelector('.lt-sun'), moon: L.querySelector('.lt-moon'),
      vignette: L.querySelector('.lt-vignette'),
    };
  }

  get list() { return AMBIENCES; }

  /**
   * @param {string} id
   * @param {{preview?:boolean, instant?:boolean, quiet?:boolean}} opts
   *   preview: quick, temporary (hovering the selector) — no audio / reactions / saving
   */
  apply(id, { preview = false, instant = false, quiet = false } = {}) {
    const a = getAmbience(id);
    const ms = instant || motion.reduced ? 0 : preview ? 700 : a.transitionMs;
    this.room.style.setProperty('--amb-t', ms + 'ms');
    this.current = a;
    document.documentElement.dataset.ambience = a.id;

    // sky cross-fade
    for (const [sky, img] of Object.entries(this.refs.skies)) img.classList.toggle('is-active', sky === a.sky);

    this.applyLighting(a.lighting);
    this.weather.configure(a.weather, a.curtains?.amplitude || 1);
    this.refs.curtains.style.setProperty('--amp', a.curtains?.amplitude ?? 1.5);

    if (preview) return;
    this.committed = a.id;
    prefs.set('ambience', a.id);
    this.audio?.setAmbient(a.audio?.ambient);
    if (!quiet) this.character?.onAmbience(a.character, DIALOGUE.ambience[a.id]);
    else this.character && (this.character.sleepyChance = a.character?.sleepyChance || 0);
    bus.emit('ambience:changed', a);
  }

  /** Revert a hover-preview back to the committed ambience. */
  endPreview() {
    if (this.committed && this.current?.id !== this.committed) this.apply(this.committed, { preview: true });
  }

  applyLighting(l) {
    const { tint, haze, lamp, monitor, sun, moon, vignette } = this.lt;
    tint.style.fill = l.tint; tint.style.opacity = l.tintOpacity + (this.lampOn ? 0 : 0.16);
    haze.style.fill = l.haze; haze.style.opacity = l.hazeOpacity;
    lamp.style.opacity = this.lampOn ? l.lamp : 0;
    lamp.classList.toggle('is-flicker', !!l.lampFlicker && this.lampOn);
    monitor.style.opacity = l.monitor;
    sun.style.opacity = l.sunBeams;
    moon.style.opacity = l.moonBeams;
    vignette.style.opacity = l.vignette;
    this.refs.wallStars.style.opacity = Math.max(l.wallStars, this.lampOn ? 0 : 0.6);
    this.room.classList.toggle('is-lamp-off', !this.lampOn);
  }

  setLamp(on) {
    this.lampOn = on;
    this.room.style.setProperty('--amb-t', motion.reduced ? '0ms' : '350ms');
    this.applyLighting(this.current.lighting);
  }
}
