const MIDI_KEYCODE_OFFSET = 20;
const KEY_DOWN = 144;
const KEY_UP = 128;
const COMMAND = 0;
const NOTE = 1;

export default async function initializeMidi(playNote, stopNote) {
    const access = await navigator.requestMIDIAccess();
    Array.from(access.inputs.values()).forEach(input => {
        input.onmidimessage = message => {
            const data = message.data;

            if (data[COMMAND] === KEY_DOWN) {
                playNote(data[NOTE] - MIDI_KEYCODE_OFFSET)
                return
            }

            if (data[COMMAND] === KEY_UP) {
                stopNote(data[NOTE] - MIDI_KEYCODE_OFFSET)
            }
        }
    });
}
