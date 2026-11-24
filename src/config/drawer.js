/**
 * THE DESK DRAWER — "You weren't supposed to open this..."
 * Everything you might want to edit about the drawer lives here.
 *
 * OBJECTS: positions are on the drawer close-up (1000 × 640 units; the floor of the
 * drawer is roughly x 100–900, y 100–555). `w` = width in the same units, `r` = tilt.
 *   art       which drawing to use (src/drawer/drawerArt.js)
 *   canHide   the lucky charm may be hidden under it
 *   anim      click animation: flap | roll | jingle | bounce | flash | bite | peel | squeak
 *   egg       special easter-egg behaviour instead of a search: polaroid | note | fortune
 */
export const DRAWER = {
  opening: "Oh. You're snooping. Interesting.",
  intro: "I've misplaced my lucky charm. Can you find it?",
  win: 'You found it! You officially have too much time on your hands. But I appreciate you.',
  alreadySearched: ['You already looked there.', 'Still not there. I checked.', 'Same paper clip. Same answer.'],
  wrong: [
    "Not that one. That's important. Probably.",
    'Why are you touching my stationery?',
    'Nope. Keep looking.',
    'That was literally a paper clip.',
    "You're making a mess.",
    'Are you sure you have work to do?',
    'Warm. Actually no, cold.',
    "Hey, put that back where it was. Ish.",
  ],

  polaroid: {
    // each click on the polaroid shows the next memory
    memories: [
      'Summer 20XX — I drew this whole room on the train home. (placeholder)',
      'Fun fact: Basil the plant is older than my first design job. (placeholder)',
      'My first ever "real" project was a poster for a bake sale. Sold out. (placeholder)',
    ],
    caption: 'me + coffee',
  },

  note: {
    title: 'a note to whoever opened this',
    body: "Thank you for looking around properly. Most people don't. If you've made it this far, we should probably work together. (Placeholder — write your own message here.)",
    signoff: '— R.',
  },

  fortunes: [
    'You will encounter an unnecessarily complicated UX flow this week.',
    'Your next cup of coffee will be worth it.',
    'Trust your instincts. And test your prototypes.',
    'Someone will appreciate the details you almost gave up on.',
    'A bug you ignored will fix itself. Just kidding.',
    'Your best idea today will happen in the shower.',
  ],

  objects: [
    { id: 'notebook', label: 'tiny notebook', art: 'notebook', x: 250, y: 200, w: 170, r: -8, canHide: true, anim: 'flap' },
    { id: 'polaroid', label: 'a polaroid', art: 'polaroid', x: 445, y: 175, w: 104, r: 8, egg: 'polaroid' },
    { id: 'pencil', label: 'pencil', art: 'pencil', x: 655, y: 150, w: 230, r: 14, anim: 'roll' },
    { id: 'clips', label: 'paper clips', art: 'clips', x: 808, y: 232, w: 92, r: 0, anim: 'jingle' },
    { id: 'note', label: 'a folded note', art: 'note', x: 215, y: 335, w: 112, r: 6, egg: 'note' },
    { id: 'crumpled', label: 'crumpled paper', art: 'crumpled', x: 372, y: 365, w: 120, r: 0, canHide: true, anim: 'bounce' },
    { id: 'camera', label: 'little camera', art: 'camera', x: 590, y: 335, w: 176, r: -5, canHide: true, anim: 'flash' },
    { id: 'fortune', label: 'fortune teller', art: 'fortune', x: 835, y: 380, w: 112, r: -6, egg: 'fortune' },
    { id: 'stickers', label: 'stickers', art: 'stickers', x: 180, y: 470, w: 140, r: 10, canHide: true, anim: 'peel' },
    { id: 'cattoy', label: 'cat toy', art: 'cattoy', x: 470, y: 490, w: 150, r: -12, canHide: true, anim: 'squeak' },
    { id: 'cookie', label: 'a cookie', art: 'cookie', x: 728, y: 488, w: 106, r: 0, canHide: true, anim: 'bite' },
  ],
};
