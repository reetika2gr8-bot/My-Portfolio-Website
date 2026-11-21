/**
 * The room is painted on a fixed 1600×900 "stage". This module fits it to any screen:
 *  - "cover" mode (wide screens): the stage fills the viewport, cropping a little.
 *  - "pan" mode (portrait / narrow): the stage fills the viewport HEIGHT and the
 *    visitor scrolls / swipes sideways to look around the room (native scrolling,
 *    so touch never fights with taps).
 * It also exposes --s (current scale) so UI inside the stage can stay a readable size.
 */
import { bus } from './events.js';

export const STAGE_W = 1600;
export const STAGE_H = 900;
const PAN_BELOW_ASPECT = 1.45;   // narrower than this → pan mode
const FOCUS_X = 860;            // where to centre initially in pan mode (the desk)

export class Stage {
  constructor(viewport, sizer, stage) {
    this.viewport = viewport;
    this.sizer = sizer;
    this.stage = stage;
    this.scale = 1;
    this.mode = 'cover';
    this.parallax = { x: 0, y: 0 };
    this._centred = false;
    this.fit = this.fit.bind(this);
    window.addEventListener('resize', this.fit);
    window.visualViewport?.addEventListener('resize', this.fit);
    this.fit();
  }

  fit() {
    const vw = this.viewport.clientWidth || window.innerWidth;
    const vh = this.viewport.clientHeight || window.innerHeight;
    const aspect = vw / vh;
    const prevMode = this.mode;
    this.mode = aspect < PAN_BELOW_ASPECT ? 'pan' : 'cover';
    document.documentElement.dataset.stageMode = this.mode;

    if (this.mode === 'cover') {
      const s = Math.max(vw / STAGE_W, vh / STAGE_H);
      const ox = (vw - STAGE_W * s) / 2;
      const oy = (vh - STAGE_H * s) * 0.45; // keep a touch more of the ceiling
      this.scale = s;
      this.sizer.style.width = vw + 'px';
      this.sizer.style.height = vh + 'px';
      this.stage.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
    } else {
      const s = vh / STAGE_H;
      this.scale = s;
      this.sizer.style.width = Math.ceil(STAGE_W * s) + 'px';
      this.sizer.style.height = vh + 'px';
      this.stage.style.transform = `scale(${s})`;
      if (!this._centred || prevMode !== 'pan') {
        this.panTo(FOCUS_X, false);
        this._centred = true;
      }
    }
    this.stage.style.setProperty('--s', this.scale.toFixed(4));
    document.documentElement.style.setProperty('--stage-scale', this.scale.toFixed(4));
    bus.emit('stage:resize', { scale: this.scale, mode: this.mode });
  }

  /** In pan mode: scroll so stage x is centred. */
  panTo(x, smooth = true) {
    if (this.mode !== 'pan') return;
    const left = x * this.scale - this.viewport.clientWidth / 2;
    this.viewport.scrollTo({ left: Math.max(0, left), behavior: smooth ? 'smooth' : 'auto' });
  }

  /** Make sure a stage-space point is visible (used before opening popups on mobile). */
  reveal(x) {
    if (this.mode !== 'pan') return;
    const viewL = this.viewport.scrollLeft / this.scale;
    const viewR = viewL + this.viewport.clientWidth / this.scale;
    if (x < viewL + 60 || x > viewR - 60) this.panTo(x);
  }
}
