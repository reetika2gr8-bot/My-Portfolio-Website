/**
 * PLACEHOLDER — Layer 1: wall, ceiling, floor, window frame, pinboard, poster,
 * calendar, bookshelf, door. Replace with a painted file via ASSETS.layers.background.
 * The window glass (x134–396, y144–500) is left transparent.
 */
import { PALETTE as C, svgOpen, paintFilters, starPath, scribbles } from './defs.js';
import { seeded } from '../../core/dom.js';
import { WALL_STARS } from '../../config/objects.js';

export function backgroundSvg() {
  const r = seeded(42);
  const P = 'bg';

  // ---- wall planks
  let planks = '';
  const plankTones = ['#3e4a5a', '#435063', '#3a4555', '#465366', '#3f4b5c'];
  for (let x = -10, i = 0; x < 1600; x += 58, i++) {
    const w = 56 + r() * 4;
    planks += `<rect x="${x}" y="40" width="${w}" height="730" fill="${plankTones[i % plankTones.length]}"/>`;
    planks += `<rect x="${x}" y="40" width="3" height="730" fill="#141820" opacity="0.55"/>`;
    planks += `<rect x="${x + 3}" y="40" width="2" height="730" fill="#9fb0c4" opacity="0.08"/>`;
    if (r() > 0.55) planks += `<ellipse cx="${x + 12 + r() * 34}" cy="${120 + r() * 560}" rx="${2 + r() * 3}" ry="${5 + r() * 6}" fill="#2a313d" opacity="0.6"/>`;
    // painted streaks
    for (let k = 0; k < 3; k++) {
      const sx = x + 6 + r() * (w - 12);
      planks += `<path d="M${sx} ${60 + r() * 200} q ${(r() - 0.5) * 6} ${150 + r() * 200} ${(r() - 0.5) * 4} ${300 + r() * 200}" stroke="${r() > 0.5 ? '#5a6b80' : '#2c3440'}" stroke-width="${1 + r() * 2.5}" opacity="0.35" fill="none" stroke-linecap="round"/>`;
    }
  }

  // ---- floor boards (perspective)
  let floor = `<rect x="0" y="758" width="1600" height="142" fill="url(#${P}-floor)"/>`;
  for (let i = -14; i <= 14; i++) {
    const xt = 800 + i * 64, xb = 800 + i * 150;
    floor += `<path d="M${xt} 760 L${xb} 900" stroke="#160d08" stroke-width="2.2" opacity="0.7"/>`;
    floor += `<path d="M${xt + 3} 760 L${xb + 6} 900" stroke="#8a5a36" stroke-width="1" opacity="0.18"/>`;
  }
  for (const y of [790, 832, 884]) floor += `<path d="M0 ${y} L1600 ${y}" stroke="#160d08" stroke-width="1" opacity="0.25"/>`;

  // ---- window frame (glass is a hole in the wall group)
  const windowFrame = `
    <rect x="98" y="108" width="336" height="396" rx="4" fill="#24170f" opacity="0.6" filter="url(#${P}-blur4)"/>
    <path d="M106 116 H426 V500 H396 V144 H134 V500 H106 Z" fill="url(#${P}-frame)" filter="url(#${P}-woodV)"/>
    <path d="M134 144 H396 V150 H134 Z" fill="#1a110b" opacity="0.7"/>
    <path d="M128 140 V500" stroke="#c9935e" stroke-width="2" opacity="0.25"/>
    <rect x="261" y="144" width="9" height="356" fill="url(#${P}-frame)"/>
    <rect x="134" y="316" width="262" height="9" fill="url(#${P}-frame)"/>
    <rect x="268" y="144" width="2" height="356" fill="#e8a85a" opacity="0.2"/>
    <rect x="134" y="323" width="262" height="2" fill="#000" opacity="0.35"/>
    <path d="M86 496 H448 L444 528 H90 Z" fill="url(#${P}-sill)" filter="url(#${P}-woodH)"/>
    <path d="M86 496 H448" stroke="#d9a46a" stroke-width="2" opacity="0.5"/>
    <path d="M108 528 H424 V552 Q266 560 108 552 Z" fill="#3a2416"/>
    <path d="M108 552 Q266 560 424 552" stroke="#000" stroke-width="5" opacity="0.25" filter="url(#${P}-blur4)"/>`;

  // ---- curtain rod
  const rod = `
    <rect x="60" y="94" width="420" height="7" rx="3" fill="#3a2a1e"/>
    <rect x="60" y="94" width="420" height="2" fill="#b88a58" opacity="0.6"/>
    <circle cx="58" cy="97.5" r="8" fill="#4a3424"/><circle cx="482" cy="97.5" r="8" fill="#4a3424"/>
    <circle cx="56" cy="95" r="3" fill="#c9935e" opacity="0.5"/><circle cx="480" cy="95" r="3" fill="#c9935e" opacity="0.5"/>`;

  // ---- calendar between window and pinboard
  const calendar = `
    <g transform="rotate(-1.5 500 330)">
      <rect x="470" y="290" width="62" height="78" fill="${C.paper}"/>
      <rect x="470" y="290" width="62" height="20" fill="${C.rust}" opacity="0.85"/>
      <circle cx="501" cy="286" r="3" fill="#2a1b13"/>
      ${Array.from({ length: 20 }, (_, i) => `<rect x="${475 + (i % 5) * 11}" y="${316 + Math.floor(i / 5) * 12}" width="7" height="7" fill="#7a6a58" opacity="${i === 12 ? 0.9 : 0.25}"/>`).join('')}
      <circle cx="${475 + 2 * 11 + 3.5}" cy="${316 + 2 * 12 + 3.5}" r="7" fill="none" stroke="${C.rust}" stroke-width="1.4"/>
    </g>`;

  // ---- pinboard (About)
  let pins = '';
  const pin = (x, y, c) => `<circle cx="${x}" cy="${y}" r="4.2" fill="${c}"/><circle cx="${x - 1.3}" cy="${y - 1.3}" r="1.4" fill="#fff" opacity="0.6"/>`;
  const polaroid = (x, y, rot, sky, ground) => `
    <g transform="rotate(${rot} ${x + 19} ${y})">
      <rect x="${x + 2}" y="${y + 3}" width="38" height="45" fill="#000" opacity="0.25"/>
      <rect x="${x}" y="${y}" width="38" height="45" fill="#eee5d2"/>
      <rect x="${x + 4}" y="${y + 4}" width="30" height="28" fill="${sky}"/>
      <path d="M${x + 4} ${y + 24} q8 -8 15 -2 q8 -7 15 0 V${y + 32} H${x + 4} Z" fill="${ground}"/>
      <rect x="${x + 16}" y="${y - 6}" width="6" height="11" fill="#c9a77a"/>
    </g>`;
  const pinboard = `
    <rect x="548" y="200" width="316" height="234" fill="#1a1009" opacity="0.5" filter="url(#${P}-blur10)"/>
    <rect x="552" y="202" width="306" height="226" fill="#4e321f" filter="url(#${P}-woodH)"/>
    <rect x="552" y="202" width="306" height="3" fill="#c9935e" opacity="0.45"/>
    <rect x="566" y="216" width="278" height="198" fill="url(#${P}-cork)" filter="url(#${P}-cork)"/>
    <path d="M572 238 Q705 268 838 236" stroke="#d8c8a8" stroke-width="1.3" fill="none"/>
    ${polaroid(584, 242, -6, '#8fa9b8', '#6b7f55')}
    ${polaroid(632, 251, 4, '#d9b27a', '#8a5a3a')}
    ${polaroid(680, 254, -2, '#6f86a0', '#3f5a3a')}
    ${polaroid(728, 252, 5, '#c9a39a', '#7a4e40')}
    ${polaroid(778, 244, -4, '#a9bccb', '#d4b483')}
    <g transform="rotate(3 630 350)">
      <rect x="586" y="312" width="84" height="88" fill="#e6dcc6"/>
      <path d="M600 386 q10 -40 30 -38 q18 2 16 24 q-2 16 -20 14" stroke="#3a2c22" stroke-width="1.5" fill="none" opacity="0.65"/>
      <circle cx="628" cy="338" r="10" stroke="#3a2c22" stroke-width="1.4" fill="none" opacity="0.6"/>
      <path d="M618 336 q4 -16 18 -10" stroke="#3a2c22" stroke-width="1.2" fill="none" opacity="0.5"/>
      ${scribbles(r, 592, 316, 40, 14, 2)}
    </g>
    <g transform="rotate(-4 720 360)">
      <rect x="690" y="318" width="64" height="62" fill="#d9c27a"/>
      ${scribbles(r, 694, 322, 56, 52, 5, '#4a3a20', 0.6)}
    </g>
    <g transform="rotate(5 800 360)">
      <rect x="770" y="314" width="62" height="60" fill="#a9bccb"/>
      ${scribbles(r, 774, 318, 54, 50, 4, '#22303c', 0.6)}
    </g>
    <g transform="rotate(-2 790 398)">
      <rect x="752" y="384" width="80" height="24" fill="#efe6d4"/>
      ${scribbles(r, 756, 386, 70, 20, 2)}
    </g>
    ${pin(628, 316, '#7fa36a')}${pin(722, 322, '#b5523b')}${pin(801, 318, '#7fa36a')}${pin(792, 388, '#c9a14a')}`;

  // ---- poster
  const poster = `
    <rect x="876" y="186" width="140" height="202" fill="#12100c" opacity="0.45" filter="url(#${P}-blur10)"/>
    <rect x="880" y="188" width="132" height="194" fill="#e4d6b8"/>
    <rect x="888" y="196" width="116" height="150" fill="url(#${P}-posterSky)"/>
    <circle cx="968" cy="236" r="16" fill="#e8b866" opacity="0.9"/>
    <path d="M888 300 L918 262 L940 284 L962 252 L1004 296 V346 H888 Z" fill="#5e7a7f"/>
    <path d="M888 312 L930 286 L960 306 L1004 284 V346 H888 Z" fill="#456068"/>
    <rect x="888" y="318" width="116" height="28" fill="#33505c"/>
    ${[324, 332, 340].map((y) => `<path d="M892 ${y} q8 -3 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" stroke="#a9c4c8" stroke-width="1" fill="none" opacity="0.5"/>`).join('')}
    <path d="M940 316 h20 l-4 6 h-12 z M950 316 v-14 l8 12 z" fill="#2a1d16"/>
    <path d="M896 358 h70 M896 368 h48" stroke="#2c3a42" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
    <rect x="874" y="182" width="26" height="12" fill="#e9dcc4" opacity="0.7" transform="rotate(-25 887 188)"/>
    <rect x="992" y="182" width="26" height="12" fill="#e9dcc4" opacity="0.7" transform="rotate(25 1005 188)"/>`;

  // ---- bookshelf (Resume)
  let books = '';
  const bookColors = ['#6f86a0', '#8a9a6a', '#b8643e', '#d4b483', '#5a4a40', '#a9bccb', '#7a4e30', '#c9a14a', '#4d5a7a', '#9a6a5a'];
  let bx = 1062;
  let bi = 0;
  while (bx < 1196) {
    const w = 11 + r() * 12;
    const h = 56 + r() * 30;
    const c = bookColors[bi++ % bookColors.length];
    books += `<rect x="${bx}" y="${328 - h}" width="${w}" height="${h}" fill="${c}"/>`;
    books += `<rect x="${bx}" y="${328 - h + 8}" width="${w}" height="3" fill="#1a1410" opacity="0.35"/>`;
    books += `<rect x="${bx}" y="${328 - 14}" width="${w}" height="2" fill="#f2ead9" opacity="0.25"/>`;
    books += `<rect x="${bx + w - 2}" y="${328 - h}" width="2" height="${h}" fill="#000" opacity="0.25"/>`;
    bx += w + 1;
  }
  // leaning book
  books += `<g transform="rotate(14 ${bx + 4} 328)"><rect x="${bx}" y="262" width="15" height="66" fill="#8a9a6a"/><rect x="${bx}" y="270" width="15" height="3" fill="#1a1410" opacity="0.35"/></g>`;
  // resume binder
  books += `
    <rect x="1222" y="250" width="30" height="78" fill="#e6d8bd"/>
    <rect x="1222" y="250" width="30" height="78" fill="url(#${P}-binderShade)"/>
    <rect x="1227" y="266" width="20" height="26" fill="#f6efe0" stroke="#7a6a58" stroke-width="0.8"/>
    <text x="1237" y="284" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-weight="bold" fill="#5a3a24">CV</text>
    <circle cx="1237" cy="312" r="4" fill="none" stroke="#7a6a58" stroke-width="1.5"/>`;
  // small stack lying flat + succulent
  books += `
    <rect x="1258" y="318" width="36" height="10" fill="#b8643e"/><rect x="1260" y="309" width="32" height="9" fill="#d4b483"/>
    <path d="M1268 309 q-2 -10 4 -14 q2 8 0 14 M1276 309 q0 -14 6 -18 q2 10 -2 18 M1284 309 q4 -8 8 -8 q-2 6 -4 8" fill="#7f9a62"/>
    <rect x="1266" y="296" width="24" height="13" fill="#b07a5a" rx="2"/>`;
  const shelf = `
    <rect x="1048" y="336" width="256" height="20" fill="#000" opacity="0.35" filter="url(#${P}-blur10)"/>
    ${books}
    <rect x="1050" y="328" width="250" height="14" fill="url(#${P}-shelf)" filter="url(#${P}-woodH)"/>
    <rect x="1050" y="328" width="250" height="2" fill="#d9a46a" opacity="0.55"/>
    <path d="M1080 342 v20 l18 -20 z M1270 342 v20 l-18 -20 z" fill="#3a2416"/>`;

  // ---- door (Contact)
  const panel = (x, y, w, h) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#4a5c6e"/>
    <path d="M${x} ${y + h} V${y} H${x + w}" stroke="#2a3440" stroke-width="3" fill="none"/>
    <path d="M${x + w} ${y} V${y + h} H${x}" stroke="#8aa0b4" stroke-width="2" fill="none" opacity="0.45"/>`;
  const door = `
    <rect x="1316" y="106" width="232" height="520" fill="#100c0a" opacity="0.5" filter="url(#${P}-blur10)"/>
    <path d="M1320 112 H1544 V640 H1520 V128 H1344 V640 H1320 Z" fill="url(#${P}-frame)" filter="url(#${P}-woodV)"/>
    <rect x="1344" y="128" width="176" height="512" fill="url(#${P}-door)" filter="url(#${P}-woodV)"/>
    ${panel(1362, 148, 62, 150)}${panel(1440, 148, 62, 150)}${panel(1362, 320, 62, 170)}${panel(1440, 320, 62, 170)}
    <circle cx="1364" cy="420" r="9" fill="#8a6a2a"/><circle cx="1362" cy="418" r="6" fill="${C.mustard}"/><circle cx="1360" cy="416" r="2" fill="#fff3c9" opacity="0.8"/>
    <rect x="1357" y="430" width="8" height="16" rx="3" fill="#6a4f1f"/>
    <g transform="rotate(-3 1440 250)">
      <path d="M1440 214 L1420 240 M1440 214 L1460 240" stroke="#c9a77a" stroke-width="1"/>
      <circle cx="1440" cy="212" r="2.5" fill="#6a4f1f"/>
      <rect x="1404" y="238" width="72" height="40" fill="${C.paper}"/>
      <text x="1440" y="263" text-anchor="middle" font-family="'Comic Sans MS', 'Segoe Print', cursive" font-size="14" fill="#5a3a24">come in :)</text>
    </g>
    <path d="M1520 128 V640" stroke="#e8a85a" stroke-width="2" opacity="0.18"/>`;

  // ---- dim wall stars (glow layer is separate & animated)
  const stars = WALL_STARS.map(([x, y, s]) => `<path d="${starPath(x, y, s)}" fill="#cfd8b8" opacity="0.5"/>`).join('');

  // ---- hanging thread for paper plane (plane itself is animated, inline)
  const thread = `<path d="M1206 40 V96" stroke="#d8c8a8" stroke-width="0.9" opacity="0.6"/>`;

  return `${svgOpen(1600, 900)}
  <defs>
    ${paintFilters(P, { wobble: 3.5 })}
    <linearGradient id="${P}-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b281c"/><stop offset="1" stop-color="#22150e"/></linearGradient>
    <linearGradient id="${P}-frame" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3d2718"/><stop offset="0.5" stop-color="#5e3a24"/><stop offset="1" stop-color="#3a2416"/></linearGradient>
    <linearGradient id="${P}-sill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a36"/><stop offset="1" stop-color="#4e301d"/></linearGradient>
    <linearGradient id="${P}-shelf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a36"/><stop offset="1" stop-color="#4a2c1a"/></linearGradient>
    <linearGradient id="${P}-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4f6274"/><stop offset="1" stop-color="#3d4c5c"/></linearGradient>
    <linearGradient id="${P}-binderShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.15"/><stop offset="0.3" stop-color="#fff" stop-opacity="0.1"/><stop offset="1" stop-color="#000" stop-opacity="0.3"/></linearGradient>
    <linearGradient id="${P}-posterSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c9a3"/><stop offset="1" stop-color="#86a6a8"/></linearGradient>
    <radialGradient id="${P}-cork" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stop-color="#b98a5a"/><stop offset="1" stop-color="#8a6038"/></radialGradient>
    <radialGradient id="${P}-lampWall" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f0a25a" stop-opacity="0.55"/><stop offset="0.5" stop-color="#c97a42" stop-opacity="0.25"/><stop offset="1" stop-color="#c97a42" stop-opacity="0"/></radialGradient>
    <radialGradient id="${P}-coolWall" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#8fb0cf" stop-opacity="0.28"/><stop offset="1" stop-color="#8fb0cf" stop-opacity="0"/></radialGradient>
    <radialGradient id="${P}-corner" cx="0.5" cy="0.45" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#05070a" stop-opacity="0.55"/></radialGradient>
    <linearGradient id="${P}-ceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a120c"/><stop offset="1" stop-color="#2e1d14"/></linearGradient>
    <mask id="${P}-winHole"><rect width="1600" height="900" fill="#fff"/><rect x="134" y="144" width="262" height="356" fill="#000"/></mask>
  </defs>
  <g filter="url(#${P}-paint)">
    <g mask="url(#${P}-winHole)">
      <rect width="1600" height="900" fill="${C.wall}"/>
      ${planks}
      <ellipse cx="980" cy="440" rx="520" ry="380" fill="url(#${P}-lampWall)"/>
      <ellipse cx="660" cy="470" rx="220" ry="170" fill="url(#${P}-coolWall)"/>
      <ellipse cx="270" cy="330" rx="300" ry="320" fill="url(#${P}-coolWall)"/>
      <rect x="0" y="0" width="1600" height="46" fill="url(#${P}-ceil)"/>
      <rect x="0" y="46" width="1600" height="26" fill="#000" opacity="0.35" filter="url(#${P}-blur10)"/>
      <rect x="0" y="40" width="1600" height="6" fill="#4e301d"/>
      ${floor}
      <rect x="0" y="738" width="1600" height="24" fill="#2a1a10"/>
      <rect x="0" y="738" width="1600" height="2" fill="#a8754a" opacity="0.4"/>
      ${stars}
      ${thread}
    </g>
    ${windowFrame}
    ${rod}
    ${calendar}
    ${pinboard}
    ${poster}
    ${shelf}
    ${door}
  </g>
  <rect width="1600" height="900" fill="url(#${P}-corner)"/>
</svg>`;
}
