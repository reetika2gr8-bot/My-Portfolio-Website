/**
 * Small in-room popup (paper note / cassette card) anchored to a stage point.
 * Counter-scaled so it stays a readable size, nudged to stay on screen,
 * closes on Esc / outside click, and returns focus to whatever opened it.
 */
import { el } from '../core/dom.js';
import { ICONS } from './icons.js';
import { bus } from '../core/events.js';

let current = null;

export class Popup {
  constructor(layer, { className = '', anchor, label, revealX, stage }) {
    this.anchor = anchor;
    this.revealX = revealX ?? anchor.x;
    this.stage = stage;
    this.el = el('div', { class: `popup ${className}`, role: 'dialog', 'aria-label': label, hidden: true });
    this.el.style.left = anchor.x + 'px';
    this.el.style.top = anchor.y + 'px';
    const close = el('button', { type: 'button', class: 'popup__close', 'aria-label': 'Close' }, ICONS.close);
    close.addEventListener('click', () => this.close());
    this.body = el('div', { class: 'popup__body' });
    this.el.append(close, this.body);
    layer.appendChild(this.el);
    this.onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); this.close(); } };
    this.onDown = (e) => {
      if (this.el.contains(e.target) || e.target.closest?.(`[data-opens="${this.el.className}"]`)) return;
      if (e.target.closest?.('.hotspot')?.dataset.action === this.toggleAction) return;
      this.close(false);
    };
    bus.on('stage:resize', () => this.isOpen && this.keepInView());
  }

  get isOpen() { return !this.el.hidden; }

  open() {
    if (current && current !== this) current.close(false);
    current = this;
    this.returnFocus = document.activeElement;
    this.stage?.reveal(this.revealX);
    this.el.hidden = false;
    this.el.style.setProperty('--dx', '0px');
    this.el.style.setProperty('--dy', '0px');
    requestAnimationFrame(() => { this.keepInView(); this.el.classList.add('is-open'); });
    document.addEventListener('keydown', this.onKey, true);
    setTimeout(() => document.addEventListener('pointerdown', this.onDown, true), 0);
  }

  close(restoreFocus = true) {
    if (!this.isOpen) return;
    this.el.classList.remove('is-open');
    this.el.hidden = true;
    if (current === this) current = null;
    document.removeEventListener('keydown', this.onKey, true);
    document.removeEventListener('pointerdown', this.onDown, true);
    if (restoreFocus && this.returnFocus?.focus) this.returnFocus.focus({ preventScroll: true });
    this.onClose?.();
  }

  keepInView() {
    const s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stage-scale')) || 1;
    this.el.style.setProperty('--dx', '0px');
    this.el.style.setProperty('--dy', '0px');
    const r = this.el.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight, m = 12;
    let dx = 0, dy = 0;
    if (r.right > vw - m) dx = vw - m - r.right;
    if (r.left + dx < m) dx = m - r.left;
    if (r.bottom > vh - m) dy = vh - m - r.bottom;
    if (r.top + dy < m) dy = m - r.top;
    this.el.style.setProperty('--dx', dx / s + 'px');
    this.el.style.setProperty('--dy', dy / s + 'px');
  }
}

export const closeAnyPopup = () => current?.close(false);
