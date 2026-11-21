# My Little Room — Reetika's interactive portfolio

An illustrated, animated room that *is* the homepage. Reetika sits at her desk working;
visitors explore by clicking objects in the room. No navbar, no hero section — the room is the navigation.

| Object | Does |
|---|---|
| Computer monitor | **Projects** → case studies |
| Sketchbook (desk) | **Design process** |
| Pinboard | **About me** |
| Bookshelf / CV binder | **Resume** |
| Door | **Contact** |
| Window | Ambience selector (5 moods) |
| Cassette radio (window sill) | Music player |
| Reetika | Poke her. She turns around and talks back (6 expressions, escalating lines) |
| Cat | Wakes, looks at you, stretches, goes back to sleep (gets grumpy if you keep poking) |
| Coffee, lamp, clock, plant, poster, drawer, paper plane, 3 hidden wall stars | Easter eggs |

A **room guide** (top-right) and a **skip link** list every destination as plain links, so
nothing depends on finding objects visually. A discreet **sound** button sits bottom-left.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ — host anywhere (GitHub Pages, Netlify, Vercel…)
npm run preview    # serve the built site
```

No runtime dependencies. Vite is the only dev dependency.

## Where things live

```
src/
  config/            ← EDIT THESE: all content & behaviour data
    site.js            name, welcome note, hint, default ambience
    projects.js        projects + case-study content
    process.js         sketchbook chapters
    about.js           pinboard content
    resume.js          resume content + PDF path
    contact.js         email + links
    dialogue.js        every line of dialogue
    ambiences.js       the 5 ambience presets
    audio.js           music tracks + environmental sounds
    objects.js         clickable objects: position, label, action (+ bubble anchors, wall stars)
    assets.js          ARTWORK MANIFEST — which painted file replaces which placeholder
  room/
    Room.js            builds the depth layers
    Weather.js         rain / droplets / leaves / stars / birds / dust (one 30fps canvas loop)
    Hotspots.js        accessible <button>s over the painting
    Dialogue.js        speech bubbles
    art/               PLACEHOLDER paintings (SVG generators)
      background.js      wall, window frame, pinboard, poster, shelf, door, floor
      furniture.js       desk, monitor, lamp, sketchbook, clock, rug
      foreground.js      bed
      skies.js           5 outside views + glass reflections
      inline.js          animated bits: curtains, plant, coffee, radio, plane, star glow, LIGHTING RIG
      defs.js            painterly filters + palette
  character/           characterArt.js (layered SVG) + CharacterController.js (state machine)
  cat/                 catArt.js + CatController.js
  ambience/            AmbienceManager.js (applies presets) + AmbienceSelector.js (window note)
  audio/               AudioEngine.js, synths.js (placeholder sound), MusicPlayer.js, SoundControl.js
  sections/            page renderers, SectionHost (overlay), router (#/projects etc.)
  ui/                  intro/hint, room guide, popup, icons
  styles/              base, room, character (+cat), ui, pages
public/
  assets/…             drop real artwork / audio / images here (see ASSETS.md)
  references/          the three reference images
```

## Common edits (quick guide)

- **Add a project:** copy an object in `src/config/projects.js`, change `id`. Images go in
  `public/assets/projects/…` and are referenced without a leading slash. URL becomes `#/projects/<id>`.
- **Change dialogue:** `src/config/dialogue.js`. Arrays cycle in order. `escalation` keys are poke counts.
- **Change / add an ambience:** `src/config/ambiences.js`. Copy a preset, give it a new `id`. Lighting,
  weather, curtain wind, audio and character behaviour are all data. Add a new outside view in
  `room/art/skies.js` (or a painted file in `assets.js → skies`).
- **Add music:** put files in `public/assets/audio/music/`, set `src` in `src/config/audio.js`
  (e.g. `'assets/audio/music/rain-lofi.mp3'`). Use only music you own or have licensed.
  Without a file, a quiet procedural placeholder plays.
- **Add environmental audio:** `public/assets/audio/ambience/`, set `src` in `AMBIENT_SOUNDS`.
  The key (`rain`, `birds`…) is what `ambiences.js → audio.ambient` refers to.
- **Modify interactive objects:** `src/config/objects.js` — move/resize hotspots (stage coordinates, 1600×900),
  change labels, or point an object at another action. New simple objects can use `action: 'say:<key>'`
  with lines in `dialogue.js → objects.<key>`.
- **Change the room layout:** objects are positioned in the art files (placeholders) and in
  `objects.js` (click areas). If you move something in the art, move its hotspot too.
  When you switch to painted artwork, only `objects.js` and `ANCHORS` need to match the new painting.
- **Character / cat / artwork replacement:** see **ASSETS.md**.

## Audio rules (built in)
Never autoplays (the audio context is only created after a click), music and weather sound are
independent with separate volumes, master mute, pauses when the tab is hidden, missing files fall back silently.

## Accessibility & performance
Real buttons with labels and visible focus. Keyboard: Tab through objects, Enter to use, Esc closes
pages and popups, and focus returns to the object. The text-menu fallback has a skip link, screen-reader
live region for dialogue, `prefers-reduced-motion` honoured (static weather, no loops), and pages are
`inert`-isolated. Static layers are rasterised once as images, and animation uses CSS transforms. Canvases are
small with a single 30fps loop that pauses when hidden or when a page is open. Room CSS animations pause behind pages.
