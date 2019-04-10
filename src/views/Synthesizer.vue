<template>
  <div class="bg-black h-screen text-white">
    <div>
      <div class="p-4 bg-black rounded mb-4 flex flex-col items-end" style="box-shadow: 1px 1px 4px rgba(0,0,0,0.3)">
        <label for="volume">Master Volume</label>
        <div class="my-4">
          <input id="volume" v-model.number="volume" type="range" min="0" max="1" step="0.01" />
        </div>
        <p>{{ volume }}</p>
      </div>
    </div>
    <div class="flex flex-wrap items-start justify-center">
      <div class="p-12 m-4 flex flex-col items-center">
        <label for="shape">Shape</label>
        <div class="bg-black rounded p-4 my-4" style="box-shadow: 1px 1px 4px rgba(0,0,0,0.3)">
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

      <div class="p-12 m-4 flex flex-col items-center">
        <label for="decay">Decay</label>
        <div class="bg-black rounded p-4 my-4" style="box-shadow: 1px 1px 4px rgba(0,0,0,0.3)">
          <input id="decay" v-model.number="decay" type="range" min="0.1" max="5" step="0.1" />
        </div>
        <p>{{ decay }} s</p>
      </div>

      <div class="p-12 m-4 flex flex-col items-center">
        <label for="attack">Attack</label>
        <div class="bg-black rounded p-4 my-4" style="box-shadow: 1px 1px 4px rgba(0,0,0,0.3)">
          <input id="attack" v-model.number="attack" type="range" min="0.1" max="5" step="0.1" />
        </div>
        <p>{{ attack }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import frequencies from '@/frequencies';
import shapeMap from '@/shapes';
import keyMap from '@/keys';

const keyIsAValidNote = (key) => {
  return keyMap[key] !== undefined;
}

export default {
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
      oscillators: [],
      allowed: true,
      keysPressed: [],
    }
  },
  created() {
    window.addEventListener('keydown', this.playNote)
    window.addEventListener('keyup', this.stopNote)
  },
  computed: {
    soundShape() {
      return shapeMap[this.shape];
    }
  },
  methods: {
    playNote(e) {
      const key = e.key;
      const keyIsRepeating = e.repeat;
      if (keyIsRepeating) { return }
      if (!keyIsAValidNote(key)) { return }
      if (this.findOscillatorBy({ key })) { return }

      this.setKeyPressed(key);
      const gainNode = this.createGainNode();
      const oscillator = this.createOscillatorNode(key);
      oscillator.connect(gainNode);
      this.oscillators.push({ key, oscillator, gainNode });
      oscillator.start();
    },
    stopNote(e) {
      const key = e.key;
      if (!keyIsAValidNote(key)) { return }
      this.unsetKeyPressed(key)
      const now = this.audioContext.currentTime;
      const oscillator = this.findOscillatorBy({ key });
      const oscillatorIndex = this.oscillators.findIndex((osc) => { return osc.key === key });
      oscillator.gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + this.decay);
      this.oscillators.splice(oscillatorIndex, 1);
    },
    createGainNode() {
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.01;
      gainNode.gain.setTargetAtTime(this.volume, this.audioContext.currentTime, this.attack);
      gainNode.connect(this.audioContext.destination);
      return gainNode;
    },
    createOscillatorNode(key) {
      const oscillator = this.audioContext.createOscillator();
      oscillator.frequency.value = frequencies[keyMap[key]][4];
      oscillator.type = this.soundShape;
      return oscillator;
    },
    setKeyPressed(key) {
      this.keysPressed.push(key)
    },
    unsetKeyPressed(key) {
      const index = this.keysPressed.indexOf(key);
      if (index >= 0) {
        this.keysPressed.splice(index, 1);
      }
    },
    findOscillatorBy({ key }) {
      return this.oscillators.find((osc) => osc.key === key)
    }
  },
}
</script>
