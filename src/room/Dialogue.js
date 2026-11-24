/**
 * SPEECH BUBBLES — small paper notes anchored to a point on the stage.
 * They counter-scale (via --s) so text stays readable at any zoom.
 * Every line is mirrored to an aria-live region for screen readers.
 */
import { ANCHORS } from '../config/objects.js';
import { el } from '../core/dom.js';
import { motion } from '../core/motion.js';

export class Dialogue {
  constructor(layer, liveRegion) {
    this.layer = layer;
    this.live = liveRegion;
    this.active = new Map();
  }

  say(text, anchorKey = 'character', { duration = 2600, speaker, label, typewriter } = {}) {
    const a = typeof anchorKey === 'object' ? anchorKey : ANCHORS[anchorKey] || ANCHORS.character;
    if (typeof anchorKey === 'object') anchorKey = 'custom';
    const prev = this.active.get(anchorKey);
    if (prev) { clearTimeout(prev.timer); prev.node._stopTyping?.(); prev.node.remove(); }

    const flip = a.x > 1300 ? 'is-left' : a.x < 300 ? 'is-right' : '';
    const node = el('div', { class: `bubble ${flip} bubble--${speaker || anchorKey}` });
    node.style.left = a.x + 'px';
    node.style.top = a.y + 'px';
    node.innerHTML = `<span class="bubble__inner">${label ? '<b class="bubble__label"></b>' : ''}<span class="bubble__text"></span></span>`;
    if (label) node.querySelector('.bubble__label').textContent = label;
    const textEl = node.querySelector('.bubble__text');
    if (typewriter && !motion.reduced) {
      // reserve the final size first so the bubble doesn't grow while typing
      textEl.innerHTML = `<span class="bubble__typed"></span><span class="bubble__ghost"></span>`;
      textEl.lastChild.textContent = text;
      let i = 0;
      const tick = () => {
        i = Math.min(text.length, i + 1);
        textEl.firstChild.textContent = text.slice(0, i);
        textEl.lastChild.textContent = text.slice(i);
        if (i < text.length) typing = setTimeout(tick, /[.!,]/.test(text[i - 1]) ? 150 : 34);
      };
      let typing = setTimeout(tick, 160);
      node._stopTyping = () => clearTimeout(typing);
    } else textEl.textContent = text;
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
      setTimeout(() => { this.live.textContent = label ? `${label}: ${text}` : text; }, 30);
    }
  }
}
