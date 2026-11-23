/**
 * AMBIENCE PRESETS
 * The room layout never changes — only these values do. Add a preset by copying one
 * object, giving it a new id, and (optionally) a new `sky` id from assets.js.
 *
 * lighting
 *   tint / tintOpacity  colour multiplied over the whole room (mood)
 *   haze / hazeOpacity  colour screened over the room (atmospheric lift — keep 0–0.08, it lifts blacks)
 *   windowSpill         cool light spilling from the window 0–1
 *   lamp                desk lamp glow strength 0–1
 *   lampFlicker         subtle flicker on/off
 *   monitor             monitor glow 0–1
 *   sunBeams            golden light shafts through the window 0–1
 *   moonBeams           pale cool light shafts 0–1
 *   wallStars           glow-in-the-dark wall stars 0–1
 *   vignette            edge darkening 0–1
 * weather (any can be null)
 *   rain   { count, speed, slant, length, droplets }
 *   leaves { count, speed, colors[] }
 *   stars  { count, twinkle }
 *   motes  { count, color }        floating particles in the room (dust / sparkles)
 *   birds  { every }                ms between birds crossing the window
 * curtains    { amplitude (deg), duration (s) }
 * audio       { ambient: id from audio.js AMBIENT_SOUNDS }
 * character   { sleepyChance 0–1, onEnter: 'glance-window' | 'stretch' | null }
 */
export const AMBIENCES = [
  {
    id: 'rainy-evening',
    name: 'Rainy evening',
    icon: 'rain',
    sky: 'rainy',
    lighting: {
      tint: '#4f6c9c', tintOpacity: 0.26,
      haze: '#1c2433', hazeOpacity: 0, windowSpill: 0.75,
      lamp: 0.95, lampFlicker: true, monitor: 0.75,
      sunBeams: 0, moonBeams: 0, wallStars: 0.25, vignette: 0.5,
    },
    weather: {
      rain: { count: 150, speed: 900, slant: 0.12, length: 22, droplets: true },
      leaves: null, stars: null,
      motes: { count: 14, color: '255,214,160' },
      birds: null,
    },
    curtains: { amplitude: 1.6, duration: 7 },
    audio: { ambient: 'rain' },
    character: { sleepyChance: 0.05, onEnter: 'glance-window' },
    transitionMs: 2200,
  },
  {
    id: 'sunny-afternoon',
    name: 'Sunny afternoon',
    icon: 'sun',
    sky: 'sunny',
    lighting: {
      tint: '#fff1d6', tintOpacity: 0.0,
      haze: '#ffd9a0', hazeOpacity: 0.08, windowSpill: 0,
      lamp: 0.0, lampFlicker: false, monitor: 0.35,
      sunBeams: 0.9, moonBeams: 0, wallStars: 0, vignette: 0.25,
    },
    weather: {
      rain: null, leaves: null, stars: null,
      motes: { count: 34, color: '255,230,180' },
      birds: { every: 9000 },
    },
    curtains: { amplitude: 1.2, duration: 9 },
    audio: { ambient: 'birds' },
    character: { sleepyChance: 0, onEnter: 'stretch' },
    transitionMs: 2400,
  },
  {
    id: 'late-night',
    name: 'Late night',
    icon: 'moon',
    sky: 'night',
    lighting: {
      tint: '#2e4170', tintOpacity: 0.5,
      haze: '#0b1020', hazeOpacity: 0, windowSpill: 0.85,
      lamp: 1, lampFlicker: true, monitor: 0.7,
      sunBeams: 0, moonBeams: 0.45, wallStars: 0.9, vignette: 0.65,
    },
    weather: {
      rain: null, leaves: null,
      stars: { count: 70, twinkle: 0.6 },
      motes: { count: 8, color: '255,210,150' },
      birds: null,
    },
    curtains: { amplitude: 0.7, duration: 11 },
    audio: { ambient: 'night' },
    character: { sleepyChance: 0.55, onEnter: null },
    transitionMs: 2600,
  },
  {
    id: 'autumn-wind',
    name: 'Autumn wind',
    icon: 'leaf',
    sky: 'autumn',
    lighting: {
      tint: '#c08a5a', tintOpacity: 0.18,
      haze: '#7a4a2a', hazeOpacity: 0, windowSpill: 0.2,
      lamp: 0.55, lampFlicker: false, monitor: 0.55,
      sunBeams: 0.35, moonBeams: 0, wallStars: 0.05, vignette: 0.45,
    },
    weather: {
      rain: null,
      leaves: { count: 22, speed: 1, colors: ['#c4622d', '#d99a3e', '#a2482a', '#8c6a2f'] },
      stars: null,
      motes: { count: 12, color: '255,200,150' },
      birds: null,
    },
    curtains: { amplitude: 4.2, duration: 3.6 },
    audio: { ambient: 'wind' },
    character: { sleepyChance: 0, onEnter: 'glance-window' },
    transitionMs: 2200,
  },
  {
    id: 'dreamy-starlight',
    name: 'Dreamy starlight',
    icon: 'star',
    sky: 'dreamy',
    lighting: {
      tint: '#3d6688', tintOpacity: 0.4,
      haze: '#2c4a58', hazeOpacity: 0.04, windowSpill: 0.75,
      lamp: 0.55, lampFlicker: false, monitor: 0.6,
      sunBeams: 0, moonBeams: 0.3, wallStars: 1, vignette: 0.55,
    },
    weather: {
      rain: null, leaves: null,
      stars: { count: 120, twinkle: 1 },
      motes: { count: 26, color: '214,236,255', sparkle: true },
      birds: null,
    },
    curtains: { amplitude: 1, duration: 10 },
    audio: { ambient: 'dreamy' },
    character: { sleepyChance: 0.2, onEnter: 'glance-window' },
    transitionMs: 3000,
  },
];

export const getAmbience = (id) => AMBIENCES.find((a) => a.id === id) || AMBIENCES[0];
