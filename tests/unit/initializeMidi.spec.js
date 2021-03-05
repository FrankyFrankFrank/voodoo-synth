import initializeMidi from "@/initializeMidi";

describe('initializeMidi', () => {
  it('calls playNote callback when a key is pressed', async() => {
    const device = {id: 1, state: 'connected', name: 'first', onmidimessage: null}
    navigator.requestMIDIAccess = jest.fn().mockResolvedValue({inputs: [ device ]});

    const playNote = jest.fn()
    const stopNote = jest.fn()

    await initializeMidi(playNote, stopNote)

    device.onmidimessage({ data: [144, 60, 0] })

    expect(playNote).toHaveBeenCalledWith(40)
  });

  it('calls stopNote callback when a key is lifted', async () => {
    const device = {id: 1, state: 'connected', name: 'first', onmidimessage: null}
    navigator.requestMIDIAccess = jest.fn().mockResolvedValue({inputs: [ device ]});

    const playNote = jest.fn()
    const stopNote = jest.fn()

    await initializeMidi(playNote, stopNote)

    device.onmidimessage({ data: [128, 60, 0] })

    expect(stopNote).toHaveBeenCalledWith(40)
  });
});
