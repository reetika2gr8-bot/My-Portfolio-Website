/**
 * Opens portfolio pages OVER the room: the room stays visible behind, softly
 * blurred, and every page has the same "back to my room" control (and Esc).
 * Room animations pause while a page is open.
 */
import { el } from '../core/dom.js';
import { ICONS } from '../ui/icons.js';
import { ticker } from '../core/ticker.js';
import { SITE } from '../config/site.js';
import {
  SECTIONS, renderProjects, renderCaseStudy, renderProcess, bindProcess, renderAbout,
  renderResume, bindResume, renderContact, bindContact, bindImages,
} from './renderers.js';

export class SectionHost {
  constructor(root, roomEl, hotspots, goHome) {
    this.roomEl = roomEl;
    this.hotspots = hotspots;
    this.goHome = goHome;
    this.current = null;
    this.el = el('div', { class: 'page', hidden: true, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'page-title' });
    this.back = el('button', { type: 'button', class: 'page__back' }, `${ICONS.back}<span>back to my room</span>`);
    this.back.addEventListener('click', () => this.goHome());
    this.scroller = el('div', { class: 'page__scroll' });
    this.content = el('div', { class: 'page__content' });
    this.scroller.appendChild(this.content);
    this.el.append(this.back, this.scroller);
    root.appendChild(this.el);
    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); this.goHome(); }
      if (e.key === 'Tab') this.trapFocus(e);
    });
  }

  open(name, param) {
    const sec = SECTIONS[name];
    if (!sec) return false;
    let html;
    if (name === 'projects') html = param ? renderCaseStudy(param) : renderProjects();
    if (html === null) html = renderProjects();
    if (name === 'process') html = renderProcess();
    if (name === 'about') html = renderAbout();
    if (name === 'resume') html = renderResume();
    if (name === 'contact') html = renderContact();

    const wasOpen = !!this.current;
    if (!wasOpen) this.returnTo = this.hotspots[sec.from] || document.activeElement;
    this.current = name;
    this.el.dataset.theme = sec.theme;
    this.content.innerHTML = html;
    bindImages(this.content);
    if (name === 'process') bindProcess(this.content);
    if (name === 'resume') bindResume(this.content);
    if (name === 'contact') bindContact(this.content);

    document.title = `${sec.title} — ${SITE.title}`;
    this.el.hidden = false;
    this.roomEl.classList.add('is-away');
    this.roomEl.setAttribute('aria-hidden', 'true');
    this.roomEl.inert = true;
    ticker.pause('page');
    requestAnimationFrame(() => this.el.classList.add('is-open'));
    this.scroller.scrollTop = 0;
    setTimeout(() => this.content.querySelector('#page-title')?.focus({ preventScroll: true }), wasOpen ? 30 : 380);
    return true;
  }

  close() {
    if (!this.current) return;
    this.current = null;
    document.title = SITE.title;
    this.el.classList.remove('is-open');
    this.roomEl.classList.remove('is-away');
    this.roomEl.removeAttribute('aria-hidden');
    this.roomEl.inert = false;
    ticker.resume('page');
    setTimeout(() => { if (!this.current) { this.el.hidden = true; this.content.innerHTML = ''; } }, 450);
    this.returnTo?.focus?.({ preventScroll: true });
  }

  trapFocus(e) {
    const f = [...this.el.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"], input')].filter((n) => n.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
