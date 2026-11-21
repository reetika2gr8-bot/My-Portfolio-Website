/**
 * Cassette-card music player that pops out of the radio on the window sill.
 * Also drives the radio's spinning reels + LED in the room.
 */
import { el, esc } from '../core/dom.js';
import { ICONS } from '../ui/icons.js';
import { Popup } from '../ui/Popup.js';
import { bus } from '../core/events.js';

export class MusicPlayer {
  constructor(layer, audio, radioEl, stage) {
    this.audio = audio;
    this.radio = radioEl;
    this.popup = new Popup(layer, {
      className: 'cassette', anchor: { x: 228, y: 236 }, label: 'Music player', revealX: 340, stage,
    });
    this.popup.toggleAction = 'music';
    this.build();
    bus.on('audio:changed', () => this.sync());
    this.sync();
  }

  build() {
    const b = this.popup.body;
    b.innerHTML = `
      <div class="cassette__tape" aria-hidden="true">
        <div class="cassette__label"><span class="cassette__cat"></span></div>
        <div class="cassette__window"><span class="cassette__reel"></span><span class="cassette__reel"></span></div>
      </div>
      <p class="cassette__title" aria-live="polite"></p>
      <div class="cassette__controls">
        <button type="button" class="ctl" data-do="prev" aria-label="Previous track">${ICONS.prev}</button>
        <button type="button" class="ctl ctl--main" data-do="toggle" aria-label="Play">${ICONS.play}</button>
        <button type="button" class="ctl" data-do="next" aria-label="Next track">${ICONS.next}</button>
        <span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      </div>
      <label class="slider"><span>volume</span><input type="range" min="0" max="1" step="0.01" data-vol="music" aria-label="Music volume"></label>
      <button type="button" class="ctl ctl--text" data-do="mute"></button>
      <p class="cassette__note">placeholder tunes — add your own in <code>src/config/audio.js</code></p>`;
    b.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-do]');
      if (!btn) return;
      const a = this.audio;
      ({ prev: () => a.prev(), next: () => a.next(), toggle: () => a.toggle(), mute: () => a.setMuted(!a.muted) })[btn.dataset.do]?.();
    });
    b.querySelector('[data-vol]').addEventListener('input', (e) => this.audio.setMusicVolume(+e.target.value));
  }

  sync() {
    const a = this.audio, b = this.popup.body, t = a.track;
    b.querySelector('.cassette__title').innerHTML = `<b>${esc(t.title)}</b><span>${esc(t.category)} · ${a.index + 1}/${a.tracks.length}</span>`;
    b.querySelector('.cassette__cat').textContent = t.category;
    const main = b.querySelector('[data-do="toggle"]');
    main.innerHTML = a.playing ? ICONS.pause : ICONS.play;
    main.setAttribute('aria-label', a.playing ? 'Pause' : 'Play');
    b.querySelector('[data-vol]').value = a.musicVolume;
    const mute = b.querySelector('[data-do="mute"]');
    mute.innerHTML = `${a.muted ? ICONS.soundOff : ICONS.soundOn}<span>${a.muted ? 'unmute all' : 'mute all'}</span>`;
    mute.setAttribute('aria-pressed', a.muted);
    const spinning = a.playing && !a.muted;
    this.popup.el.classList.toggle('is-playing', spinning);
    this.radio?.classList.toggle('is-playing', spinning);
  }

  toggle() { this.popup.isOpen ? this.popup.close() : this.popup.open(); }
}
