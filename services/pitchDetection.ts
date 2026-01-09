
// Autocorrelation algorithm to find the dominant frequency in a buffer
export function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  let size = buffer.length;
  let rms = 0;

  for (let i = 0; i < size; i++) {
    let val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / size);

  // Signal too weak
  if (rms < 0.01) return -1;

  let r1 = 0, r2 = size - 1, thres = 0.2;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buffer[size - i]) < thres) { r2 = size - i; break; }
  }

  buffer = buffer.slice(r1, r2);
  size = buffer.length;

  let c = new Float32Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] = c[i] + buffer[j] * buffer[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  // Parabolic interpolation for better precision
  let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  let a = (x1 + x3 - 2 * x2) / 2;
  let b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

export function getNoteFromFrequency(frequency: number, referenceFreq: number = 440): { note: number; cents: number } {
  const noteNum = 12 * (Math.log(frequency / referenceFreq) / Math.log(2));
  const roundedNote = Math.round(noteNum) + 69;
  const cents = Math.floor((noteNum - Math.round(noteNum)) * 100);
  return { note: roundedNote, cents };
}
