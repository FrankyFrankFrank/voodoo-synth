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
      <input id="decay" v-model.number="decay" type="range" min="0" max="4" step="0.1" />
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
      if (e.repeat) { return false }
      this.setKeyPressed(e.key);
      if (this.oscillators.find((osc) => osc.key === e.key)) {return false}
      const newOscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.01;
      gainNode.gain.setTargetAtTime(this.volume, this.audioContext.currentTime, this.attack);
      newOscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      newOscillator.frequency.value = frequencies[e.key.toUpperCase()][4];
      newOscillator.type = this.soundShape;
      newOscillator.start();
      const oscillatorObj = {
        key: e.key,
        osc: newOscillator,
        gain: gainNode,
      }
      this.oscillators.push(oscillatorObj);
    },
    stopNote(e) {
      const now = this.audioContext.currentTime;
      this.unsetKeyPressed(e.key)
      const oscillatorHasKey = (osc) => {
        return osc.key === e.key;
      };
      const oscillator = this.oscillators.find(oscillatorHasKey);
      const index = this.oscillators.findIndex(oscillatorHasKey);
      oscillator.gain.gain.exponentialRampToValueAtTime(0.001, now + this.decay);
      this.oscillators.splice(index, now + this.decay);
    },
    setKeyPressed(key) {
      const index = this.keysPressed.indexOf(key);
      if (index > 0) {
        return false;
      }
    },
    unsetKeyPressed(key) {
      const index = this.keysPressed.indexOf(key);
      if (index >= 0) {
        this.keysPressed.splice(index, 1);
      }
    },
  },
}
</script>
