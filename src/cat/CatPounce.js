/**
 * CatPounce — the "I warned you" easter egg.
 *
 *   sleeping ─poke→ waking ─→ leaping ─→ scratching ─→ dialogue ─→ returning ─→ sleeping
 *
 * A small explicit state machine: every state has an `enter()` that returns how long
 * it lasts, and exactly one transition timer is pending at a time. Sub-beats inside a
 * state use `this.later()`, and every timer / Web Animation is tracked, so `cancel()`
 * (navigation, tab hidden, destroy) always restores the room cleanly.
 *
 * The sleeping cat on the bed is its own SVG layer, so during the leap it is hidden and
 * a matching pounce drawing (pounceArt.js) flies out of its exact screen position.
 */
import { pounceSvg } from './pounceArt.js';
import { ScratchOverlay } from './ScratchOverlay.js';
import { DIALOGUE } from '../config/dialogue.js';
import { motion } from '../core/motion.js';

const ORDER = ['waking', 'leaping', 'scratching', 'dialogue', 'returning', 'sleeping'];

export class CatPounce {
  /**
   * @param {object} o
   * @param {SVGGElement} o.catRoot     the bed cat's root group (.cat)
   * @param {object} o.cat              CatController (pose states on the bed)
   * @param {object} o.character        CharacterController (Reetika's reaction)
   * @param {object} [o.audio]          AudioEngine (optional effects)
   * @param {HTMLElement} o.shakeTarget element nudged on impact (the room viewport)
   * @param {object} [o.stage]         Stage — on phones, pans to Reetika for the punchline
   */
  constructor({ catRoot, cat, character, audio, shakeTarget, stage }) {
    Object.assign(this, { catRoot, cat, character, audio, shakeTarget, stage });
    this.state = 'sleeping';
    this.timer = 0;
    this.subTimers = new Set();
    this.anims = new Set();
    this.onAway = () => this.cancel();
    window.addEventListener('hashchange', this.onAway);
    document.addEventListener('visibilitychange', this.onVisibility = () => document.hidden && this.cancel());
    window.addEventListener('resize', this.onAway);
  }

  get busy() { return this.state !== 'sleeping'; }

  /** Entry point (click / tap / Enter on the cat). Returns false if already mid-sequence. */
  start() {
    if (this.busy) return false;
    this.go('waking');
    return true;
  }

  /* ---------------- state machine core ---------------- */
  go(name) {
    clearTimeout(this.timer);
    this.state = name;
    document.documentElement.dataset.catPounce = name;
    const ms = this.states[name].call(this);
    const next = ORDER[ORDER.indexOf(name) + 1];
    if (next && name !== 'sleeping') this.timer = setTimeout(() => this.go(next), ms);
  }

  later(fn, ms) {
    const t = setTimeout(() => { this.subTimers.delete(t); fn(); }, ms);
    this.subTimers.add(t);
  }

  track(anim) {
    this.anims.add(anim);
    anim.finished.catch(() => {}).finally(() => this.anims.delete(anim));
    return anim;
  }

  /** Interrupt from anywhere and put the room back exactly as it was. */
  cancel() {
    if (!this.busy) return;
    clearTimeout(this.timer);
    this.subTimers.forEach(clearTimeout); this.subTimers.clear();
    this.anims.forEach((a) => a.cancel()); this.anims.clear();
    this.overlay?.remove(); this.overlay = null;
    this.scratches?.destroy(); this.scratches = null;
    this.catRoot.classList.remove('is-hidden', 'is-crouch');
    this.cat.set('sleeping');
    this.state = 'sleeping';
    delete document.documentElement.dataset.catPounce;
  }

  destroy() {
    this.cancel();
    window.removeEventListener('hashchange', this.onAway);
    window.removeEventListener('resize', this.onAway);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  /* ---------------- geometry ---------------- */
  measure() {
    const vw = window.innerWidth, vh = window.innerHeight;
    this.W = Math.round(Math.min(vw * 0.62, vh * 0.66, 540));
    this.H = Math.round(this.W * 0.95);
    const a = this.catRoot.querySelector('.cat__body').getBoundingClientRect();
    const b = this.catRoot.querySelector('.cat__head').getBoundingClientRect();
    const left = Math.min(a.left, b.left), right = Math.max(a.right, b.right);
    const top = Math.min(a.top, b.top), bottom = Math.max(a.bottom, b.bottom);
    this.from = { x: (left + right) / 2, y: (top + bottom) / 2, s: Math.max(0.12, (right - left) / (this.W * 0.78)), r: 0 };
    this.to = { x: vw * (vw > vh ? 0.58 : 0.5), y: vh * 0.56, s: 1, r: 4 };
    this.corner = { x: vw - this.W * 0.3, y: vh - this.H * 0.12, s: 0.62, r: -10 };
  }

  pose({ x, y, s, r }) {
    return `translate(${(x - this.W / 2).toFixed(1)}px, ${(y - this.H / 2).toFixed(1)}px) scale(${s.toFixed(3)}) rotate(${r}deg)`;
  }

  sound(name) { this.audio?.playEffect?.(name); }

  /* ---------------- states ---------------- */
  states = {
    /* Phase 2 — rudely awake: ears perk, then a glare and a butt-wiggle of anticipation */
    waking() {
      this.cat.set('alert');
      this.sound('startle');
      this.later(() => { this.cat.set('grumpy'); this.catRoot.classList.add('is-crouch'); }, 200);
      return motion.reduced ? 700 : 620;
    },

    /* Phase 3 — the leap out of the room toward the screen */
    leaping() {
      this.measure();
      const el = document.createElement('div');
      el.className = 'pounce is-wild';
      el.style.width = this.W + 'px';
      el.style.height = this.H + 'px';
      el.innerHTML = pounceSvg();
      document.body.appendChild(el);
      this.overlay = el;
      this.catRoot.classList.remove('is-crouch');
      this.catRoot.classList.add('is-hidden');

      if (motion.reduced) {
        el.style.transform = this.pose(this.to);
        this.track(el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'both' }));
        return 260;
      }
      const vh = window.innerHeight;
      const mid = {
        x: this.from.x + (this.to.x - this.from.x) * 0.45,
        y: Math.min(this.from.y, this.to.y) - vh * 0.16,
        s: this.from.s + (1 - this.from.s) * 0.4,
        r: -16,
      };
      const flight = this.track(el.animate([
        { transform: this.pose(this.from), filter: 'blur(0px)', offset: 0 },
        { transform: this.pose(mid), filter: 'blur(3px)', offset: 0.45 },
        { transform: this.pose({ ...this.to, s: 1.08, r: 7 }), filter: 'blur(1px)', offset: 0.86 },
        { transform: this.pose(this.to), filter: 'blur(0px)', offset: 1 },
      ], { duration: 460, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' }));
      this.sound('leap');
      flight.finished.then(() => this.shake(11, 340)).catch(() => {});
      return 470;
    },

    /* Phase 4 — swipe, swipe, swipe, swipe */
    scratching() {
      this.scratches = new ScratchOverlay(document.body);
      const { x, y } = this.to;
      const W = this.W;
      const swipes = [
        { paw: 'l', cx: x - W * 0.26, cy: y - W * 0.06, angle: 1.15 },
        { paw: 'r', cx: x + W * 0.24, cy: y - W * 0.1, angle: 1.98 },
        { paw: 'l', cx: x - W * 0.08, cy: y + W * 0.02, angle: 1.0 },
        { paw: 'r', cx: x + W * 0.36, cy: y + W * 0.06, angle: 2.15 },
      ];
      const beat = motion.reduced ? 0 : 165;
      swipes.forEach((s, i) => this.later(() => {
        const paw = this.overlay?.querySelector(`.pz-paw--${s.paw}`);
        if (paw && !motion.reduced) {
          const dir = s.paw === 'l' ? 1 : -1;
          this.track(paw.animate(
            [{ rotate: '0deg' }, { rotate: `${dir * -18}deg`, offset: 0.25 }, { rotate: `${dir * 34}deg`, offset: 0.7 }, { rotate: '0deg' }],
            { duration: 200, easing: 'ease-out' },
          ));
        }
        this.later(() => {
          this.scratches?.swipe({ cx: s.cx, cy: s.cy, length: W * (0.4 + Math.random() * 0.1), angle: s.angle + (Math.random() - 0.5) * 0.15, gap: Math.max(9, W * 0.032), width: Math.max(4, W * 0.011) });
          this.sound('scratch');
          if (!motion.reduced) this.shake(3, 120);
        }, motion.reduced ? 0 : 60);
      }, i * beat));
      return swipes.length * beat + (motion.reduced ? 300 : 260);
    },

    /* Phase 5 — the cat hops down to the corner looking smug; Reetika says it */
    dialogue() {
      const el = this.overlay;
      if (el) {
        el.classList.replace('is-wild', 'is-smug');
        this.track(el.animate(
          [{ transform: this.pose(this.to) }, { transform: this.pose(this.corner) }],
          { duration: motion.reduced ? 1 : 420, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' },
        ));
      }
      this.stage?.reveal(846); // phones: bring Reetika into view for her line
      this.character.react({ ...DIALOGUE.character.catPounce }, { hold: 3300 });
      this.later(() => this.scratches?.fadeOut(700), 2300);
      return 3500;
    },

    /* Phase 6 — back to bed */
    returning() {
      const el = this.overlay;
      this.cat.set('returning');
      if (el) {
        const back = this.track(el.animate([
          { transform: this.pose(this.corner), opacity: 1 },
          { transform: this.pose({ ...this.from, s: this.from.s * 1.25, r: 6, y: this.from.y - 30 }), opacity: 1, offset: 0.75 },
          { transform: this.pose(this.from), opacity: 0 },
        ], { duration: motion.reduced ? 1 : 520, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }));
        back.finished.then(() => this.catRoot.classList.remove('is-hidden')).catch(() => {});
        this.later(() => this.catRoot.classList.remove('is-hidden'), motion.reduced ? 0 : 420);
      }
      return motion.reduced ? 400 : 1100;
    },

    /* Phase 1 — peace (and clean-up) */
    sleeping() {
      this.overlay?.remove(); this.overlay = null;
      this.scratches?.destroy(); this.scratches = null;
      this.catRoot.classList.remove('is-hidden', 'is-crouch');
      this.cat.set('sleeping');
      delete document.documentElement.dataset.catPounce;
      return 0;
    },
  };

  shake(px, ms) {
    if (motion.reduced || !this.shakeTarget) return;
    const k = (f) => `${(px * f).toFixed(1)}px`;
    this.track(this.shakeTarget.animate([
      { translate: '0 0' }, { translate: `${k(-1)} ${k(0.5)}` }, { translate: `${k(0.8)} ${k(-0.6)}` },
      { translate: `${k(-0.5)} ${k(0.4)}` }, { translate: `${k(0.25)} ${k(-0.2)}` }, { translate: '0 0' },
    ], { duration: ms, easing: 'linear' }));
  }
}
