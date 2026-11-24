/**
 * ScratchOverlay — reusable hand-drawn claw marks drawn across the viewport.
 *   const s = new ScratchOverlay(); s.swipe({cx, cy, ...}); s.clear();
 * Each swipe = a tight group of tapered, ragged claw slashes revealed progressively
 * (an animated stroke-dash mask). Each slash has a dark rim + light core so it reads
 * on both dark and light areas.
 * pointer-events: none — it never blocks the page. Removing it leaves no trace.
 */
import { motion } from '../core/motion.js';

const NS = 'http://www.w3.org/2000/svg';

export class ScratchOverlay {
  constructor(parent = document.body) {
    this.svg = document.createElementNS(NS, 'svg');
    this.svg.setAttribute('class', 'scratch-overlay');
    this.svg.setAttribute('aria-hidden', 'true');
    parent.appendChild(this.svg);
    this.resize();
    this.anims = [];
  }

  resize() {
    this.w = window.innerWidth; this.h = window.innerHeight;
    this.svg.setAttribute('viewBox', `0 0 ${this.w} ${this.h}`);
  }

  /** Wobbly centre-line points between two points (organic, slightly bowed). */
  static centreline(x0, y0, x1, y1, bow, n = 12) {
    const nx = -(y1 - y0), ny = x1 - x0, len = Math.hypot(nx, ny) || 1;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const off = Math.sin(t * Math.PI) * bow + (i && i < n ? (Math.random() - 0.5) * 2.6 : 0);
      pts.push([x0 + (x1 - x0) * t + (nx / len) * off, y0 + (y1 - y0) * t + (ny / len) * off]);
    }
    return pts;
  }

  /** A tapered, slightly ragged slash polygon around a centre-line (thick middle, sharp ends). */
  static slash(pts, maxW) {
    const left = [], right = [];
    for (let i = 0; i < pts.length; i++) {
      const t = i / (pts.length - 1);
      const [x, y] = pts[i];
      const [ax, ay] = pts[Math.max(0, i - 1)], [bx, by] = pts[Math.min(pts.length - 1, i + 1)];
      const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1;
      const w = maxW * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.7) * (0.8 + Math.random() * 0.4) / 2;
      left.push([x - (dy / l) * w, y + (dx / l) * w]);
      right.push([x + (dy / l) * w, y - (dx / l) * w]);
    }
    const ring = left.concat(right.reverse());
    return 'M' + ring.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L') + ' Z';
  }

  /**
   * One swipe of the paw: a tight group of tapered claw slashes, revealed
   * progressively through an animated mask (so they "draw" in swipe direction).
   * Coordinates in viewport px. Returns ms until fully drawn.
   */
  swipe({ cx, cy, length, angle, claws = 4, gap = 14, drawMs = 120, width = 5.5 }) {
    const id = `sc${Math.random().toString(36).slice(2, 8)}`;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'scratch');
    const mask = document.createElementNS(NS, 'mask');
    mask.setAttribute('id', id);
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('x', 0); mask.setAttribute('y', 0);
    mask.setAttribute('width', this.w); mask.setAttribute('height', this.h);
    const ca = Math.cos(angle), sa = Math.sin(angle), px = -sa, py = ca;
    const bow = (Math.random() < 0.5 ? -1 : 1) * length * 0.05;
    const shapes = document.createElementNS(NS, 'g');
    shapes.setAttribute('mask', `url(#${id})`);
    const reveal = [];
    for (let i = 0; i < claws; i++) {
      const off = (i - (claws - 1) / 2) * gap + (Math.random() - 0.5) * 3;
      const l = length * (0.8 + Math.random() * 0.25) * (i === 0 || i === claws - 1 ? 0.85 : 1);
      const stagger = (Math.random() - 0.5) * 14;
      const sx = cx - (ca * l) / 2 + px * off + ca * stagger;
      const sy = cy - (sa * l) / 2 + py * off + sa * stagger;
      const pts = ScratchOverlay.centreline(sx, sy, sx + ca * l, sy + sa * l, bow);
      const shadow = document.createElementNS(NS, 'path');
      shadow.setAttribute('d', ScratchOverlay.slash(pts, width + 4));
      shadow.setAttribute('class', 'scratch__shadow');
      const core = document.createElementNS(NS, 'path');
      core.setAttribute('d', ScratchOverlay.slash(pts, width));
      core.setAttribute('class', 'scratch__core');
      shapes.append(shadow, core);
      const m = document.createElementNS(NS, 'path');
      m.setAttribute('d', 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L'));
      m.setAttribute('class', 'scratch__reveal');
      mask.appendChild(m);
      reveal.push(m);
    }
    g.append(mask, shapes);
    this.svg.appendChild(g);
    reveal.forEach((m, k) => {
      const L = m.getTotalLength() + 4;
      m.style.strokeDasharray = `${L} ${L}`;
      if (motion.reduced) return;
      this.anims.push(m.animate(
        [{ strokeDashoffset: L }, { strokeDashoffset: 0 }],
        { duration: drawMs, delay: k * 14, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'backwards' },
      ));
    });
    return motion.reduced ? 0 : drawMs + claws * 14;
  }

  fadeOut(ms = 600) {
    const a = this.svg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: motion.reduced ? 1 : ms, fill: 'forwards' });
    this.anims.push(a);
    return a.finished.catch(() => {});
  }

  destroy() {
    this.anims.forEach((a) => a.cancel());
    this.svg.remove();
  }
}
