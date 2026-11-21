/**
 * The ambience selector: a small handwritten note that appears beside the window.
 * Hover / focus previews an ambience, click commits it. Esc or outside click closes.
 */
import { el } from '../core/dom.js';
import { ICONS } from '../ui/icons.js';
import { Popup } from '../ui/Popup.js';

export class AmbienceSelector {
  constructor(layer, manager, audio, stage) {
    this.manager = manager;
    this.audio = audio;
    this.popup = new Popup(layer, {
      className: 'note note--ambience',
      anchor: { x: 404, y: 150 },
      label: 'Change the ambience of the room',
      revealX: 300,
      stage,
    });
    this.popup.toggleAction = 'ambience';
    this.render();
    this.popup.onClose = () => manager.endPreview();
  }

  render() {
    const p = this.popup.body;
    p.innerHTML = `<p class="note__title">the weather today…</p>`;
    const list = el('div', { class: 'amb-list', role: 'radiogroup', 'aria-label': 'Room ambience' });
    let previewTimer = 0;
    for (const a of this.manager.list) {
      const b = el('button', { type: 'button', class: 'amb-option', role: 'radio', 'data-id': a.id, 'aria-checked': 'false' },
        `<span class="amb-option__icon" aria-hidden="true">${ICONS[a.icon] || ''}</span><span class="amb-option__name">${a.name}</span>`);
      const preview = () => { clearTimeout(previewTimer); previewTimer = setTimeout(() => this.manager.apply(a.id, { preview: true }), 220); };
      b.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && preview());
      b.addEventListener('pointerleave', () => { clearTimeout(previewTimer); previewTimer = setTimeout(() => this.manager.endPreview(), 260); });
      b.addEventListener('click', () => { clearTimeout(previewTimer); this.manager.apply(a.id); this.sync(); });
      b.addEventListener('keydown', (e) => {
        if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
        e.preventDefault();
        const all = [...list.children];
        const i = all.indexOf(b) + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1);
        all[(i + all.length) % all.length].focus();
      });
      list.appendChild(b);
    }
    p.appendChild(list);

    this.soundBtn = el('button', { type: 'button', class: 'note__toggle', 'aria-pressed': 'false' });
    this.soundBtn.addEventListener('click', () => { this.audio.setAmbientEnabled(!this.audio.ambientEnabled); this.sync(); });
    p.appendChild(this.soundBtn);
    this.list = list;
    this.sync();
  }

  sync() {
    const cur = this.manager.committed;
    for (const b of this.list.children) {
      const on = b.dataset.id === cur;
      b.setAttribute('aria-checked', on);
      b.tabIndex = on ? 0 : -1;
    }
    const on = this.audio.ambientEnabled;
    this.soundBtn.setAttribute('aria-pressed', on);
    this.soundBtn.innerHTML = `<span aria-hidden="true">${on ? ICONS.soundOn : ICONS.soundOff}</span> sound of the weather: <b>${on ? 'on' : 'off'}</b>`;
  }

  toggle() { this.popup.isOpen ? this.popup.close() : this.open(); }
  open() {
    this.sync();
    this.popup.open();
    const sel = this.list.querySelector('[aria-checked="true"]') || this.list.firstChild;
    setTimeout(() => sel?.focus({ preventScroll: true }), 60);
  }
}
