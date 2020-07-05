<template>

</template>

<script>
    import frequencies from '@/frequencies';
    import keyMap from '@/keys';
    export default {
        name: "MusicalTyping",
        props: ['octave'],
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
                    const frequency = frequencies[keyMap[e.key]][this.octave];
                    this.$emit('playNote', e.key, frequency);
                }
            },
            stopNote(e) {
                if (!this.keyIsAValidNote(e.key)) return;

                const frequency = frequencies[keyMap[e.key]][this.octave];

                this.$emit('stopNote', frequency);
            },
            keyIsAValidNote (key) {
                return keyMap[key] !== undefined;
            }
        }
    }
</script>

<style scoped>

</style>
