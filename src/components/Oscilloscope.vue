<template>
  <div>
    <h2>Oscilloscope</h2>
    <canvas id="c" class="oscilloscope"></canvas>
  </div>
</template>

<script>
import OscilloscopeFoo from 'oscilloscope'

export default {
  name: "Oscilloscope",
  props: ['signal'],
  watch: {
    signal: function(newVal) {
      const scope = new OscilloscopeFoo(newVal, { fftSize: 2048 })
      document.getElementById("c").fillStyle="white"
      scope.animate(document.getElementById("c").getContext("2d"))
    }
  }

}
</script>

<style scoped>
.oscilloscope {
  display: block;
}
</style>
