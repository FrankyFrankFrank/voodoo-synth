import { shallowMount } from '@vue/test-utils'
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

  it('plays a C note when the c key pressed', () => {
    const playNoteStub = jest.fn();
    const wrapper = shallowMount(Synthesizer, {
      propsData: {
        audioContext: AudioContext
      },
      methods: {
        playNote: playNoteStub,
      },
      attachToDocument: true,
    });

    wrapper.trigger('keydown', {
      key: 'a'
    });

    expect(playNoteStub).toHaveBeenCalledWith('a');
  });
});
