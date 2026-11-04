// Soft UI sounds, synthesized with the Web Audio API. Nothing is downloaded:
// each sound is a short sine/triangle blip with a fast fade, kept very quiet.
// The AudioContext is only created after the visitor's first interaction,
// which is what browsers require for audio anyway.

export type SoundName = "click" | "hover" | "toggle-on" | "toggle-off";

const STORAGE_KEY = "sound";
const MASTER_VOLUME = 0.5;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted: boolean | null = null;
const listeners = new Set<(muted: boolean) => void>();

function readMuted(): boolean {
  if (muted !== null) return muted;
  try {
    muted = localStorage.getItem(STORAGE_KEY) === "off";
  } catch {
    muted = false;
  }
  return muted;
}

export function isMuted() {
  return readMuted();
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "off" : "on");
  } catch {
    // Private mode or blocked storage: keep the choice for this page view.
  }
  listeners.forEach((fn) => fn(next));
}

export function subscribeMuted(fn: (muted: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = MASTER_VOLUME;
    master.connect(ctx.destination);
  }
  return ctx;
}

function blip(
  ac: AudioContext,
  {
    freq,
    to,
    duration,
    gain,
    type = "sine",
    delay = 0,
  }: {
    freq: number;
    to?: number;
    duration: number;
    gain: number;
    type?: OscillatorType;
    delay?: number;
  },
) {
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const env = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, start + duration);

  // Quick attack, smooth exponential release: no clicks or pops.
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + 0.005);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(env).connect(master!);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

let lastPlayed = 0;

export function playSound(name: SoundName) {
  if (readMuted()) return;
  // Hover isn't a user gesture, so it can't start audio. It stays silent
  // until the first click or key press has unlocked the context.
  if (name === "hover" && !ctx) return;

  // Never stack sounds on top of each other (fast hovering, double clicks).
  const now = performance.now();
  if (now - lastPlayed < (name === "hover" ? 70 : 35)) return;
  lastPlayed = now;

  const ac = getContext();
  if (!ac) return;
  if (ac.state === "running") render(ac, name);
  else void ac.resume().then(() => render(ac, name));
}

function render(ac: AudioContext, name: SoundName) {
  switch (name) {
    case "click":
      blip(ac, { freq: 1250, to: 650, duration: 0.07, gain: 0.07 });
      break;
    case "hover":
      blip(ac, { freq: 1900, duration: 0.03, gain: 0.012 });
      break;
    case "toggle-on":
      blip(ac, { freq: 520, duration: 0.11, gain: 0.06, type: "triangle" });
      blip(ac, {
        freq: 780,
        duration: 0.14,
        gain: 0.05,
        type: "triangle",
        delay: 0.06,
      });
      break;
    case "toggle-off":
      blip(ac, { freq: 780, duration: 0.11, gain: 0.06, type: "triangle" });
      blip(ac, {
        freq: 520,
        duration: 0.14,
        gain: 0.05,
        type: "triangle",
        delay: 0.06,
      });
      break;
  }
}

// Called on the first pointer/key interaction so the context is unlocked
// before the first real sound needs to play.
export function unlockAudio() {
  if (readMuted()) return;
  const ac = getContext();
  if (ac?.state === "suspended") void ac.resume();
}
