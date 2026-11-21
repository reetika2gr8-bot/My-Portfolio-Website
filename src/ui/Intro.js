/**
 * Subtle welcome note + discoverability hint. Fades after a few seconds or on the
 * first interaction. Never blocks the room.
 */
import { el, wait } from '../core/dom.js';
import { SITE } from '../config/site.js';

export function showIntro(root, roomEl) {
  const note = el('div', { class: 'intro', role: 'status' });
  note.innerHTML = `<p class="intro__welcome"></p><p class="intro__hint"></p>`;
  note.querySelector('.intro__welcome').textContent = SITE.welcome;
  note.querySelector('.intro__hint').textContent = SITE.hint;
  root.appendChild(note);

  let done = false;
  const dismiss = async () => {
    if (done) return;
    done = true;
    note.classList.add('is-out');
    roomEl.classList.remove('is-hinting');
    await wait(900);
    note.remove();
  };
  (async () => {
    await wait(700);
    note.classList.add('is-in');
    await wait(1600);
    note.classList.add('is-hint');
    roomEl.classList.add('is-hinting');
    await wait(SITE.introDuration);
    dismiss();
  })();
  const onFirst = (e) => {
    if (e.type === 'keydown' && e.key === 'Tab') return; // tabbing to explore shouldn't kill the hint
    dismiss();
    window.removeEventListener('pointerdown', onFirst, true);
    window.removeEventListener('keydown', onFirst, true);
  };
  setTimeout(() => {
    window.addEventListener('pointerdown', onFirst, true);
    window.addEventListener('keydown', onFirst, true);
  }, 1200);
}

export function showPanHint(root, viewport) {
  const h = el('div', { class: 'pan-hint', 'aria-hidden': 'true' }, '<span>‹</span> swipe to look around <span>›</span>');
  root.appendChild(h);
  setTimeout(() => h.classList.add('is-in'), 1800);
  let start = viewport.scrollLeft;
  const hide = () => { h.classList.add('is-out'); setTimeout(() => h.remove(), 800); };
  const onScroll = () => { if (Math.abs(viewport.scrollLeft - start) > 30) { hide(); viewport.removeEventListener('scroll', onScroll); } };
  viewport.addEventListener('scroll', onScroll, { passive: true });
  setTimeout(hide, 12000);
}
