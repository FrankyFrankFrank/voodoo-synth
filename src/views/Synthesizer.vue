<template>
  <div></div>
</template>

<script>
import frequencies from '@/frequencies';

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
      oscillators: [],
      allowed: true,
      keysPressed: [],
    }
  },
  created() {
    window.addEventListener('keydown', this.playNote)
    window.addEventListener('keyup', this.stopNote)
  },
  methods: {
    playNote(e) {
      if (e.repeat) { return false }
      this.setKeyPressed(e.key);
      if (this.oscillators.find((osc) => osc.key === e.key)) {return false}
      const newOscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      newOscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      newOscillator.frequency.value = frequencies[e.key.toUpperCase()][4];
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
      oscillator.gain.gain.setTargetAtTime(0, now, 0.2);
      this.oscillators.splice(index, 1);
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
