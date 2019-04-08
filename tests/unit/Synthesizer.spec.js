import { shallowMount } from '@vue/test-utils'
import Synthesizer from '@/Views/Synthesizer.vue'
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
      attachToDocument: true,
      methods: {
        playNote: playNoteStub,
      }
    });

    wrapper.trigger('keydown', {
      key: 'c'
    });

    expect(playNoteStub).toHaveBeenCalledWith(expect.objectContaining({ key: 'c' }));
  });
});
