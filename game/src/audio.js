// audio.js — bunyi prosedural WebAudio: tanpa file audio, tanpa network.
// AudioContext dibuat hanya setelah interaksi pengguna pertama (aturan autoplay).

let audioContext = null;
let muted = false;

export function setAudioMuted(value) {
  muted = value;
}

export function isAudioMuted() {
  return muted;
}

/** Buat (atau pakai ulang) AudioContext setelah gestur pengguna. */
export function ensureAudioContext() {
  if (audioContext) {
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return audioContext;
  }
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  audioContext = new AudioCtor();
  return audioContext;
}

function playTone(freq, startAt, duration, type, volume) {
  if (muted) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume || 0.12, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

/** Denting temuan: dua nada naik yang lembut. */
export function playDiscoveryChime() {
  playTone(659.25, 0, 0.22, 'sine', 0.14);
  playTone(880.0, 0.09, 0.3, 'sine', 0.12);
}

/** Nada kesalahan yang lembut (bukan bunyi keras). */
export function playMistakeTone() {
  playTone(196.0, 0, 0.18, 'triangle', 0.08);
}

/** Arpeggio kecil saat satu level selesai. */
export function playSceneCompleteChime() {
  playTone(523.25, 0, 0.2, 'sine', 0.12);
  playTone(659.25, 0.1, 0.2, 'sine', 0.12);
  playTone(783.99, 0.2, 0.28, 'sine', 0.12);
  playTone(1046.5, 0.32, 0.4, 'sine', 0.12);
}

/** Bisik nada tunggal saat petunjuk dipakai. */
export function playHintTone() {
  playTone(440.0, 0, 0.25, 'sine', 0.07);
  playTone(554.37, 0.12, 0.25, 'sine', 0.06);
}
