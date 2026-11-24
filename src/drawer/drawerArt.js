/**
 * PLACEHOLDER ARTWORK for the drawer experience (SVG, same palette as the room).
 * Every drawing is a small function returning { vb: [w, h], svg } so each one can be
 * swapped for painted artwork later — return `<image href="assets/objects/drawer/..."/>`
 * inside the same viewBox, keep the export name, and nothing else changes.
 */
import { paintFilters } from '../room/art/defs.js';

const OUT = '#3a2416';               // shared ink outline
const ink = (o = 0.55, w = 2) => `stroke="${OUT}" stroke-opacity="${o}" stroke-width="${w}" stroke-linejoin="round"`;

/* ---------------- in-room drawer (overlays the painted one, stage coords) ---------------- */
export function roomDrawerSvg() {
  const bits = [
    ['#efe6d4', 520, 626, 14, 7, -10], ['#a4553a', 556, 628, 18, 6, 4], ['#c9a14a', 604, 624, 26, 4, 14],
    ['#d9c27a', 640, 628, 16, 8, -6], ['#6f86a0', 668, 625, 12, 6, 0],
  ].map(([c, x, y, w, h, r]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${c}" transform="rotate(${r} ${x} ${y})"/>`).join('');
  return `
  <defs>${paintFilters('rd', { wobble: 2.5 })}
    <linearGradient id="rd-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c120b"/><stop offset="1" stop-color="#3a2416"/></linearGradient>
  </defs>
  <g class="room-drawer" aria-hidden="true">
    <rect class="room-drawer__cavity" x="482" y="638" width="214" height="56" fill="#0e0805"/>
    <g class="room-drawer__box">
      <g class="room-drawer__inside">
        <path d="M478 640 L700 640 L690 612 L488 612 Z" fill="url(#rd-in)"/>
        <path d="M494 636 L684 636 L677 618 L500 618 Z" fill="#cdbfa2" opacity="0.9"/>
        ${bits}
        <path d="M478 640 L488 612 M700 640 L690 612" stroke="#8a5a36" stroke-width="4"/>
        <path d="M488 612 H690" stroke="#c9935e" stroke-width="2" opacity="0.7"/>
      </g>
      <g filter="url(#rd-paint)">
        <rect x="482" y="638" width="214" height="56" fill="#6a4329" filter="url(#rd-woodH)"/>
        <path d="M482 694 V638 H696" stroke="#2a1a10" stroke-width="2.5" fill="none"/>
        <path d="M696 638 V694 H482" stroke="#b07a48" stroke-width="1.5" fill="none" opacity="0.5"/>
        <path d="M482 638 H696" stroke="#d9a46a" stroke-width="2" opacity="0.55"/>
        <circle cx="589" cy="666" r="7" fill="#7a5a22"/><circle cx="587" cy="664" r="4" fill="#c9a14a"/>
      </g>
    </g>
  </g>`;
}

/* ---------------- close-up drawer box (1000 × 640, stretches to fit) ---------------- */
export function drawerBoxSvg() {
  // newspaper lining: perspective text lines on the drawer floor
  let lines = '';
  const lerp = (a, b, t) => a + (b - a) * t;
  for (let i = 0; i < 26; i++) {
    const t = 0.05 + i * 0.035;
    if (t > 0.96) break;
    const y = lerp(112, 548, t), l = lerp(150, 100, t), r = lerp(850, 900, t);
    const mid = (l + r) / 2;
    if (i % 9 === 0) { lines += `<rect x="${l + 20}" y="${y - 6}" width="${(r - l) * 0.55}" height="9" fill="#6a5d4c" opacity="0.32"/>`; continue; }
    lines += `<path d="M${l + 20} ${y} H${mid - 12} M${mid + 12} ${y} H${r - 20 - (i % 4) * 30}" stroke="#7a6d5a" stroke-width="2.2" opacity="0.22"/>`;
  }
  return `
  <svg class="dv-box" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      ${paintFilters('dw', { wobble: 3 })}
      <filter id="dw-wob" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <linearGradient id="dw-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a40"/><stop offset="1" stop-color="#6a4329"/></linearGradient>
      <linearGradient id="dw-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4e30"/><stop offset="1" stop-color="#4a2d1b"/></linearGradient>
      <linearGradient id="dw-floor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfc1a4"/><stop offset="0.6" stop-color="#ddd0b4"/><stop offset="1" stop-color="#e8dcc0"/></linearGradient>
      <linearGradient id="dw-shadeT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0f08" stop-opacity="0.65"/><stop offset="0.25" stop-color="#1a0f08" stop-opacity="0"/></linearGradient>
      <linearGradient id="dw-shadeL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a0f08" stop-opacity="0.45"/><stop offset="0.12" stop-color="#1a0f08" stop-opacity="0"/><stop offset="0.9" stop-color="#ffcf8a" stop-opacity="0"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0.18"/></linearGradient>
      <radialGradient id="dw-warm" cx="0.75" cy="0.2" r="0.8"><stop offset="0" stop-color="#ffcf8a" stop-opacity="0.25"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></radialGradient>
    </defs>
    <ellipse cx="500" cy="622" rx="520" ry="34" fill="#000" opacity="0.45" filter="url(#dw-blur10)"/>
    <g filter="url(#dw-paint)">
      <path d="M88 16 H912 L992 594 H8 Z" fill="url(#dw-rim)" filter="url(#dw-woodV)"/>
      <path d="M130 52 H870 L858 104 H142 Z" fill="#2a1a10"/>
      <path d="M130 52 L142 104 L92 556 L50 560 Z" fill="#3d2718"/>
      <path d="M870 52 L950 560 L908 556 L858 104 Z" fill="#62402a"/>
      <path d="M142 104 H858 L908 556 H92 Z" fill="url(#dw-floor)"/>
      <g opacity="1">${lines}</g>
      <path d="M142 104 H858 L908 556 H92 Z" fill="url(#dw-shadeT)"/>
      <path d="M142 104 H858 L908 556 H92 Z" fill="url(#dw-shadeL)"/>
      <path d="M142 104 H858 L908 556 H92 Z" fill="url(#dw-warm)"/>
      <path d="M88 16 H912" stroke="#e0aa6e" stroke-width="4" opacity="0.7"/>
      <path d="M912 16 L992 594" stroke="#d9a46a" stroke-width="3" opacity="0.55"/>
      <path d="M88 16 L8 594" stroke="#2a1a10" stroke-width="3" opacity="0.6"/>
      <path d="M130 52 H870 L950 560 H50 Z" fill="none" stroke="#1a0f08" stroke-width="3" opacity="0.5"/>
      <path d="M2 590 H998 V640 H2 Z" fill="url(#dw-front)" filter="url(#dw-woodH)"/>
      <path d="M2 591 H998" stroke="#e0aa6e" stroke-width="3" opacity="0.65"/>
    </g>
  </svg>`;
}

/* ---------------- objects ---------------- */
export const OBJECT_ART = {
  notebook: () => ({ vb: [160, 120], svg: `
    <path d="M14 14 Q12 10 18 9 L146 6 Q152 6 152 12 L154 108 Q154 114 148 114 L20 116 Q14 116 14 110 Z" fill="#efe6d4" ${ink()}/>
    <path d="M10 10 Q10 6 15 6 L142 4 Q148 4 148 10 L150 104 Q150 110 144 110 L16 112 Q10 112 10 106 Z" fill="#a4553a" ${ink(0.6)}/>
    <path d="M10 10 L28 9 L30 111 L16 112 Q10 112 10 106 Z" fill="#7a3a26"/>
    <rect x="52" y="36" width="70" height="30" rx="3" fill="#efe6d4" transform="rotate(-2 87 51)"/>
    <path d="M60 46 h48 M60 55 h34" stroke="#5a3a24" stroke-width="2.4" stroke-linecap="round" opacity="0.7"/>
    <path d="M126 4 L132 112" stroke="#2c2622" stroke-width="5" opacity="0.85"/>
    <path d="M40 10 Q90 6 140 8" stroke="#e8987a" stroke-width="2" opacity="0.5" fill="none"/>` }),

  polaroid: () => ({ vb: [100, 118], svg: `
    <rect x="4" y="4" width="92" height="110" rx="2" fill="#f2ead9" ${ink(0.45)}/>
    <rect x="11" y="11" width="78" height="72" fill="#8fb0c8"/>
    <circle cx="68" cy="30" r="9" fill="#f2c27e"/>
    <path d="M11 64 Q32 44 50 58 Q66 46 89 60 V83 H11 Z" fill="#6e8a55"/>
    <path d="M11 74 Q40 64 89 76 V83 H11 Z" fill="#4e6a40"/>
    <path d="M42 70 q2 -10 6 -10 q4 0 5 10 z" fill="#a4553a"/>
    <path d="M18 98 q10 -4 20 0 t20 -1 t18 1" stroke="#5a3a24" stroke-width="2" fill="none" opacity="0.6"/>` }),

  pencil: () => ({ vb: [220, 30], svg: `
    <path d="M38 6 H176 V24 H38 Z" fill="#d9ad4a" ${ink(0.5)}/>
    <path d="M38 12 H176" stroke="#f2cf7a" stroke-width="3"/><path d="M38 19 H176" stroke="#b08a2e" stroke-width="2"/>
    <path d="M176 5 H192 V25 H176 Z" fill="#b9bcbf" ${ink(0.5)}/><path d="M180 5 V25 M186 5 V25" stroke="#8a8d90" stroke-width="1.5"/>
    <path d="M192 6 H206 Q212 6 212 12 V18 Q212 24 206 24 H192 Z" fill="#e0908a" ${ink(0.5)}/>
    <path d="M38 6 L10 15 L38 24 Z" fill="#e8c890" ${ink(0.5)}/>
    <path d="M18 12.4 L10 15 L18 17.6 Z" fill="#2c2622"/>` }),

  clips: () => ({ vb: [92, 72], svg: `
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 54 V18 Q20 8 30 8 Q40 8 40 18 V48 Q40 54 34 54 Q28 54 28 48 V22" stroke="#9aa5ad" stroke-width="4" transform="rotate(-20 30 30)"/>
      <path d="M50 60 V24 Q50 14 60 14 Q70 14 70 24 V54 Q70 60 64 60 Q58 60 58 54 V28" stroke="#a4553a" stroke-width="4" transform="rotate(14 60 36)"/>
      <path d="M36 66 V34 Q36 26 44 26 Q52 26 52 34 V60 Q52 65 47 65 Q42 65 42 60 V38" stroke="#c9d0d4" stroke-width="3.6" transform="rotate(62 44 46)"/>
    </g>` }),

  note: () => ({ vb: [112, 90], svg: `
    <path d="M6 10 L104 6 L106 82 L8 86 Z" fill="#d9c27a" ${ink(0.45)}/>
    <path d="M6 10 L104 6 L102 30 L10 34 Z" fill="#e6d28e"/>
    <path d="M10 34 L102 30" stroke="#a88f44" stroke-width="2" opacity="0.7"/>
    <text x="56" y="64" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="20" fill="#5a3a24" transform="rotate(-3 56 60)">for you</text>
    <path d="M40 70 q16 6 32 0" stroke="#a4553a" stroke-width="2" fill="none"/>` }),

  // small torn piece of paper, tucked in — the note to the hiring manager
  hiringNote: () => ({ vb: [104, 84], svg: `
    <path d="M6 9 L18 6 L27 8 L39 5 L52 7 L64 4 L77 7 L88 5 L98 8 L97 20 L99 33 L96 46 L98 60 L95 74 L84 77 L70 75 L57 78 L44 76 L31 79 L18 76 L8 78 L7 64 L5 50 L8 37 L5 23 Z" fill="#f1e4c3" ${ink(0.45)}/>
    <path d="M6 9 L18 6 L27 8 L39 5 L52 7 L64 4 L77 7 L88 5 L98 8 L97 20 L99 33 L60 30 Z" fill="#f8efd8" opacity="0.6"/>
    <path d="M70 75 L95 74 L98 60 Z" fill="#d9c8a0" opacity="0.6"/>
    <text x="13" y="24" font-family="Caveat, cursive" font-weight="700" font-size="13" fill="#4a3020" transform="rotate(-2 13 24)">Dear Hiring Manager,</text>
    <path d="M13 36 q10 -2 20 0 t20 -1 t22 1 M13 46 q12 -2 24 0 t26 0 M13 56 q10 -1 20 0 t22 0 t16 -1" stroke="#5a3a24" stroke-width="1.6" fill="none" opacity="0.45" stroke-linecap="round"/>
    <text x="58" y="70" font-family="Caveat, cursive" font-weight="700" font-size="11" fill="#a4553a">Hire me?</text>` }),

  crumpled: () => ({ vb: [120, 110], svg: `
    <path d="M18 34 L30 12 L54 18 L70 6 L94 20 L108 44 L100 66 L110 86 L84 100 L60 94 L36 104 L14 86 L20 62 L8 48 Z" fill="#e8dcc2" ${ink(0.5)}/>
    <path d="M30 12 L44 46 L70 6 M44 46 L94 20 M44 46 L60 94 M44 46 L14 86 M44 46 L20 62 M70 52 L108 44 M70 52 L84 100 M70 52 L60 94 M70 52 L44 46" stroke="#8a7a62" stroke-width="1.8" opacity="0.55" fill="none"/>
    <path d="M44 46 L70 52 L60 94 L36 104 Z" fill="#cfc1a4" opacity="0.7"/>
    <path d="M70 6 L94 20 L70 52 L44 46 Z" fill="#f6efe0" opacity="0.8"/>
    <path d="M52 30 q6 -2 10 2 M80 70 q6 0 8 4" stroke="#6f86a0" stroke-width="1.6" fill="none" opacity="0.5"/>` }),

  camera: () => ({ vb: [176, 120], svg: `
    <path d="M48 18 Q50 8 60 8 H92 Q102 8 104 18 Z" fill="#3d4248" ${ink(0.6)}/>
    <rect x="8" y="18" width="160" height="94" rx="14" fill="#41464d" ${ink(0.6)}/>
    <rect x="8" y="44" width="160" height="50" fill="#6a4329"/>
    ${Array.from({ length: 16 }, (_, i) => `<path d="M${12 + i * 10} 48 v42" stroke="#4a2d1b" stroke-width="1.5" opacity="0.5"/>`).join('')}
    <rect x="16" y="26" width="26" height="14" rx="3" fill="#e8eef0" opacity="0.9"/>
    <circle cx="140" cy="22" r="6" fill="#a4553a"/>
    <circle cx="92" cy="66" r="36" fill="#c9c9c0" ${ink(0.6)}/>
    <circle cx="92" cy="66" r="27" fill="#2a2d31"/>
    <circle cx="92" cy="66" r="17" fill="#1a1c20"/><circle cx="92" cy="66" r="17" fill="#4d6a8a" opacity="0.35"/>
    <circle cx="84" cy="58" r="6" fill="#fff" opacity="0.7"/>
    <path d="M18 24 H160" stroke="#fff" stroke-width="2" opacity="0.18"/>` }),

  fortune: () => ({ vb: [112, 112], svg: `
    <g class="ft">
      <path class="ft__a" d="M56 6 L106 56 L56 56 Z" fill="#efe6d4" ${ink(0.5)}/>
      <path class="ft__b" d="M106 56 L56 106 L56 56 Z" fill="#a9c0a0" ${ink(0.5)}/>
      <path class="ft__c" d="M56 106 L6 56 L56 56 Z" fill="#e0a07a" ${ink(0.5)}/>
      <path class="ft__d" d="M6 56 L56 6 L56 56 Z" fill="#a9bccb" ${ink(0.5)}/>
      <path d="M56 6 V106 M6 56 H106" stroke="${OUT}" stroke-width="1.6" opacity="0.5"/>
      <circle cx="74" cy="38" r="4" fill="#a4553a"/><circle cx="74" cy="74" r="4" fill="#efe6d4"/>
      <circle cx="38" cy="74" r="4" fill="#6f86a0"/><circle cx="38" cy="38" r="4" fill="#c9a14a"/>
    </g>` }),

  stickers: () => ({ vb: [140, 110], svg: `
    <path d="M8 8 H132 V84 L108 102 H8 Z" fill="#f6efe0" ${ink(0.45)}/>
    <path d="M132 84 L108 102 L112 84 Z" fill="#d9ccb0" ${ink(0.45)}/>
    <path d="M34 22 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1 z" fill="#d9ad4a" ${ink(0.5, 1.5)}/>
    <path d="M86 30 q8 -12 16 0 q8 -12 16 0 q0 12 -16 22 q-16 -10 -16 -22 z" fill="#c45a3e" ${ink(0.5, 1.5)}/>
    <circle cx="34" cy="76" r="14" fill="#8a9a6a" ${ink(0.5, 1.5)}/>
    <path d="M64 86 l4 -14 l6 8 l6 -8 l4 14 q-10 6 -20 0 z" fill="#c9844a" ${ink(0.5, 1.5)}/>
    <circle cx="70" cy="80" r="1.6" fill="#2a1c17"/><circle cx="78" cy="80" r="1.6" fill="#2a1c17"/>` }),

  cattoy: () => ({ vb: [150, 90], svg: `
    <path d="M118 52 Q138 54 140 40 Q142 26 128 28" stroke="#c4622d" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M14 56 Q14 26 58 22 Q100 20 118 52 Q100 72 60 74 Q22 74 14 56 Z" fill="#8f8a86" ${ink(0.55)}/>
    <path d="M30 34 Q60 26 100 40" stroke="#b9b4ae" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M40 66 Q70 72 104 58" stroke="#5a5550" stroke-width="2" stroke-dasharray="4 4" fill="none"/>
    <circle cx="36" cy="26" r="13" fill="#8f8a86" ${ink(0.55)}/><circle cx="36" cy="26" r="7" fill="#e8a090"/>
    <circle cx="24" cy="46" r="3" fill="#2a1c17"/>
    <circle cx="10" cy="54" r="4" fill="#e8a090"/>
    <path d="M12 52 l-8 -6 M12 56 l-9 2" stroke="#2a1c17" stroke-width="1" opacity="0.6"/>
    <circle cx="128" cy="28" r="6" fill="#d9ad4a" ${ink(0.5, 1.5)}/>` }),

  cookie: () => ({ vb: [106, 106], svg: `
    <defs><mask id="ck-bites" maskUnits="userSpaceOnUse" x="0" y="0" width="106" height="106">
      <rect width="106" height="106" fill="#fff"/>
      <g class="ck-bite ck-bite--1"><circle cx="96" cy="28" r="16" fill="#000"/><circle cx="84" cy="14" r="11" fill="#000"/></g>
      <g class="ck-bite ck-bite--2"><circle cx="100" cy="66" r="18" fill="#000"/><circle cx="92" cy="84" r="12" fill="#000"/></g>
      <g class="ck-bite ck-bite--3"><circle cx="20" cy="92" r="20" fill="#000"/><circle cx="44" cy="100" r="12" fill="#000"/></g>
    </mask></defs>
    <g mask="url(#ck-bites)">
      <circle cx="53" cy="53" r="46" fill="#c98f52" ${ink(0.55)}/>
      <circle cx="53" cy="53" r="38" fill="#d9a066"/>
      <path d="M26 30 q20 -12 46 -4" stroke="#f0c48a" stroke-width="4" fill="none" opacity="0.6"/>
      ${[[36, 40, 6], [62, 34, 5], [70, 60, 7], [44, 66, 5], [56, 78, 4], [28, 58, 4], [80, 44, 3]].map(([x, y, r]) => `<path d="M${x - r} ${y} q${r} ${-r * 1.4} ${r * 2} 0 q${-r} ${r} ${-r * 2} 0z" fill="#4a2a18"/>`).join('')}
    </g>` }),
};

/* ---------------- the lucky charm ---------------- */
export const charmArt = () => ({ vb: [90, 112], svg: `
  <path d="M45 4 Q22 6 26 30 Q30 46 45 50 Q60 46 64 30 Q68 6 45 4" stroke="#b5352e" stroke-width="3.5" fill="none"/>
  <circle cx="45" cy="52" r="5" fill="#d9ad4a" ${ink(0.5, 1.5)}/>
  <g transform="translate(45 80)">
    ${[0, 90, 180, 270].map((a) => `<ellipse cx="0" cy="-12" rx="11" ry="14" fill="#d9ad4a" ${ink(0.55, 1.8)} transform="rotate(${a + 45})"/>`).join('')}
    ${[0, 90, 180, 270].map((a) => `<path d="M0 -4 L0 -20" stroke="#a87a22" stroke-width="1.6" transform="rotate(${a + 45})"/>`).join('')}
    <circle r="4" fill="#f2cf7a"/>
    <path d="M-12 -18 q4 -6 10 -4" stroke="#fff6d0" stroke-width="2.4" fill="none" opacity="0.8"/>
  </g>` });

/** Wrap an art object in an <svg> (with the shared hand-drawn wobble). */
export const toSvg = ({ vb, svg }, cls = '') =>
  `<svg class="${cls}" viewBox="0 0 ${vb[0]} ${vb[1]}" aria-hidden="true" focusable="false"><g filter="url(#dw-wob)">${svg}</g></svg>`;
