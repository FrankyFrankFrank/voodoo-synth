import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'
import AudioContext from '../mocks/AudioContext';

describe('App.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(App, {
      propsData: {
        audioContext: AudioContext
      }
    });

    expect(wrapper.exists()).toBe(true);
  });
});
