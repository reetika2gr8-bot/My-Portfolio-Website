/** Reduced-motion awareness. Modules subscribe to stay in sync if the OS setting changes. */
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
const subs = new Set();
export const motion = {
  get reduced() { return mq.matches; },
  onChange(fn) { subs.add(fn); return () => subs.delete(fn); },
};
mq.addEventListener?.('change', () => subs.forEach((fn) => fn(mq.matches)));
