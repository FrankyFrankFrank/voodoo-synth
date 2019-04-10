<template>
  <div>
    <div class="p-12">
      <label for="shape">Shape</label>
      <input id="shape" v-model="shape" type="range" min="0" max="3" />
      <p>{{ soundShape }}</p>
    </div>

    <div class="p-12">
      <label for="volume">Volume</label>
      <input id="volume" v-model.number="volume" type="range" min="0" max="1" step="0.1" />
      <p>{{ volume }}</p>
    </div>

    <div class="p-12">
      <label for="decay">Decay</label>
      <input id="decay" v-model.number="decay" type="range" min="0.1" max="4" step="0.1" />
      <p>{{ decay }}</p>
    </div>

    <div class="p-12">
      <label for="attack">Attack</label>
      <input id="attack" v-model.number="attack" type="range" min="0" max="4" step="0.1" />
      <p>{{ attack }}</p>
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
      shape: 0,
      volume: 0.5,
      decay: 0.2,
      attack: 0.2,
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
      if (!this.keysPressed.indexOf(key)) { return }
      this.unsetKeyPressed(key)
      const now = this.audioContext.currentTime;
      const oscillator = this.findOscillatorBy({ key });
      const index = this.oscillators.findIndex((osc) => { return osc.key === key });
      oscillator.gainNode.gain.exponentialRampToValueAtTime(0.001, now + this.decay);
      this.oscillators.splice(index, 1);
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
      const index = this.keysPressed.indexOf(key);
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
