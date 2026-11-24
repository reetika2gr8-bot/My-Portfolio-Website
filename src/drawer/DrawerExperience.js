/**
 * DrawerExperience — "You weren't supposed to open this..."
 *
 * States: closed → opening → open → closing → closed (guards prevent double-triggers).
 *   1. the in-room drawer (an inline copy laid exactly over the painted one) slides out,
 *      the camera eases toward it;
 *   2. a close-up of the drawer grows out of that exact spot (FLIP from the hotspot rect);
 *   3. inside: ~11 objects, a hidden-object game (HiddenObjectGame.js) and three easter
 *      eggs (polaroid / note / fortune teller) shown in an "inspect" layer.
 * Closing: the shut tag, the drawer front ("push it shut"), the backdrop, or Esc.
 * Rendering lives here; game rules live in HiddenObjectGame; art in drawerArt.js;
 * all text in src/config/drawer.js.
 */
import { DRAWER } from '../config/drawer.js';
import { HiddenObjectGame } from './HiddenObjectGame.js';
import { drawerBoxSvg, OBJECT_ART, charmArt, toSvg } from './drawerArt.js';
import { el, esc } from '../core/dom.js';
import { motion } from '../core/motion.js';
import { ICONS } from '../ui/icons.js';

const BOX = { w: 1000, h: 640 };
const TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13 q3 2 6 6 q4 -9 10 -14" fill="none" stroke="#a4553a" stroke-width="3" stroke-linecap="round"/></svg>';

export class DrawerExperience {
  /**
   * @param {object} o
   * @param {HTMLElement} o.mount        where the overlay lives (#app)
   * @param {HTMLElement} o.room         the room <main> (zoom + inert)
   * @param {HTMLElement} o.viewport     the room viewport (camera zoom)
   * @param {SVGGElement} o.roomDrawer   inline in-room drawer group (.room-drawer)
   * @param {HTMLElement} o.hotspot      the drawer hotspot button
   * @param {object} [o.audio]           AudioEngine (effects only play if sound is on)
   */
  constructor({ mount, room, viewport, roomDrawer, hotspot, audio }) {
    Object.assign(this, { room, viewport, roomDrawer, hotspot, audio });
    this.state = 'closed';
    this.anims = new Set();
    this.timers = new Set();
    this.objects = DRAWER.objects;
    this.game = new HiddenObjectGame({
      spots: this.objects.filter((o) => !o.egg).map((o) => o.id),
      hideable: this.objects.filter((o) => o.canHide).map((o) => o.id),
      wrong: DRAWER.wrong,
      generic: DRAWER.wrongGeneric,
      already: DRAWER.alreadySearched,
      labels: Object.fromEntries(DRAWER.objects.map((o) => [o.id, o.label])),
    });
    this.memoryIdx = -1;
    this.lastFortune = -1;
    this.bites = 0;
    this.build(mount);
    window.addEventListener('hashchange', () => this.close(true));
  }

  /* ---------------- helpers ---------------- */
  later(fn, ms) { const t = setTimeout(() => { this.timers.delete(t); fn(); }, ms); this.timers.add(t); return t; }
  track(a) { this.anims.add(a); a.finished.catch(() => {}).finally(() => this.anims.delete(a)); return a; }
  sound(n) { this.audio?.playEffect?.(n); }
  anim(node, frames, opts) { return this.track(node.animate(frames, { duration: motion.reduced ? 1 : opts.duration, ...opts, ...(motion.reduced ? { duration: 1, delay: 0 } : {}) })); }

  /* ---------------- DOM ---------------- */
  build(mount) {
    const root = el('div', { class: 'dv', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'The desk drawer', hidden: true });
    root.innerHTML = `
      <div class="dv__backdrop"></div>
      <div class="dv__stage" tabindex="-1">
        <div class="dv__scrap">
          <p class="dv__snoop">${esc(DRAWER.opening)}</p>
          <p class="dv__msg" aria-live="polite"></p>
          <button type="button" class="dv__again" hidden>${ICONS.arrow}<span>hide it again</span></button>
        </div>
        <button type="button" class="dv__shut" aria-label="Close the drawer">${ICONS.close}<span>shut drawer</span></button>
        <div class="dv__drawer">
          ${drawerBoxSvg()}
          <div class="dv__floor"></div>
          <div class="dv__flash" aria-hidden="true"></div>
          <button type="button" class="dv__front" aria-label="Push the drawer shut"><span class="dv__knob" aria-hidden="true"></span><span class="dv__frontlabel">push to close</span></button>
        </div>
        <div class="dv__inspect" hidden>
          <div class="dv__scrim"></div>
          <div class="dv__card"></div>
          <button type="button" class="dv__putback">${ICONS.back}<span>put it back</span></button>
        </div>
      </div>`;
    mount.appendChild(root);
    this.root = root;
    this.stage = root.querySelector('.dv__stage');
    this.drawer = root.querySelector('.dv__drawer');
    this.floor = root.querySelector('.dv__floor');
    this.msg = root.querySelector('.dv__msg');
    this.againBtn = root.querySelector('.dv__again');
    this.inspectEl = root.querySelector('.dv__inspect');
    this.card = root.querySelector('.dv__card');

    // objects
    this.btns = {};
    for (const o of this.objects) {
      const art = OBJECT_ART[o.art]();
      const h = o.w * (art.vb[1] / art.vb[0]);
      const b = el('button', {
        type: 'button', class: `dobj dobj--${o.id}`, 'data-id': o.id,
        'aria-label': o.egg ? `${o.label} (look closer)` : `Search the ${o.label}`,
      });
      Object.assign(b.style, {
        left: `${((o.x - o.w / 2) / BOX.w) * 100}%`, top: `${((o.y - h / 2) / BOX.h) * 100}%`,
        width: `${(o.w / BOX.w) * 100}%`,
      });
      b.style.setProperty('--r', `${o.r}deg`);
      b.innerHTML = `<span class="dobj__art">${toSvg(art)}</span><span class="dobj__tag" aria-hidden="true">${esc(o.label)}</span><span class="dobj__tick" hidden>${TICK}</span>`;
      b.addEventListener('click', (e) => { e.stopPropagation(); this.onObject(o, b); });
      this.floor.appendChild(b);
      this.btns[o.id] = b;
    }
    // the charm (hidden under the target)
    this.charm = el('button', { type: 'button', class: 'dcharm', 'aria-label': 'The lucky charm', hidden: true, tabindex: '-1' });
    this.charm.innerHTML = toSvg(charmArt());
    this.charm.addEventListener('click', () => this.anim(this.charm.firstChild, [{ rotate: '0deg' }, { rotate: '360deg' }], { duration: 700, easing: 'cubic-bezier(.3,1.4,.5,1)' }));
    this.floor.prepend(this.charm);
    this.sparkles = el('div', { class: 'dv__sparkles', 'aria-hidden': 'true' });
    this.floor.appendChild(this.sparkles);
    this.placeCharm();

    // closing controls
    root.querySelector('.dv__backdrop').addEventListener('click', () => this.close());
    root.querySelector('.dv__shut').addEventListener('click', () => this.close());
    root.querySelector('.dv__front').addEventListener('click', () => this.close());
    this.againBtn.addEventListener('click', () => this.restart());
    // inspect controls
    root.querySelector('.dv__scrim').addEventListener('click', () => this.closeInspect());
    root.querySelector('.dv__putback').addEventListener('click', () => this.closeInspect());
    this.card.addEventListener('click', () => this.onCardClick());
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); this.inspecting ? this.closeInspect() : this.close(); }
      if (e.key === 'Tab') this.trapFocus(e);
    });
    this.setMessage(DRAWER.intro, true);
  }

  placeCharm() {
    const t = this.objects.find((o) => o.id === this.game.target);
    const w = 84, h = w * (112 / 90);
    Object.assign(this.charm.style, {
      left: `${((t.x - w / 2) / BOX.w) * 100}%`, top: `${((t.y - h / 2) / BOX.h) * 100}%`, width: `${(w / BOX.w) * 100}%`,
    });
    this.charm.hidden = true;
  }

  setMessage(text, quiet) {
    this.msg.textContent = text;
    if (quiet || motion.reduced) return;
    this.anim(this.msg, [{ opacity: 0, translate: '0 4px', rotate: '-1.5deg' }, { opacity: 1, translate: '0 0', rotate: '0deg' }], { duration: 260, easing: 'ease-out' });
  }

  /* ---------------- open / close ---------------- */
  open() {
    if (this.state !== 'closed') return;
    this.state = 'opening';
    this.returnFocus = document.activeElement;
    const hs = this.hotspot.getBoundingClientRect();
    const vp = this.viewport.getBoundingClientRect();
    this.room.style.setProperty('--zx', `${hs.left + hs.width / 2 - vp.left}px`);
    this.room.style.setProperty('--zy', `${hs.top + hs.height / 2 - vp.top}px`);
    this.room.classList.add('is-drawer');
    this.roomDrawer.classList.add('is-open');
    this.sound('drawerOpen');

    this.later(() => {
      this.root.hidden = false;
      this.root.classList.add('is-open');
      this.room.inert = true;
      // FLIP: the close-up grows out of the real drawer front (non-uniform, so its shape matches)
      const f = this.flipFrom();
      this.anim(this.stage, [
        { transform: `${f} rotateX(32deg)`, opacity: 0 },
        { transform: `${f} rotateX(32deg)`, opacity: 1, offset: 0.08 },
        { transform: 'translate(0,0) scale(1.02) rotateX(-2deg)', opacity: 1, offset: 0.8 },
        { transform: 'none', opacity: 1 },
      ], { duration: 680, easing: 'cubic-bezier(.22,.9,.3,1)' });
      this.anim(this.root.querySelector('.dv__backdrop'), [{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: 'both' });
      this.root.classList.remove('is-snooped');
      this.later(() => this.root.classList.add('is-snooped'), motion.reduced ? 0 : 520);
      this.later(() => { this.state = 'open'; this.stage.focus({ preventScroll: true }); }, motion.reduced ? 0 : 640);
    }, motion.reduced ? 0 : 300);
  }

  close(instant = false) {
    if (this.state === 'closed' || this.state === 'closing') return;
    this.state = 'closing';
    this.closeInspect(true);
    const finish = () => {
      this.root.hidden = true;
      this.root.classList.remove('is-open', 'is-snooped');
      this.room.inert = false;
      this.roomDrawer.classList.remove('is-open');
      this.room.classList.remove('is-drawer');
      this.state = 'closed';
      if (!instant) this.sound('drawerClose');
      (this.returnFocus?.isConnected ? this.returnFocus : this.hotspot)?.focus?.({ preventScroll: true });
    };
    if (instant || motion.reduced) { this.timers.forEach(clearTimeout); this.timers.clear(); return finish(); }
    const f = this.flipFrom();
    this.anim(this.root.querySelector('.dv__backdrop'), [{ opacity: 1 }, { opacity: 0 }], { duration: 380, fill: 'both' });
    const a = this.anim(this.stage, [
      { transform: 'none', opacity: 1 },
      { transform: `${f} rotateX(30deg)`, opacity: 0.2 },
    ], { duration: 420, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' });
    a.finished.then(() => { a.cancel(); finish(); }).catch(() => {});
  }

  /**
   * Transform that maps the close-up's drawer box onto the painted drawer front.
   * Sets the stage's transform-origin to the box centre so the scale is anchored there.
   */
  flipFrom() {
    const st = this.stage.getBoundingClientRect(), d = this.drawer.getBoundingClientRect(), h = this.hotspot.getBoundingClientRect();
    const ox = d.left + d.width / 2 - st.left, oy = d.top + d.height / 2 - st.top;
    this.stage.style.transformOrigin = `${ox}px ${oy}px`;
    const dx = h.left + h.width / 2 - (d.left + d.width / 2), dy = h.top + h.height / 2 - (d.top + d.height / 2);
    return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${Math.max(0.05, h.width / d.width).toFixed(4)}, ${Math.max(0.05, h.height / d.height).toFixed(4)})`;
  }

  /* ---------------- objects & game ---------------- */
  onObject(o, b) {
    if (this.state !== 'open' || this.inspecting) return;
    if (o.egg) { this.sound('paper'); return this.openInspect(o.egg, b); }
    const res = this.game.search(o.id);
    if (res.result === 'found') return this.win(o, b);
    this.sound('tap');
    this.play(o.anim, b);
    if (res.result === 'over') return this.wiggle(b);
    if (res.message) this.setMessage(res.message);
    if (res.result === 'wrong') b.querySelector('.dobj__tick').hidden = false;
  }

  wiggle(b) {
    this.anim(b.querySelector('.dobj__art'), [{ rotate: '0deg' }, { rotate: '-6deg' }, { rotate: '5deg' }, { rotate: '0deg' }], { duration: 320 });
  }

  /** Distinct, tactile click animation per object. */
  play(kind, b) {
    const art = b.querySelector('.dobj__art');
    const A = (frames, ms, ease = 'cubic-bezier(.3,1.3,.5,1)') => this.anim(art, frames, { duration: ms, easing: ease });
    switch (kind) {
      case 'flap': A([{ transform: 'none' }, { transform: 'scaleX(.8) skewY(-5deg)' }, { transform: 'scaleX(1.05)' }, { transform: 'none' }], 480); break;
      case 'roll': A([{ transform: 'none' }, { transform: 'translate(14%, 30%) rotate(24deg)' }, { transform: 'translate(-4%, 0) rotate(-6deg)' }, { transform: 'none' }], 700, 'ease-in-out'); break;
      case 'jingle': A([0, -14, 12, -9, 6, 0].map((d) => ({ rotate: `${d}deg` })), 420, 'linear'); break;
      case 'bounce': A([{ transform: 'none' }, { transform: 'translateY(-26%) scale(.95, 1.06)' }, { transform: 'translateY(0) scale(1.08, .9)' }, { transform: 'none' }], 520); break;
      case 'flash':
        A([{ transform: 'none' }, { transform: 'translateY(-6%) rotate(-3deg)' }, { transform: 'none' }], 380);
        this.anim(this.root.querySelector('.dv__flash'), [{ opacity: 0.85 }, { opacity: 0 }], { duration: 420, easing: 'ease-out' });
        break;
      case 'bite': {
        this.bites = Math.min(3, this.bites + 1);
        b.dataset.bites = this.bites;
        A([{ transform: 'none' }, { transform: 'scale(.92) rotate(-4deg)' }, { transform: 'none' }], 300);
        this.crumbs(b);
        break;
      }
      case 'peel': A([{ transform: 'none' }, { transform: 'translateY(-8%) rotate(-7deg) scale(1.05)' }, { transform: 'none' }], 520); break;
      case 'squeak': A([{ transform: 'none' }, { transform: 'scale(1.18, .82)' }, { transform: 'scale(.94, 1.08)' }, { transform: 'none' }], 460); break;
      default: this.wiggle(b);
    }
  }

  crumbs(b) {
    if (motion.reduced) return;
    const r = b.getBoundingClientRect(), f = this.floor.getBoundingClientRect();
    for (let i = 0; i < 7; i++) {
      const c = el('i', { class: 'dv__crumb' });
      c.style.left = `${r.left - f.left + r.width * (0.6 + Math.random() * 0.3)}px`;
      c.style.top = `${r.top - f.top + r.height * (0.2 + Math.random() * 0.4)}px`;
      this.floor.appendChild(c);
      const a = this.anim(c, [{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${(Math.random() - 0.3) * 40}px, ${20 + Math.random() * 30}px)`, opacity: 0 }], { duration: 600 + Math.random() * 300, easing: 'cubic-bezier(.3,0,.7,1)' });
      a.finished.finally(() => c.remove()).catch(() => {});
    }
  }

  win(o, b) {
    this.sound('found');
    this.charm.hidden = false;
    b.classList.add('is-moved');
    this.anim(b, [{ translate: '0 0', rotate: `${o.r}deg` }, { translate: '58% -22%', rotate: `${o.r + 16}deg` }], { duration: 520, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' });
    this.anim(this.charm, [{ transform: 'scale(.2) rotate(-40deg)', opacity: 0 }, { transform: 'scale(1.3) rotate(8deg)', opacity: 1, offset: 0.6 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], { duration: 640, delay: 180, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'backwards' });
    this.charm.classList.add('is-found');
    this.charm.tabIndex = 0;
    this.burst();
    this.setMessage(`${DRAWER.win} (Found in ${this.game.tries} ${this.game.tries === 1 ? 'try' : 'tries'}.)`);
    this.root.classList.add('is-won');
    this.againBtn.hidden = false;
    this.later(() => this.againBtn.focus({ preventScroll: true }), motion.reduced ? 0 : 700);
  }

  burst() {
    if (motion.reduced) return;
    const c = this.charm.getBoundingClientRect(), f = this.floor.getBoundingClientRect();
    const cx = c.left - f.left + c.width / 2, cy = c.top - f.top + c.height / 2;
    const colors = ['#f2cf7a', '#fff4de', '#e0a07a', '#a9c0a0'];
    for (let i = 0; i < 22; i++) {
      const s = el('i', { class: `dv__spark ${i % 3 ? '' : 'dv__spark--star'}` });
      s.style.left = cx + 'px'; s.style.top = cy + 'px';
      s.style.background = colors[i % colors.length];
      this.sparkles.appendChild(s);
      const ang = (i / 22) * Math.PI * 2 + Math.random() * 0.3, dist = 40 + Math.random() * 70;
      const a = this.anim(s, [
        { transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) scale(1)`, opacity: 1, offset: 0.6 },
        { transform: `translate(calc(-50% + ${Math.cos(ang) * dist * 1.2}px), calc(-50% + ${Math.sin(ang) * dist * 1.2 + 14}px)) scale(.4)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 400, delay: 200, easing: 'cubic-bezier(.2,.8,.4,1)', fill: 'backwards' });
      a.finished.finally(() => s.remove()).catch(() => {});
    }
  }

  restart() {
    this.sound('tap');
    for (const b of Object.values(this.btns)) {
      b.classList.remove('is-moved');
      b.getAnimations().forEach((a) => a.cancel());
      b.querySelector('.dobj__tick').hidden = true;
    }
    this.charm.classList.remove('is-found');
    this.charm.tabIndex = -1;
    this.game.restart();
    this.placeCharm();
    this.root.classList.remove('is-won');
    this.againBtn.hidden = true;
    this.setMessage(DRAWER.intro);
    this.stage.focus({ preventScroll: true });
  }

  /* ---------------- easter eggs (inspect layer) ---------------- */
  openInspect(kind, fromBtn) {
    this.inspecting = kind;
    this.inspectFrom = fromBtn;
    this.card.className = `dv__card dv__card--${kind}`;
    this.card.setAttribute('role', 'group');
    if (kind === 'polaroid') {
      this.memoryIdx = (this.memoryIdx + 1) % DRAWER.polaroid.memories.length;
      this.card.innerHTML = `
        <div class="pc">
          <div class="pc__face pc__front">${toSvg(OBJECT_ART.polaroid())}</div>
          <div class="pc__face pc__back"><p>${esc(DRAWER.polaroid.memories[this.memoryIdx])}</p><span>${esc(DRAWER.polaroid.caption)}</span></div>
        </div>`;
      this.card.setAttribute('aria-label', `Polaroid. On the back: ${DRAWER.polaroid.memories[this.memoryIdx]}`);
      this.later(() => this.card.classList.add('is-flipped'), motion.reduced ? 0 : 520);
    } else if (kind === 'note') {
      const n = DRAWER.note;
      this.card.innerHTML = `<div class="nt"><p class="nt__title">${esc(n.title)}</p><p class="nt__body">${esc(n.body)}</p><p class="nt__sign">${esc(n.signoff)}</p></div>`;
      this.card.setAttribute('aria-label', `A note: ${n.body} ${n.signoff}`);
    } else if (kind === 'fortune') {
      let i;
      do i = Math.floor(Math.random() * DRAWER.fortunes.length); while (i === this.lastFortune && DRAWER.fortunes.length > 1);
      this.lastFortune = i;
      this.card.innerHTML = `<div class="fo">${toSvg(OBJECT_ART.fortune(), 'fo__teller')}<div class="fo__slip"><p>${esc(DRAWER.fortunes[i])}</p></div></div>`;
      this.card.setAttribute('aria-label', `Fortune: ${DRAWER.fortunes[i]}`);
      this.pinch();
    }
    this.inspectEl.hidden = false;
    // grow out of the object (FLIP)
    const end = this.card.getBoundingClientRect(), from = fromBtn.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (end.left + end.width / 2), dy = from.top + from.height / 2 - (end.top + end.height / 2);
    const s = Math.max(0.1, from.width / end.width);
    this.anim(this.card, [{ transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(${kind === 'note' ? 0 : -8}deg)`, opacity: 0.5 }, { transform: 'none', opacity: 1 }], { duration: 460, easing: 'cubic-bezier(.25,1.2,.4,1)' });
    if (kind === 'note' && !motion.reduced) this.anim(this.card.firstChild, [{ transform: 'scaleY(.2)' }, { transform: 'scaleY(.2)', offset: 0.35 }, { transform: 'scaleY(1.04)', offset: 0.8 }, { transform: 'scaleY(1)' }], { duration: 760, easing: 'ease-out' });
    fromBtn.style.visibility = 'hidden';
    this.later(() => this.root.querySelector('.dv__putback').focus({ preventScroll: true }), motion.reduced ? 0 : 400);
  }

  pinch() {
    const t = this.card.querySelector('.fo__teller');
    const slip = this.card.querySelector('.fo__slip');
    if (motion.reduced) { slip.classList.add('is-out'); return; }
    const frames = [];
    for (let k = 0; k < 4; k++) { frames.push({ transform: 'scale(1,1)' }, { transform: k % 2 ? 'scale(.78,1.12)' : 'scale(1.12,.78)' }); }
    frames.push({ transform: 'scale(1,1)' });
    this.anim(t, frames, { duration: 1100, delay: 420, easing: 'ease-in-out' });
    this.later(() => { slip.classList.add('is-out'); this.sound('paper'); }, 1500);
  }

  onCardClick() {
    if (this.inspecting === 'polaroid') this.card.classList.toggle('is-flipped');
    else if (this.inspecting === 'fortune') { this.closeInspect(true); this.openInspect('fortune', this.btns.fortune); }
    else this.closeInspect();
  }

  closeInspect(instant) {
    if (!this.inspecting) return;
    const btn = this.inspectFrom;
    this.inspecting = null;
    const done = () => { this.inspectEl.hidden = true; this.card.innerHTML = ''; this.card.className = 'dv__card'; if (btn) btn.style.visibility = ''; };
    if (instant || motion.reduced) { done(); btn?.focus({ preventScroll: true }); return; }
    const end = this.card.getBoundingClientRect(), to = btn.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (end.left + end.width / 2), dy = to.top + to.height / 2 - (end.top + end.height / 2);
    const a = this.anim(this.card, [{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(${Math.max(0.1, to.width / end.width)})`, opacity: 0.3 }], { duration: 320, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' });
    a.finished.then(() => { a.cancel(); done(); btn?.focus({ preventScroll: true }); }).catch(() => {});
  }

  trapFocus(e) {
    const scope = this.inspecting ? this.inspectEl : this.stage;
    const f = [...scope.querySelectorAll('button:not([hidden])')].filter((n) => n.offsetParent !== null && n.tabIndex !== -1 && !n.closest('[hidden]'));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === this.stage)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
