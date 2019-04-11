<template>
  <div class="box">
    <label class="self-start text-xl uppercase" for="octave">Octave</label>
      <div class="bg-black p-4 my-4">
        <input
          id="octave"
          type="range"
          v-model.number="octave"
          min="0"
          max="7"
          step="1"
          list="octaves"
        />
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
</template>

<script>
export default {
  name: 'octave',
  props: ['initialOctave'],
  data() {
    return {
      octave: 3
    }
  },
  watch: {
    octave() {
      this.$emit('octave', this.octave);
    }
  }
}
</script>