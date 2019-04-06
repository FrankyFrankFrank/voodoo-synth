<template>
  <div id="app">
  </div>
</template>

<script>
import notes from './notes';

export default {
  data() {
    return {
      audioContext: null,
      oscillator: null,
      allowed: true,
    }
  },
  mounted() {
    window.addEventListener('keydown', this.playNote)
  },
  methods: {
    playNote(e) {
      if (e.repeat != undefined) {
        this.allowed = !e.repeat;
      }
      if (!this.allowed) return;
      this.allowed = false;
      console.log(e.key);
      this.audioContext = new AudioContext();
      this.oscillator = this.audioContext.createOscillator();
      this.audioContext.createGain();
      this.oscillator.connect(this.audioContext.destination);
      this.oscillator.frequency.value = notes[e.key.toUpperCase()][4];
      this.oscillator.start();
      this.oscillator.stop(this.audioContext.currentTime + 0.1);
    },
  },
}
</script>

