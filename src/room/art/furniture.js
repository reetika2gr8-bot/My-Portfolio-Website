/**
 * PLACEHOLDER — Layer 3: rug, desk + drawers, CRT monitor, keyboard, tablet,
 * pen cup, papers, sketchbook, clock body, desk lamp. Sits BEHIND the character.
 * Replace via ASSETS.layers.furniture.
 */
import { PALETTE as C, svgOpen, paintFilters, scribbles } from './defs.js';
import { seeded } from '../../core/dom.js';

export function furnitureSvg() {
  const r = seeded(7);
  const P = 'fu';

  const rug = `
    <ellipse cx="800" cy="872" rx="470" ry="66" fill="#000" opacity="0.35" filter="url(#${P}-blur10)"/>
    <ellipse cx="800" cy="866" rx="460" ry="60" fill="#6e3a2a" filter="url(#${P}-fabric)"/>
    <ellipse cx="800" cy="866" rx="430" ry="50" fill="none" stroke="#d4b483" stroke-width="4" stroke-dasharray="14 8" opacity="0.6"/>
    <ellipse cx="800" cy="866" rx="380" ry="38" fill="none" stroke="#3f5a5a" stroke-width="10" opacity="0.55"/>
    <ellipse cx="800" cy="866" rx="300" ry="26" fill="none" stroke="#d4b483" stroke-width="3" opacity="0.45"/>`;

  const leg = (x) => `
    <path d="M${x} 704 h26 v20 q-4 10 0 20 v120 q2 8 -4 18 h-18 q-6 -10 -4 -18 v-120 q4 -10 0 -20 z" fill="url(#${P}-leg)"/>
    <path d="M${x + 20} 724 v160" stroke="#d9a46a" stroke-width="1.5" opacity="0.25"/>`;

  const desk = `
    <ellipse cx="850" cy="888" rx="420" ry="22" fill="#000" opacity="0.45" filter="url(#${P}-blur10)"/>
    ${leg(470)}${leg(684)}${leg(998)}${leg(1208)}
    <rect x="712" y="626" width="286" height="70" fill="#140c07" opacity="0.9"/>
    <rect x="466" y="626" width="246" height="80" fill="url(#${P}-ped)" filter="url(#${P}-woodH)"/>
    <rect x="996" y="626" width="240" height="80" fill="url(#${P}-ped)" filter="url(#${P}-woodH)"/>
    <rect x="482" y="638" width="214" height="56" fill="#6a4329" filter="url(#${P}-woodH)"/>
    <path d="M482 694 V638 H696" stroke="#2a1a10" stroke-width="2.5" fill="none"/><path d="M696 638 V694 H482" stroke="#b07a48" stroke-width="1.5" fill="none" opacity="0.5"/>
    <rect x="1012" y="638" width="208" height="56" fill="#6a4329" filter="url(#${P}-woodH)"/>
    <path d="M1012 694 V638 H1220" stroke="#2a1a10" stroke-width="2.5" fill="none"/><path d="M1220 638 V694 H1012" stroke="#c9935e" stroke-width="1.5" fill="none" opacity="0.55"/>
    <circle cx="589" cy="666" r="7" fill="#7a5a22"/><circle cx="587" cy="664" r="4" fill="${C.mustard}"/>
    <circle cx="1116" cy="666" r="7" fill="#7a5a22"/><circle cx="1114" cy="664" r="4" fill="#e3bd62"/>
    <path d="M448 612 H1252 V630 H448 Z" fill="#4a2d1b"/>
    <path d="M448 612 H1252" stroke="#c9935e" stroke-width="2" opacity="0.55"/>
    <path d="M462 592 H1238 L1252 612 H448 Z" fill="url(#${P}-top)" filter="url(#${P}-woodH)"/>
    <rect x="448" y="628" width="804" height="10" fill="#000" opacity="0.35" filter="url(#${P}-blur4)"/>`;

  // CRT-style monitor (Projects)
  let ui = '';
  for (let i = 0; i < 6; i++) ui += `<rect x="${744}" y="${450 + i * 12}" width="10" height="8" fill="${['#c4622d', '#d4b483', '#6f86a0', '#8a9a6a', '#2c3a42', '#e8a85a'][i]}"/>`;
  const monitor = `
    <ellipse cx="676" cy="596" rx="120" ry="10" fill="#000" opacity="0.45" filter="url(#${P}-blur4)"/>
    <path d="M640 586 h76 l8 10 h-92 z" fill="#a39373"/>
    <path d="M784 420 L808 440 V570 L784 584 Z" fill="#8a7c62"/>
    <rect x="558" y="408" width="230" height="180" rx="14" fill="url(#${P}-crt)"/>
    <rect x="558" y="408" width="230" height="4" rx="2" fill="#fff6e0" opacity="0.35"/>
    <rect x="576" y="424" width="194" height="134" rx="10" fill="#2e2c28"/>
    <rect x="584" y="430" width="178" height="120" rx="8" fill="url(#${P}-screen)"/>
    <rect x="588" y="434" width="170" height="10" fill="#c4ccc9" opacity="0.8"/>
    ${[594, 606, 618, 630, 642].map((x) => `<rect x="${x}" y="437" width="8" height="4" fill="#5a6468" opacity="0.6"/>`).join('')}
    <rect x="592" y="450" width="144" height="94" fill="#fbfaf4"/>
    <rect x="596" y="456" width="40" height="36" fill="none" stroke="#3a3a36" stroke-width="1" opacity="0.6"/>
    <rect x="642" y="456" width="40" height="36" fill="none" stroke="#3a3a36" stroke-width="1" opacity="0.6"/>
    <rect x="688" y="456" width="44" height="36" fill="none" stroke="#3a3a36" stroke-width="1" opacity="0.6"/>
    <path d="M604 486 q6 -18 14 -10 q6 6 12 -8" stroke="#3a3a36" stroke-width="1.2" fill="none" opacity="0.7"/>
    <circle cx="662" cy="472" r="7" stroke="#3a3a36" stroke-width="1.2" fill="none" opacity="0.7"/>
    <path d="M696 486 l10 -18 l10 12 l8 -8" stroke="#c4622d" stroke-width="1.4" fill="none" opacity="0.8"/>
    <rect x="596" y="500" width="136" height="40" fill="none" stroke="#3a3a36" stroke-width="1" opacity="0.45"/>
    ${scribbles(r, 600, 502, 120, 36, 3, '#3a3a36', 0.5, 1)}
    ${ui}
    <path d="M590 436 L630 436 L600 470 Z" fill="#fff" opacity="0.18"/>
    <rect x="600" y="566" width="30" height="6" rx="2" fill="#6a604c"/><circle cx="752" cy="570" r="4" fill="#7fa36a"/>
    <path d="M566 420 V576" stroke="#fff6e0" stroke-width="2" opacity="0.2"/>`;

  const deskItems = `
    <path d="M492 596 l62 -6 l8 10 l-66 6 z" fill="#e6dcc6"/><path d="M500 592 l60 -4 l6 8 l-62 5 z" fill="#efe6d4" opacity="0.9"/>
    ${scribbles(r, 506, 591, 46, 6, 2, '#3a2c22', 0.4, 0.8)}
    <path d="M520 546 l-6 -26 M528 548 l4 -30 M534 548 l10 -22" stroke="${C.mustard}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M524 548 l-2 -28" stroke="#6f86a0" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="510" y="544" width="34" height="50" rx="4" fill="#7d93a0"/>
    <rect x="510" y="544" width="34" height="50" rx="4" fill="url(#${P}-cyl)"/>
    <path d="M640 586 h170 l6 10 h-182 z" fill="#d8ccb2"/>
    ${Array.from({ length: 14 }, (_, i) => `<path d="M${646 + i * 12} 589 h8" stroke="#8a7c62" stroke-width="2"/>`).join('')}
    <path d="M884 590 h96 l6 10 h-108 z" fill="#2c3036"/><path d="M890 592 h80 l4 6 h-88 z" fill="#3d434b"/>
    <path d="M990 590 L1044 586 L1046 604 L986 608 Z" fill="#efe6d4"/>
    <path d="M1046 586 L1100 589 L1104 607 L1046 604 Z" fill="#e6dcc6"/>
    <path d="M990 590 L1044 586 L1046 604 L986 608 Z" fill="url(#${P}-page)"/>
    ${Array.from({ length: 7 }, (_, i) => `<ellipse cx="1045" cy="${588 + i * 2.6}" rx="2.4" ry="1.2" fill="none" stroke="#3a3a36" stroke-width="0.8"/>`).join('')}
    <path d="M996 596 q8 -6 16 -2 t16 -3 M998 601 q10 -4 20 -1" stroke="#3a2c22" stroke-width="0.9" fill="none" opacity="0.6"/>
    <path d="M1056 592 q6 6 14 -2 q8 -6 12 4 q6 8 16 0" stroke="#3a2c22" stroke-width="1" fill="none" opacity="0.6"/>
    <circle cx="1070" cy="598" r="4" stroke="#c4622d" stroke-width="0.9" fill="none" opacity="0.7"/>
    <path d="M1060 610 l46 -10" stroke="${C.mustard}" stroke-width="3" stroke-linecap="round"/><path d="M1104 600.4 l5 -1" stroke="#3a2c22" stroke-width="3" stroke-linecap="round"/>
    <rect x="1108" y="560" width="80" height="42" rx="6" fill="url(#${P}-clock)"/>
    <rect x="1108" y="560" width="80" height="3" rx="1.5" fill="#d9a46a" opacity="0.6"/>
    <rect x="1116" y="567" width="64" height="27" rx="3" fill="#15130f"/>
    <path d="M1114 602 h68" stroke="#000" stroke-width="3" opacity="0.4"/>`;

  // lamp (glow is a separate lighting layer)
  const lamp = `
    <ellipse cx="1214" cy="602" rx="34" ry="7" fill="#000" opacity="0.45" filter="url(#${P}-blur4)"/>
    <ellipse cx="1214" cy="598" rx="28" ry="8" fill="#344033"/><ellipse cx="1214" cy="595" rx="24" ry="6" fill="#4b5a47"/>
    <path d="M1212 594 L1186 486" stroke="#2c3328" stroke-width="7" stroke-linecap="round"/>
    <path d="M1214 592 L1189 488" stroke="#8a9a7a" stroke-width="1.5" opacity="0.5"/>
    <path d="M1186 486 L1112 446" stroke="#2c3328" stroke-width="7" stroke-linecap="round"/>
    <path d="M1186 484 L1114 444" stroke="#d9a46a" stroke-width="1.5" opacity="0.4"/>
    <circle cx="1186" cy="486" r="7" fill="#3b4637"/><circle cx="1184" cy="484" r="2" fill="#c9a14a"/>
    <path d="M1196 540 q8 -4 4 -10 q-6 -4 2 -10 q8 -4 4 -10" stroke="#5a5a4a" stroke-width="1.5" fill="none"/>
    <ellipse cx="1102" cy="444" rx="22" ry="17" fill="#3b4a3a"/>
    <path d="M1084 428 Q1110 424 1124 448 L1096 506 Q1052 506 1014 482 Z" fill="url(#${P}-shade)"/>
    <path d="M1090 430 Q1108 430 1118 446" stroke="#c9d1a8" stroke-width="2" fill="none" opacity="0.4"/>
    <ellipse cx="1054" cy="494" rx="42" ry="13" transform="rotate(-18 1054 494)" fill="#fff1cf"/>
    <ellipse cx="1058" cy="490" rx="14" ry="7" transform="rotate(-18 1058 490)" fill="#fffdf2"/>`;

  return `${svgOpen(1600, 900)}
  <defs>
    ${paintFilters(P, { wobble: 3 })}
    <linearGradient id="${P}-top" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e4429"/><stop offset="0.55" stop-color="#a06a3e"/><stop offset="0.75" stop-color="#b98048"/><stop offset="1" stop-color="#7a4e30"/></linearGradient>
    <linearGradient id="${P}-ped" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5e3a24"/><stop offset="1" stop-color="#3a2416"/></linearGradient>
    <linearGradient id="${P}-leg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2e1d14"/><stop offset="0.6" stop-color="#5e3a24"/><stop offset="1" stop-color="#3a2416"/></linearGradient>
    <linearGradient id="${P}-crt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8ccae"/><stop offset="1" stop-color="#9c8e72"/></linearGradient>
    <radialGradient id="${P}-screen" cx="0.45" cy="0.45" r="0.7"><stop offset="0" stop-color="#f4f7f0"/><stop offset="1" stop-color="#b9c6c4"/></radialGradient>
    <linearGradient id="${P}-cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.3"/><stop offset="0.4" stop-color="#fff" stop-opacity="0.15"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></linearGradient>
    <linearGradient id="${P}-page" x1="0" y1="0" x2="1" y2="0"><stop offset="0.7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.18"/></linearGradient>
    <linearGradient id="${P}-clock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a36"/><stop offset="1" stop-color="#4e301d"/></linearGradient>
    <linearGradient id="${P}-shade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#55664f"/><stop offset="1" stop-color="#2c3628"/></linearGradient>
  </defs>
  <g filter="url(#${P}-paint)">
    ${rug}
    ${desk}
    ${monitor}
    ${deskItems}
    ${lamp}
  </g>
</svg>`;
}
