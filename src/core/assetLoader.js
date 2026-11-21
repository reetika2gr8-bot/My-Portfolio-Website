/**
 * Loads a painted asset if one is configured, otherwise (or if it fails to load)
 * falls back to the generated placeholder artwork. Never throws.
 */
import { assetUrl } from './dom.js';

const svgUrlCache = new Map();

export function svgToUrl(svg) {
  if (svgUrlCache.has(svg)) return svgUrlCache.get(svg);
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  svgUrlCache.set(svg, url);
  return url;
}

export function probeImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(false);
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/**
 * @param {string|null} src   configured asset path (may be null)
 * @param {() => string} fallbackSvg  generator for the placeholder SVG
 * @returns {Promise<{url:string, placeholder:boolean}>}
 */
export async function resolveArt(src, fallbackSvg) {
  const url = assetUrl(src);
  if (url && (await probeImage(url))) return { url, placeholder: false };
  return { url: svgToUrl(fallbackSvg()), placeholder: true };
}
