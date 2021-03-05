import {shallowMount, mount} from '@vue/test-utils'
import Synthesizer from '@/views/Synthesizer.vue'
import AudioContext from '../mocks/AudioContext';

describe('Synthesizer', () => {
  it('renders', () => {
    navigator.requestMIDIAccess = jest.fn().mockResolvedValue({ inputs: [] });
    const wrapper = shallowMount(Synthesizer, {
      propsData: {
        audioContext: AudioContext,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('plays 880Hz when the A key pressed on default 4th octave', () => {
    navigator.requestMIDIAccess = jest.fn().mockResolvedValue({ inputs: [] });
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

  it('plays when a midi device plays middle C', async () => {
    const device = {id: '1', state: 'connected', name: 'first', onmidimessage: null}
    navigator.requestMIDIAccess = jest.fn().mockResolvedValue({ inputs: [ device ] });
    const createOscillatorNodeStub = jest.fn().mockReturnValue({
      connect: () => {},
      start: () => {}
    });

    let wrapper = await mount(Synthesizer, {
      propsData: {
        audioContext: AudioContext
      },
      methods: {
        createOscillatorNode: createOscillatorNodeStub,
      },
    });

    await wrapper.vm.$nextTick();

    const KEY_DOWN_COMMAND = 144;
    const MIDDLE_C_KEYCODE = 60;
    const fakeMidiEvent = {data: [KEY_DOWN_COMMAND, MIDDLE_C_KEYCODE, 0]};

    device.onmidimessage(fakeMidiEvent)

    const MIDDLE_C_FREQUENCY = 261.63;
    expect(createOscillatorNodeStub).toHaveBeenCalledWith(MIDDLE_C_FREQUENCY);
  });

  it('stops an oscillator when the midi device lifts middle C', async () => {
    const device = {id: '1', state: 'connected', name: 'first', onmidimessage: null}
    navigator.requestMIDIAccess = jest.fn().mockResolvedValue({ inputs: [ device ] });
    const turnOffGainStub = jest.fn()
    const findOscillatorByStub = jest.fn().mockReturnValue({
      gainNode: {
        gain: {
          exponentialRampToValueAtTime: turnOffGainStub
        }
      }
    });

    let wrapper = await mount(Synthesizer, {
      propsData: {
        audioContext: AudioContext
      },
      methods: {
        findOscillatorBy: findOscillatorByStub,
      },
    });

    await wrapper.vm.$nextTick();

    const KEY_UP_COMMAND = 128;
    const MIDDLE_C_KEYCODE = 60;
    const fakeMidiEvent = {data: [KEY_UP_COMMAND, MIDDLE_C_KEYCODE, 0]};

    device.onmidimessage(fakeMidiEvent)

    const MIDDLE_C_FREQUENCY = 261.63;
    expect(findOscillatorByStub).toHaveBeenCalledWith({ frequency: MIDDLE_C_FREQUENCY });
    expect(turnOffGainStub).toHaveBeenCalled();
  });
});
