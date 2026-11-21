/**
 * PLACEHOLDER CAT — layered SVG.
 *  .cat[data-state]  sleeping · waking · looking · stretching · returning · grumpy
 *   ├ .cat__tail       (flicks)
 *   ├ .cat__body       (breathes)
 *   ├ .cat__paws / .cat__paws-stretch
 *   └ .cat__head       (.cat__ear--l/--r, eyes closed/open/grumpy, yawn mouth)
 * Swap for painted sprites via ASSETS.cat.sprites (see ASSETS.md).
 */
export function catSvg() {
  return `
  <defs>
    <linearGradient id="cat-fur" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e3a466"/><stop offset="0.55" stop-color="#c9844a"/><stop offset="1" stop-color="#8a5228"/>
    </linearGradient>
    <radialGradient id="cat-head" cx="0.6" cy="0.35" r="0.75"><stop offset="0" stop-color="#e8ab6c"/><stop offset="1" stop-color="#b8743e"/></radialGradient>
  </defs>
  <g class="cat" data-state="sleeping">
    <ellipse cx="1418" cy="708" rx="86" ry="10" fill="#0e1218" opacity="0.45"/>
    <g class="cat__tail" style="transform-origin:1490px 686px">
      <path d="M1490 686 C1500 716 1440 722 1388 714 C1372 712 1362 706 1366 700" stroke="url(#cat-fur)" stroke-width="13" stroke-linecap="round" fill="none"/>
      <path d="M1388 714 C1376 712 1366 706 1366 700" stroke="#7a4420" stroke-width="13" stroke-linecap="round" fill="none"/>
      <path d="M1450 716 l4 -8 M1426 718 l3 -9 M1406 716 l2 -9" stroke="#8a4e22" stroke-width="3" stroke-linecap="round"/>
    </g>
    <g class="cat__body" style="transform-origin:1420px 704px">
      <path d="M1346 694 C1334 654 1380 630 1430 632 C1480 634 1504 664 1494 692 C1484 712 1362 714 1346 694 Z" fill="url(#cat-fur)"/>
      <ellipse cx="1470" cy="684" rx="23" ry="17" fill="#b8743e"/>
      <path d="M1404 636 q8 12 2 24 M1426 634 q8 14 2 26 M1448 638 q8 12 2 24 M1470 648 q6 10 0 20" stroke="#8a4e22" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.75"/>
      <path d="M1380 640 C1410 628 1460 630 1486 652" stroke="#ffd59a" stroke-width="2.5" opacity="0.5" fill="none"/>
    </g>
    <g class="cat__paws"><ellipse cx="1374" cy="704" rx="11" ry="5.5" fill="#f0dcb8"/><ellipse cx="1394" cy="706" rx="10" ry="5" fill="#e8d0aa"/></g>
    <g class="cat__paws-stretch">
      <path d="M1362 692 C1340 698 1316 700 1292 700" stroke="#c9844a" stroke-width="11" stroke-linecap="round"/>
      <path d="M1370 700 C1346 706 1322 710 1300 710" stroke="#b8743e" stroke-width="10" stroke-linecap="round"/>
      <ellipse cx="1290" cy="700" rx="9" ry="5" fill="#f0dcb8"/><ellipse cx="1298" cy="710" rx="9" ry="5" fill="#f0dcb8"/>
    </g>
    <g class="cat__head" style="transform-origin:1366px 694px">
      <g class="cat__ear cat__ear--l" style="transform-origin:1342px 660px">
        <path d="M1330 668 L1336 638 L1354 658 Z" fill="#c9844a"/><path d="M1336 662 L1339 646 L1348 658 Z" fill="#e8a090"/>
      </g>
      <g class="cat__ear cat__ear--r" style="transform-origin:1372px 656px">
        <path d="M1360 658 L1376 632 L1384 662 Z" fill="#b8743e"/><path d="M1366 656 L1375 642 L1379 658 Z" fill="#e8a090"/>
      </g>
      <ellipse cx="1356" cy="676" rx="27" ry="23" fill="url(#cat-head)"/>
      <path d="M1348 656 v8 M1356 655 v9 M1364 657 v7" stroke="#8a4e22" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="1350" cy="688" rx="13" ry="8.5" fill="#f0dcb8"/>
      <path d="M1346 683 l4 0 l-2 3 z" fill="#d87a7a"/>
      <path d="M1340 688 l-18 -2 M1340 691 l-18 3 M1360 688 l18 -3 M1360 691 l18 2" stroke="#f6ead4" stroke-width="0.8" opacity="0.7"/>
      <g class="cat__eyes cat__eyes--closed"><path d="M1336 675 q5 4 10 0 M1357 673 q5 4 10 0" stroke="#4a2a14" stroke-width="2" fill="none" stroke-linecap="round"/></g>
      <g class="cat__eyes cat__eyes--open" style="transform-origin:1352px 674px">
        <ellipse cx="1341" cy="674" rx="5" ry="5.5" fill="#d9b04a"/><ellipse cx="1362" cy="672" rx="5" ry="5.5" fill="#d9b04a"/>
        <ellipse cx="1341" cy="674" rx="1.8" ry="4.5" fill="#1a120c"/><ellipse cx="1362" cy="672" rx="1.8" ry="4.5" fill="#1a120c"/>
        <circle cx="1342.5" cy="672" r="1.1" fill="#fff"/><circle cx="1363.5" cy="670" r="1.1" fill="#fff"/>
      </g>
      <g class="cat__eyes cat__eyes--grumpy">
        <ellipse cx="1341" cy="675" rx="5" ry="3" fill="#d9b04a"/><ellipse cx="1362" cy="673" rx="5" ry="3" fill="#d9b04a"/>
        <path d="M1335 672 l12 2 M1368 670 l-12 2" stroke="#4a2a14" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="1341" cy="675" rx="1.4" ry="2.4" fill="#1a120c"/><ellipse cx="1362" cy="673" rx="1.4" ry="2.4" fill="#1a120c"/>
      </g>
      <ellipse class="cat__yawn" cx="1349" cy="694" rx="4.5" ry="5" fill="#a8404a"/>
    </g>
    <g class="cat__zzz" font-family="Caveat, 'Segoe Print', cursive" fill="#f2ead9">
      <text x="1318" y="646" font-size="14">z</text><text x="1306" y="628" font-size="18">z</text>
    </g>
  </g>`;
}
