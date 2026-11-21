/**
 * ARTWORK MANIFEST — the single place that says which painted file goes where.
 *
 * Everything is drawn on a 1600×900 stage (see src/core/stage.js).
 * FULL-STAGE LAYERS should be exported at 1600×900 (or 3200×1800 for retina),
 * transparent PNG/WebP, aligned so they stack exactly.
 *
 * Leave `src: null` to use the built-in placeholder painting. Set it to a path
 * (relative, no leading slash, e.g. 'assets/room/background/wall.webp') and the
 * real artwork replaces the placeholder automatically. If the file is missing,
 * the placeholder is used and nothing breaks.
 */
export const ASSETS = {
  layers: {
    // Layer 1 — static wall, window frame, pinboard, poster, shelf, door, floor.
    // The window GLASS must be transparent so the sky/weather shows through.
    background: { src: null, suggested: 'assets/room/background/room-background.webp' },
    // Layer 3 — desk, monitor, lamp, sketchbook, clock body. Sits behind the character.
    furniture: { src: null, suggested: 'assets/room/furniture/furniture.webp' },
    // Layer 5 — bed, rug, foreground shadows. Sits in front of the character.
    foreground: { src: null, suggested: 'assets/room/foreground/foreground.webp' },
    // Reflections painted on the glass (subtle, mostly transparent).
    glass: { src: null, suggested: 'assets/room/window/glass-reflections.webp' },
  },

  /**
   * Outside views, one per ambience `sky` id. Size: 360×460, placed at stage x=80,y=100
   * (the glass opening is at x 134–396, y 144–500 on the stage).
   */
  skies: {
    rainy: { src: null, suggested: 'assets/room/sky/rainy.webp' },
    sunny: { src: null, suggested: 'assets/room/sky/sunny.webp' },
    night: { src: null, suggested: 'assets/room/sky/night.webp' },
    autumn: { src: null, suggested: 'assets/room/sky/autumn.webp' },
    dreamy: { src: null, suggested: 'assets/room/sky/dreamy.webp' },
  },

  /**
   * CHARACTER. Default = layered SVG placeholder (src/character/characterArt.js).
   * To use painted sprites, set `sprites` (see ASSETS.md for the full format):
   *   sprites: {
   *     box: { x: 700, y: 330, w: 300, h: 560 },     // where the frames sit on the stage
   *     states: {                                     // each state: frames + fps
   *       working:   { frames: ['assets/character/poses/work-01.webp', ...], fps: 6 },
   *       idle:      { frames: [...], fps: 4 },
   *       distracted:{ frames: [...] }, turning: { frames: [...] , fps: 12 },
   *       returning: { frames: [...], fps: 12 }, stretching: { frames: [...] }, sleepy: { frames: [...] },
   *     },
   *     expressions: {                                // the face-visible "reacting" frames
   *       curious: 'assets/character/expressions/curious.webp', annoyed: '...', neutral: '...',
   *       smiling: '...', surprised: '...', sleepy: '...',
   *     },
   *   }
   */
  character: { sprites: null },

  /**
   * CAT. Same idea as the character:
   *   sprites: { box: {x:1300,y:590,w:220,h:140}, states: { sleeping:{frames:[...],fps:2},
   *              waking:{...}, looking:{...}, stretching:{...}, returning:{...}, grumpy:{...} } }
   */
  cat: { sprites: null },
};
