/**
 * Page content for each room object. Pure functions: config in → HTML out.
 * All text comes from src/config/*.js — edit content there, not here.
 */
import { PROJECTS } from '../config/projects.js';
import { PROCESS } from '../config/process.js';
import { ABOUT } from '../config/about.js';
import { RESUME } from '../config/resume.js';
import { CONTACT } from '../config/contact.js';
import { esc } from '../core/dom.js';
import { ICONS } from '../ui/icons.js';

/** <img> that swaps itself for a soft placeholder if the file is missing. */
const pic = (src, alt, cls = '', tint = '#a37a55', label = '') =>
  `<figure class="pic ${cls}" style="--tint:${tint}">
     ${src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" data-fallback>` : ''}
     <span class="pic__ph" ${src ? 'hidden' : ''} aria-hidden="true"><span>${esc(label || alt || 'image')}</span></span>
   </figure>`;

export const SECTIONS = {
  projects: { title: 'My work', theme: 'monitor', from: 'monitor' },
  process: { title: 'Sketchbook', theme: 'sketchbook', from: 'sketchbook' },
  about: { title: 'About me', theme: 'pinboard', from: 'pinboard' },
  resume: { title: 'Resume', theme: 'paper', from: 'books' },
  contact: { title: 'Say hello', theme: 'door', from: 'door' },
};

export function renderProjects() {
  return `
  <header class="page__head">
    <p class="page__kicker">on my screen</p>
    <h1 id="page-title" tabindex="-1">Selected work</h1>
    <p class="page__lede">A few projects I'm proud of. Pick one to read the case study.</p>
  </header>
  <ol class="work-list">
    ${PROJECTS.map((p, i) => `
    <li>
      <a class="work-row" href="#/projects/${esc(p.id)}">
        <span class="work-row__num">${String(i + 1).padStart(2, '0')}</span>
        ${pic(p.thumbnail, `${p.title} thumbnail`, 'work-row__thumb', p.accent, p.title)}
        <span class="work-row__text">
          <span class="work-row__title">${esc(p.title)}</span>
          <span class="work-row__desc">${esc(p.description)}</span>
        </span>
        <span class="work-row__meta">${esc(p.category)}<span class="work-row__year">${esc(p.year || '')}</span></span>
        <span class="work-row__go" aria-hidden="true">${ICONS.arrow}</span>
      </a>
    </li>`).join('')}
  </ol>`;
}

export function renderCaseStudy(id) {
  const i = PROJECTS.findIndex((p) => p.id === id);
  if (i < 0) return null;
  const p = PROJECTS[i];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const block = (title, text) => (text ? `<section class="cs__block"><h2>${title}</h2><p>${esc(text)}</p></section>` : '');
  return `
  <article class="cs" style="--accent:${p.accent || '#a37a55'}">
    <a class="cs__crumb" href="#/projects">${ICONS.back}<span>All projects</span></a>
    <header class="cs__head">
      <p class="page__kicker">${esc(p.category)}</p>
      <h1 id="page-title" tabindex="-1">${esc(p.title)}</h1>
      <p class="page__lede">${esc(p.description)}</p>
      <dl class="cs__meta">
        <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Timeline</dt><dd>${esc(p.duration)}${p.year ? ` · ${esc(p.year)}` : ''}</dd></div>
        <div><dt>Tools</dt><dd>${esc((p.tools || []).join(', '))}</dd></div>
      </dl>
    </header>
    ${pic(p.thumbnail, `${p.title} — cover`, 'cs__hero', p.accent, p.title)}
    <div class="cs__body">
      ${block('Overview', p.overview)}
      ${block('The problem', p.problem)}
      ${block('Research', p.research)}
      ${block('Design process', p.process)}
      ${block('Solution', p.solution)}
      ${block('Outcome', p.outcome)}
    </div>
    ${p.images?.length ? `<div class="cs__gallery">${p.images.map((im) => `<div>${pic(im.src, im.caption, 'cs__img', p.accent, im.caption)}<p class="cs__cap">${esc(im.caption || '')}</p></div>`).join('')}</div>` : ''}
    <a class="cs__next" href="#/projects/${esc(next.id)}"><span>Next project</span><b>${esc(next.title)}</b>${ICONS.arrow}</a>
  </article>`;
}

export function renderProcess() {
  return `
  <header class="page__head">
    <p class="page__kicker">my sketchbook</p>
    <h1 id="page-title" tabindex="-1">How I work</h1>
    <p class="page__lede">Messy pages, honest process. Flip through.</p>
  </header>
  <nav class="sb-tabs" aria-label="Sketchbook chapters">
    ${PROCESS.map((c, i) => `<button type="button" class="sb-tab" data-chapter="${i}" aria-controls="sb-page">${esc(c.title)}</button>`).join('')}
  </nav>
  <div class="sb" id="sb-page" aria-live="polite">
    ${PROCESS.map((c, i) => `
    <section class="sb__page" data-chapter="${i}" ${i ? 'hidden' : ''} aria-label="${esc(c.title)}">
      <h2 class="sb__title">${esc(c.title)}</h2>
      <p class="sb__note">${esc(c.note)}</p>
      <div class="sb__imgs">
        ${(c.images || []).map((im, k) => `<div class="sb__frame" style="--r:${(k % 2 ? 1.6 : -1.4)}deg">${pic(im.src, im.caption, 'sb__pic', '#b9a88a', im.caption)}<p>${esc(im.caption)}</p></div>`).join('')}
      </div>
      <p class="sb__pageno">${i + 1} / ${PROCESS.length}</p>
    </section>`).join('')}
    <div class="sb__nav">
      <button type="button" class="btn-ink" data-sb="-1">${ICONS.back}<span>previous page</span></button>
      <button type="button" class="btn-ink" data-sb="1"><span>next page</span>${ICONS.arrow}</button>
    </div>
  </div>`;
}

export function bindProcess(root) {
  let cur = 0;
  const pages = root.querySelectorAll('.sb__page');
  const tabs = root.querySelectorAll('.sb-tab');
  const go = (n) => {
    cur = (n + pages.length) % pages.length;
    pages.forEach((p, i) => { p.hidden = i !== cur; });
    tabs.forEach((t, i) => t.setAttribute('aria-current', i === cur ? 'page' : 'false'));
    root.querySelector('.sb').classList.remove('is-flip'); void root.offsetWidth; root.querySelector('.sb').classList.add('is-flip');
  };
  tabs.forEach((t) => t.addEventListener('click', () => go(+t.dataset.chapter)));
  root.querySelectorAll('[data-sb]').forEach((b) => b.addEventListener('click', () => go(cur + +b.dataset.sb)));
  go(0);
}

export function renderAbout() {
  const a = ABOUT;
  const note = (cls, inner, r = 0) => `<div class="pin-note ${cls}" style="--r:${r}deg"><span class="pin" aria-hidden="true"></span>${inner}</div>`;
  return `
  <header class="page__head page__head--board">
    <p class="page__kicker">pinned on my board</p>
    <h1 id="page-title" tabindex="-1">Hello, I'm Reetika.</h1>
  </header>
  <div class="board">
    ${note('pin-note--photo', `${pic(a.photo, 'Portrait of Reetika', 'polaroid', '#8a9a6a', 'your photo here')}<p class="hand">${esc(a.photoCaption)}</p>`, -3)}
    ${note('pin-note--intro', `<h2>Introduction</h2><p class="big">${esc(a.intro)}</p>`, 1)}
    ${note('pin-note--card', `<h2>Design philosophy</h2><p>${esc(a.philosophy)}</p>`, 2)}
    ${note('pin-note--paper', `<h2>Background</h2><p>${esc(a.background)}</p>`, -1.5)}
    ${note('pin-note--paper', `<h2>Experience</h2><ul class="plain">${a.experience.map((e) => `<li><b>${esc(e.title)}</b> · ${esc(e.place)} <span class="muted">${esc(e.years)}</span><br><span>${esc(e.note || '')}</span></li>`).join('')}</ul>`, 1.2)}
    ${note('pin-note--yellow', `<h2>Education</h2><ul class="plain">${a.education.map((e) => `<li><b>${esc(e.title)}</b><br>${esc(e.place)} <span class="muted">${esc(e.years)}</span></li>`).join('')}</ul>`, -2)}
    ${note('pin-note--blue', `<h2>Things I love</h2><ul class="stickers">${a.interests.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`, 2.5)}
    ${note('pin-note--card', `<h2>Small facts</h2><ul class="plain hand">${a.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>`, -1)}
  </div>
  <section class="timeline" aria-labelledby="tl-title">
    <h2 id="tl-title" class="hand">a little timeline</h2>
    <ol>${a.timeline.map((t) => `<li><span class="timeline__year">${esc(t.year)}</span><span>${esc(t.text)}</span></li>`).join('')}</ol>
  </section>`;
}

export function renderResume() {
  const r = RESUME;
  return `
  <div class="resume-actions">
    <a class="btn-ink btn-ink--solid" data-resume-pdf href="${esc(r.pdf)}" download>${ICONS.download}<span>Download PDF</span></a>
    <button type="button" class="btn-ink" data-print>${ICONS.copy}<span>Print this page</span></button>
  </div>
  <article class="resume">
    <header>
      <h1 id="page-title" tabindex="-1">${esc(r.name)}</h1>
      <p class="resume__headline">${esc(r.headline)}</p>
      <p>${esc(r.summary)}</p>
    </header>
    ${r.sections.map((s) => `
    <section>
      <h2>${esc(s.title)}</h2>
      ${s.items.map((it) => `
        <div class="resume__item">
          ${it.title ? `<div class="resume__row"><h3>${esc(it.title)}</h3><span>${esc(it.meta)}</span></div>` : ''}
          ${it.bullets.length ? `<ul class="${it.title ? '' : 'resume__chips'}">${it.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        </div>`).join('')}
    </section>`).join('')}
  </article>`;
}

export async function bindResume(root) {
  root.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  const a = root.querySelector('[data-resume-pdf]');
  try {
    const res = await fetch(a.href, { method: 'HEAD' });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || type.includes('text/html')) throw 0;
  } catch {
    a.removeAttribute('href'); a.removeAttribute('download');
    a.setAttribute('aria-disabled', 'true');
    a.classList.add('is-disabled');
    a.querySelector('span').textContent = 'PDF coming soon';
  }
}

export function renderContact() {
  const c = CONTACT;
  return `
  <div class="postcard">
    <div class="postcard__left">
      <p class="page__kicker">the door is open</p>
      <h1 id="page-title" tabindex="-1">${esc(c.heading)}</h1>
      <p class="page__lede">${esc(c.message)}</p>
      <p class="hand postcard__sign">${esc(c.signoff)}</p>
    </div>
    <div class="postcard__right">
      <span class="stamp" aria-hidden="true">${ICONS.mail}</span>
      <p class="postcard__label">write to me</p>
      <a class="postcard__email" href="mailto:${esc(c.email)}">${esc(c.email)}</a>
      <button type="button" class="btn-ink" data-copy="${esc(c.email)}">${ICONS.copy}<span>Copy email</span></button>
      <ul class="postcard__links">
        ${c.links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}<span aria-hidden="true">${ICONS.arrow}</span></a></li>`).join('')}
      </ul>
    </div>
  </div>`;
}

export function bindContact(root) {
  root.querySelector('[data-copy]')?.addEventListener('click', async (e) => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText(b.dataset.copy); b.querySelector('span').textContent = 'Copied!'; }
    catch { b.querySelector('span').textContent = 'Select & copy above'; }
    setTimeout(() => { b.querySelector('span').textContent = 'Copy email'; }, 2200);
  });
}

/** Swap broken images for their soft placeholders. */
export function bindImages(root) {
  root.querySelectorAll('img[data-fallback]').forEach((img) => {
    const ph = img.parentElement.querySelector('.pic__ph');
    const fail = () => { img.remove(); ph?.removeAttribute('hidden'); };
    if (img.complete && img.naturalWidth === 0) fail();
    else {
      img.addEventListener('error', fail, { once: true });
      img.addEventListener('load', () => ph && (ph.hidden = true), { once: true });
    }
  });
}
