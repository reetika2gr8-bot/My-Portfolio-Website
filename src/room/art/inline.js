/**
 * Animated room pieces drawn inline (so CSS can move their parts).
 * All coordinates are on the 1600×900 stage. Each function returns an SVG fragment
 * (without the <svg> wrapper) — Room.js places them in the correct depth layer.
 */
import { starPath } from './defs.js';
import { WALL_STARS } from '../../config/objects.js';

/* ---------- CURTAINS (Layer 2) ---------- */
function curtainStrips(x0, x1, side) {
  const n = 5;
  const w = (x1 - x0) / n;
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * w;
    const hem = 612 + Math.sin(i * 1.7 + (side === 'L' ? 0 : 2)) * 10;
    const sway = (side === 'L' ? i : n - 1 - i) / (n - 1); // outer folds move less
    const dur = 5.5 + ((i * 7) % 5) * 0.55;
    const delay = -(i * 1.3);
    out += `
      <g class="fold" style="--k:${(0.35 + sway * 0.65).toFixed(2)};animation-duration:${dur}s;animation-delay:${delay}s;transform-origin:${x + w / 2}px 100px">
        <path d="M${x - 1} 100 C ${x + w * 0.2} 260, ${x - w * 0.1} 420, ${x + w * 0.05} ${hem}
                 Q ${x + w / 2} ${hem + 8} ${x + w + 1} ${hem - 4}
                 C ${x + w * 1.05} 420, ${x + w * 0.85} 260, ${x + w + 1} 100 Z"
              fill="url(#cu-fold)"/>
        <path d="M${x + w * 0.5} 104 C ${x + w * 0.62} 260, ${x + w * 0.4} 420, ${x + w * 0.52} ${hem}" stroke="#f0dcb4" stroke-width="2" opacity="0.18" fill="none"/>
      </g>`;
    out += `<circle cx="${x + w / 2}" cy="98" r="4.5" fill="none" stroke="#2a1d14" stroke-width="2.2"/>`;
  }
  return out;
}

export function curtainsSvg() {
  return `
  <defs>
    <linearGradient id="cu-fold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#5e4a32"/><stop offset="0.35" stop-color="#b59a72"/>
      <stop offset="0.55" stop-color="#cdb48a"/><stop offset="1" stop-color="#6e5638"/>
    </linearGradient>
    <linearGradient id="cu-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.25"/><stop offset="0.3" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <g class="curtain curtain--left">${curtainStrips(62, 178, 'L')}</g>
  <g class="curtain curtain--right">${curtainStrips(360, 478, 'R')}</g>
  <rect x="60" y="100" width="420" height="520" fill="url(#cu-shade)" style="mix-blend-mode:multiply" pointer-events="none" mask="url(#cu-mask)"/>
  <mask id="cu-mask"><rect x="60" y="100" width="118" height="520" fill="#fff"/><rect x="360" y="100" width="120" height="520" fill="#fff"/></mask>`;
}

/* ---------- PLANT "Basil" (Layer 5, foreground) ---------- */
const leaf = (x, y, len, ang, c1, c2) => {
  const rad = (ang * Math.PI) / 180;
  const ex = x + Math.cos(rad) * len, ey = y + Math.sin(rad) * len;
  const nx = -Math.sin(rad) * len * 0.42, ny = Math.cos(rad) * len * 0.42;
  return `<path d="M${x} ${y} Q ${(x + ex) / 2 + nx} ${(y + ey) / 2 + ny} ${ex} ${ey} Q ${(x + ex) / 2 - nx} ${(y + ey) / 2 - ny} ${x} ${y} Z" fill="${c1}"/>
          <path d="M${x} ${y} Q ${(x + ex) / 2 + nx * 0.2} ${(y + ey) / 2 + ny * 0.2} ${ex} ${ey}" stroke="${c2}" stroke-width="1.6" fill="none" opacity="0.6"/>`;
};
export function plantSvg() {
  const dark = '#2f4630', mid = '#45613e', light = '#6e8a55';
  return `
  <g class="plant">
    <ellipse cx="116" cy="898" rx="96" ry="14" fill="#000" opacity="0.5"/>
    <g class="plant__stem plant__stem--a" style="transform-origin:110px 790px">
      <path d="M110 790 Q90 700 70 640" stroke="#3a4a2a" stroke-width="4" fill="none"/>
      ${leaf(70, 640, 80, -120, mid, light)}${leaf(84, 690, 70, -160, dark, light)}${leaf(78, 662, 64, -60, light, '#a9bd7a')}
    </g>
    <g class="plant__stem plant__stem--b" style="transform-origin:120px 790px">
      <path d="M120 790 Q140 690 168 610" stroke="#3a4a2a" stroke-width="4" fill="none"/>
      ${leaf(168, 610, 84, -70, mid, light)}${leaf(150, 660, 76, -20, dark, light)}${leaf(160, 630, 60, -120, light, '#a9bd7a')}
    </g>
    <g class="plant__stem plant__stem--c" style="transform-origin:116px 790px">
      <path d="M116 790 Q112 700 120 590" stroke="#3a4a2a" stroke-width="4" fill="none"/>
      ${leaf(120, 590, 76, -95, light, '#c2d08a')}${leaf(114, 700, 66, -140, mid, light)}${leaf(118, 650, 58, -40, dark, light)}
    </g>
    <path d="M42 786 H190 L174 898 H58 Z" fill="#9a5034"/>
    <path d="M42 786 H190 L174 898 H58 Z" fill="url(#pl-pot)"/>
    <rect x="34" y="776" width="164" height="20" rx="4" fill="#b0613e"/>
    <rect x="34" y="776" width="164" height="4" rx="2" fill="#e8a070" opacity="0.5"/>
    <defs><linearGradient id="pl-pot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.08"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></linearGradient></defs>
  </g>`;
}

/* ---------- COFFEE (desk) ---------- */
export function coffeeSvg() {
  const steam = (x, i) => `<path class="steam steam--${i}" d="M${x} 552 q -8 -12 0 -24 q 8 -12 0 -24 q -8 -12 0 -22" stroke="#f2ead9" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  return `
  <g class="coffee">
    <g class="coffee__steam">${steam(950, 1)}${steam(960, 2)}${steam(970, 3)}</g>
    <g class="coffee__mug">
      <ellipse cx="958" cy="601" rx="24" ry="5" fill="#000" opacity="0.4"/>
      <path d="M978 568 q16 0 16 14 q0 14 -18 14" stroke="#c9d3d6" stroke-width="5" fill="none"/>
      <path d="M938 558 h40 v34 q0 8 -8 8 h-24 q-8 0 -8 -8 z" fill="#c9d3d6"/>
      <path d="M938 558 h40 v34 q0 8 -8 8 h-24 q-8 0 -8 -8 z" fill="url(#cf-shade)"/>
      <path d="M944 572 h28 M944 580 h20" stroke="#6f86a0" stroke-width="2" opacity="0.7"/>
      <ellipse cx="958" cy="558" rx="20" ry="4.5" fill="#e6ecee"/>
      <ellipse cx="958" cy="559" rx="16" ry="3" fill="#3a2216"/>
    </g>
    <defs><linearGradient id="cf-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.25"/><stop offset="0.6" stop-color="#ffd59a" stop-opacity="0.18"/><stop offset="1" stop-color="#000" stop-opacity="0.3"/></linearGradient></defs>
  </g>`;
}

/* ---------- CASSETTE RADIO (window sill) ---------- */
export function radioSvg() {
  const reel = (cx) => `<g class="reel" style="transform-origin:${cx}px 478px">
      <circle cx="${cx}" cy="478" r="7" fill="#efe6d4"/><circle cx="${cx}" cy="478" r="2.4" fill="#3a2c22"/>
      ${[0, 60, 120].map((a) => `<rect x="${cx - 0.8}" y="471" width="1.6" height="14" fill="#3a2c22" transform="rotate(${a} ${cx} 478)"/>`).join('')}
    </g>`;
  return `
  <g class="radio">
    <ellipse cx="345" cy="500" rx="60" ry="5" fill="#000" opacity="0.45"/>
    <path d="M300 456 q0 -16 14 -16 h62 q14 0 14 16" stroke="#3a2c22" stroke-width="4" fill="none"/>
    <path d="M378 446 L404 404" stroke="#8a8a80" stroke-width="2"/><circle cx="404" cy="404" r="2.5" fill="#c9c9c0"/>
    <rect x="290" y="454" width="110" height="46" rx="7" fill="#7a4e30"/>
    <rect x="290" y="454" width="110" height="46" rx="7" fill="url(#rd-shade)"/>
    <rect x="296" y="460" width="38" height="34" rx="4" fill="#3a2c22"/>
    ${Array.from({ length: 4 }, (_, row) => Array.from({ length: 4 }, (_, col) => `<circle cx="${302 + col * 8.5}" cy="${466 + row * 7.5}" r="2.2" fill="#1a120c"/>`).join('')).join('')}
    <rect x="340" y="462" width="54" height="30" rx="3" fill="#d9ccb0"/>
    <rect x="344" y="468" width="46" height="20" rx="2" fill="#2e2a26"/>
    ${reel(357)}${reel(377)}
    <rect x="344" y="456" width="10" height="4" rx="1" fill="#c9a14a"/><rect x="358" y="456" width="10" height="4" rx="1" fill="#c9a14a"/><rect x="372" y="456" width="10" height="4" rx="1" fill="#c9a14a"/>
    <circle class="radio__led" cx="390" cy="458" r="2.2" fill="#5a3a20"/>
    <rect x="290" y="454" width="110" height="3" rx="1.5" fill="#d9a46a" opacity="0.5"/>
    <defs><linearGradient id="rd-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.08"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></linearGradient></defs>
  </g>`;
}

/* ---------- PAPER PLANE mobile ---------- */
export function planeSvg() {
  return `
  <g class="plane" style="transform-origin:1206px 40px">
    <path d="M1206 40 V96" stroke="#d8c8a8" stroke-width="0.9" opacity="0.6"/>
    <path d="M1172 112 L1240 98 L1206 118 Z" fill="#efe6d4"/>
    <path d="M1206 118 L1240 98 L1200 126 Z" fill="#c9bea6"/>
    <path d="M1172 112 L1206 118 L1200 126 Z" fill="#d9ceb6"/>
    <path d="M1178 111 l20 -2 M1182 115 l18 0" stroke="#7a6a58" stroke-width="0.7" opacity="0.6"/>
  </g>`;
}

/* ---------- WALL STAR GLOW (glow-in-the-dark) ---------- */
export function wallStarGlowSvg() {
  return `
  <defs><filter id="ws-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <g class="wall-stars" filter="url(#ws-glow)">
    ${WALL_STARS.map(([x, y, s], i) => `<path class="wall-star" style="animation-delay:${-i * 0.7}s" d="${starPath(x, y, s)}" fill="#d6f2c2"/>`).join('')}
  </g>`;
}

/* ---------- LIGHTING RIG (Layer above everything in the room) ---------- */
export function lightingSvg() {
  return `
  <defs>
    <radialGradient id="lt-lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd59a" stop-opacity="0.8"/><stop offset="0.3" stop-color="#f0a25a" stop-opacity="0.3"/><stop offset="0.65" stop-color="#e08a40" stop-opacity="0.08"/><stop offset="1" stop-color="#e08a40" stop-opacity="0"/></radialGradient>
    <radialGradient id="lt-bulb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff6dc" stop-opacity="1"/><stop offset="1" stop-color="#ffd59a" stop-opacity="0"/></radialGradient>
    <linearGradient id="lt-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2b0" stop-opacity="0.5"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient>
    <radialGradient id="lt-mon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#d8ecff" stop-opacity="0.32"/><stop offset="0.45" stop-color="#b9d4f0" stop-opacity="0.1"/><stop offset="1" stop-color="#a9c8e8" stop-opacity="0"/></radialGradient>
    <linearGradient id="lt-sun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe0a0" stop-opacity="0.75"/><stop offset="1" stop-color="#ffc870" stop-opacity="0"/></linearGradient>
    <linearGradient id="lt-moon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9cdf0" stop-opacity="0.6"/><stop offset="1" stop-color="#9fb6e0" stop-opacity="0"/></linearGradient>
    <radialGradient id="lt-vig" cx="0.52" cy="0.5" r="0.72"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#06060a" stop-opacity="0.9"/></radialGradient>
    <filter id="lt-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>
  <mask id="lt-winmask"><rect width="1600" height="900" fill="#fff"/><rect x="138" y="148" width="254" height="348" fill="#000" opacity="0.55" filter="url(#lt-soft)"/></mask>
  <g mask="url(#lt-winmask)"><rect class="lt lt-tint" width="1600" height="900" style="mix-blend-mode:multiply"/></g>
  <rect class="lt lt-haze" width="1600" height="900" style="mix-blend-mode:screen"/>
  <g class="lt lt-sun" style="mix-blend-mode:screen" filter="url(#lt-soft)">
    <path d="M140 150 L390 150 L900 760 L520 880 Z" fill="url(#lt-sun)" opacity="0.75"/>
    <path d="M520 700 L980 640 L1100 840 L560 900 Z" fill="#ffd48a" opacity="0.35"/>
    <path d="M600 330 L760 300 L800 420 L640 440 Z" fill="#ffe0a0" opacity="0.25"/>
  </g>
  <g class="lt lt-moon" style="mix-blend-mode:screen" filter="url(#lt-soft)">
    <path d="M140 150 L390 150 L820 760 L480 860 Z" fill="url(#lt-moon)" opacity="0.32"/>
    <path d="M480 720 L860 680 L960 840 L520 890 Z" fill="#a9c0ea" opacity="0.22"/>
  </g>
  <g class="lt lt-monitor" style="mix-blend-mode:screen">
    <ellipse cx="676" cy="488" rx="190" ry="150" fill="url(#lt-mon)"/>
  </g>
  <g class="lt lt-lamp" style="mix-blend-mode:screen">
    <ellipse cx="1030" cy="560" rx="440" ry="330" fill="url(#lt-lamp)"/>
    <path d="M1018 484 L1094 502 L1190 620 L880 620 Z" fill="url(#lt-cone)" filter="url(#lt-soft)"/>
    <ellipse cx="1054" cy="494" rx="60" ry="28" fill="url(#lt-bulb)" transform="rotate(-18 1054 494)"/>
  </g>
  <rect class="lt lt-vignette" width="1600" height="900" fill="url(#lt-vig)" style="mix-blend-mode:multiply"/>`;
}
