<template>
  <div id="app">
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener('keydown', this.playNote)
  },
  methods: {
    playNote(e) {
      console.log(e.key);
    }
  },
}
</script>

