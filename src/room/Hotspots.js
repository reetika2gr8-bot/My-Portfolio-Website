/**
 * HOTSPOTS — real <button>s laid over the painting (keyboard + screen-reader friendly).
 * Generated from src/config/objects.js. Hovering shows a warm highlight + handwritten tag.
 */
import { OBJECTS } from '../config/objects.js';
import { el } from '../core/dom.js';

export function buildHotspots({ mid, front }, onAction) {
  const map = {};
  for (const o of OBJECTS) {
    const b = el('button', {
      type: 'button',
      class: `hotspot hotspot--${o.shape} ${o.quiet ? 'hotspot--quiet' : ''}`,
      'aria-label': o.a11y,
      'data-id': o.id,
      'data-action': o.action,
    });
    Object.assign(b.style, { left: o.x + 'px', top: o.y + 'px', width: o.w + 'px', height: o.h + 'px' });
    if (o.label) b.innerHTML = `<span class="hotspot__tag" aria-hidden="true">${o.label}</span>`;
    b.addEventListener('click', (e) => {
      b.classList.remove('is-pressed'); void b.offsetWidth; b.classList.add('is-pressed', 'tag-off');
      onAction(o.action, o, b, e);
    });
    b.addEventListener('pointerleave', () => b.classList.remove('tag-off'));
    b.addEventListener('blur', () => b.classList.remove('tag-off'));
    (o.layer === 'front' ? front : mid).appendChild(b);
    map[o.id] = b;
  }
  return map;
}
