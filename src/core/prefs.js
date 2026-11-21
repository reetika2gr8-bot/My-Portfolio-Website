/** Per-visitor conveniences (last ambience, volumes). Never essential — always wrapped. */
const KEY = 'my-little-room:prefs';
let cache = null;
function load() {
  if (cache) return cache;
  try { cache = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cache = {}; }
  return cache;
}
export const prefs = {
  get(k, fallback) { const v = load()[k]; return v === undefined ? fallback : v; },
  set(k, v) {
    load()[k] = v;
    try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* private mode etc. */ }
  },
};
