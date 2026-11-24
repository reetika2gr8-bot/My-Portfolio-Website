/**
 * PLACEHOLDER — the cat mid-pounce, facing the viewer, paws up and claws out.
 * Same palette, stripes and warm rim light as the sleeping cat (catArt.js) so the
 * two read as one animal. Used only by CatPounce for the leap toward the screen.
 *
 * Parts the animation drives (keep these class names if you repaint it):
 *   .pz-paw--l / .pz-paw--r   swipe (scratch) — rotate around the shoulders
 *   .pz-eyes--wild / --smug   wild during the attack, smug afterwards
 *   .pz-mouth--hiss / --smug
 *   .pz-tail                  swishes
 * Painted replacement: export a 400×380 transparent image per pose (or keep this SVG).
 */
export function pounceSvg() {
  const claw = (x, y, rot) =>
    `<path d="M${x} ${y} q 3 -10 -1 -16 q 6 6 5 16 z" fill="#fbf4e6" transform="rotate(${rot} ${x} ${y})"/>`;
  const paw = (side) => {
    const L = side === 'l';
    const sx = L ? 150 : 250, px = L ? 86 : 314;
    return `
    <g class="pz-paw pz-paw--${side}" style="transform-origin:${sx}px 236px">
      <path d="M${sx} 236 C ${L ? 130 : 270} 200, ${L ? 104 : 296} 160, ${px} 122" stroke="url(#pz-fur)" stroke-width="40" stroke-linecap="round" fill="none"/>
      <path d="M${sx + (L ? -6 : 6)} 226 C ${L ? 126 : 274} 194, ${L ? 104 : 296} 160, ${px + (L ? 4 : -4)} 130" stroke="#8a4e22" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.5" stroke-dasharray="7 12"/>
      <ellipse cx="${px}" cy="112" rx="25" ry="22" fill="#f0dcb8"/>
      <ellipse cx="${px}" cy="118" rx="10" ry="8" fill="#d98c8c" opacity="0.8"/>
      ${[-15, -5, 5, 15].map((dx, i) => `<ellipse cx="${px + dx}" cy="100" rx="4.5" ry="4" fill="#d98c8c" opacity="0.75"/>`).join('')}
      ${[-16, -5, 6, 17].map((dx, i) => claw(px + dx, 94, (dx / 2) | 0)).join('')}
    </g>`;
  };
  return `
  <svg class="pz-svg" viewBox="0 0 400 380" aria-hidden="true">
    <defs>
      <linearGradient id="pz-fur" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e8ab6c"/><stop offset="0.55" stop-color="#c9844a"/><stop offset="1" stop-color="#8a5228"/>
      </linearGradient>
      <radialGradient id="pz-head" cx="0.58" cy="0.35" r="0.75"><stop offset="0" stop-color="#eeb478"/><stop offset="0.7" stop-color="#cf8a4e"/><stop offset="1" stop-color="#a2622e"/></radialGradient>
      <radialGradient id="pz-eye" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#f2cf6a"/><stop offset="1" stop-color="#c4932e"/></radialGradient>
      <filter id="pz-paint" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="6" result="w"/>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="3.5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
    <g filter="url(#pz-paint)">
      <g class="pz-tail" style="transform-origin:268px 280px">
        <path d="M268 286 C 320 280, 350 220, 336 160 C 332 140, 346 128, 358 132" stroke="url(#pz-fur)" stroke-width="22" stroke-linecap="round" fill="none"/>
        <path d="M338 168 l14 -4 M342 196 l14 0 M332 226 l13 4" stroke="#8a4e22" stroke-width="5" stroke-linecap="round"/>
      </g>
      <ellipse cx="200" cy="262" rx="92" ry="74" fill="url(#pz-fur)"/>
      <path d="M150 230 q 10 30 0 64 M200 214 q 10 40 0 84 M250 230 q 10 30 0 64" stroke="#8a4e22" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.6"/>
      <ellipse cx="200" cy="280" rx="38" ry="44" fill="#f0dcb8" opacity="0.9"/>
      <ellipse cx="140" cy="330" rx="34" ry="24" fill="#b8743e"/><ellipse cx="260" cy="330" rx="34" ry="24" fill="#b8743e"/>
      <ellipse cx="128" cy="346" rx="18" ry="11" fill="#f0dcb8"/><ellipse cx="272" cy="346" rx="18" ry="11" fill="#f0dcb8"/>
      ${paw('l')}${paw('r')}
      <path class="pz-ear" d="M118 124 L108 34 L184 92 Z" fill="#c9844a"/><path d="M128 108 L122 58 L166 92 Z" fill="#e8a090"/>
      <path class="pz-ear" d="M282 124 L292 34 L216 92 Z" fill="#b8743e"/><path d="M272 108 L278 58 L234 92 Z" fill="#e8a090"/>
      <path d="M112 170 l-22 -6 l18 -8 l-20 -12 l24 -2 M288 170 l22 -6 l-18 -8 l20 -12 l-24 -2" fill="#cf8a4e"/>
      <ellipse cx="200" cy="158" rx="90" ry="78" fill="url(#pz-head)"/>
      <path d="M180 92 q 4 18 0 30 M200 88 q 4 22 0 36 M220 92 q 4 18 0 30" stroke="#8a4e22" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M118 140 q 20 -6 30 4 M282 140 q -20 -6 -30 4" stroke="#8a4e22" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.6"/>
      <path d="M128 104 C 170 82, 230 82, 272 104" stroke="#ffd59a" stroke-width="3" opacity="0.55" fill="none"/>

      <g class="pz-eyes pz-eyes--wild">
        <ellipse cx="164" cy="156" rx="22" ry="24" fill="url(#pz-eye)"/><ellipse cx="236" cy="156" rx="22" ry="24" fill="url(#pz-eye)"/>
        <ellipse cx="164" cy="158" rx="11" ry="17" fill="#1a120c"/><ellipse cx="236" cy="158" rx="11" ry="17" fill="#1a120c"/>
        <circle cx="169" cy="148" r="4.5" fill="#fff"/><circle cx="241" cy="148" r="4.5" fill="#fff"/>
        <path d="M138 126 l 44 14 M262 126 l -44 14" stroke="#4a2a14" stroke-width="6" stroke-linecap="round"/>
      </g>
      <g class="pz-eyes pz-eyes--smug">
        <ellipse cx="164" cy="160" rx="21" ry="13" fill="url(#pz-eye)"/><ellipse cx="236" cy="160" rx="21" ry="13" fill="url(#pz-eye)"/>
        <ellipse cx="166" cy="162" rx="5" ry="10" fill="#1a120c"/><ellipse cx="238" cy="162" rx="5" ry="10" fill="#1a120c"/>
        <path d="M140 152 q 24 -10 46 0 M214 152 q 24 -10 46 0" stroke="#4a2a14" stroke-width="5" stroke-linecap="round" fill="#cf8a4e"/>
      </g>

      <ellipse cx="200" cy="200" rx="38" ry="26" fill="#f0dcb8"/>
      <path d="M190 186 h20 l-10 10 z" fill="#d87a7a"/>
      <g class="pz-mouth pz-mouth--hiss">
        <path d="M178 204 q 22 30 44 0 q -22 8 -44 0 z" fill="#8a3038"/>
        <path d="M184 205 l4 9 l3 -8 M216 205 l-4 9 l-3 -8" fill="#fbf4e6"/>
        <ellipse cx="200" cy="218" rx="9" ry="5" fill="#d87a7a"/>
      </g>
      <path class="pz-mouth pz-mouth--smug" d="M184 206 q 8 8 16 0 q 8 8 16 0" stroke="#4a2a14" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M168 204 l-56 -10 M168 210 l-54 6 M232 204 l56 -10 M232 210 l54 6" stroke="#fbf4e6" stroke-width="2" opacity="0.75" stroke-linecap="round"/>
    </g>
  </svg>`;
}
