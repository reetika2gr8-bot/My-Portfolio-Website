/**
 * MY LITTLE ROOM — entry point. Wires the modules together; contains no art or content.
 */
import './styles/base.css';
import './styles/room.css';
import './styles/character.css';
import './styles/ui.css';
import './styles/pages.css';
import './styles/pounce.css';

import { SITE } from './config/site.js';
import { ASSETS } from './config/assets.js';
import { DIALOGUE } from './config/dialogue.js';
import { OBJECTS, ANCHORS } from './config/objects.js';
import { $, el, cycler } from './core/dom.js';
import { bus } from './core/events.js';
import { prefs } from './core/prefs.js';
import { motion } from './core/motion.js';
import { Stage } from './core/stage.js';
import { SpriteRenderer } from './core/sprites.js';
import { buildRoom, enableParallax } from './room/Room.js';
import { Weather } from './room/Weather.js';
import { Dialogue } from './room/Dialogue.js';
import { buildHotspots } from './room/Hotspots.js';
import { CharacterController, SvgCharacterRenderer } from './character/CharacterController.js';
import { CatController, SvgCatRenderer } from './cat/CatController.js';
import { CatPounce } from './cat/CatPounce.js';
import { AmbienceManager } from './ambience/AmbienceManager.js';
import { AmbienceSelector } from './ambience/AmbienceSelector.js';
import { AudioEngine } from './audio/AudioEngine.js';
import { MusicPlayer } from './audio/MusicPlayer.js';
import { SoundControl } from './audio/SoundControl.js';
import { SectionHost } from './sections/SectionHost.js';
import { createRouter } from './sections/router.js';
import { closeAnyPopup } from './ui/Popup.js';
import { showIntro, showPanHint } from './ui/Intro.js';
import { AltNav } from './ui/AltNav.js';

async function init() {
  document.title = SITE.title;
  const app = $('#app');
  const roomEl = el('main', { class: 'room is-loading', id: 'room', 'aria-label': "Reetika's room — an interactive portfolio" });
  roomEl.innerHTML = `
    <h1 class="sr-only">${SITE.name}'s room — interactive portfolio. Explore objects in the room or use the room guide.</h1>
    <div class="viewport" id="viewport"><div class="sizer"><div class="stage" id="stage"></div></div></div>`;
  const ui = el('div', { class: 'ui' });
  const live = el('p', { class: 'sr-only', 'aria-live': 'polite' });
  app.append(roomEl, ui, live);

  const viewport = $('#viewport', roomEl);
  const stage = new Stage(viewport, $('.sizer', roomEl), $('#stage', roomEl));
  const refs = await buildRoom($('#stage', roomEl));

  const weather = new Weather(refs.windowCanvas, refs.motesCanvas);
  const dialogue = new Dialogue(refs.bubbles, live);
  const say = (text, anchor, opts) => dialogue.say(text, anchor, opts);

  // --- character (SVG placeholder, or painted sprites if configured)
  const charRoot = refs.character.querySelector('.char');
  const charRenderers = [new SvgCharacterRenderer(charRoot)];
  if (ASSETS.character.sprites) {
    const sr = new SpriteRenderer(refs.depths[1], ASSETS.character.sprites, 'sprite--character');
    charRenderers.push(sr);
    sr.ready.then((ok) => ok && refs.character.classList.add('is-replaced'));
  }
  const character = new CharacterController(charRenderers, say);

  // --- cat
  const catRenderers = [new SvgCatRenderer(refs.cat.querySelector('.cat'))];
  if (ASSETS.cat.sprites) {
    const sr = new SpriteRenderer(refs.depths[2], ASSETS.cat.sprites, 'sprite--cat');
    catRenderers.push(sr);
    sr.ready.then((ok) => ok && refs.cat.classList.add('is-replaced'));
  }
  const cat = new CatController(catRenderers, say, character);

  // --- ambience + audio
  const audio = new AudioEngine();
  const ambience = new AmbienceManager({ room: roomEl, refs, weather, audio, character });
  ambience.apply(prefs.get('ambience', SITE.defaultAmbience), { instant: true, quiet: true });
  // the "I warned you" easter egg — owns cat pokes
  cat.pounce = new CatPounce({ catRoot: refs.cat.querySelector('.cat'), cat, character, audio, shakeTarget: viewport, stage });
  const selector = new AmbienceSelector(refs.popups, ambience, audio, stage);
  const player = new MusicPlayer(refs.popups, audio, refs.desk.querySelector('.radio'), stage);
  new SoundControl(ui, audio, () => player.popup.open());

  // --- pages + routing
  let hotspots = {};
  const router = createRouter(({ section, param }) => {
    closeAnyPopup();
    if (section && host.open(section, param)) return;
    host.close();
  });
  const host = new SectionHost(app, roomEl, hotspots, () => router.home());

  // --- object actions
  const coffeeLine = cycler(DIALOGUE.coffee);
  const objLines = Object.fromEntries(Object.entries(DIALOGUE.objects).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, cycler(v)]));
  const wiggleTargets = { plant: refs.plant.querySelector('.plant'), plane: refs.plane.querySelector('.plane') };
  const wiggle = (node) => { if (!node) return; node.classList.remove('is-wiggle'); void node.getBBox?.(); node.classList.add('is-wiggle'); setTimeout(() => node.classList.remove('is-wiggle'), 900); };
  const starsFound = new Set();
  let lampBusy = false;

  function handleAction(action, obj) {
    const [kind, arg] = action.split(':');
    switch (kind) {
      case 'open': router.go(arg); break;
      case 'poke': character.poke(); break;
      case 'cat': cat.poke(); break;
      case 'ambience': selector.toggle(); break;
      case 'music': player.toggle(); break;
      case 'coffee':
        wiggle(refs.desk.querySelector('.coffee'));
        say(coffeeLine(), 'coffee', { duration: 2400 });
        break;
      case 'lamp':
        if (lampBusy) break;
        lampBusy = true;
        ambience.setLamp(false);
        character.react(DIALOGUE.character.lampOff, { hold: 2200 });
        setTimeout(() => {
          ambience.setLamp(true);
          say(DIALOGUE.character.lampBackOn.text, 'character', { duration: 1600 });
          lampBusy = false;
        }, 3000);
        break;
      case 'clock': say(DIALOGUE.objects.clock(new Date().getHours()), 'clock'); break;
      case 'say':
        wiggle(wiggleTargets[arg]);
        say(objLines[arg](), ANCHORS[arg] ? arg : 'character');
        break;
      case 'star': {
        starsFound.add(arg);
        const lines = DIALOGUE.objects.star;
        say(lines[Math.min(starsFound.size, lines.length) - 1], { x: obj.x + obj.w / 2, y: obj.y }, { duration: 2400 });
        if (starsFound.size === 3) setTimeout(() => character.react({ text: 'You found all my stars? Okay, you can stay.', expression: 'smiling' }), 1600);
        break;
      }
      default: break;
    }
  }
  hotspots = buildHotspots({ mid: refs.hotspotsMid, front: refs.hotspotsFront }, handleAction);
  host.hotspots = hotspots;
  bus.on('action', (a) => handleAction(a, {}));

  // --- desk clock
  const tick = () => {
    const d = new Date();
    refs.clock.innerHTML = `${String(d.getHours()).padStart(2, '0')}<span class="desk-clock__colon">:</span>${String(d.getMinutes()).padStart(2, '0')}`;
  };
  tick(); setInterval(tick, 15000);

  // --- extras
  enableParallax(viewport, refs.depths, () => stage.mode === 'cover' && !motion.reduced && !host.current);
  new AltNav(ui, { onAmbience: () => selector.open(), onMusic: () => player.popup.open() });

  character.start();
  cat.start();
  router.start();

  requestAnimationFrame(() => roomEl.classList.remove('is-loading'));
  $('#boot')?.classList.add('is-done');
  setTimeout(() => $('#boot')?.remove(), 1200);
  if (!host.current) {
    showIntro(ui, roomEl);
    if (stage.mode === 'pan') showPanHint(ui, viewport);
  }

  // handy for debugging in the console
  window.__room = { character, cat, pounce: cat.pounce, ambience, audio, weather, stage, router, OBJECTS };
}

init().catch((e) => {
  console.error(e);
  const boot = document.getElementById('boot');
  if (boot) boot.innerHTML = '<p>Something went wrong loading the room. <a href="#/projects">See my work</a> · <a href="#/contact">Contact</a></p>';
});
