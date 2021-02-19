<template>
  <div class="mx-auto text-left mt-64" style="width:700px">
    <div>
      <button class="w-8"></button>
      <key-button v-for="key in sharpKeys" :key="key.key" :meta="key"></key-button>
    </div>
    <div>
      <key-button v-for="key in naturalKeys" :key="key.key" :meta="key"></key-button>
    </div>
  </div>
</template>

<script>
  import KeyButton from "./KeyButton";

  const KEYS_IN_OCTAVE = 12;

  export default {
    name: "MusicalTyping",
    components: {KeyButton},
    props: ['octave'],
    data() {
      return {
        keys: [
          {
            letter: 'a',
            pianoKey: 'C',
            stepsAboveRootOfOctave: 4,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'w',
            pianoKey: 'Db',
            stepsAboveRootOfOctave: 5,
            isNatural: false,
            isActive: false
          },
          {
            letter: 's',
            pianoKey: 'D',
            stepsAboveRootOfOctave: 6,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'e',
            pianoKey: 'Eb',
            stepsAboveRootOfOctave: 7,
            isNatural: false,
            isActive: false
          },
          {
            letter: 'd',
            pianoKey: 'E',
            stepsAboveRootOfOctave: 8,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'f',
            pianoKey: 'F',
            stepsAboveRootOfOctave: 9,
            isNatural: true,
            isActive: false
          },
          {
            isGhost: true,
            isNatural: false,
          },
          {
            letter: 't',
            pianoKey: 'Gb',
            stepsAboveRootOfOctave: 10,
            isNatural: false,
            isActive: false
          },
          {
            letter: 'g',
            pianoKey: 'G',
            stepsAboveRootOfOctave: 11,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'y',
            pianoKey: 'Ab',
            stepsAboveRootOfOctave: 12,
            isNatural: false,
            isActive: false
          },
          {
            letter: 'h',
            pianoKey: 'A',
            stepsAboveRootOfOctave: 13,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'u',
            pianoKey: 'Bb',
            stepsAboveRootOfOctave: 14,
            isNatural: false,
            isActive: false
          },
          {
            letter: 'j',
            pianoKey: 'B',
            stepsAboveRootOfOctave: 15,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'k',
            pianoKey: 'C',
            stepsAboveRootOfOctave: 16,
            isNatural: true,
            isActive: false
          },
          {
            isGhost: true,
            isNatural: false,
          },
          {
            letter: 'o',
            pianoKey: 'Db',
            stepsAboveRootOfOctave: 17,
            isNatural: false,
            isActive: false
          },
          {
            letter: 'l',
            pianoKey: 'D',
            stepsAboveRootOfOctave: 18,
            isNatural: true,
            isActive: false
          }
        ]
      }
    },
    created() {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.stopNote);
    },
    methods: {
      handleKeyDown(e) {
        if (e.key === '.') {
          this.$emit('changeOctave', 1);
          return
        }
        if (e.key === ',') {
          this.$emit('changeOctave', -1);
          return
        }
        if (this.keyIsAValidNote(e.key) && !e.repeat) {
          let internalKey = this.keys.find(k => k.letter === e.key);
          internalKey.isActive = true;
          this.$emit('keyDown', this.keyNumber(internalKey));
        }
      },
      stopNote(e) {
        if (!this.keyIsAValidNote(e.key)) return;

        let internalKey = this.keys.find(k => k.letter === e.key);
        internalKey.isActive = false;

        this.$emit('keyUp', this.keyNumber(internalKey));
      },
      keyIsAValidNote(key) {
        return this.keys.map(k => k.letter).includes(key);
      },
      keyNumber(key) {
        return key.stepsAboveRootOfOctave + this.octave * KEYS_IN_OCTAVE;
      }
    },
    computed: {
      naturalKeys() {
        return this.keys.filter(k => k.isNatural)
      },
      sharpKeys() {
        return this.keys.filter(k => !k.isNatural)
      }
    }
  }
</script>
