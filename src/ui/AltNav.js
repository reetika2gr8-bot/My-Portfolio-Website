/**
 * Accessible fallback navigation — a small "room guide" tab in the corner.
 * Lists every destination as plain links so nothing is hidden behind the room.
 * The page's first focusable element is a skip link that opens it.
 */
import { el } from '../core/dom.js';
import { ICONS } from './icons.js';
import { OBJECTS } from '../config/objects.js';

export class AltNav {
  constructor(root, { onAmbience, onMusic }) {
    this.wrap = el('nav', { class: 'guide', 'aria-label': 'Room guide' });
    this.btn = el('button', { type: 'button', class: 'guide__btn', 'aria-expanded': 'false', 'aria-controls': 'guide-list' }, `${ICONS.menu}<span>room guide</span>`);
    this.list = el('div', { class: 'guide__list', id: 'guide-list', hidden: true });
    const labels = { projects: 'Projects', process: 'Design process', about: 'About me', resume: 'Resume', contact: 'Contact' };
    const where = { projects: 'the computer', process: 'the sketchbook', about: 'the pinboard', resume: 'the bookshelf', contact: 'the door' };
    const navs = OBJECTS.filter((o) => o.nav).map((o) => o.action.split(':')[1]);
    this.list.innerHTML = `
      <p class="guide__title">around the room</p>
      <ul>${navs.map((s) => `<li><a href="#/${s}"><b>${labels[s]}</b><span>${where[s]}</span></a></li>`).join('')}</ul>
      <ul class="guide__extra">
        <li><button type="button" data-g="ambience"><b>Change the weather</b><span>the window</span></button></li>
        <li><button type="button" data-g="music"><b>Music</b><span>the radio</span></button></li>
      </ul>`;
    this.wrap.append(this.btn, this.list);
    root.appendChild(this.wrap);

    this.btn.addEventListener('click', () => this.setOpen(this.list.hidden));
    this.list.addEventListener('click', (e) => {
      const g = e.target.closest('[data-g]')?.dataset.g;
      if (e.target.closest('a') || g) this.setOpen(false);
      if (g === 'ambience') onAmbience();
      if (g === 'music') onMusic();
    });
    document.addEventListener('pointerdown', (e) => { if (!this.wrap.contains(e.target)) this.setOpen(false); });
    this.wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !this.list.hidden) { this.setOpen(false); this.btn.focus(); } });

    const skip = el('a', { class: 'skip-link', href: '#guide-list' }, 'Skip the room — open the text menu');
    skip.addEventListener('click', (e) => { e.preventDefault(); this.setOpen(true); this.list.querySelector('a')?.focus(); });
    document.body.prepend(skip);
  }

  setOpen(open) {
    this.list.hidden = !open;
    this.btn.setAttribute('aria-expanded', open);
  }
}
