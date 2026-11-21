/**
 * CAT STATE MACHINE: sleeping → waking → looking → (stretching) → returning → sleeping
 * plus 'grumpy' when poked too often. Ambient life: ear twitches, tail flicks, shifting.
 */
import { DIALOGUE } from '../config/dialogue.js';
import { wait, rand, cycler } from '../core/dom.js';
import { motion } from '../core/motion.js';

export class SvgCatRenderer {
  constructor(root) { this.root = root; }
  show(state) { this.root.dataset.state = state; }
  flag(name, on) { this.root.classList.toggle(name, on); }
}

export class CatController {
  constructor(renderers, say, character) {
    this.renderers = renderers;
    this.say = say;
    this.character = character;
    this.state = 'sleeping';
    this.seq = 0;
    this.clicks = [];
    this.wakes = 0;
    this.nextLine = cycler(DIALOGUE.cat);
    this.ambientTimer = 0;
  }

  start() { this.set('sleeping'); this.scheduleAmbient(); }

  set(state) { this.state = state; this.renderers.forEach((r) => r.show(state)); }
  flag(n, on) { this.renderers.forEach((r) => r.flag?.(n, on)); }

  scheduleAmbient() {
    clearTimeout(this.ambientTimer);
    this.ambientTimer = setTimeout(() => {
      if (this.state === 'sleeping' && !motion.reduced) {
        const cls = ['is-twitch-l', 'is-twitch-r', 'is-flick', 'is-shift'][Math.floor(Math.random() * 4)];
        this.flag(cls, true);
        setTimeout(() => this.flag(cls, false), cls === 'is-shift' ? 1600 : 700);
      }
      this.scheduleAmbient();
    }, rand(5000, 12000));
  }

  async poke() {
    const now = Date.now();
    this.clicks = this.clicks.filter((t) => now - t < 6000).concat(now);
    const id = ++this.seq;
    const ms = (n) => (motion.reduced ? Math.min(n, 400) : n);

    if (this.clicks.length >= 3) {
      this.clicks = [];
      this.set('grumpy');
      this.say('That was rude.', 'cat', { duration: 2000 });
      setTimeout(() => this.character.react({ ...DIALOGUE.character.catDefend }, { hold: 2400 }), 700);
      await wait(ms(3000));
      if (id !== this.seq) return;
      this.set('returning'); await wait(ms(700));
      if (id !== this.seq) return;
      return this.set('sleeping');
    }

    if (this.state === 'sleeping' || this.state === 'returning') {
      this.set('waking');
      await wait(ms(450));
      if (id !== this.seq) return;
    }
    this.set('looking');
    const line = this.nextLine();
    if (line.speaker === 'character') this.character.react({ text: line.text, expression: 'annoyed' }, { hold: 2300 });
    else this.say(line.text, 'cat', { duration: 1800 });
    await wait(ms(1500));
    if (id !== this.seq) return;
    if (this.wakes++ % 2 === 0) {
      this.set('stretching');
      await wait(ms(1900));
      if (id !== this.seq) return;
    }
    this.set('returning');
    await wait(ms(800));
    if (id !== this.seq) return;
    this.set('sleeping');
  }
}
