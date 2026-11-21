/**
 * PLACEHOLDER CHARACTER — layered SVG so every part can be animated.
 *
 *  .char                    root  (data-state, data-head, data-expr)
 *   ├ .char__body           torso + arms + head (twists when she turns)
 *   │  ├ .char__arm--left / --right   (.char__hand drawing loop)
 *   │  ├ .char__arms-up     stretch pose (hidden unless state=stretching)
 *   │  └ .char__head
 *   │     ├ .head--back     default, seen from behind
 *   │     ├ .head--three    three-quarter (mid-turn frame)
 *   │     └ .head--front    face visible, with .expr--<name> groups
 *   ├ .char__chair          wooden chair, in front of her
 *   └ .char__fx             surprise marks, sleepy z's
 *
 * The head turn swaps between three DRAWN views (back → three-quarter → front),
 * so the face genuinely appears instead of a rotated back-of-head.
 * To swap in painted sprites instead, see ASSETS.character.sprites + ASSETS.md.
 */
const SKIN = '#d9a07a', SKIN_SH = '#b07a5a', HAIR = '#2a1c17', HAIR_HI = '#7a4a30';
const SWEATER = 'url(#ch-sweater)';

const eyesOpen = (rx = 3.3, ry = 4.2, pupil = true) => `
  <g class="face__eyes">
    <ellipse cx="825" cy="460" rx="${rx}" ry="${ry}" fill="#2a1c17"/>
    <ellipse cx="852" cy="460" rx="${rx}" ry="${ry}" fill="#2a1c17"/>
    ${pupil ? `<circle cx="826.2" cy="458.4" r="1.2" fill="#fff"/><circle cx="853.2" cy="458.4" r="1.2" fill="#fff"/>` : ''}
  </g>`;

const EXPRESSIONS = {
  neutral: `${eyesOpen()}
    <path d="M818 449 q7 -3 13 0 M846 449 q7 -3 13 0" stroke="${HAIR}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M833 485 q6 2 12 0" stroke="#7a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  curious: `${eyesOpen(3.7, 4.8)}
    <path d="M817 446 q7 -6 14 -2 M846 450 q7 -2 13 1" stroke="${HAIR}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M834 486 q5 -2 10 1" stroke="#7a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  annoyed: `${eyesOpen(3.4, 4)}
    <path d="M819 455 h13 v-8 h-13 z M846 455 h13 v-8 h-13 z" fill="${SKIN}"/>
    <path d="M819 456 h13 M846 456 h13" stroke="#2a1c17" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M817 446 l14 4 M861 446 l-14 4" stroke="${HAIR}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M832 487 q7 -3 14 0" stroke="#7a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  smiling: `
    <path d="M820 461 q5 -6 10 0 M847 461 q5 -6 10 0" stroke="#2a1c17" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M818 449 q7 -4 13 -1 M846 448 q7 -3 13 1" stroke="${HAIR}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M830 482 q9 9 18 0" stroke="#7a3a2a" stroke-width="2.2" fill="#a8504a" stroke-linecap="round"/>
    <ellipse cx="818" cy="474" rx="6" ry="3.5" fill="#e07a6a" opacity="0.45"/><ellipse cx="860" cy="474" rx="6" ry="3.5" fill="#e07a6a" opacity="0.45"/>`,
  surprised: `${eyesOpen(4.4, 5.4)}
    <path d="M816 444 q8 -7 15 -2 M846 442 q8 -5 15 2" stroke="${HAIR}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="839" cy="487" rx="3.6" ry="4.6" fill="#6a2a22"/>`,
  sleepy: `
    <path d="M820 461 q5 4 10 0 M847 461 q5 4 10 0" stroke="#2a1c17" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M819 452 q6 -1 12 1 M846 453 q6 -2 12 -1" stroke="${HAIR}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="839" cy="486" rx="3" ry="2.4" fill="#7a3a2a"/>`,
};

export function characterSvg() {
  const exprGroups = Object.entries(EXPRESSIONS)
    .map(([k, v]) => `<g class="expr expr--${k}">${v}</g>`).join('');

  return `
  <defs>
    <linearGradient id="ch-sweater" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8f9a98"/><stop offset="0.25" stop-color="#c9bc9c"/>
      <stop offset="0.6" stop-color="#e0cca4"/><stop offset="0.85" stop-color="#eec48a"/><stop offset="1" stop-color="#9a6e48"/>
    </linearGradient>
    <linearGradient id="ch-hair" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2c2a30"/><stop offset="0.6" stop-color="${HAIR}"/><stop offset="1" stop-color="#4a2a1c"/>
    </linearGradient>
    <radialGradient id="ch-face" cx="0.6" cy="0.4" r="0.7">
      <stop offset="0" stop-color="#ebb48a"/><stop offset="0.7" stop-color="${SKIN}"/><stop offset="1" stop-color="${SKIN_SH}"/>
    </radialGradient>
    <linearGradient id="ch-wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3d2416"/><stop offset="0.5" stop-color="#6b4128"/><stop offset="1" stop-color="#8a5634"/>
    </linearGradient>
    <linearGradient id="ch-scarf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3f6060"/><stop offset="1" stop-color="#6a9690"/></linearGradient>
  </defs>
  <g class="char" data-state="working" data-head="back" data-expr="neutral">
    <ellipse cx="846" cy="884" rx="110" ry="12" fill="#000" opacity="0.5"/>

    <g class="char__body">
      <!-- left arm (viewer's left) — reaches to keyboard -->
      <g class="char__arm char__arm--left">
        <path d="M774 524 C752 540 740 566 744 590 C748 606 772 608 790 600 L794 578 C784 560 784 544 790 528 Z" fill="${SWEATER}"/>
        <path d="M748 588 C752 602 772 604 788 598" stroke="#6a6a60" stroke-width="2" opacity="0.5" fill="none"/>
        <path d="M770 530 C754 546 746 566 748 586" stroke="#b9cde0" stroke-width="2" opacity="0.35" fill="none"/>
      </g>
      <!-- right arm — holds the stylus -->
      <g class="char__arm char__arm--right">
        <path d="M916 524 C940 540 952 566 950 590 C948 604 928 606 912 600 L906 578 C914 560 914 544 908 528 Z" fill="${SWEATER}"/>
        <path d="M918 526 C940 542 950 566 948 588" stroke="#ffcf8a" stroke-width="2.5" opacity="0.55" fill="none"/>
        <g class="char__hand">
          <path d="M920 586 C930 590 938 592 946 590" stroke="#d6c29c" stroke-width="12" stroke-linecap="round" fill="none"/>
          <ellipse cx="944" cy="591" rx="8.5" ry="5.5" fill="${SKIN}"/>
          <path d="M940 592 L956 576" stroke="#2c3036" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </g>

      <!-- torso -->
      <path class="char__torso" d="M812 490 C790 494 768 506 760 528 C752 552 756 590 764 620 L770 692 L922 692 L928 620 C936 590 938 552 930 528 C922 506 900 494 878 490 Z" fill="${SWEATER}"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${784 + i * 15} 530 V690" stroke="#7a6a50" stroke-width="1" opacity="0.14"/>`).join('')}
      <path d="M846 520 C842 580 848 630 844 690" stroke="#8a7656" stroke-width="2.5" opacity="0.35" fill="none"/>
      <path d="M800 600 C820 610 870 610 892 600" stroke="#8a7656" stroke-width="2" opacity="0.25" fill="none"/>
      <path d="M764 530 C756 560 760 600 766 640" stroke="#b9cde0" stroke-width="2.5" opacity="0.35" fill="none"/>
      <path d="M928 530 C934 560 932 600 926 640" stroke="#ffcf8a" stroke-width="3" opacity="0.5" fill="none"/>
      <!-- scarf -->
      <path d="M810 494 C826 506 866 506 882 494 C884 504 876 516 846 518 C818 518 806 506 810 494 Z" fill="url(#ch-scarf)"/>
      <path d="M872 506 C878 524 874 548 868 560 L858 556 C862 540 862 524 860 510 Z" fill="#4f7474"/>
      <!-- neck -->
      <path d="M832 476 h28 v22 q-14 6 -28 0 z" fill="${SKIN_SH}"/>

      <!-- stretch pose arms -->
      <g class="char__arms-up">
        <path d="M774 526 C758 480 786 404 832 368 L846 362 L854 378 C820 408 802 470 802 528 Z" fill="${SWEATER}"/>
        <path d="M918 526 C934 480 906 404 860 368 L846 362 L838 378 C872 408 890 470 890 528 Z" fill="${SWEATER}"/>
        <ellipse cx="846" cy="360" rx="12" ry="9" fill="${SKIN}"/>
      </g>

      <g class="char__head">
        <!-- BACK VIEW -->
        <g class="head head--back">
          <ellipse cx="809" cy="462" rx="5.5" ry="9" fill="${SKIN_SH}"/><ellipse cx="883" cy="462" rx="5.5" ry="9" fill="${SKIN}"/>
          <ellipse cx="846" cy="450" rx="37" ry="43" fill="url(#ch-hair)"/>
          <path d="M818 476 Q846 500 874 476 Q868 492 846 496 Q824 492 818 476 Z" fill="${HAIR}"/>
          <path d="M876 424 Q886 446 878 472" stroke="${HAIR_HI}" stroke-width="3" opacity="0.7" fill="none"/>
          <path d="M814 426 Q806 446 812 470" stroke="#9fb6d0" stroke-width="2" opacity="0.35" fill="none"/>
          <path d="M830 414 Q846 440 838 486 M850 412 Q858 444 852 488 M864 418 Q868 446 862 482" stroke="#140c08" stroke-width="1.4" opacity="0.6" fill="none"/>
          <circle cx="848" cy="402" r="21" fill="url(#ch-hair)"/>
          <path d="M834 396 Q848 384 862 398" stroke="${HAIR_HI}" stroke-width="2" opacity="0.6" fill="none"/>
          <rect x="834" y="416" width="28" height="6" rx="3" fill="#a4553a"/>
          <path d="M860 398 q12 4 10 18" stroke="${HAIR}" stroke-width="2" fill="none"/>
        </g>
        <!-- THREE-QUARTER VIEW -->
        <g class="head head--three">
          <ellipse cx="852" cy="450" rx="37" ry="43" fill="url(#ch-hair)"/>
          <path d="M814 430 Q800 452 808 478 Q816 496 836 498 Q822 478 822 452 Q822 436 814 430 Z" fill="url(#ch-face)"/>
          <ellipse cx="832" cy="462" rx="5" ry="8.5" fill="${SKIN}"/>
          <path d="M810 452 l-5 -2" stroke="#2a1c17" stroke-width="2" stroke-linecap="round"/>
          <path d="M818 424 Q830 420 840 432 Q834 446 828 470" stroke="${HAIR}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M880 424 Q890 446 882 472" stroke="${HAIR_HI}" stroke-width="3" opacity="0.7" fill="none"/>
          <circle cx="852" cy="402" r="21" fill="url(#ch-hair)"/>
          <rect x="838" y="416" width="28" height="6" rx="3" fill="#a4553a"/>
        </g>
        <!-- FRONT VIEW (looking over her shoulder at you) -->
        <g class="head head--front">
          <ellipse cx="848" cy="452" rx="38" ry="42" fill="url(#ch-hair)"/>
          <circle cx="852" cy="402" r="21" fill="url(#ch-hair)"/>
          <rect x="838" y="416" width="28" height="6" rx="3" fill="#a4553a"/>
          <ellipse cx="807" cy="464" rx="5" ry="8" fill="${SKIN_SH}"/><ellipse cx="871" cy="464" rx="5" ry="8" fill="${SKIN}"/>
          <ellipse cx="839" cy="461" rx="30" ry="34" fill="url(#ch-face)"/>
          <path d="M806 446 Q806 412 840 410 Q874 412 873 446 L866 440 L859 447 L852 439 L845 446 L837 439 L829 446 L821 439 L813 446 Z" fill="${HAIR}"/>
          <path d="M818 420 Q840 410 864 422" stroke="${HAIR_HI}" stroke-width="2" opacity="0.6" fill="none"/>
          <path d="M808 446 Q802 470 808 492 M871 446 Q878 470 872 492" stroke="${HAIR}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M839 466 q-2 6 1 8" stroke="${SKIN_SH}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          <ellipse cx="818" cy="474" rx="5" ry="3" fill="#e07a6a" opacity="0.25"/><ellipse cx="860" cy="474" rx="5" ry="3" fill="#e07a6a" opacity="0.25"/>
          <g class="face">${exprGroups}</g>
          <path d="M869 440 Q878 460 870 488" stroke="#ffcf8a" stroke-width="2" opacity="0.5" fill="none"/>
        </g>
      </g>
    </g>

    <!-- chair (in front of her) -->
    <g class="char__chair">
      <path d="M776 700 L770 880 M916 700 L922 880" stroke="#2a180e" stroke-width="12" stroke-linecap="round"/>
      <path d="M796 704 L798 866 M896 704 L894 866" stroke="#24140b" stroke-width="10" stroke-linecap="round" opacity="0.9"/>
      <path d="M780 800 H912" stroke="#3d2416" stroke-width="7"/>
      <path d="M754 688 H938 L934 708 H758 Z" fill="url(#ch-wood)"/>
      <path d="M754 688 H938" stroke="#d9a46a" stroke-width="2" opacity="0.45"/>
      ${[812, 846, 880].map((x) => `<rect x="${x - 4}" y="586" width="8" height="104" rx="3" fill="url(#ch-wood)"/>`).join('')}
      <rect x="768" y="560" width="16" height="140" rx="6" fill="url(#ch-wood)"/>
      <rect x="908" y="560" width="16" height="140" rx="6" fill="url(#ch-wood)"/>
      <circle cx="776" cy="558" r="9" fill="#5a3420"/><circle cx="916" cy="558" r="9" fill="#7a4a2c"/>
      <path d="M766 568 C800 556 892 556 926 568 L928 594 C892 584 800 584 764 594 Z" fill="url(#ch-wood)"/>
      <path d="M770 570 C804 560 890 560 922 570" stroke="#e7b07a" stroke-width="2" opacity="0.55" fill="none"/>
      <path d="M922 572 V700 M918 590 V698" stroke="#ffcf8a" stroke-width="1.5" opacity="0.35"/>
    </g>

    <g class="char__fx">
      <g class="fx-surprise"><path d="M796 404 l-12 -10 M804 392 l-6 -14 M818 386 l-1 -15" stroke="#f2ead9" stroke-width="2.5" stroke-linecap="round"/></g>
      <g class="fx-zzz" font-family="Caveat, 'Segoe Print', cursive" fill="#f2ead9">
        <text x="884" y="392" font-size="18">z</text><text x="898" y="372" font-size="22">z</text><text x="914" y="348" font-size="26">Z</text>
      </g>
    </g>
  </g>`;
}

export const EXPRESSION_NAMES = Object.keys(EXPRESSIONS);
