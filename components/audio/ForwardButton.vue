<template>
  <div class="play-forward-button" :style="playReleaseStyle" @click.prevent="onClick">
  </div>
</template>

<script>
  export default {
    name: 'ForwardButton',
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
    data: function () {
      return {
        baseSize: this.size,
        ratio: 1.1,
        foregroundColor: this.foreground,
        backgroundColor: this.background
      }
    },
    computed: {
      playReleaseStyle: function () {
        return {
          height: `${this.baseSize}px`,
          width: `${this.baseSize}px`,
          backgroundImage: `url(${require('~/assets/images/Next_Icon.svg')})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          borderRadius: '2px',
          backgroundColor: this.backgroundColor
        }
      }
    },
    methods: {
      onClick () {
        this.$emit('forward')
      }
    }
  }
</script>

<style lang="scss">
  .play-forward-button {
    cursor: pointer;
    &:hover:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      border-radius: 2px;
      height: 100%;
      background-color: white;
      opacity: 0.1;
    }
  }
</style>
