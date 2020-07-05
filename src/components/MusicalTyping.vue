<template>

</template>

<script>
    import keyMap from '@/keys';
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
                if (this.keyIsAValidNote(e.key) && !e.repeat) {
                    this.$emit('playNote', e.key);
                }
            },
            stopNote(e) {
                this.$emit('stopNote', e)
            },
            keyIsAValidNote (key) {
                return keyMap[key] !== undefined;
            }
        }
    }
</script>

<style scoped>

</style>
