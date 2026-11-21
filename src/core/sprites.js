/**
 * Generic frame-by-frame sprite renderer for painted character / cat artwork.
 * Used only when ASSETS.character.sprites / ASSETS.cat.sprites is configured.
 * If the first frame can't load, `ready` resolves false and the SVG placeholder stays.
 */
import { assetUrl } from './dom.js';
import { probeImage } from './assetLoader.js';
import { motion } from './motion.js';

export class SpriteRenderer {
  constructor(layer, cfg, className) {
    this.cfg = cfg;
    this.img = document.createElement('img');
    this.img.alt = '';
    this.img.className = `sprite ${className}`;
    Object.assign(this.img.style, {
      position: 'absolute', left: cfg.box.x + 'px', top: cfg.box.y + 'px',
      width: cfg.box.w + 'px', height: cfg.box.h + 'px', pointerEvents: 'none',
    });
    this.timer = 0;
    const first = cfg.states?.working?.frames?.[0] || cfg.states?.sleeping?.frames?.[0];
    this.ready = probeImage(assetUrl(first)).then((ok) => {
      if (ok) {
        layer.appendChild(this.img);
        // preload everything else
        Object.values(cfg.states || {}).forEach((s) => s.frames?.forEach((f) => { new Image().src = assetUrl(f); }));
        Object.values(cfg.expressions || {}).forEach((f) => { new Image().src = assetUrl(f); });
      }
      return ok;
    });
  }

  show(state, { expr } = {}) {
    clearInterval(this.timer);
    let frames;
    let fps = 6;
    if (state === 'reacting' && this.cfg.expressions?.[expr]) frames = [this.cfg.expressions[expr]];
    else {
      const s = this.cfg.states?.[state] || this.cfg.states?.working || this.cfg.states?.sleeping;
      frames = s?.frames || [];
      fps = s?.fps || 6;
    }
    if (!frames.length) return;
    let i = 0;
    this.img.src = assetUrl(frames[0]);
    if (frames.length > 1 && !motion.reduced) {
      this.timer = setInterval(() => { i = (i + 1) % frames.length; this.img.src = assetUrl(frames[i]); }, 1000 / fps);
    }
  }
}
