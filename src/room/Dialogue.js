/**
 * SPEECH BUBBLES — small paper notes anchored to a point on the stage.
 * They counter-scale (via --s) so text stays readable at any zoom.
 * Every line is mirrored to an aria-live region for screen readers.
 */
import { ANCHORS } from '../config/objects.js';
import { el } from '../core/dom.js';

export class Dialogue {
  constructor(layer, liveRegion) {
    this.layer = layer;
    this.live = liveRegion;
    this.active = new Map();
  }

  say(text, anchorKey = 'character', { duration = 2600, speaker } = {}) {
    const a = typeof anchorKey === 'object' ? anchorKey : ANCHORS[anchorKey] || ANCHORS.character;
    if (typeof anchorKey === 'object') anchorKey = 'custom';
    const prev = this.active.get(anchorKey);
    if (prev) { clearTimeout(prev.timer); prev.node.remove(); }

    const flip = a.x > 1300 ? 'is-left' : a.x < 300 ? 'is-right' : '';
    const node = el('div', { class: `bubble ${flip} bubble--${speaker || anchorKey}` });
    node.style.left = a.x + 'px';
    node.style.top = a.y + 'px';
    node.innerHTML = `<span class="bubble__inner"></span>`;
    node.firstChild.textContent = text;
    this.layer.appendChild(node);
    requestAnimationFrame(() => node.classList.add('is-in'));

    const timer = setTimeout(() => {
      node.classList.remove('is-in');
      node.classList.add('is-out');
      setTimeout(() => node.remove(), 400);
      this.active.delete(anchorKey);
    }, duration);
    this.active.set(anchorKey, { node, timer });

    if (this.live) {
      this.live.textContent = '';
      setTimeout(() => { this.live.textContent = text; }, 30);
    }
  }
}
