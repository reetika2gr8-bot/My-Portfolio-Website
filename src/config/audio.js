/**
 * AUDIO CONFIGURATION
 *
 * Put your files in:   public/assets/audio/music/      (music)
 *                      public/assets/audio/ambience/   (environmental loops)
 * then set `src` to e.g. 'assets/audio/music/rainy-lofi.mp3' (no leading slash).
 *
 * While `src` is null — or if the file is missing / fails to load — the room
 * quietly falls back to a gentle procedurally generated placeholder (`synth`),
 * so nothing breaks and nothing copyrighted ships. Use only music you own or
 * have a licence for (e.g. your own, CC0, or properly licensed tracks).
 *
 * Nothing ever autoplays. Visitors must press play / switch sound on.
 */
export const MUSIC_TRACKS = [
  { id: 'lofi-rain', title: 'Rainy desk (placeholder)', category: 'Cozy Lo-fi', src: null, synth: 'lofi', volume: 0.8, loop: true },
  { id: 'soft-piano', title: 'Soft piano sketches (placeholder)', category: 'Soft piano', src: null, synth: 'piano', volume: 0.8, loop: true },
  { id: 'acoustic', title: 'Window seat (placeholder)', category: 'Acoustic', src: null, synth: 'acoustic', volume: 0.75, loop: true },
  { id: 'ambient-drift', title: 'Drift (placeholder)', category: 'Ambient', src: null, synth: 'ambient', volume: 0.8, loop: true },
];

/** Environmental loops. Keys are referenced by ambiences.js → audio.ambient */
export const AMBIENT_SOUNDS = {
  rain: { title: 'Rain', src: null, synth: 'rain', volume: 0.7 },
  birds: { title: 'Birds', src: null, synth: 'birds', volume: 0.6 },
  night: { title: 'Night', src: null, synth: 'night', volume: 0.5 },
  wind: { title: 'Wind', src: null, synth: 'wind', volume: 0.65 },
  dreamy: { title: 'Dreamy', src: null, synth: 'dreamy', volume: 0.5 },
};

export const AUDIO_DEFAULTS = {
  musicVolume: 0.6,
  ambientVolume: 0.55,
  masterMuted: false,
  /** crossfade time when ambience changes (ms) */
  ambientFade: 1800,
};
