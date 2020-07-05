<template>

</template>

<script>
    export default {
        name: "MusicalTyping",
        created () {
            window.addEventListener('keydown', this.handleKeyDown);
            window.addEventListener('keyup', this.stopNote);
        },
        methods: {
            handleKeyDown (e) {
                if (e.key === '.') {
                    this.$emit('changeOctave', 1);
                    return
                }
                if (e.key === ',') {
                    this.$emit('changeOctave', -1);
                    return
                }
                this.$emit('handleKeyDown', e);
            },
            stopNote(e) {
                this.$emit('stopNote', e)
            }
        }
    }
</script>

<style scoped>

</style>
