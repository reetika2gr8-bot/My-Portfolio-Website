/**
 * Hash router:  #/            → the room
 *               #/projects    #/projects/<id>   #/process   #/about   #/resume   #/contact
 * Works on any static host, supports deep links and the browser back button.
 */
export function createRouter(onRoute) {
  const parse = () => {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    return { section: parts[0] || null, param: parts[1] ? decodeURIComponent(parts[1]) : null };
  };
  window.addEventListener('hashchange', () => onRoute(parse()));
  return {
    start: () => onRoute(parse()),
    go: (section, param) => { location.hash = section ? `#/${section}${param ? '/' + encodeURIComponent(param) : ''}` : '#/'; },
    home: () => { if (location.hash && location.hash !== '#/') location.hash = '#/'; else onRoute({ section: null }); },
  };
}
