/**
 * PLACEHOLDER — outside views, one per ambience `sky` id.
 * Each is 360×460 and sits at stage (80,100). The visible glass is local (54,44)–(316,400).
 * Replace via ASSETS.skies.<id>.
 */
import { svgOpen, paintFilters } from './defs.js';
import { seeded } from '../../core/dom.js';

export const SKY_BOX = { x: 80, y: 100, w: 360, h: 460 };

function roofs(rnd, color, windowColor, litChance, baseY = 330) {
  let out = '';
  let x = 30;
  while (x < 340) {
    const w = 30 + rnd() * 40;
    const h = 30 + rnd() * 60;
    const top = baseY - h;
    const roof = rnd() > 0.5
      ? `<path d="M${x - 4} ${top} L${x + w / 2} ${top - 16 - rnd() * 10} L${x + w + 4} ${top} Z" fill="${color}"/>`
      : `<rect x="${x + w * 0.6}" y="${top - 14}" width="6" height="14" fill="${color}"/>`;
    out += `${roof}<rect x="${x}" y="${top}" width="${w}" height="${460 - top}" fill="${color}"/>`;
    for (let wy = top + 8; wy < baseY + 60; wy += 14) {
      for (let wx = x + 5; wx < x + w - 8; wx += 12) {
        if (rnd() < litChance) out += `<rect x="${wx}" y="${wy}" width="5" height="7" fill="${windowColor}" opacity="${0.5 + rnd() * 0.5}"/>`;
      }
    }
    x += w + rnd() * 6;
  }
  return out;
}

function trees(rnd, colors, y = 360, count = 9, size = 28) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const cx = 40 + rnd() * 290;
    const cy = y + rnd() * 40;
    const s = size * (0.7 + rnd() * 0.6);
    out += `<rect x="${cx - 2}" y="${cy}" width="4" height="${s}" fill="#2a2018" opacity="0.8"/>`;
    for (let k = 0; k < 4; k++) {
      out += `<circle cx="${cx + (rnd() - 0.5) * s}" cy="${cy - rnd() * s * 0.8}" r="${s * (0.4 + rnd() * 0.3)}" fill="${colors[k % colors.length]}"/>`;
    }
  }
  return out;
}

function clouds(rnd, color, op, n = 5, yMin = 50, yMax = 200) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const cx = 40 + rnd() * 300, cy = yMin + rnd() * (yMax - yMin), w = 50 + rnd() * 70;
    for (let k = 0; k < 5; k++) out += `<ellipse cx="${cx + (k - 2) * w * 0.22}" cy="${cy - Math.sin((k / 4) * Math.PI) * 10}" rx="${w * 0.3}" ry="${w * 0.16}" fill="${color}" opacity="${op}"/>`;
  }
  return out;
}

const wrap = (P, inner, extraDefs = '') => `${svgOpen(360, 460)}
  <defs>${paintFilters(P, { wobble: 5, streak: 1 })}${extraDefs}</defs>
  <g filter="url(#${P}-paint)">${inner}</g></svg>`;

export const SKIES = {
  rainy() {
    const r = seeded(3);
    return wrap('sr', `
      <rect width="360" height="460" fill="url(#sr-g)"/>
      <g filter="url(#sr-blur10)">${clouds(r, '#3f4a58', 0.75, 7, 40, 180)}${clouds(r, '#7c8896', 0.4, 4, 90, 220)}</g>
      <g opacity="0.55">${roofs(r, '#3a4350', '#e8b866', 0.06, 340)}</g>
      <rect y="250" width="360" height="120" fill="#8b97a3" opacity="0.25" filter="url(#sr-blur24)"/>
      <g opacity="0.9">${trees(r, ['#2c3a40', '#34444a', '#26333a'], 390, 8, 34)}</g>
      <rect y="420" width="360" height="40" fill="#222a32"/>`,
    `<linearGradient id="sr-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c5a6c"/><stop offset="0.6" stop-color="#7e8b98"/><stop offset="1" stop-color="#5a6672"/></linearGradient>`);
  },
  sunny() {
    const r = seeded(5);
    return wrap('ss', `
      <rect width="360" height="460" fill="url(#ss-g)"/>
      <circle cx="270" cy="70" r="60" fill="#fff2c4" opacity="0.5" filter="url(#ss-blur24)"/>
      <g filter="url(#ss-blur4)">${clouds(r, '#fffaf0', 0.85, 4, 60, 170)}</g>
      <g>${roofs(r, '#b07a5a', '#4a3a30', 0.08, 350)}</g>
      <g>${trees(r, ['#6e8a4a', '#8fa85a', '#5a7a3e', '#b5c27a'], 380, 9, 34)}</g>
      <rect y="425" width="360" height="35" fill="#6a7a42"/>`,
    `<linearGradient id="ss-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb0d6"/><stop offset="0.65" stop-color="#cfe0e0"/><stop offset="1" stop-color="#f0dcb0"/></linearGradient>`);
  },
  night() {
    const r = seeded(8);
    return wrap('sn', `
      <rect width="360" height="460" fill="url(#sn-g)"/>
      <circle cx="250" cy="96" r="44" fill="#cfd8f0" opacity="0.25" filter="url(#sn-blur24)"/>
      <circle cx="250" cy="96" r="19" fill="#efe9d2"/><circle cx="258" cy="90" r="17" fill="#1a2544"/>
      <g filter="url(#sn-blur10)">${clouds(r, '#2a3858', 0.6, 3, 140, 230)}</g>
      <g>${roofs(r, '#121a2e', '#f2b866', 0.32, 360)}</g>
      <g>${trees(r, ['#0e1424', '#141c30'], 400, 6, 30)}</g>
      <rect y="430" width="360" height="30" fill="#0b101c"/>`,
    `<linearGradient id="sn-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1430"/><stop offset="0.7" stop-color="#1d2c52"/><stop offset="1" stop-color="#2c3a5e"/></linearGradient>`);
  },
  autumn() {
    const r = seeded(13);
    return wrap('sa', `
      <rect width="360" height="460" fill="url(#sa-g)"/>
      <g filter="url(#sa-blur10)">${clouds(r, '#b8a48c', 0.6, 6, 40, 200)}</g>
      <g opacity="0.8">${roofs(r, '#6a5040', '#e8b866', 0.05, 345)}</g>
      <g>${trees(r, ['#c4622d', '#d99a3e', '#a2482a', '#8c6a2f'], 380, 10, 36)}</g>
      <rect y="425" width="360" height="35" fill="#6a4a2a"/>`,
    `<linearGradient id="sa-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f9aa0"/><stop offset="0.6" stop-color="#d0b490"/><stop offset="1" stop-color="#e0b98a"/></linearGradient>`);
  },
  dreamy() {
    const r = seeded(21);
    let band = '';
    for (let i = 0; i < 9; i++) band += `<ellipse cx="${20 + i * 40}" cy="${260 - i * 22}" rx="80" ry="22" fill="#9fd0d8" opacity="0.08"/>`;
    return wrap('sd', `
      <rect width="360" height="460" fill="url(#sd-g)"/>
      <g filter="url(#sd-blur24)">${band}</g>
      <g filter="url(#sd-blur10)"><path d="M0 300 Q120 240 360 280 V330 Q180 290 0 350 Z" fill="#5fb0a0" opacity="0.18"/></g>
      <path d="M0 400 Q90 340 180 380 T360 360 V460 H0 Z" fill="#132436"/>
      <path d="M0 420 Q120 380 220 410 T360 400 V460 H0 Z" fill="#0c1826"/>
      <g opacity="0.9">${trees(r, ['#0c1826', '#102030'], 420, 5, 26)}</g>`,
    `<linearGradient id="sd-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1d36"/><stop offset="0.6" stop-color="#1d3e56"/><stop offset="1" stop-color="#2d5268"/></linearGradient>`);
  },
};

/** Faint reflections painted on the glass (stage coordinates, full 1600×900). */
export function glassSvg() {
  return `${svgOpen(1600, 900)}
  <defs>
    <linearGradient id="gl-r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.13"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="gl-edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="0.15" stop-color="#000" stop-opacity="0"/><stop offset="0.85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.3"/></linearGradient>
    <filter id="gl-b"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>
  <g>
    <rect x="134" y="144" width="262" height="356" fill="url(#gl-edge)"/>
    <path d="M150 144 L196 144 L134 236 L134 196 Z" fill="url(#gl-r)" filter="url(#gl-b)"/>
    <path d="M290 330 L330 330 L270 500 L240 500 Z" fill="url(#gl-r)" filter="url(#gl-b)"/>
    <path d="M300 144 L316 144 L270 230 L262 230 Z" fill="#fff" opacity="0.05"/>
  </g>
</svg>`;
}
