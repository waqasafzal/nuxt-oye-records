<template>
  <div class="play-forward-button" :style="playReleaseStyle" @click.prevent="onClick">
    <div :style="arrowStyle">
      <div :style="arrowRightStyle">
        <div :style="barStyle"></div>
      </div>
    </div>
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
          transform: 'scaleX(-1)',
          borderRadius: '2px',
          backgroundColor: this.backgroundColor
        }
      },
      arrowStyle: function () {
        return {
          textAlign: 'center'
        }
      },
      arrowRightStyle: function () {
        return {
          width: 0,
          height: 0,
          borderRadius: `${this.baseSize / 16}px`,
          borderTop: `${this.baseSize / (4 * this.ratio)}px solid transparent`,
          borderBottom: `${this.baseSize / (4 * this.ratio)}px solid transparent`,
          borderRight: `${this.baseSize / 4}px solid ${this.foregroundColor}`,
          margin: `0px ${this.baseSize / 4}px 0px auto`,
          position: 'relative',
          right: `${this.baseSize * 0.1 / 2}px`,
          top: `${(this.baseSize / 4) * this.ratio}px`
        }
      },
      barStyle: function () {
        return {
          position: 'relative',
          width: `${this.baseSize / 2.5}px`,
          height: `${(this.baseSize / 2.5) * this.ratio}px`,
          right: `${this.baseSize / 2.3}px`,
          top: `${this.baseSize / -4.6}px`,
          borderRight: `${this.baseSize / 10.2}px solid ${this.foregroundColor}`
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
