/**
 * PLACEHOLDER SOUND — tiny procedural generators (Web Audio, no files, no copyright).
 * Used when a track / ambient sound has no `src` or its file fails to load.
 * Each factory returns { output: AudioNode, stop(fadeSeconds) }.
 */
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

let noiseBuf = null;
function noise(ctx) {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    let b = 0;
    for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; b = 0.97 * b + 0.03 * w; d[i] = w * 0.5 + b * 2.5; }
  }
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf; src.loop = true;
  return src;
}

let reverbBuf = null;
function reverb(ctx) {
  if (!reverbBuf) {
    const len = ctx.sampleRate * 2.6;
    reverbBuf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = reverbBuf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = reverbBuf;
  return conv;
}

/** Shared scaffolding: output gain + optional reverb send + scheduler loop. */
function voice(ctx, { wet = 0.25, lp = 4000 } = {}) {
  const out = ctx.createGain(); out.gain.value = 0;
  const pre = ctx.createGain();
  const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = lp;
  const rv = reverb(ctx); const wetG = ctx.createGain(); wetG.gain.value = wet;
  pre.connect(filt); filt.connect(out); filt.connect(rv); rv.connect(wetG); wetG.connect(out);
  out.gain.setTargetAtTime(1, ctx.currentTime, 0.4);
  const nodes = [];
  let timer = 0;
  return {
    out, pre, filt, nodes,
    loop(fn, ms = 60) { timer = setInterval(fn, ms); },
    stop(fade = 0.8) {
      clearInterval(timer);
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setTargetAtTime(0, ctx.currentTime, fade / 3);
      setTimeout(() => { nodes.forEach((n) => { try { n.stop(); } catch {} }); out.disconnect(); }, fade * 1000 + 300);
    },
  };
}

function note(ctx, dest, t, freq, { dur = 1.6, gain = 0.12, type = 'sine', attack = 0.01, partial = 0.3 } = {}) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
  const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 2;
  const g2 = ctx.createGain(); g2.gain.value = partial;
  o.connect(g); o2.connect(g2); g2.connect(g); g.connect(dest);
  o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
}

/* ---------------- MUSIC ---------------- */
function scheduled(ctx, opts, bpm, onBeat) {
  const v = voice(ctx, opts);
  const spb = 60 / bpm;
  let beat = 0;
  let next = ctx.currentTime + 0.15;
  v.loop(() => {
    while (next < ctx.currentTime + 0.25) { onBeat(v, next, beat, spb); beat++; next += spb; }
  }, 50);
  return { output: v.out, stop: v.stop };
}

const PROGS = {
  lofi: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]],
  piano: [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]],
  acoustic: [[43, 47, 50, 55, 59], [40, 47, 52, 55, 59], [36, 43, 48, 52, 55], [38, 45, 50, 54, 57]],
  ambient: [[45, 52, 57, 64], [41, 48, 55, 60], [43, 50, 55, 62], [40, 47, 52, 59]],
};
const PENTA = [0, 2, 4, 7, 9];

export const MUSIC_SYNTHS = {
  lofi: (ctx) => scheduled(ctx, { wet: 0.22, lp: 2200 }, 72, (v, t, b, spb) => {
    const chord = PROGS.lofi[Math.floor(b / 4) % 4];
    if (b % 4 === 0) chord.forEach((m, i) => note(ctx, v.pre, t + i * 0.012, mtof(m), { dur: spb * 4, gain: 0.05, type: 'triangle', partial: 0.15 }));
    if (b % 2 === 0) { // soft kick
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.2);
      g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g); g.connect(v.out); o.start(t); o.stop(t + 0.35);
    }
    const hat = noise(ctx), hg = ctx.createGain(), hf = ctx.createBiquadFilter();
    hf.type = 'highpass'; hf.frequency.value = 7000;
    hg.gain.setValueAtTime(0.025, t + spb / 2); hg.gain.exponentialRampToValueAtTime(0.0005, t + spb / 2 + 0.05);
    hat.connect(hf); hf.connect(hg); hg.connect(v.out); hat.start(t + spb / 2, Math.random()); hat.stop(t + spb / 2 + 0.08);
    if (Math.random() < 0.45) note(ctx, v.pre, t + (Math.random() < 0.5 ? 0 : spb / 2), mtof(72 + PENTA[Math.floor(Math.random() * 5)] - 7), { dur: 1.2, gain: 0.045 });
  }),
  piano: (ctx) => scheduled(ctx, { wet: 0.35, lp: 3200 }, 84, (v, t, b) => {
    const chord = PROGS.piano[Math.floor(b / 8) % 4];
    const m = chord[[0, 2, 1, 3, 2, 1, 3, 2][b % 8]] + 12;
    note(ctx, v.pre, t, mtof(m), { dur: 2.6, gain: 0.07, partial: 0.4 });
    if (b % 8 === 0) note(ctx, v.pre, t, mtof(chord[0] - 12), { dur: 4, gain: 0.06 });
  }),
  acoustic: (ctx) => scheduled(ctx, { wet: 0.18, lp: 2600 }, 96, (v, t, b, spb) => {
    const chord = PROGS.acoustic[Math.floor(b / 8) % 4];
    const pattern = [1, 0, 1, 1, 0, 1, 1, 0];
    if (pattern[b % 8]) {
      const down = b % 2 === 0;
      (down ? chord : [...chord].reverse()).forEach((m, i) =>
        note(ctx, v.pre, t + i * 0.018, mtof(m), { dur: down ? 1.4 : 0.6, gain: down ? 0.04 : 0.025, type: 'sawtooth', partial: 0 }));
    }
  }),
  ambient: (ctx) => scheduled(ctx, { wet: 0.6, lp: 1800 }, 30, (v, t, b) => {
    if (b % 4 === 0) PROGS.ambient[Math.floor(b / 4) % 4].forEach((m) =>
      note(ctx, v.pre, t, mtof(m), { dur: 9, gain: 0.035, attack: 2.5, type: 'triangle', partial: 0.1 }));
    if (Math.random() < 0.5) note(ctx, v.pre, t + Math.random(), mtof(76 + PENTA[Math.floor(Math.random() * 5)]), { dur: 4, gain: 0.02, attack: 0.3 });
  }),
};

/* ---------------- AMBIENCE ---------------- */
function filteredNoise(ctx, v, type, freq, q, gain) {
  const n = noise(ctx), f = ctx.createBiquadFilter(), g = ctx.createGain();
  f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.value = gain;
  n.connect(f); f.connect(g); g.connect(v.out); n.start(0, Math.random() * 2);
  v.nodes.push(n);
  return { f, g };
}
function lfo(ctx, v, target, rate, depth) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.value = rate; g.gain.value = depth; o.connect(g); g.connect(target); o.start();
  v.nodes.push(o);
}

export const AMBIENT_SYNTHS = {
  rain(ctx) {
    const v = voice(ctx, { wet: 0 });
    filteredNoise(ctx, v, 'lowpass', 5200, 0.3, 0.28);
    const b = filteredNoise(ctx, v, 'bandpass', 1400, 0.6, 0.12);
    lfo(ctx, v, b.g.gain, 0.13, 0.05);
    filteredNoise(ctx, v, 'lowpass', 300, 0.5, 0.25);
    v.loop(() => { // droplet ticks
      if (Math.random() < 0.5) {
        const t = ctx.currentTime + Math.random() * 0.05, o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = 1800 + Math.random() * 2400; g.gain.setValueAtTime(0.012, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        o.connect(g); g.connect(v.out); o.start(t); o.stop(t + 0.05);
      }
    }, 70);
    return { output: v.out, stop: v.stop };
  },
  wind(ctx) {
    const v = voice(ctx, { wet: 0 });
    const a = filteredNoise(ctx, v, 'lowpass', 500, 1.2, 0.35);
    lfo(ctx, v, a.f.frequency, 0.09, 320);
    lfo(ctx, v, a.g.gain, 0.06, 0.18);
    const b = filteredNoise(ctx, v, 'bandpass', 900, 3, 0.06);
    lfo(ctx, v, b.f.frequency, 0.17, 400);
    return { output: v.out, stop: v.stop };
  },
  birds(ctx) {
    const v = voice(ctx, { wet: 0.3 });
    filteredNoise(ctx, v, 'bandpass', 2500, 0.4, 0.015);
    let next = 0;
    v.loop(() => {
      if (ctx.currentTime < next) return;
      next = ctx.currentTime + 1.2 + Math.random() * 4;
      const base = 2600 + Math.random() * 1800, n = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) {
        const t = ctx.currentTime + 0.05 + i * (0.09 + Math.random() * 0.05);
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.setValueAtTime(base, t); o.frequency.exponentialRampToValueAtTime(base * (1.2 + Math.random() * 0.5), t + 0.06);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.035, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
        o.connect(g); g.connect(v.pre); o.start(t); o.stop(t + 0.1);
      }
    }, 100);
    return { output: v.out, stop: v.stop };
  },
  night(ctx) {
    const v = voice(ctx, { wet: 0.2 });
    filteredNoise(ctx, v, 'lowpass', 400, 0.4, 0.05);
    let next = 0;
    v.loop(() => {
      if (ctx.currentTime < next) return;
      next = ctx.currentTime + 0.7 + Math.random() * 1.4;
      const f = 4200 + Math.random() * 600;
      for (let i = 0; i < 3; i++) {
        const t = ctx.currentTime + 0.05 + i * 0.07;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.012, t + 0.01); g.gain.linearRampToValueAtTime(0, t + 0.045);
        o.connect(g); g.connect(v.pre); o.start(t); o.stop(t + 0.06);
      }
    }, 100);
    return { output: v.out, stop: v.stop };
  },
  dreamy(ctx) {
    const v = voice(ctx, { wet: 0.7, lp: 2000 });
    [57, 64, 69].forEach((m, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = mtof(m - 12); g.gain.value = 0.03;
      o.connect(g); g.connect(v.pre); o.start(); v.nodes.push(o);
      lfo(ctx, v, o.detune, 0.07 + i * 0.03, 6);
    });
    v.loop(() => {
      if (Math.random() < 0.04) note(ctx, v.pre, ctx.currentTime + 0.05, mtof(81 + PENTA[Math.floor(Math.random() * 5)]), { dur: 3.5, gain: 0.025, partial: 0.5 });
    }, 200);
    return { output: v.out, stop: v.stop };
  },
};

/* ---------------- ONE-SHOT EFFECTS ---------------- */
function env(ctx, dest, t, peak, attack, dur) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(dest);
  return g;
}
export const EFFECTS = {
  /** wooden drawer sliding out: low rumble + soft stop */
  drawerOpen(ctx, dest) {
    const t = ctx.currentTime, n = noise(ctx), f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.setValueAtTime(380, t); f.frequency.linearRampToValueAtTime(700, t + 0.32);
    n.connect(f); f.connect(env(ctx, dest, t, 0.2, 0.05, 0.38)); n.start(t, Math.random()); n.stop(t + 0.4);
    const o = ctx.createOscillator(); o.frequency.setValueAtTime(140, t + 0.34); o.frequency.exponentialRampToValueAtTime(70, t + 0.46);
    o.connect(env(ctx, dest, t + 0.34, 0.12, 0.005, 0.14)); o.start(t + 0.34); o.stop(t + 0.5);
  },
  /** drawer pushed shut: short slide + wooden knock */
  drawerClose(ctx, dest) {
    const t = ctx.currentTime, n = noise(ctx), f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 520; n.connect(f); f.connect(env(ctx, dest, t, 0.14, 0.03, 0.22)); n.start(t, Math.random()); n.stop(t + 0.25);
    const o = ctx.createOscillator(); o.frequency.setValueAtTime(180, t + 0.2); o.frequency.exponentialRampToValueAtTime(80, t + 0.3);
    o.connect(env(ctx, dest, t + 0.2, 0.2, 0.004, 0.12)); o.start(t + 0.2); o.stop(t + 0.34);
  },
  /** tiny wooden/paper tap */
  tap(ctx, dest) {
    const t = ctx.currentTime, o = ctx.createOscillator(), f = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.setValueAtTime(900 + Math.random() * 300, t); o.frequency.exponentialRampToValueAtTime(400, t + 0.05);
    f.type = 'bandpass'; f.frequency.value = 1200; o.connect(f); f.connect(env(ctx, dest, t, 0.06, 0.003, 0.07)); o.start(t); o.stop(t + 0.09);
  },
  /** paper rustle */
  paper(ctx, dest) {
    const t = ctx.currentTime, n = noise(ctx), f = ctx.createBiquadFilter();
    f.type = 'highpass'; f.frequency.value = 2500; n.connect(f); f.connect(env(ctx, dest, t, 0.07, 0.02, 0.18)); n.start(t, Math.random()); n.stop(t + 0.2);
  },
  /** found it: a soft little chime arpeggio */
  found(ctx, dest) {
    const t = ctx.currentTime;
    [76, 79, 83, 88].forEach((m, i) => {
      const o = ctx.createOscillator(), f = 440 * Math.pow(2, (m - 69) / 12);
      o.type = 'sine'; o.frequency.value = f;
      o.connect(env(ctx, dest, t + i * 0.09, 0.09, 0.01, 0.9)); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 1);
    });
  },
  /** a startled little "mrrAOW?" */
  startle(ctx, dest) {
    const t = ctx.currentTime + 0.01;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(1150, t + 0.1); o.frequency.exponentialRampToValueAtTime(700, t + 0.32);
    const vib = ctx.createOscillator(), vg = ctx.createGain(); vib.frequency.value = 28; vg.gain.value = 18; vib.connect(vg); vg.connect(o.frequency);
    const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 1300; f1.Q.value = 3;
    const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 2600; f2.Q.value = 4;
    const g = env(ctx, dest, t, 0.22, 0.03, 0.38);
    o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g);
    o.start(t); vib.start(t); o.stop(t + 0.42); vib.stop(t + 0.42);
  },
  /** a quick whoosh */
  leap(ctx, dest) {
    const t = ctx.currentTime, n = noise(ctx), f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(2200, t + 0.35);
    n.connect(f); f.connect(env(ctx, dest, t, 0.12, 0.12, 0.42)); n.start(t, Math.random()); n.stop(t + 0.45);
  },
  /** one claw swipe: a scratchy, rising noise burst */
  scratch(ctx, dest) {
    const t = ctx.currentTime, n = noise(ctx), f = ctx.createBiquadFilter(), hp = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.Q.value = 2.5; f.frequency.setValueAtTime(2200, t); f.frequency.exponentialRampToValueAtTime(5200, t + 0.12);
    hp.type = 'highpass'; hp.frequency.value = 1200;
    const g = env(ctx, dest, t, 0.2, 0.008, 0.14);
    const am = ctx.createOscillator(), ag = ctx.createGain(); am.frequency.value = 90; ag.gain.value = 0.08; am.connect(ag); ag.connect(g.gain);
    n.connect(f); f.connect(hp); hp.connect(g); n.start(t, Math.random()); n.stop(t + 0.16); am.start(t); am.stop(t + 0.16);
  },
};
