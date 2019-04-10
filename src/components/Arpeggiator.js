import frequencies from '../frequencies';
import keyMap from '../keys';

export const arpeggiate = ({ audioContext, oscillator, timing, steps, key, baseOctave }) => {
  const now = audioContext.currentTime
  const note = frequencies[keyMap[key]];
  for (let i = 1; i < 1000; i++) {
    const octave = baseOctave + (i % steps);
    oscillator.frequency.setValueAtTime(note[octave], now + timing * i, 0);
  }
}
