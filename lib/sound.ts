// Soft UI sounds, synthesized with the Web Audio API. Nothing is downloaded.
//
// The palette is deliberately low and warm: rounded sine tones with a gentle
// attack, run through a low-pass filter so there is no bright "beep" edge,
// and a faint room tail on the chimes. Sounds are always on; there is no
// mute toggle. Browsers only allow audio after the visitor's first click or
// key press, so the AudioContext is created (and unlocked) at that moment.

export type SoundName = "click" | "toggle-on" | "toggle-off";

const MASTER_VOLUME = 0.55;

let ctx: AudioContext | null = null;
let dry: AudioNode | null = null;
let wet: AudioNode | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();

  // master -> warm low-pass -> speakers. Everything goes through the filter,
  // which rounds off any harsh upper partials.
  const master = ctx.createGain();
  master.gain.value = MASTER_VOLUME;
  const warmth = ctx.createBiquadFilter();
  warmth.type = "lowpass";
  warmth.frequency.value = 2600;
  warmth.Q.value = 0.5;
  master.connect(warmth).connect(ctx.destination);
  dry = master;

  // A tiny, darkened feedback delay stands in for a small room. Only the
  // chimes send to it; clicks stay dry and close.
  const send = ctx.createGain();
  send.gain.value = 0.22;
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.13;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.28;
  const dampen = ctx.createBiquadFilter();
  dampen.type = "lowpass";
  dampen.frequency.value = 1400;
  send.connect(delay);
  delay.connect(dampen).connect(feedback).connect(delay);
  dampen.connect(master);
  wet = send;

  return ctx;
}

type Tone = {
  freq: number;
  /** Optional pitch glide target, reached over the first 60% of the tone. */
  to?: number;
  duration: number;
  gain: number;
  attack?: number;
  delay?: number;
  type?: OscillatorType;
  reverb?: boolean;
};

function tone(ac: AudioContext, t: Tone) {
  const start = ac.currentTime + (t.delay ?? 0);
  const attack = t.attack ?? 0.004;
  const end = start + t.duration;

  const osc = ac.createOscillator();
  osc.type = t.type ?? "sine";
  osc.frequency.setValueAtTime(t.freq, start);
  if (t.to) {
    osc.frequency.exponentialRampToValueAtTime(t.to, start + t.duration * 0.6);
  }

  // Soft attack, long exponential release: no pops, nothing abrupt.
  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(t.gain, start + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, end);

  osc.connect(env);
  env.connect(dry!);
  if (t.reverb) env.connect(wet!);
  osc.start(start);
  osc.stop(end + 0.05);
}

// A little pitch variance keeps repeated clicks from sounding mechanical.
function vary(freq: number, cents = 30) {
  return freq * 2 ** (((Math.random() * 2 - 1) * cents) / 1200);
}

function render(ac: AudioContext, name: SoundName) {
  switch (name) {
    case "click": {
      // A muted wooden "tock": a low body that dips slightly in pitch, plus a
      // quieter overtone that dies away first.
      const f = vary(440);
      tone(ac, { freq: f, to: f * 0.82, duration: 0.11, gain: 0.09 });
      tone(ac, { freq: f * 2.01, duration: 0.045, gain: 0.018 });
      break;
    }
    case "toggle-on":
    case "toggle-off": {
      // Two soft marimba-like notes a fourth apart (E5 and A5), rising for
      // light and falling for dark.
      const notes = name === "toggle-on" ? [659.25, 880] : [880, 659.25];
      notes.forEach((freq, i) => {
        const delay = i * 0.085;
        tone(ac, {
          freq,
          duration: 0.42,
          gain: 0.055,
          attack: 0.008,
          delay,
          reverb: true,
        });
        tone(ac, {
          freq: freq * 3.98,
          duration: 0.08,
          gain: 0.006,
          attack: 0.003,
          delay,
        });
      });
      break;
    }
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
