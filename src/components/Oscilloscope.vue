<template>
  <div class="px-16 py-4 inline-block m-2">
    <div class="bg-grey-darker p-5 rounded-full">
      <div class="bg-grey-darkest p-4 rounded-full">
        <div class="bg-green-darker rounded-full py-4 w-64 h-64 overflow-hidden border border-white">
          <canvas id="c" class="oscilloscope h-64 -mt-4"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

function drawScope(analyser, ctx) {
  // Copyright (c) 2021 by Ewen (https://codepen.io/ContemporaryInsanity/pen/Mwvqpb)
  // Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  // The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var timeData = new Uint8Array(analyser.frequencyBinCount);
  var scaling = height / 256;
  var risingEdge = 0;
  var edgeThreshold = 5;

  analyser.getByteTimeDomainData(timeData);

  ctx.fillStyle = 'transparent';

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#38c172';
  ctx.beginPath();

  // No buffer overrun protection
  while (timeData[risingEdge++] - 128 > 0 && risingEdge <= width);
  if (risingEdge >= width) risingEdge = 0;

  while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width);
  if (risingEdge >= width) risingEdge = 0;

  for (var x = risingEdge; x < timeData.length && x - risingEdge < width; x++)
    ctx.lineTo(x - risingEdge, height - timeData[x] * scaling);

  ctx.stroke();
}

export default {
  name: "Oscilloscope",
  props: ['signal'],
  data() {
    return {
      context: null,
      canvas: null
    }
  },
  mounted() {
    this.canvas = document.getElementById("c");
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight / 4
    this.context = this.canvas.getContext("2d")

    this.oscillatorLoop()
  },
  methods: {
    oscillatorLoop() {
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.drawBoard()
      drawScope(this.signal, this.context);
      requestAnimationFrame(this.oscillatorLoop);
    },
    drawBoard() {
      var bw = this.context.canvas.width;
      // Box height
      var bh = this.context.canvas.height;
      // Padding
      var p = 10;

      this.context.beginPath()

      for (var x = -20; x <= bw; x += 40) {
        this.context.moveTo(0.5 + x, 0);
        this.context.lineTo(0.5 + x, bh + p+30);
      }

      for (var y = -20; y <= bh; y += 40) {
        this.context.moveTo(0, 0.5 + y + p);
        this.context.lineTo(bw + p, 0.5 + y + p);
      }
      this.context.lineWidth = 1;
      this.context.strokeStyle = "#e3fcec";
      this.context.stroke();
    }
  }
}
</script>

<style scoped>
.oscilloscope {
  display: block;
}
</style>
