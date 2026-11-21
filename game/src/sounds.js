// Harbour Lights: all sounds are synthesised with WebAudio. No audio files,
// no network — every note is an oscillator shaped by a gain envelope.
let audioContext = null;

export function ensureAudio() {
  if (!audioContext) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

function tone(freq, startAt, duration, type, volume) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

export function playFindSound() {
  tone(523.25, 0, 0.16, 'sine', 0.22);
  tone(659.25, 0.07, 0.16, 'sine', 0.22);
  tone(783.99, 0.14, 0.28, 'sine', 0.24);
}

export function playMissSound() {
  tone(196, 0, 0.2, 'triangle', 0.16);
  tone(155.56, 0.1, 0.28, 'triangle', 0.14);
}

export function playHintSound() {
  tone(880, 0, 0.12, 'sine', 0.14);
  tone(1174.66, 0.09, 0.2, 'sine', 0.12);
}

export function playClickSound() {
  tone(440, 0, 0.06, 'square', 0.06);
}

export function playSceneClearSound() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => tone(freq, i * 0.11, 0.3, 'sine', 0.2));
}

export function playGameCompleteSound() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
  notes.forEach((freq, i) => tone(freq, i * 0.13, 0.32, 'triangle', 0.18));
}

export function playTickSound() {
  tone(1200, 0, 0.05, 'sine', 0.08);
}
