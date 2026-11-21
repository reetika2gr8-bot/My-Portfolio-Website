/** Small hand-drawn-style stroke icons (inherit currentColor). */
const s = (inner, vb = '0 0 24 24') =>
  `<svg viewBox="${vb}" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const ICONS = {
  rain: s('<path d="M6 14.5a4 4 0 0 1 .7-7.9A5.5 5.5 0 0 1 17.4 7a3.6 3.6 0 0 1 .4 7.2"/><path d="M8 17l-1 3M12 16l-1.2 4M16 17l-1 3"/>'),
  sun: s('<circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M5.6 18.4l1.5-1.5M16.9 7.1l1.5-1.5"/>'),
  moon: s('<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.6 7.6 0 1 0 9.5 9.5z"/><path d="M17 4.5l.4 1.2 1.2.4-1.2.4-.4 1.2-.4-1.2-1.2-.4 1.2-.4z"/>'),
  leaf: s('<path d="M5 19c0-8 5-13.5 14-14-.3 9-6 14-14 14z"/><path d="M5 19c3-4 6-7 10-9.5"/>'),
  star: s('<path d="M12 3.5l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L12 15.9l-5 2.8 1.2-5.6L4 9.3l5.6-.6z"/>'),
  soundOn: s('<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 7a7 7 0 0 1 0 10"/>'),
  soundOff: s('<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'),
  play: s('<path d="M8 5.5v13l10.5-6.5z"/>'),
  pause: s('<path d="M8.5 5.5v13M15.5 5.5v13"/>'),
  next: s('<path d="M6 6v12l8.5-6zM18 6v12"/>'),
  prev: s('<path d="M18 6v12l-8.5-6zM6 6v12"/>'),
  close: s('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  note: s('<path d="M9 17.5V6l10-2v11"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15" r="2.5"/>'),
  back: s('<path d="M10 6l-6 6 6 6M4.5 12H20"/>'),
  menu: s('<path d="M4 7h16M4 12h11M4 17h14"/>'),
  download: s('<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>'),
  mail: s('<rect x="3.5" y="6" width="17" height="12" rx="1.5"/><path d="M4 7l8 6 8-6"/>'),
  arrow: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  copy: s('<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>'),
};
