<template>
  <div :class="[displayOnly ? '' : 'play-release-button']" :style="playReleaseStyle" @click.prevent="onClick">
    <div :style="arrowStyle">
      <template v-if="active">
        <div :style="pauseStyle"></div>
      </template>
      <template v-else>
        <div :style="arrowRightStyle"></div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PlayButton',
    props: {
      release: Object,
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
      },
      displayOnly: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        baseSize: this.size,
        ratio: 1.1,
        foregroundColor: this.foreground,
        backgroundColor: this.background,
        initiated: false
      }
    },
    computed: {
      active () {
        if (this.displayOnly) {
          return false
        }
        let player = this.$store.state.player
        return this.release && player.playing && player.currentTrack.release.slug === this.release.slug
      },
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
        let style = {
          width: 0,
          height: 0,
          borderRadius: '1px',
//          borderRadius: `${this.baseSize > 20 ? (this.baseSize / 16) : 0}px`,
          borderTop: `${this.baseSize / (4 * this.ratio)}px solid transparent`,
          borderBottom: `${this.baseSize / (4 * this.ratio)}px solid transparent`,
          borderRight: `${this.baseSize / 4}px solid ${this.foregroundColor}`,
          margin: '0px auto 0px auto',
          position: 'relative',
          right: `${this.baseSize * 0.1 / 2}px`,
          top: `${(this.baseSize / 4) * this.ratio}px`
        }
        return style
      },
      pauseStyle: function () {
        let style = {
          position: 'relative',
          width: `${this.baseSize / 2.6}px`,
          height: `${this.baseSize / 2.4}px`,
          margin: '0px auto 0px auto',
          borderLeft: `${this.baseSize / 8}px solid white`,
          borderRight: `${this.baseSize / 8}px solid white`,
          top: `${(this.baseSize / 3.5) * this.ratio}px`
        }
        return style
      }
    },
    methods: {
      onClick () {
        if (this.active) {
//          this.active = false
          this.$emit('pause')
        } else {
//          this.active = true
          this.$emit('play')
        }
      }
    }
  }
</script>

<style lang="scss">
  .play-release-button {
    cursor: po;
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
