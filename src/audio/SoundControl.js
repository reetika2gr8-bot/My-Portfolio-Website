/**
 * Discreet global sound control (bottom-left): master mute, music volume,
 * weather sound on/off + volume. Always reachable, independent of the room.
 */
import { el } from '../core/dom.js';
import { ICONS } from '../ui/icons.js';
import { bus } from '../core/events.js';

export class SoundControl {
  constructor(root, audio, openPlayer) {
    this.audio = audio;
    this.wrap = el('div', { class: 'sound' });
    this.btn = el('button', { type: 'button', class: 'sound__btn', 'aria-expanded': 'false', 'aria-controls': 'sound-panel' });
    this.panel = el('div', { class: 'sound__panel', id: 'sound-panel', hidden: true, role: 'group', 'aria-label': 'Sound settings' });
    this.panel.innerHTML = `
      <p class="sound__title">sound</p>
      <button type="button" class="sound__row" data-do="music">music</button>
      <label class="slider"><span>music volume</span><input type="range" min="0" max="1" step="0.01" data-vol="music"></label>
      <button type="button" class="sound__row" data-do="ambient">weather sounds</button>
      <label class="slider"><span>weather volume</span><input type="range" min="0" max="1" step="0.01" data-vol="ambient"></label>
      <button type="button" class="sound__row" data-do="mute">mute everything</button>
      <button type="button" class="sound__link" data-do="player">open the cassette player</button>`;
    this.wrap.append(this.panel, this.btn);
    root.appendChild(this.wrap);

    this.btn.addEventListener('click', () => this.setOpen(this.panel.hidden));
    this.panel.addEventListener('click', (e) => {
      const d = e.target.closest('[data-do]')?.dataset.do;
      const a = this.audio;
      if (d === 'music') a.toggle();
      if (d === 'ambient') a.setAmbientEnabled(!a.ambientEnabled);
      if (d === 'mute') a.setMuted(!a.muted);
      if (d === 'player') { this.setOpen(false); openPlayer(); }
    });
    this.panel.querySelector('[data-vol="music"]').addEventListener('input', (e) => audio.setMusicVolume(+e.target.value));
    this.panel.querySelector('[data-vol="ambient"]').addEventListener('input', (e) => audio.setAmbientVolume(+e.target.value));
    document.addEventListener('pointerdown', (e) => { if (!this.wrap.contains(e.target)) this.setOpen(false); });
    this.wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !this.panel.hidden) { this.setOpen(false); this.btn.focus(); } });
    bus.on('audio:changed', () => this.sync());
    this.sync();
  }

  setOpen(open) {
    this.panel.hidden = !open;
    this.btn.setAttribute('aria-expanded', open);
  }

  sync() {
    const a = this.audio;
    const anyOn = !a.muted && (a.playing || a.ambientEnabled);
    this.btn.innerHTML = `${anyOn ? ICONS.soundOn : ICONS.soundOff}<span class="sr-only">Sound settings</span>`;
    this.btn.classList.toggle('is-on', anyOn);
    const row = (k, on, txt) => {
      const b = this.panel.querySelector(`[data-do="${k}"]`);
      b.setAttribute('aria-pressed', on);
      b.innerHTML = `<span class="tick" aria-hidden="true">${on ? '●' : '○'}</span> ${txt}`;
    };
    row('music', a.playing, a.playing ? 'music playing' : 'music off');
    row('ambient', a.ambientEnabled, a.ambientEnabled ? 'weather sounds on' : 'weather sounds off');
    row('mute', a.muted, a.muted ? 'everything muted' : 'mute everything');
    this.panel.querySelector('[data-vol="music"]').value = a.musicVolume;
    this.panel.querySelector('[data-vol="ambient"]').value = a.ambientVolume;
  }
}
