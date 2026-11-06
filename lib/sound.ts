// Soft UI sounds, synthesized with the Web Audio API. Nothing is downloaded.
//
// - click: "felt key", a deep, muted keyboard key (a low sine thump plus a
//   short burst of low-passed noise for texture).
// - toggle: "soft swoosh", a breath of band-passed noise sweeping upward.
//
// Sounds are always on; there is no mute toggle. Browsers only allow audio
// after the visitor's first click or key press, so the AudioContext is
// created (and unlocked) at that moment.

export type SoundName = "click" | "toggle-on" | "toggle-off";

const MASTER_VOLUME = 1;
// The theme swoosh sits a little under the clicks.
const SWOOSH_VOLUME = 0.7;

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
  const warm = ctx.createBiquadFilter();
  warm.type = "lowpass";
  warm.frequency.value = 6000;
  out.connect(warm).connect(ctx.destination);

  // One second of white noise, reused (from a random offset) by every sound.
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  return ctx;
}

function envelope(
  ac: AudioContext,
  start: number,
  peak: number,
  attack: number,
  release: number,
) {
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);
  return g;
}

function noiseBurst(
  ac: AudioContext,
  o: {
    type: BiquadFilterType;
    freq: number;
    sweepTo?: number;
    q?: number;
    peak: number;
    attack?: number;
    release: number;
  },
) {
  const t = ac.currentTime;
  const attack = o.attack ?? 0.002;
  const src = ac.createBufferSource();
  src.buffer = noise;
  src.playbackRate.value = 0.9 + Math.random() * 0.2;
  const filter = ac.createBiquadFilter();
  filter.type = o.type;
  filter.frequency.setValueAtTime(o.freq, t);
  if (o.sweepTo) {
    filter.frequency.exponentialRampToValueAtTime(o.sweepTo, t + o.release);
  }
  filter.Q.value = o.q ?? 0.7;
  src
    .connect(filter)
    .connect(envelope(ac, t, o.peak, attack, o.release))
    .connect(out!);
  src.start(t, Math.random() * 0.5);
  src.stop(t + attack + o.release + 0.05);
}

function thump(
  ac: AudioContext,
  o: { freq: number; to: number; peak: number; release: number },
) {
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  osc.frequency.setValueAtTime(o.freq, t);
  osc.frequency.exponentialRampToValueAtTime(o.to, t + o.release);
  osc.connect(envelope(ac, t, o.peak, 0.003, o.release)).connect(out!);
  osc.start(t);
  osc.stop(t + o.release + 0.06);
}

function render(ac: AudioContext, name: SoundName) {
  switch (name) {
    case "click":
      thump(ac, { freq: 150, to: 90, peak: 0.25, release: 0.05 });
      noiseBurst(ac, {
        type: "lowpass",
        freq: 900,
        peak: 0.22,
        release: 0.025,
      });
      break;
    case "toggle-on":
    case "toggle-off":
      noiseBurst(ac, {
        type: "bandpass",
        freq: 350,
        sweepTo: 2200,
        q: 1.2,
        peak: 0.35 * SWOOSH_VOLUME,
        attack: 0.09,
        release: 0.28,
      });
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
