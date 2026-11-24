/**
 * CHARACTER STATE MACHINE
 * States: working · idle · distracted · turning · reacting · returning · stretching · sleepy
 *
 * Rendering is delegated to a renderer with a single method:
 *   renderer.show(state, { head: 'back'|'three'|'front', expr })
 * The SVG renderer maps that to data-attributes (CSS does the motion); the sprite
 * renderer swaps painted frames. Add a new state = add a CSS block / sprite frames
 * and call `this.set('newState')` from a behaviour below.
 */
import { DIALOGUE } from '../config/dialogue.js';
import { wait, rand, cycler } from '../core/dom.js';
import { bus } from '../core/events.js';
import { motion } from '../core/motion.js';

export class SvgCharacterRenderer {
  constructor(root) { this.root = root; }
  show(state, { head = 'back', expr = 'neutral' } = {}) {
    this.root.dataset.state = state;
    this.root.dataset.head = head;
    this.root.dataset.expr = expr;
  }
  flag(name, on) { this.root.classList.toggle(name, on); }
}

export class CharacterController {
  constructor(renderers, say) {
    this.renderers = renderers;      // usually [svgRenderer] or [spriteRenderer]
    this.say = say;                  // (text, anchorKey, opts) => void
    this.state = 'working';
    this.head = 'back';
    this.expr = 'neutral';
    this.seq = 0;
    this.pokes = 0;
    this.sleepyChance = 0;
    this.nextPoke = cycler(DIALOGUE.character.pokes);
    this.nextSleepy = cycler(DIALOGUE.character.sleepyPokes);
    this.idleTimer = 0;
    this.microTimer = 0;
    this.blinkTimer = 0;
  }

  start() {
    this.set('working');
    this.scheduleIdle();
    this.scheduleMicro();
  }

  set(state, head = state === 'reacting' ? 'front' : 'back', expr = this.expr) {
    this.state = state;
    this.head = head;
    this.expr = expr;
    this.renderers.forEach((r) => r.show(state, { head, expr }));
    bus.emit('character:state', state);
  }

  flag(name, on) { this.renderers.forEach((r) => r.flag?.(name, on)); }

  get busy() { return ['turning', 'reacting', 'returning'].includes(this.state); }

  /* ---------- poke ---------- */
  poke() {
    this.pokes++;
    let line;
    if (this.state === 'sleepy') line = this.nextSleepy();
    else if (DIALOGUE.character.escalation[this.pokes]) line = DIALOGUE.character.escalation[this.pokes];
    else line = this.nextPoke();
    this.react(line, { hold: 2800 });
    bus.emit('character:poked', this.pokes);
  }

  /**
   * Turn around, show an expression + line, then go back to work.
   * Safe to call repeatedly — a newer reaction cancels the older one.
   */
  async react(line, { hold = 2600 } = {}) {
    const id = ++this.seq;
    clearTimeout(this.idleTimer);
    this.flag('is-paused-hands', true);
    if (this.head !== 'front') {
      this.set('turning', 'three', line.expression);
      await wait(motion.reduced ? 0 : 140);
      if (id !== this.seq) return;
    }
    this.set('reacting', 'front', line.expression || 'neutral');
    this.startBlinking();
    if (line.text) this.say(line.text, 'character', { duration: hold, label: line.label, typewriter: line.typewriter });
    if (line.action) setTimeout(() => bus.emit('action', line.action), 900);
    await wait(hold);
    if (id !== this.seq) return;
    this.stopBlinking();
    this.set('returning', 'three', this.expr);
    await wait(motion.reduced ? 0 : 160);
    if (id !== this.seq) return;
    this.flag('is-paused-hands', false);
    this.set('working', 'back', 'neutral');
    this.scheduleIdle();
  }

  startBlinking() {
    clearTimeout(this.blinkTimer);
    const loop = () => {
      this.blinkTimer = setTimeout(() => {
        this.flag('is-blinking', true);
        setTimeout(() => this.flag('is-blinking', false), 130);
        loop();
      }, rand(1400, 3200));
    };
    loop();
  }
  stopBlinking() { clearTimeout(this.blinkTimer); this.flag('is-blinking', false); }

  /* ---------- idle behaviours (rare, varied) ---------- */
  scheduleIdle(delay = rand(13000, 26000)) {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.runIdle(), delay);
  }

  async runIdle(forced) {
    if (this.busy) return this.scheduleIdle();
    const id = ++this.seq;
    const roll = Math.random();
    let behaviour = forced;
    if (!behaviour) {
      if (roll < this.sleepyChance) behaviour = 'sleepy';
      else behaviour = ['pause', 'glance-window', 'stretch', 'lean', 'adjust', 'pause'][Math.floor(Math.random() * 6)];
    }
    const steps = {
      pause: ['idle', rand(2200, 3800)],
      'glance-window': ['distracted', rand(2200, 3400)],
      stretch: ['stretching', 3000],
      sleepy: ['sleepy', rand(6000, 9000)],
      lean: ['working', 3200, 'is-leaning'],
      adjust: ['working', 1400, 'is-adjusting'],
    };
    const [state, ms, cls] = steps[behaviour] || steps.pause;
    if (cls) this.flag(cls, true);
    else this.set(state);
    await wait(ms);
    if (cls) this.flag(cls, false);
    if (id !== this.seq) return;
    this.set('working');
    this.scheduleIdle();
  }

  /** Tiny variations while working so the loop never feels mechanical. */
  scheduleMicro() {
    clearTimeout(this.microTimer);
    this.microTimer = setTimeout(() => {
      if (this.state === 'working') {
        const r = Math.random();
        if (r < 0.45) { this.flag('is-paused-hands', true); setTimeout(() => this.state === 'working' && this.flag('is-paused-hands', false), rand(700, 1700)); }
        else if (r < 0.7) { this.flag('is-tilting', true); setTimeout(() => this.flag('is-tilting', false), rand(1600, 2600)); }
      }
      this.scheduleMicro();
    }, rand(2200, 5200));
  }

  /** Called by the ambience manager. */
  onAmbience({ sleepyChance = 0, onEnter = null } = {}, line) {
    this.sleepyChance = sleepyChance;
    if (this.busy) return;
    if (line && Math.random() < 0.6) {
      this.say(line, 'character', { duration: 2200 });
    }
    if (onEnter === 'glance-window') this.runIdle('glance-window');
    else if (onEnter === 'stretch') this.runIdle('stretch');
  }
}
