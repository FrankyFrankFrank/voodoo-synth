<template>
  <div>
    <div>
      <div class="p-4 bg-black mb-4 flex flex-col items-end shadows">
        <label for="volume">Master Volume</label>
        <div class="my-4">
          <input id="volume" v-model.number="volume" type="range" min="0" max="1" step="0.01" />
        </div>
        <p>{{ volume }}</p>
      </div>
    </div>
    <div class="flex flex-wrap items-start justify-center">
      <div class="box">
        <label class="self-start text-xl uppercase" for="shape">Shape</label>
        <div class="bg-black p-4 my-4">
          <input id="shape" v-model="shape" type="range" list="waves" min="0" max="3" />
        </div>
        <datalist id="waves">
          <option value="0"/>
          <option value="1"/>
          <option value="2"/>
          <option value="3"/>
        </datalist>
        <p>{{ soundShape }}</p>
      </div>

      <div class="box">
        <label class="self-start text-xl uppercase" for="decay">Decay</label>
        <div class="bg-black p-4 my-4">
          <input id="decay" v-model.number="decay" type="range" min="0.01" max="5" step="0.01" />
        </div>
        <p>{{ decay }} s</p>
      </div>

      <div class="box">
        <label class="self-start text-xl uppercase" for="attack">Attack</label>
        <div class="bg-black p-4 my-4">
          <input id="attack" v-model.number="attack" type="range" min="0.01" max="5" step="0.01" />
        </div>
        <p>{{ attack }} s</p>
      </div>

      <div class="box">
        <label class="self-start text-xl uppercase" for="octave">Octave</label>
        <div class="bg-black p-4 my-4">
          <input id="octave" v-model.number="octave" type="range" min="0" max="7" step="1" list="octaves"/>
          <datalist id="octaves">
            <option value="0"/>
            <option value="1"/>
            <option value="2"/>
            <option value="3"/>
            <option value="4"/>
            <option value="5"/>
            <option value="6"/>
            <option value="7"/>
          </datalist>
        </div>
        <p>Octave {{ octave }}</p>
      </div>

      <div class="box">
        <label class="self-start text-xl uppercase">Arpeggiator</label>
        <div class="bg-black p-4 my-4">
          <input id="arpeggiating" v-model="arpeggiator.active" type="checkbox" />
          <label for="arpeggiating">{{ arpeggiator.active ? 'ON' : 'OFF' }}</label>
        </div>
        <div class="bg-black p-4 my-4">
          <input id="arpeggiationTiming" v-model.number="arpeggiator.config.timing" type="range" min="0.01" max="2" step="0.01" />
          <label for="arpeggiationTiming">Timing {{ arpeggiator.config.timing }}</label>
        </div>
        <div class="bg-black p-4 my-4">
          <input id="arpeggiationSteps" v-model.number="arpeggiator.config.steps" type="range" list="steps" min="2" max="5" />
          <label for="arpeggiationSteps">Steps {{ arpeggiator.config.steps }}</label>
          <datalist id="steps">
            <option value="2"/>
            <option value="3"/>
            <option value="4"/>
            <option value="5"/>
          </datalist>
        </div>
      </div>
      <musical-typing
        :octave="octave"
        @stopNote="stopNote"
        @changeOctave="changeOctave"
        @playNote="playNote"
      ></musical-typing>
    </div>
  </div>
</template>

<script>
import shapeMap from '@/shapes';
import Arpeggiator from '@/components/Arpeggiator';
import MusicalTyping from "../components/MusicalTyping";

export default {
    components: {MusicalTyping},
    props: {
    audioContext: {
      default: function () {
        return new AudioContext();
      }
    }
  },
  data() {
    return {
      shape: 2,
      volume: 0.5,
      decay: 0.1,
      attack: 0.1,
      octave: 4,
      arpeggiator: {
        active: false,
        config: {
          timing: 0.2,
          steps: 3,
        }
      },
      oscillators: [],
      allowed: true,
    }
  },
  computed: {
    soundShape() {
      return shapeMap[this.shape];
    }
  },
  methods: {
    changeOctave(step) {
      if (this.octave + step < 0 || this.octave + step > 7) {
        return
      }
      this.octave = this.octave + step;
    },
    playNote(key, frequency) {
      if (this.findOscillatorBy({ key })) { return }

      const gainNode = this.createGainNode();
      const oscillator = this.createOscillatorNode(frequency);

      if (this.arpeggiator.active) {
          new Arpeggiator({ audioContext: this.audioContext, config: this.arpeggiator.config })
              .arpeggiate({ oscillator, key, baseOctave: this.octave });
      }
      oscillator.connect(gainNode);
      this.oscillators.push({ key, oscillator, gainNode });
      oscillator.start();
    },
    stopNote(e) {
      const key = e.key;
      const now = this.audioContext.currentTime;

      const oscillator = this.findOscillatorBy({ key });
      oscillator.gainNode.gain.exponentialRampToValueAtTime(0.00001, now + this.decay);

      const oscillatorIndex = this.oscillators.findIndex(o => o.key === key );
      this.oscillators.splice(oscillatorIndex, 1);
    },
    createGainNode() {
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.01;
      gainNode.gain.setTargetAtTime(this.volume, this.audioContext.currentTime, this.attack);
      gainNode.connect(this.audioContext.destination);
      return gainNode;
    },
    createOscillatorNode(frequency) {
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = this.soundShape;
      oscillator.frequency.setTargetAtTime(frequency, this.audioContext.currentTime, 0);

      return oscillator;
    },
    findOscillatorBy({ key }) {
      return this.oscillators.find(o => o.key === key)
    }
  },
}
</script>

<style lang="postcss">
 .box {
   @apply p-4 m-4 flex flex-col items-center shadows;
 }
 .shadows {
   box-shadow: 1px 1px 4px rgba(0,0,0,0.3)
 }
</style>

