<template>
  <div :class="['play-release-button', active ? 'active': '']" :style="playReleaseStyle" @click.prevent="onClick">
    <div :style="arrowStyle">
      <div :style="[active ? pauseStyle : arrowRightStyle]"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PlayButton',
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
        backgroundColor: this.background,
        active: false
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
          margin: '0px auto 0px auto',
          position: 'relative',
          right: `${this.baseSize * 0.1 / 2}px`,
          top: `${(this.baseSize / 4) * this.ratio}px`
        }
      },
      pauseStyle: function () {
        return {
          position: 'relative',
          width: `${this.baseSize / 2.6}px`,
          height: `${this.baseSize / 2.4}px`,
          margin: '0px auto 0px auto',
          borderLeft: `${this.baseSize / 8}px solid white`,
          borderRight: `${this.baseSize / 8}px solid white`,
          top: `${(this.baseSize / 3.5) * this.ratio}px`
        }
      }
    },
    methods: {
      onClick () {
        if (this.active) {
          this.active = false
          this.$emit('pause')
        } else {
          this.active = true
          this.$emit('play')
        }
      }
    }
  }
</script>

<style lang="scss">
  .play-release-button {
    &:hover:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 0.5;
    }
  }
</style>
