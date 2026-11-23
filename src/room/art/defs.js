/**
 * Shared SVG building blocks for the PLACEHOLDER paintings.
 * These filters fake a hand-painted feel (organic wobble, brush streaks, paper grain)
 * on top of simple shapes. They are placeholders — real painted layers can replace
 * each file via src/config/assets.js.
 */
export const PALETTE = {
  woodDark: '#2e1d14', wood: '#5e3a24', woodMid: '#7a4e30', woodLight: '#a8754a', woodHi: '#c9935e',
  wallDeep: '#232a36', wall: '#3c4858', wallMid: '#4d5b6c', wallWarm: '#7a5f4b',
  cream: '#e9dcc4', offWhite: '#f2ead9', paper: '#e8dcc2',
  amber: '#e8a85a', amberHi: '#ffd59a',
  dustyBlue: '#6f86a0', blueGrey: '#5d6b7d',
  green: '#6e7f5a', greenDark: '#3f5a3a',
  rust: '#a4553a', mustard: '#c9a14a',
  ink: '#241a14',
};

export const svgOpen = (w, h, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" ${extra}>`;

/** Filters used by most static layers. ids are prefixed to avoid collisions. */
export function paintFilters(p = 'p', { wobble = 4, streak = 0.22, grain = 0.3 } = {}) {
  return `
  <filter id="${p}-paint" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.024" numOctaves="2" seed="4" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="${wobble}" xChannelSelector="R" yChannelSelector="G" result="w"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.05 0.009" numOctaves="3" seed="11" result="st"/>
    <feColorMatrix in="st" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="stG0"/>
    <feComponentTransfer in="stG0" result="stG"><feFuncR type="linear" slope="${streak}" intercept="${(1 - streak) / 2}"/><feFuncG type="linear" slope="${streak}" intercept="${(1 - streak) / 2}"/><feFuncB type="linear" slope="${streak}" intercept="${(1 - streak) / 2}"/></feComponentTransfer>
    <feBlend in="stG" in2="w" mode="soft-light" result="s1"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" result="gr"/>
    <feColorMatrix in="gr" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="grG"/>
    <feComponentTransfer in="grG" result="grS"><feFuncR type="linear" slope="${grain}" intercept="${(1 - grain) / 2}"/><feFuncG type="linear" slope="${grain}" intercept="${(1 - grain) / 2}"/><feFuncB type="linear" slope="${grain}" intercept="${(1 - grain) / 2}"/></feComponentTransfer>
    <feBlend in="grS" in2="s1" mode="soft-light" result="s2"/>
    <feComposite in="s2" in2="w" operator="in"/>
  </filter>
  <filter id="${p}-woodV" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.14 0.006" numOctaves="3" seed="7" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="g"/>
    <feBlend in="g" in2="SourceGraphic" mode="soft-light" result="b"/>
    <feComposite in="b" in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="${p}-woodH" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.005 0.16" numOctaves="3" seed="9" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="g"/>
    <feBlend in="g" in2="SourceGraphic" mode="soft-light" result="b"/>
    <feComposite in="b" in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="${p}-cork" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="3" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="g"/>
    <feComponentTransfer in="g" result="g2"><feFuncR type="linear" slope="1.8" intercept="-0.4"/><feFuncG type="linear" slope="1.8" intercept="-0.4"/><feFuncB type="linear" slope="1.8" intercept="-0.4"/></feComponentTransfer>
    <feBlend in="g2" in2="SourceGraphic" mode="soft-light" result="b"/>
    <feComposite in="b" in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="${p}-fabric" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.02 0.5" numOctaves="2" seed="5" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="g"/>
    <feBlend in="g" in2="SourceGraphic" mode="soft-light" result="b"/>
    <feComposite in="b" in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="${p}-blur4" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="${p}-blur10" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="${p}-blur24" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24"/></filter>`;
}

/** Five-point star path centred at cx,cy */
export function starPath(cx, cy, r, inner = 0.45, rot = -90) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rad = ((rot + i * 36) * Math.PI) / 180;
    const rr = i % 2 ? r * inner : r;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(rad) * rr).toFixed(1)} ${(cy + Math.sin(rad) * rr).toFixed(1)} `;
  }
  return d + 'Z';
}

/** Loose hand-drawn scribble lines inside a box (for notes, sketches, screens). */
export function scribbles(rnd, x, y, w, h, lines = 4, color = '#3a2c22', op = 0.55, sw = 1.2) {
  let out = '';
  const gap = h / (lines + 1);
  for (let i = 1; i <= lines; i++) {
    const ly = y + gap * i + (rnd() - 0.5) * 2;
    const len = w * (0.55 + rnd() * 0.4);
    let d = `M${x + 2} ${ly}`;
    const steps = 5;
    for (let s = 1; s <= steps; s++) d += ` L${x + 2 + (len * s) / steps} ${ly + (rnd() - 0.5) * 1.6}`;
    out += `<path d="${d}" stroke="${color}" stroke-opacity="${op}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
  }
  return out;
}
