import Arpeggiator from '@/components/Arpeggiator';

describe('Arpeggiator', () => {
  const testAudioContext = {
    currentTime: 10,
  };
  const testConfig = {
    steps: 3,
    timing: 1,
  };

  it('can take an audioContext and config', () => {
    const arpeggiator = new Arpeggiator({
      audioContext: testAudioContext,
      config: testConfig,
    })

    expect(arpeggiator.context).toEqual(testAudioContext);
    expect(arpeggiator.config).toEqual(testConfig);
  });

  it('can arpeggiate', () => {
    const testOscillator = {
      frequency: {
        setValueAtTime: jest.fn(),
      }
    };
    const arpeggiator = new Arpeggiator({
      audioContext: testAudioContext,
      config: testConfig,
    });

    arpeggiator.arpeggiate(testOscillator, 440);

    expect(testOscillator.frequency.setValueAtTime).toHaveBeenCalled();
  });
});
