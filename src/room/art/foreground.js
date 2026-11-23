/**
 * PLACEHOLDER — Layer 5: the bed (headboard, quilt, pillow) and foreground shadow.
 * Sits IN FRONT of the character; the cat is drawn on top of it.
 * Replace via ASSETS.layers.foreground.
 */
import { svgOpen, paintFilters } from './defs.js';
import { seeded } from '../../core/dom.js';

export function foregroundSvg() {
  const r = seeded(99);
  const P = 'fg';

  // quilt: soft diamond stitching + broad fold shading (no hard blocks)
  let patches = '';
  for (let i = -6; i < 14; i++) {
    patches += `<path d="M${1200 + i * 46} 600 L${1200 + i * 46 + 300} 900" stroke="#c9b28c" stroke-width="1" stroke-dasharray="5 6" opacity="0.22"/>`;
    patches += `<path d="M${1200 + i * 46} 900 L${1200 + i * 46 + 300} 600" stroke="#c9b28c" stroke-width="1" stroke-dasharray="5 6" opacity="0.16"/>`;
  }
  for (let i = 0; i < 18; i++) {
    const x = 1270 + r() * 320, y = 660 + r() * 220;
    patches += `<path d="M${x} ${y} l7 -7 l7 7 l-7 7 z" fill="#d4c09a" opacity="${0.12 + r() * 0.12}"/>`;
  }
  let stitches = '';
  for (let i = 0; i < 4; i++) {
    const y = 700 + i * 50;
    stitches += `<path d="M1260 ${y} Q1420 ${y - 22} 1600 ${y - 8}" stroke="#2a3442" stroke-width="${10 - i * 2}" opacity="0.18" fill="none" filter="url(#${P}-blur4)"/>`;
  }
  // knitted throw folded at the foot of the bed
  const throwBlanket = `
    <path d="M1330 812 Q1460 770 1600 780 V900 H1392 Q1352 860 1330 812 Z" fill="#c9a06a"/>
    <path d="M1330 812 Q1460 770 1600 780" stroke="#e8c48a" stroke-width="3" opacity="0.7" fill="none"/>
    ${Array.from({ length: 10 }, (_, i) => `<path d="M${1350 + i * 26} ${808 - i * 3} Q${1360 + i * 27} ${850} ${1380 + i * 25} 900" stroke="#9a7444" stroke-width="2" opacity="0.45" fill="none"/>`).join('')}
    <path d="M1340 830 Q1460 796 1600 806" stroke="#7a5a34" stroke-width="2" opacity="0.4" fill="none"/>`;

  return `${svgOpen(1600, 900)}
  <defs>
    ${paintFilters(P, { wobble: 4 })}
    <linearGradient id="${P}-head" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e4429"/><stop offset="1" stop-color="#3a2416"/></linearGradient>
    <linearGradient id="${P}-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a3442"/><stop offset="1" stop-color="#3f4e60"/></linearGradient>
    <radialGradient id="${P}-warm" cx="0.2" cy="0.1" r="0.8"><stop offset="0" stop-color="#e8a85a" stop-opacity="0.35"/><stop offset="1" stop-color="#e8a85a" stop-opacity="0"/></radialGradient>
    <linearGradient id="${P}-floorShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#05070a" stop-opacity="0.22"/></linearGradient>
    <linearGradient id="${P}-quilt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6f8197"/><stop offset="0.6" stop-color="#55677c"/><stop offset="1" stop-color="#3f4e60"/></linearGradient>
    <clipPath id="${P}-top"><path d="M1252 646 Q1420 628 1600 634 V900 H1420 Q1330 770 1252 646 Z"/></clipPath>
  </defs>
  <rect x="0" y="780" width="1600" height="120" fill="url(#${P}-floorShade)"/>
  <g filter="url(#${P}-paint)">
    <path d="M1180 900 Q1220 760 1236 700 L1600 700 V900 Z" fill="#000" opacity="0.4" filter="url(#${P}-blur24)"/>
    <path d="M1238 652 V556 Q1244 522 1296 516 Q1420 490 1560 512 Q1600 518 1600 540 V652 Z" fill="url(#${P}-head)" filter="url(#${P}-woodV)"/>
    <path d="M1262 640 V566 Q1268 540 1304 536 Q1420 514 1560 532 Q1590 538 1600 548 V640 Z" fill="#4a2d1b" opacity="0.8"/>
    <path d="M1262 566 Q1268 540 1304 536 Q1420 514 1560 532" stroke="#c9935e" stroke-width="2" fill="none" opacity="0.4"/>
    <rect x="1226" y="526" width="24" height="200" rx="4" fill="#4e301d"/>
    <circle cx="1238" cy="520" r="14" fill="#5e3a24"/><circle cx="1234" cy="515" r="5" fill="#c9935e" opacity="0.5"/>
    <path d="M1250 530 V720" stroke="#d9a46a" stroke-width="1.5" opacity="0.35"/>
    <path d="M1468 604 Q1500 588 1590 598 Q1606 620 1594 652 Q1530 662 1468 650 Q1452 628 1468 604 Z" fill="#e4d6bd"/>
    <path d="M1478 610 Q1530 600 1584 606" stroke="#fff" stroke-width="2" opacity="0.35" fill="none"/>
    <path d="M1470 648 Q1530 658 1594 650" stroke="#8a7a62" stroke-width="3" opacity="0.4" fill="none"/>
    <path d="M1252 646 Q1300 760 1420 900 H1340 Q1260 800 1232 704 Z" fill="url(#${P}-side)" filter="url(#${P}-fabric)"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${1248 + i * 6} ${676 + i * 40} Q${1280 + i * 22} ${740 + i * 40} ${1300 + i * 30} ${800 + i * 30}" stroke="#1d2530" stroke-width="3" opacity="0.4" fill="none"/>`).join('')}
    <g clip-path="url(#${P}-top)">
      <rect x="1200" y="600" width="400" height="300" fill="url(#${P}-quilt)" filter="url(#${P}-fabric)"/>
      ${patches}
      ${stitches}
      <rect x="1200" y="600" width="400" height="300" fill="url(#${P}-warm)"/>
      ${[0, 1, 2].map((i) => `<path d="M${1290 + i * 90} 660 Q${1320 + i * 90} 760 ${1300 + i * 110} 900" stroke="#1d2530" stroke-width="${8 - i * 2}" opacity="0.25" fill="none" filter="url(#${P}-blur4)"/>`).join('')}
    </g>
    ${throwBlanket}
    <path d="M1252 646 Q1300 760 1420 900" stroke="#e8c79a" stroke-width="2" opacity="0.3" fill="none"/>
    <path d="M1252 646 Q1420 628 1600 634" stroke="#c9b28c" stroke-width="2" opacity="0.4" fill="none"/>
  </g>
  <path d="M0 900 V700 Q60 760 40 900 Z" fill="#05060a" opacity="0.3" filter="url(#${P}-blur24)"/>
</svg>`;
}
