import frequencies from '../frequencies';
import keyMap from '../keys';

export default class Arpeggiator {
  constructor({ audioContext, config }) {
    this.context = audioContext;
    this.config = config;
  }

  arpeggiate ({ oscillator, key, baseOctave }) {
    const now = this.context.currentTime;
    const note = frequencies[keyMap[key]];
    const { steps, timing } = this.config;

    for (let i = 1; i < 1000; i++) {
      const octave = baseOctave + (i % steps);
      oscillator.frequency.setValueAtTime(note[octave], now + timing * i, 0);
    }
  }
}
