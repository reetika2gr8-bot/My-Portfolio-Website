# Artwork & asset guide

**Everything you see right now is placeholder art** generated from SVG (with painterly
filters for texture). It is built so a painter's real layers drop in without code changes.
The placeholders are *not* finished hand-painted artwork. For the cinematic look of
the reference, commission or paint the layers below.

## The stage
All art aligns to a **1600 × 900** stage (export at **3200 × 1800** for retina). Every full-stage
layer is a transparent PNG/WebP of that exact size so layers stack perfectly.
Look at `public/references/` and the current placeholder for positions. Open the site and
the console tells you which layers are still placeholders.

## Swapping artwork — `src/config/assets.js`
Set `src` to a path (relative, no leading slash). If the file is missing, the placeholder is used.

| Key | File (suggested) | Contents | Notes |
|---|---|---|---|
| `layers.background` | `assets/room/background/room-background.webp` | wall, ceiling, floor, window frame + sill, curtain rod, pinboard, poster, calendar, shelf + books, door, dim wall stars | **Window glass must be transparent** (x134–396, y144–500) |
| `layers.furniture` | `assets/room/furniture/furniture.webp` | rug, desk, drawers, monitor, keyboard, tablet, pen cup, papers, sketchbook, clock body, lamp | Behind the character. Leave the clock display dark (digits are live text at x1116 y567 64×27) |
| `layers.foreground` | `assets/room/foreground/foreground.webp` | bed, quilt, pillow, foreground shadows | In front of the character, under the cat |
| `layers.glass` | `assets/room/window/glass-reflections.webp` | soft reflections on the glass | mostly transparent |
| `skies.<id>` | `assets/room/sky/<id>.webp` | outside view per ambience (rainy, sunny, night, autumn, dreamy) | **360 × 460**, placed at stage (80,100) |

Still animated in code (keep or replace in `room/art/inline.js`): curtains (5 swaying folds per side),
plant (3 swaying stems), coffee + steam, cassette radio (spinning reels), paper plane, wall-star glow.
To replace one with painted art, swap the SVG inside its function for an `<image href="…">` of the
same piece and keep the group class names so the CSS animation still applies.

## Character — `ASSETS.character.sprites`
The placeholder is a layered SVG (`src/character/characterArt.js`) with separate body, arms,
stylus hand, stretch arms, chair, and **three head drawings** (back, three-quarter, front) plus
six facial expressions. For painted art, provide frames and set:

```js
character: {
  sprites: {
    box: { x: 700, y: 330, w: 300, h: 560 },   // where the frames sit on the stage
    states: {
      working:    { frames: ['assets/character/poses/work-01.webp', 'assets/character/poses/work-02.webp', /*…*/], fps: 6 },
      idle:       { frames: ['assets/character/poses/idle-01.webp'], fps: 4 },
      distracted: { frames: ['assets/character/poses/glance-window-01.webp'] },
      turning:    { frames: ['assets/character/poses/turn-01.webp', 'assets/character/poses/turn-02.webp'], fps: 14 },
      returning:  { frames: ['assets/character/poses/turn-02.webp', 'assets/character/poses/turn-01.webp'], fps: 14 },
      stretching: { frames: ['assets/character/poses/stretch-01.webp', /*…*/], fps: 6 },
      sleepy:     { frames: ['assets/character/poses/sleepy-01.webp', /*…*/], fps: 3 },
    },
    expressions: {   // the face-visible "reacting" frames (head turned to the viewer)
      curious: 'assets/character/expressions/curious.webp', annoyed: 'assets/character/expressions/annoyed.webp',
      neutral: 'assets/character/expressions/neutral.webp', smiling: 'assets/character/expressions/smiling.webp',
      surprised: 'assets/character/expressions/surprised.webp', sleepy: 'assets/character/expressions/sleepy.webp',
    },
  },
},
```
Frames are full images of the character + chair inside `box`. Once the first `working` frame loads, the SVG
character hides automatically. **Adding animation frames** = adding paths to a state's `frames` array.
**Adding a new state** = add frames here, a CSS block in `styles/character.css` (for the SVG),
and call `this.set('yourState')` from a behaviour in `CharacterController.js`.

Alternatively, keep the layered SVG approach and redraw the parts in `characterArt.js`.
The class names are the animation contract (`.char__hand`, `.head--front`, `.expr--smiling`…).

## Cat — `ASSETS.cat.sprites`
Same format. States: `sleeping`, `waking`, `looking`, `stretching`, `returning`, `grumpy`.
Suggested box: `{ x: 1300, y: 590, w: 220, h: 140 }`. Breathing/ear-twitch frames go in `sleeping`.

## Other images
- Project thumbnails: `public/assets/projects/thumbnails/<id>.jpg` (4:3). Case-study images: `…/case-studies/`.
- Process/sketchbook images: `public/assets/process/` → set `src` in `src/config/process.js`.
- About photo: `public/assets/about/me.jpg` → `ABOUT.photo`.
- Resume PDF: `public/assets/resume/resume.pdf`.
Missing images show a soft hatched placeholder with the caption.

## Audio
- Music: `public/assets/audio/music/` → `MUSIC_TRACKS[].src` in `src/config/audio.js`.
- Weather loops: `public/assets/audio/ambience/` → `AMBIENT_SOUNDS.<key>.src`.
Seamless loops (OGG/MP3/M4A), about -18 LUFS, 1–3 minutes. Missing files fall back to procedural placeholders.

## Art still needed for the best result (priority order)
1. **Painted background** (wall, window, pinboard, poster, shelf, door), the biggest single upgrade.
2. **Character sprites**: working loop (6–8 frames), turn (2–3 frames), 6 facial expressions, stretch, sleepy.
3. **Painted furniture** (desk, CRT, lamp, sketchbook) and **bed**.
4. **Five outside views** (rainy, sunny, night, autumn, dreamy).
5. **Cat sprites**: sleeping breath loop, wake, look, stretch, grumpy.
6. Curtains, plant, coffee mug, radio as small painted pieces (optional, since the SVG versions animate fine).
7. Project thumbnails/case-study images, your photo, resume PDF, licensed music + ambience loops.
