/**
 * INTERACTIVE OBJECTS — the room's navigation.
 * Coordinates are on the 1600×900 stage. `shape`: 'rect' | 'ellipse'.
 * `action`:
 *   'open:<section>'  projects | process | about | resume | contact
 *   'poke'            the character      'cat'    the cat
 *   'ambience'        window selector    'music'  radio / cassette player
 *   'say:<key>'       a line from DIALOGUE.objects[key] (plus a little wiggle)
 *   'coffee' | 'lamp' | 'clock' | 'star:<n>'
 * `layer`: which depth layer the hotspot rides on (so parallax never misaligns it).
 * `nav: true` marks primary portfolio destinations (also listed in the text menu).
 * Order matters for keyboard Tab order.
 */
export const OBJECTS = [
  { id: 'monitor', label: 'See my work', a11y: 'Computer — open Projects', action: 'open:projects', nav: true,
    shape: 'rect', x: 560, y: 410, w: 200, h: 180, layer: 'mid' },
  { id: 'character', label: "Don't disturb me", a11y: 'Poke Reetika', action: 'poke',
    shape: 'ellipse', x: 770, y: 360, w: 170, h: 340, layer: 'mid' },
  { id: 'sketchbook', label: 'My process', a11y: 'Sketchbook — open Design process', action: 'open:process', nav: true,
    shape: 'rect', x: 986, y: 568, w: 116, h: 44, layer: 'mid' },
  { id: 'pinboard', label: 'About me', a11y: 'Pinboard — open About me', action: 'open:about', nav: true,
    shape: 'rect', x: 552, y: 200, w: 306, h: 196, layer: 'mid' },
  { id: 'books', label: 'Resume', a11y: 'Bookshelf — open Resume', action: 'open:resume', nav: true,
    shape: 'rect', x: 1056, y: 236, w: 240, h: 104, layer: 'mid' },
  { id: 'door', label: 'Say hello', a11y: 'Door — open Contact', action: 'open:contact', nav: true,
    shape: 'rect', x: 1334, y: 124, w: 194, h: 400, layer: 'mid' },
  { id: 'window', label: 'Change the weather', a11y: 'Window — change the room ambience', action: 'ambience',
    shape: 'rect', x: 134, y: 144, w: 262, h: 300, layer: 'mid' },
  { id: 'radio', label: 'Music', a11y: 'Cassette radio — open music player', action: 'music',
    shape: 'rect', x: 286, y: 440, w: 118, h: 64, layer: 'mid' },
  { id: 'cat', label: "Don't poke my cat", a11y: 'The sleeping cat', action: 'cat',
    shape: 'ellipse', x: 1318, y: 612, w: 190, h: 104, layer: 'front' },
  { id: 'coffee', label: 'Coffee', a11y: 'Coffee mug', action: 'coffee',
    shape: 'rect', x: 930, y: 540, w: 56, h: 64, layer: 'mid' },
  { id: 'lamp', label: 'Lamp', a11y: 'Desk lamp — switch on or off', action: 'lamp',
    shape: 'ellipse', x: 1018, y: 404, w: 110, h: 86, layer: 'mid' },
  { id: 'clock', label: 'What time is it?', a11y: 'Desk clock', action: 'clock',
    shape: 'rect', x: 1108, y: 560, w: 82, h: 44, layer: 'mid' },
  { id: 'poster', label: 'Poster', a11y: 'Poster on the wall', action: 'say:poster',
    shape: 'rect', x: 880, y: 186, w: 134, h: 198, layer: 'mid' },
  { id: 'drawer', label: 'Drawer', a11y: 'Desk drawer — open it', action: 'drawer',
    shape: 'rect', x: 484, y: 636, w: 214, h: 60, layer: 'mid' },
  { id: 'plane', label: 'Paper plane', a11y: 'Hanging paper plane', action: 'say:plane',
    shape: 'ellipse', x: 1166, y: 86, w: 80, h: 56, layer: 'mid' },
  { id: 'plant', label: 'Basil', a11y: 'Basil the plant', action: 'say:plant',
    shape: 'ellipse', x: 0, y: 560, w: 230, h: 300, layer: 'front' },
  { id: 'star-1', label: '', a11y: 'A glow-in-the-dark star', action: 'star:1', shape: 'ellipse', x: 1090, y: 96, w: 34, h: 34, layer: 'mid', quiet: true },
  { id: 'star-2', label: '', a11y: 'A glow-in-the-dark star', action: 'star:2', shape: 'ellipse', x: 466, y: 70, w: 34, h: 34, layer: 'mid', quiet: true },
  { id: 'star-3', label: '', a11y: 'A glow-in-the-dark star', action: 'star:3', shape: 'ellipse', x: 1268, y: 176, w: 34, h: 34, layer: 'mid', quiet: true },
];

/** Speech-bubble anchor points on the stage. */
export const ANCHORS = {
  character: { x: 846, y: 372 },
  cat: { x: 1360, y: 616 },
  coffee: { x: 958, y: 520 },
  plant: { x: 150, y: 560 },
  poster: { x: 946, y: 196 },
  drawer: { x: 590, y: 630 },
  plane: { x: 1206, y: 90 },
  clock: { x: 1148, y: 552 },
  star: { x: 1100, y: 110 },
  window: { x: 400, y: 160 },
  radio: { x: 344, y: 440 },
};

/** Glow-in-the-dark wall stars (decorative + 3 secret clickable ones above). */
export const WALL_STARS = [
  [470, 86, 9], [520, 140, 6], [880, 120, 7], [940, 80, 6], [1010, 150, 8], [1107, 113, 9],
  [1160, 180, 6], [1230, 132, 7], [1285, 193, 9], [990, 230, 5], [700, 120, 6], [760, 80, 5],
  [620, 170, 5], [1320, 90, 6],
];
