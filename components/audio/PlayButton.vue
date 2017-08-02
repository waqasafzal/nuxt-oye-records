<template>
  <div :class="['play-release-button']" :style="playReleaseStyle" @click.prevent="onClick">
    <div class="play-release-inner">
      <div :style="arrowStyle">
        <template v-if="active">
          <div :style="pauseStyle"></div>
        </template>
        <template v-else>
          <div :style="playStyle"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import PlaySvg from '../shared/PlaySvg'
  export default {
    components: {PlaySvg},
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
          borderRadius: '2px',
          backgroundColor: this.backgroundColor
        }
      },
      arrowStyle: function () {
        return {
//          height: `${this.baseSize / 3}px`,
//          width: `${this.baseSize / 3}px`,
          margin: 'auto',
          display: 'flex'
        }
      },
      pauseStyle: function () {
        let style = {
          width: `${this.baseSize / 2.6}px`,
          height: `${this.baseSize / 2.8}px`,
          backgroundImage: `url(${require('~assets/images/Pause_icon.svg')})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }
        return style
      },
      playStyle: function () {
        let style = {
          width: `${this.baseSize / 2.6}px`,
          height: `${this.baseSize / 2.8}px`,
          backgroundImage: `url(${require('~assets/images/play-white.svg')})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }
        return style
      }
    },
    methods: {
      onClick () {
        if (this.active) {
          this.$emit('pause')
        } else {
          this.$emit('play')
        }
      }
    }
  }
</script>

<style lang="scss">
  .play-release {
    &-button {
      cursor: pointer;
      display: flex;
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
    &-inner {
      display: flex;
      height: 100%;
      width: 100%;
    }
  }
</style>
