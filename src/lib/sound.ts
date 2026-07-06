// Tiny Web Audio SFX — synthesized, no asset files required.
// All functions are no-ops on the server or when muted.

let ctx: AudioContext | null = null;
let muted = false;

if (typeof window !== "undefined") {
  try {
    muted = localStorage.getItem("hj_muted") === "1";
  } catch {
    /* ignore */
  }
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(opts: {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  slideTo?: number;
  delay?: number;
}) {
  const c = audio();
  if (!c || muted) return;
  const { freq, dur, type = "sine", gain = 0.13, slideTo, delay = 0 } = opts;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

/** Quick upward blip — a buy. */
export function playBuy() {
  tone({ freq: 520, dur: 0.08, type: "triangle", gain: 0.12 });
  tone({ freq: 784, dur: 0.10, type: "triangle", gain: 0.12, delay: 0.06 });
}

/** Cash-register "cha-ching" — a sell (take profit!). */
export function playSell() {
  // first ding
  tone({ freq: 1047, dur: 0.12, type: "square", gain: 0.08 });
  tone({ freq: 1568, dur: 0.12, type: "sine", gain: 0.05 });
  // second, higher ding — the "ching"
  tone({ freq: 1319, dur: 0.24, type: "square", gain: 0.09, delay: 0.1 });
  tone({ freq: 1976, dur: 0.24, type: "sine", gain: 0.06, delay: 0.1 });
  tone({ freq: 2637, dur: 0.22, type: "sine", gain: 0.035, delay: 0.12 });
}

/** Celebratory rising arpeggio — a token deploy/launch. */
export function playLaunch() {
  [523, 659, 784, 1047].forEach((f, i) =>
    tone({ freq: f, dur: 0.18, type: "sine", gain: 0.14, delay: i * 0.08 })
  );
  tone({ freq: 1568, dur: 0.32, type: "sine", gain: 0.08, delay: 0.34 });
}

/** Soft two-note ding — an ambient "coin just launched" feed event. */
export function playLaunchAmbient() {
  tone({ freq: 880, dur: 0.12, type: "sine", gain: 0.07 });
  tone({ freq: 1319, dur: 0.16, type: "sine", gain: 0.06, delay: 0.09 });
}

export function isMuted() {
  return muted;
}
export function setMuted(v: boolean) {
  muted = v;
  try {
    localStorage.setItem("hj_muted", v ? "1" : "0");
  } catch {
    /* ignore */
  }
}
export function toggleMuted() {
  setMuted(!muted);
  return muted;
}
/** Resume the audio context on a user gesture (autoplay policy). */
export function unlockAudio() {
  audio();
}
