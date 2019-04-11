import { shallowMount } from '@vue/test-utils';
import Octave from '@/components/Octave.vue';

describe('Octave', () => {
  it('renders', () => {
    const wrapper = shallowMount(Octave);

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('can emit the set octave', () => {
    const wrapper = shallowMount(Octave);
    wrapper.setData({ octave: 4 })

    expect(wrapper.emitted().octave[0]).toEqual([4]);
  });
})