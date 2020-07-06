export default class Arpeggiator {
  constructor({ audioContext, config }) {
    this.context = audioContext;
    this.config = config;
  }

  arpeggiate (oscillator, frequency) {
    const list = this.generateFrequencyList(frequency);
    const { steps, timing } = this.config;
    const now = this.context.currentTime;

    for (let i = 0; i < 1000; i++) {
      const octave = (i % steps);
      oscillator.frequency.setValueAtTime(list[octave], now + timing * i, 0);
    }
  }

  generateFrequencyList (frequency) {
    return [frequency, frequency*2, frequency*4, frequency*8, frequency*16];
  }
}
