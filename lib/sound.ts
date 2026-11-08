// Metallic UI sounds, synthesized with the Web Audio API. Nothing is
// downloaded.
//
// Struck metal rings at inharmonic partials, not the whole-number overtones
// of a string or voice. A thin metal bar's first bending modes sit at about
// 1 : 2.76 : 5.40 times the fundamental, and the higher ones die away faster.
// Each sound here is a few sine partials at those ratios, each with its own
// exponential decay, plus a few milliseconds of bright noise for the strike.
//
// - click: "tink", a tiny titanium tap. Short and quiet, with a slight random
//   pitch so repeated clicks don't sound machine-gunned.
// - toggle-on (to light): two rising chime notes, like a tuning fork pair.
// - toggle-off (to dark): the same two notes, falling.
//
// Sounds are always on; there is no mute toggle. Browsers only allow audio
// after the visitor's first click or key press, so the AudioContext is
// created (and unlocked) at that moment.

export type SoundName = "click" | "toggle-on" | "toggle-off";

const MASTER_VOLUME = 1;

// Bending modes of a free metal bar, relative to the fundamental.
const BAR_RATIOS = [1, 2.756, 5.404] as const;

let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let noise: AudioBuffer | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();

  out = ctx.createGain();
  out.gain.value = MASTER_VOLUME;
  // Take the sharpest edge off the top partials so nothing is piercing.
  const soften = ctx.createBiquadFilter();
  soften.type = "lowpass";
  soften.frequency.value = 9000;
  out.connect(soften).connect(ctx.destination);

  // A short buffer of white noise, reused for every strike transient.
  noise = ctx.createBuffer(
    1,
    Math.round(ctx.sampleRate * 0.25),
    ctx.sampleRate,
  );
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  return ctx;
}

/** One sine partial: instant attack, exponential ring-out. */
function partial(
  ac: AudioContext,
  start: number,
  freq: number,
  peak: number,
  decay: number,
) {
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, start);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, start + 0.002 + decay);
  osc.connect(g).connect(out!);
  osc.start(start);
  osc.stop(start + decay + 0.05);
}

/** The strike itself: a few milliseconds of high-passed noise. */
function tick(ac: AudioContext, start: number, peak: number, cutoff: number) {
  const src = ac.createBufferSource();
  src.buffer = noise;
  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = cutoff;
  const g = ac.createGain();
  g.gain.setValueAtTime(peak, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + 0.012);
  src.connect(hp).connect(g).connect(out!);
  src.start(start, Math.random() * 0.2);
  src.stop(start + 0.03);
}

/**
 * A struck metal bar at `freq`. `ring` is how long the fundamental rings;
 * higher partials are quieter and shorter, as in real metal.
 */
function strike(
  ac: AudioContext,
  o: { at?: number; freq: number; peak: number; ring: number; tick?: number },
) {
  const start = ac.currentTime + (o.at ?? 0);
  BAR_RATIOS.forEach((ratio, i) => {
    const level = [1, 0.32, 0.12][i];
    const decay = o.ring / (1 + i * 1.6);
    partial(ac, start, o.freq * ratio, o.peak * level, decay);
  });
  // A second fundamental, a hair detuned, gives the slow shimmer of a real
  // bell or fork on the longer notes.
  if (o.ring > 0.3) {
    partial(ac, start, o.freq * 1.0025, o.peak * 0.35, o.ring * 0.9);
  }
  tick(ac, start, o.tick ?? o.peak * 0.5, 5000);
}

function render(ac: AudioContext, name: SoundName) {
  switch (name) {
    case "click": {
      // Around E6, varied by up to a semitone either way.
      const freq = 1320 * 2 ** ((Math.random() - 0.5) / 6);
      strike(ac, { freq, peak: 0.055, ring: 0.11, tick: 0.04 });
      break;
    }
    case "toggle-on":
      // C6 then G6: a bright, rising fifth.
      strike(ac, { freq: 1046.5, peak: 0.04, ring: 0.65 });
      strike(ac, { at: 0.075, freq: 1568, peak: 0.035, ring: 0.7 });
      break;
    case "toggle-off":
      // G5 then C5: the same interval, falling and a little darker.
      strike(ac, { freq: 784, peak: 0.045, ring: 0.7 });
      strike(ac, { at: 0.075, freq: 523.25, peak: 0.042, ring: 0.8 });
      break;
  }
}

let lastPlayed = 0;

export function playSound(name: SoundName) {
  // Never stack sounds on top of each other (double clicks, rapid taps).
  const now = performance.now();
  if (now - lastPlayed < 45) return;
  lastPlayed = now;

  const ac = getContext();
  if (!ac) return;
  if (ac.state === "running") render(ac, name);
  else void ac.resume().then(() => render(ac, name));
}

// Called on the first pointer/key interaction so the context is unlocked
// before the first real sound needs to play.
export function unlockAudio() {
  const ac = getContext();
  if (ac?.state === "suspended") void ac.resume();
}
