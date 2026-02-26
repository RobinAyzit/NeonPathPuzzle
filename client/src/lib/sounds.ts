let audioCtx: AudioContext | null = null;
let audioInitialized = false;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function initAudio() {
  if (audioInitialized) return;
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  audioInitialized = true;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.3) {
  if (!audioInitialized) {
    initAudio();
  }
  
  const ctx = getAudioContext();
  
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export function playMoveSound() {
  playTone(880, 0.08, "sine", 0.15);
}

export function playBacktrackSound() {
  playTone(440, 0.1, "sine", 0.12);
}

export function playLoseLifeSound() {
  playTone(200, 0.3, "sawtooth", 0.2);
  setTimeout(() => playTone(150, 0.3, "sawtooth", 0.15), 100);
}

export function playWinSound() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.2, "sine", 0.2), i * 100);
  });
}

export function playClickSound() {
  playTone(600, 0.05, "square", 0.08);
}
