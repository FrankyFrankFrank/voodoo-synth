<template>
  <button
    :class="classes"
    v-text="meta.pianoKey"
  ></button>
</template>

<script>
    export default {
        name: 'KeyButton',
        props: ['meta'],
        computed: {
            classes () {
                if (this.meta.isGhost) {
                    return 'm-1 bg-transparent w-16 h-16'
                }
                return {
                    'text-blue-darkest': this.meta.isActive,
                    'bg-blue-light' : this.meta.isNatural,
                    'bg-blue-dark' : !this.meta.isNatural, // sharps are darker
                    'm-1 font-semibold w-16 h-16 rounded text-white' : true
                }
            }
        }
    }
</script>
