/**
 * One shared requestAnimationFrame loop for every canvas animation.
 * Capped at ~30fps (plenty for rain/dust), paused when the tab is hidden,
 * when a portfolio page covers the room, or when reduced motion is on.
 */
import { motion } from './motion.js';

const subs = new Set();
let raf = 0;
let last = 0;
let pausedReasons = new Set();
const FRAME = 1000 / 30;

function loop(t) {
  raf = requestAnimationFrame(loop);
  if (t - last < FRAME - 1) return;
  const dt = Math.min(0.1, (t - last) / 1000 || FRAME / 1000);
  last = t;
  subs.forEach((fn) => fn(dt, t));
}

function update() {
  const shouldRun = subs.size && !pausedReasons.size;
  if (shouldRun && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  if (!shouldRun && raf) { cancelAnimationFrame(raf); raf = 0; }
}

export const ticker = {
  add(fn) { subs.add(fn); update(); return () => { subs.delete(fn); update(); }; },
  pause(reason) { pausedReasons.add(reason); update(); },
  resume(reason) { pausedReasons.delete(reason); update(); },
  get running() { return !!raf; },
};

document.addEventListener('visibilitychange', () =>
  document.hidden ? ticker.pause('hidden') : ticker.resume('hidden'));
if (motion.reduced) ticker.pause('reduced-motion');
motion.onChange((r) => (r ? ticker.pause('reduced-motion') : ticker.resume('reduced-motion')));
