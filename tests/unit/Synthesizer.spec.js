import { shallowMount } from '@vue/test-utils'
import Synthesizer from '@/Views/Synthesizer.vue'
import AudioContext from '../mocks/AudioContext';

describe('Synthesizer', () => {
  it('renders', () => {
    const wrapper = shallowMount(Synthesizer, {
      propsData: {
        audioContext: AudioContext
      }
    });

    expect(wrapper.exists()).toBe(true);
  });
});
