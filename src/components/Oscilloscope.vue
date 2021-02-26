<template>
  <div>
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

      let canvas = document.getElementById("c");
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight/4
      let context = canvas.getContext("2d")

      context.strokeStyle="white"
      scope.animate(context)
    }
  }

}
</script>

<style scoped>
.oscilloscope {
  display: block;
}
</style>
a