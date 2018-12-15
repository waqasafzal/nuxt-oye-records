<template>
  <div 
    :style="playReleaseStyle" 
    class="play-backward-button" 
    @click.prevent="onClick"/>
</template>

<script>
export default {
  name: 'BackwardButton',
  props: {
    size: {
      type: Number,
      default: 32
    },
    foreground: {
      type: String,
      default: 'white'
    },
    background: {
      type: String,
      default: '#313532'
    }
  },
  data: function() {
    return {
      baseSize: this.size,
      ratio: 1.1,
      foregroundColor: this.foreground,
      backgroundColor: this.background
    }
  },
  computed: {
    playReleaseStyle: function() {
      return {
        height: `${this.baseSize}px`,
        width: `${this.baseSize}px`,
        backgroundImage: `url(${require('~/assets/images/Previous_Icon.svg')})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        borderRadius: '2px',
        backgroundColor: this.backgroundColor
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('backward')
    }
  }
}
</script>

<style lang="scss">
.play-backward-button {
  cursor: pointer;
  &:hover:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    background-color: white;
    opacity: 0.1;
  }
}
</style>
