import { shallowMount, mount } from '@vue/test-utils'
import Synthesizer from '@/views/Synthesizer.vue'
import AudioContext from '../mocks/AudioContext';

describe('Synthesizer', () => {
  it('renders', () => {
    const wrapper = shallowMount(Synthesizer, {
      propsData: {
        audioContext: AudioContext,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('plays 880Hz when the A key pressed on default 4th octave', () => {
    const createOscillatorNodeStub = jest.fn().mockReturnValue({
      connect: () => {},
      start: () => {}
    });
    const wrapper = mount(Synthesizer, {
      propsData: {
        audioContext: AudioContext
      },
      methods: {
        createOscillatorNode: createOscillatorNodeStub,
      },
      attachToDocument: true,
    });

    wrapper.trigger('keydown', {
      key: 'h'
    });

    expect(createOscillatorNodeStub).toHaveBeenCalledWith(880);
  });
});
