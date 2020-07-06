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

  export default {
    name: "MusicalTyping",
    components: {KeyButton},
    props: ['octave'],
    data() {
      return {
        activeFrequencies: {},
        keys: [
          {
            letter: 'a',
            pianoKey: 'C',
            offset: 4,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'w',
            pianoKey: 'Db',
            offset: 5,
            isNatural: false,
            isActive: false
          },
          {
            letter: 's',
            pianoKey: 'D',
            offset: 6,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'e',
            pianoKey: 'Eb',
            offset: 7,
            isNatural: false,
            isActive: false
          },
          {
            letter: 'd',
            pianoKey: 'E',
            offset: 8,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'f',
            pianoKey: 'F',
            offset: 9,
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
            offset: 10,
            isNatural: false,
            isActive: false
          },
          {
            letter: 'g',
            pianoKey: 'G',
            offset: 11,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'y',
            pianoKey: 'Ab',
            offset: 12,
            isNatural: false,
            isActive: false
          },
          {
            letter: 'h',
            pianoKey: 'A',
            offset: 13,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'u',
            pianoKey: 'Bb',
            offset: 14,
            isNatural: false,
            isActive: false
          },
          {
            letter: 'j',
            pianoKey: 'B',
            offset: 15,
            isNatural: true,
            isActive: false
          },
          {
            letter: 'k',
            pianoKey: 'C',
            offset: 16,
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
            offset: 17,
            isNatural: false,
            isActive: false
          },
          {
            letter: 'l',
            pianoKey: 'D',
            offset: 18,
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

          const frequency = this.frequency(this.keyNumber(internalKey));
          this.activeFrequencies[e.key] = frequency;
          this.$emit('playNote', frequency);
        }
      },
      stopNote(e) {
        if (!this.keyIsAValidNote(e.key)) return;

        let internalKey = this.keys.find(k => k.letter === e.key);
        internalKey.isActive = false;

        const frequency = this.activeFrequencies[e.key];
        delete this.activeFrequencies[e.key];

        this.$emit('stopNote', frequency);
      },
      keyIsAValidNote(key) {
        return this.keys.map(k => k.letter).includes(key);
      },
      keyNumber(key) {
        return key.offset + this.octave * 12;
      },
      frequency(keyNumber) {
        const power = (keyNumber - 49) / 12;

        return Number((Math.pow(2, power) * 440).toFixed(2));
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
