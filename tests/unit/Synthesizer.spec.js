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
    const playNoteStub = jest.fn();
    const wrapper = mount(Synthesizer, {
      propsData: {
        audioContext: AudioContext
      },
      methods: {
        playNote: playNoteStub,
      },
      attachToDocument: true,
    });

    wrapper.trigger('keydown', {
      key: 'h'
    });

    expect(playNoteStub).toHaveBeenCalledWith(880);
  });
});
