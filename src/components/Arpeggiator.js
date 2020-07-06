import frequencies from '../frequencies';

export default class Arpeggiator {
  constructor({ audioContext, config }) {
    this.context = audioContext;
    this.config = config;
  }

  arpeggiate (oscillator, baseOctave, frequency) {
    const frequencyList = Object.values(frequencies).find(f => f.includes(frequency));
    const { steps, timing } = this.config;
    const now = this.context.currentTime;

    for (let i = 1; i < 1000; i++) {
      const octave = baseOctave + (i % steps);
      oscillator.frequency.setValueAtTime(frequencyList[octave], now + timing * i, 0);
    }
  }
}
