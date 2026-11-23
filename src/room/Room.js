/**
 * ROOM ASSEMBLY — builds the layered scene on the stage, back to front:
 *
 *  depth-sky   : outside view (one <img> per sky, cross-faded)       [parallax -]
 *  mid         : window weather canvas → glass → BACKGROUND → wall stars →
 *                curtains → plane → FURNITURE → coffee/radio/clock → CHARACTER
 *  depth-front : FOREGROUND (bed) → cat → plant                       [parallax +]
 *  lighting    : tint / haze / lamp / monitor / sun / moon / vignette
 *  motes       : dust / sparkles canvas
 *  ui          : hotspots, speech bubbles, popups
 *
 * CAPS = full-stage painted layers from ASSETS.layers (or placeholders).
 */
import { ASSETS } from '../config/assets.js';
import { resolveArt } from '../core/assetLoader.js';
import { el } from '../core/dom.js';
import { backgroundSvg } from './art/background.js';
import { furnitureSvg } from './art/furniture.js';
import { foregroundSvg } from './art/foreground.js';
import { SKIES, SKY_BOX, glassSvg } from './art/skies.js';
import { curtainsSvg, plantSvg, coffeeSvg, radioSvg, planeSvg, wallStarGlowSvg, lightingSvg } from './art/inline.js';
import { characterSvg } from '../character/characterArt.js';
import { catSvg } from '../cat/catArt.js';
import { GLASS } from './Weather.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const stageSvg = (cls, inner) => {
  const s = document.createElementNS(SVG_NS, 'svg');
  s.setAttribute('viewBox', '0 0 1600 900');
  s.setAttribute('class', `layer ${cls}`);
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = inner;
  return s;
};
const layerImg = (cls) => el('img', { class: `layer ${cls}`, alt: '', draggable: 'false', decoding: 'async' });

export async function buildRoom(stage) {
  const refs = { skies: {} };
  const placeholders = [];

  // depth groups
  const sky = el('div', { class: 'depth depth--sky', 'data-depth': '-1' });
  const mid = el('div', { class: 'depth depth--mid', 'data-depth': '0' });
  const front = el('div', { class: 'depth depth--front', 'data-depth': '1' });

  // outside views
  for (const [id, gen] of Object.entries(SKIES)) {
    const img = el('img', { class: 'sky', alt: '', 'data-sky': id, draggable: 'false' });
    Object.assign(img.style, { left: SKY_BOX.x + 'px', top: SKY_BOX.y + 'px', width: SKY_BOX.w + 'px', height: SKY_BOX.h + 'px' });
    resolveArt(ASSETS.skies[id]?.src, gen).then(({ url, placeholder }) => { img.src = url; if (placeholder) placeholders.push(`sky:${id}`); });
    refs.skies[id] = img;
    sky.appendChild(img);
  }

  // weather canvas inside the glass
  refs.windowCanvas = el('canvas', { class: 'weather-window', 'aria-hidden': 'true' });
  Object.assign(refs.windowCanvas.style, { left: GLASS.x + 'px', top: GLASS.y + 'px', width: GLASS.w + 'px', height: GLASS.h + 'px' });

  const glass = layerImg('layer--glass');
  const bg = layerImg('layer--background');
  const furniture = layerImg('layer--furniture');
  const fg = layerImg('layer--foreground');

  const jobs = [
    resolveArt(ASSETS.layers.glass.src, glassSvg).then((r) => { glass.src = r.url; r.placeholder && placeholders.push('glass'); }),
    resolveArt(ASSETS.layers.background.src, backgroundSvg).then((r) => { bg.src = r.url; r.placeholder && placeholders.push('background'); }),
    resolveArt(ASSETS.layers.furniture.src, furnitureSvg).then((r) => { furniture.src = r.url; r.placeholder && placeholders.push('furniture'); }),
    resolveArt(ASSETS.layers.foreground.src, foregroundSvg).then((r) => { fg.src = r.url; r.placeholder && placeholders.push('foreground'); }),
  ];

  refs.wallStars = stageSvg('layer--stars', wallStarGlowSvg());
  refs.curtains = stageSvg('layer--curtains', curtainsSvg());
  refs.plane = stageSvg('layer--plane', planeSvg());
  refs.desk = stageSvg('layer--desk', coffeeSvg() + radioSvg());
  refs.character = stageSvg('layer--character', characterSvg());
  refs.cat = stageSvg('layer--cat', catSvg());
  refs.plant = stageSvg('layer--plant', plantSvg());
  refs.lighting = el('div', { class: 'layer layer--lighting', 'aria-hidden': 'true' }, lightingSvg());
  refs.motesCanvas = el('canvas', { class: 'layer layer--motes', 'aria-hidden': 'true' });

  refs.clock = el('div', { class: 'desk-clock', 'aria-hidden': 'true' }, '--:--');

  mid.append(refs.windowCanvas, glass, bg, refs.wallStars, refs.curtains, refs.plane, furniture, refs.desk, refs.clock, refs.character);
  front.append(fg, refs.cat, refs.plant);

  refs.hotspotsMid = el('div', { class: 'hotspots' });
  refs.hotspotsFront = el('div', { class: 'hotspots' });
  mid.appendChild(refs.hotspotsMid);
  front.appendChild(refs.hotspotsFront);

  refs.bubbles = el('div', { class: 'bubbles', 'aria-hidden': 'true' });
  refs.popups = el('div', { class: 'popups' });

  stage.append(sky, mid, front, refs.lighting, refs.motesCanvas, refs.bubbles, refs.popups);
  refs.depths = [sky, mid, front];

  await Promise.all(jobs);
  // wait until static layers are decoded so the room fades in fully painted
  await Promise.all([bg, furniture, fg].map((img) => img.decode?.().catch(() => {})));

  refs.placeholders = placeholders;
  if (placeholders.length) {
    console.info(`%c[my-little-room]%c using placeholder art for: ${placeholders.join(', ')} — see ASSETS.md to replace.`, 'color:#c9935e', 'color:inherit');
  }
  return refs;
}

/** Subtle mouse parallax for depth (desktop pointer only). */
export function enableParallax(viewport, depths, isEnabled) {
  let raf = 0, tx = 0, ty = 0;
  viewport.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !isEnabled()) return;
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(apply);
  });
  function apply() {
    raf = 0;
    for (const d of depths) {
      const k = parseFloat(d.dataset.depth);
      if (!k) continue;
      d.style.transform = `translate3d(${(tx * k * -7).toFixed(2)}px, ${(ty * k * -3).toFixed(2)}px, 0)`;
    }
  }
}
