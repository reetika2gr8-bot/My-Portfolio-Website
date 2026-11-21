/**
 * WEATHER & PARTICLES — two small canvases sharing one ticker:
 *   window canvas (only the glass area, 262×356 stage px): rain, glass droplets,
 *                 leaves, stars, birds
 *   room canvas  (full stage): floating dust motes / dreamy sparkles
 * Each system eases its intensity toward the active ambience, so switching
 * weather cross-fades instead of popping. Cheap: < 250 particles total.
 */
import { ticker } from '../core/ticker.js';
import { motion } from '../core/motion.js';
import { bus } from '../core/events.js';
import { seeded } from '../core/dom.js';

export const GLASS = { x: 134, y: 144, w: 262, h: 356 };
const MAX_RAIN = 220, MAX_LEAVES = 30, MAX_STARS = 130, MAX_MOTES = 40;

const ease = (cur, target, dt, speed = 0.7) => cur + (target - cur) * Math.min(1, dt * speed);

export class Weather {
  constructor(windowCanvas, roomCanvas) {
    this.wc = windowCanvas; this.wctx = windowCanvas.getContext('2d');
    this.rc = roomCanvas; this.rctx = roomCanvas.getContext('2d');
    this.cfg = {};
    this.level = { rain: 0, leaves: 0, stars: 0, motes: 0, droplets: 0 };
    this.target = { ...this.level };
    this.t = 0;
    this.wind = 0;
    const r = seeded(77);
    this.rain = Array.from({ length: MAX_RAIN }, () => this.newDrop(true));
    this.leaves = Array.from({ length: MAX_LEAVES }, () => this.newLeaf(true));
    this.stars = Array.from({ length: MAX_STARS }, () => ({
      x: r() * GLASS.w, y: Math.pow(r(), 1.6) * GLASS.h * 0.75, r: 0.4 + r() * 1.3, p: r() * 6.28, s: 0.5 + r() * 2,
    }));
    this.droplets = Array.from({ length: 46 }, () => ({ x: r() * GLASS.w, y: r() * GLASS.h, r: 0.8 + r() * 2.4, slide: 0, vy: 0 }));
    this.motes = Array.from({ length: MAX_MOTES }, () => this.newMote());
    this.birds = null; this.nextBird = 4;
    this.resize();
    bus.on('stage:resize', () => this.resize());
    ticker.add((dt) => this.frame(dt));
    motion.onChange(() => this.renderStatic());
  }

  resize() {
    const s = Math.max(0.5, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stage-scale')) || 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.wk = s * dpr;
    this.wc.width = Math.round(GLASS.w * this.wk);
    this.wc.height = Math.round(GLASS.h * this.wk);
    this.rk = s * Math.min(dpr, 1.5);
    this.rc.width = Math.round(1600 * this.rk);
    this.rc.height = Math.round(900 * this.rk);
    this.renderStatic();
  }

  /** Accepts the `weather` (+ curtains/wind) block from an ambience preset. */
  configure(weather, wind = 0) {
    this.cfg = weather || {};
    this.wind = wind;
    this.target.rain = this.cfg.rain ? 1 : 0;
    this.target.droplets = this.cfg.rain?.droplets ? 1 : 0;
    this.target.leaves = this.cfg.leaves ? 1 : 0;
    this.target.stars = this.cfg.stars ? 1 : 0;
    this.target.motes = this.cfg.motes ? 1 : 0;
    if (this.cfg.motes) this.moteColor = this.cfg.motes.color;
    if (this.cfg.leaves) this.leafColors = this.cfg.leaves.colors;
    this.nextBird = 2;
    if (motion.reduced || !ticker.running) { Object.assign(this.level, this.target); this.renderStatic(); }
  }

  newDrop(anywhere) {
    return { x: Math.random() * (GLASS.w + 80) - 40, y: anywhere ? Math.random() * GLASS.h : -30 - Math.random() * 60, v: 0.75 + Math.random() * 0.5, l: 0.6 + Math.random() * 0.6, a: 0.25 + Math.random() * 0.4 };
  }
  newLeaf(anywhere) {
    return { x: Math.random() * GLASS.w * 1.4 - GLASS.w * 0.5, y: anywhere ? Math.random() * GLASS.h : -20, vx: 20 + Math.random() * 30, vy: 22 + Math.random() * 26, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 4, s: 4 + Math.random() * 4, c: Math.floor(Math.random() * 4), ph: Math.random() * 6.28 };
  }
  newMote() {
    return { x: 160 + Math.random() * 1000, y: 160 + Math.random() * 560, vx: (Math.random() - 0.5) * 6, vy: -2 - Math.random() * 5, r: 0.8 + Math.random() * 1.8, p: Math.random() * 6.28 };
  }

  frame(dt) {
    this.t += dt;
    for (const k of Object.keys(this.level)) this.level[k] = ease(this.level[k], this.target[k], dt, 0.6);
    this.step(dt);
    this.draw();
  }

  step(dt) {
    const rc = this.cfg.rain;
    if (this.level.rain > 0.01) {
      const speed = rc?.speed || 900, slant = rc?.slant ?? 0.12;
      for (const d of this.rain) {
        d.y += speed * d.v * dt; d.x += speed * d.v * slant * dt;
        if (d.y > GLASS.h + 20) Object.assign(d, this.newDrop(false));
      }
      for (const g of this.droplets) {
        if (g.slide > 0) { g.y += g.vy * dt; g.slide -= dt; if (g.y > GLASS.h) { g.y = -5; g.x = Math.random() * GLASS.w; } }
        else if (Math.random() < 0.0015) { g.slide = 1 + Math.random() * 2; g.vy = 30 + Math.random() * 50; }
      }
    }
    if (this.level.leaves > 0.01) {
      const sp = this.cfg.leaves?.speed || 1;
      for (const l of this.leaves) {
        l.ph += dt * 2;
        l.x += (l.vx + Math.sin(l.ph) * 18) * dt * sp; l.y += l.vy * dt * sp; l.rot += l.vr * dt;
        if (l.y > GLASS.h + 20 || l.x > GLASS.w + 30) Object.assign(l, this.newLeaf(false));
      }
    }
    if (this.level.motes > 0.01) {
      for (const m of this.motes) {
        m.p += dt;
        m.x += (m.vx + Math.sin(m.p * 0.7) * 4) * dt; m.y += (m.vy + Math.cos(m.p * 0.5) * 2) * dt;
        if (m.y < 120 || m.x < 120 || m.x > 1250) Object.assign(m, this.newMote(), { y: 720 });
      }
    }
    if (this.cfg.birds) {
      this.nextBird -= dt;
      if (!this.birds && this.nextBird <= 0) {
        this.birds = { x: -30, y: 40 + Math.random() * 90, n: 2 + Math.floor(Math.random() * 3) };
        this.nextBird = (this.cfg.birds.every || 9000) / 1000;
      }
    }
    if (this.birds) { this.birds.x += 55 * dt; if (this.birds.x > GLASS.w + 60) this.birds = null; }
  }

  draw() {
    const c = this.wctx, k = this.wk;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, this.wc.width, this.wc.height);
    c.setTransform(k, 0, 0, k, 0, 0);

    // stars
    if (this.level.stars > 0.01) {
      const count = Math.min(MAX_STARS, this.cfg.stars?.count || 80);
      const tw = this.cfg.stars?.twinkle ?? 0.6;
      for (let i = 0; i < count; i++) {
        const s = this.stars[i];
        const a = (0.55 + Math.sin(this.t * s.s + s.p) * 0.45 * tw) * this.level.stars;
        c.fillStyle = `rgba(245,240,220,${a.toFixed(3)})`;
        c.beginPath(); c.arc(s.x, s.y, s.r, 0, 6.283); c.fill();
      }
    }
    // birds
    if (this.birds && this.cfg.birds) {
      c.strokeStyle = 'rgba(50,45,40,0.75)'; c.lineWidth = 1.4; c.lineCap = 'round';
      for (let i = 0; i < this.birds.n; i++) {
        const bx = this.birds.x - i * 16, by = this.birds.y + Math.sin(i * 2) * 8;
        const f = Math.sin(this.t * 9 + i) * 3.5;
        c.beginPath(); c.moveTo(bx - 6, by - f); c.quadraticCurveTo(bx - 3, by - 2, bx, by); c.quadraticCurveTo(bx + 3, by - 2, bx + 6, by - f); c.stroke();
      }
    }
    // leaves
    if (this.level.leaves > 0.01) {
      const cols = this.leafColors || ['#c4622d'];
      const count = Math.round(Math.min(MAX_LEAVES, this.cfg.leaves?.count || 20) * this.level.leaves);
      c.globalAlpha = Math.min(1, this.level.leaves);
      for (let i = 0; i < count; i++) {
        const l = this.leaves[i];
        c.save(); c.translate(l.x, l.y); c.rotate(l.rot); c.scale(1, Math.abs(Math.sin(l.ph)) * 0.6 + 0.4);
        c.fillStyle = cols[l.c % cols.length];
        c.beginPath(); c.ellipse(0, 0, l.s, l.s * 0.5, 0, 0, 6.283); c.fill();
        c.restore();
      }
      c.globalAlpha = 1;
    }
    // rain
    if (this.level.rain > 0.01) {
      const rc = this.cfg.rain || {};
      const count = Math.round(Math.min(MAX_RAIN, rc.count || 150) * this.level.rain);
      const len = rc.length || 22, slant = rc.slant ?? 0.12;
      c.lineWidth = 1; c.lineCap = 'round';
      for (let i = 0; i < count; i++) {
        const d = this.rain[i];
        c.strokeStyle = `rgba(205,218,232,${(d.a * this.level.rain).toFixed(3)})`;
        c.beginPath(); c.moveTo(d.x, d.y); c.lineTo(d.x - len * d.l * slant, d.y - len * d.l); c.stroke();
      }
    }
    // droplets on the glass
    if (this.level.droplets > 0.01) {
      const a = this.level.droplets;
      for (const g of this.droplets) {
        c.fillStyle = `rgba(190,205,220,${(0.28 * a).toFixed(3)})`;
        c.beginPath(); c.arc(g.x, g.y, g.r, 0, 6.283); c.fill();
        c.fillStyle = `rgba(255,255,255,${(0.45 * a).toFixed(3)})`;
        c.beginPath(); c.arc(g.x - g.r * 0.3, g.y - g.r * 0.35, g.r * 0.35, 0, 6.283); c.fill();
        if (g.slide > 0) {
          c.strokeStyle = `rgba(200,215,230,${(0.18 * a).toFixed(3)})`; c.lineWidth = g.r * 0.8;
          c.beginPath(); c.moveTo(g.x, g.y - 24); c.lineTo(g.x, g.y); c.stroke();
        }
      }
    }

    // room motes
    const r = this.rctx, rk = this.rk;
    r.setTransform(1, 0, 0, 1, 0, 0);
    r.clearRect(0, 0, this.rc.width, this.rc.height);
    if (this.level.motes > 0.01) {
      r.setTransform(rk, 0, 0, rk, 0, 0);
      const count = Math.round(Math.min(MAX_MOTES, this.cfg.motes?.count || 20) * this.level.motes);
      const col = this.moteColor || '255,220,170';
      const sparkle = this.cfg.motes?.sparkle;
      for (let i = 0; i < count; i++) {
        const m = this.motes[i];
        const tw = sparkle ? 0.35 + Math.max(0, Math.sin(m.p * 2.2)) * 0.65 : 0.55 + Math.sin(m.p * 1.3) * 0.25;
        r.fillStyle = `rgba(${col},${(tw * 0.55 * this.level.motes).toFixed(3)})`;
        r.beginPath(); r.arc(m.x, m.y, m.r, 0, 6.283); r.fill();
      }
    }
  }

  /** For reduced motion / first paint: draw a single still frame. */
  renderStatic() { this.draw(); }
}
