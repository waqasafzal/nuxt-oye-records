<template>
  <div 
    :class="['play-release-button']" 
    :style="playReleaseStyle" 
    @touchend.prevent="onClick" 
    @click.prevent="onClick">
    <!--<div :class="['play-release-button']" :style="playReleaseStyle" @touchmove.prevent="onClick" @click.prevent="onClick">-->
    <div class="play-release-inner">
      <div :style="arrowStyle">
        <template v-if="active">
          <div :style="pauseStyle"/>
        </template>
        <template v-else>
          <play-svg 
            :style="playStyle" 
            :fill="foreground"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import PlaySvg from '../shared/PlaySvg'
export default {
  name: 'PlayButton',
  components: { PlaySvg },
  props: {
    release: { type: Object, default: null },
    size: { type: Number, default: 32 },
    foreground: { type: String, default: 'white' },
    background: { type: String, default: '#313532' },
    displayOnly: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      baseSize: this.size,
      ratio: 1.1,
      foregroundColor: this.foreground,
      backgroundColor: this.background,
      initiated: false
    }
  },
  computed: {
    active() {
      if (this.displayOnly) {
        return false
      }
      let player = this.$store.state.player
      return (
        this.release &&
        player.playing &&
        player.currentTrack.release.slug === this.release.slug
      )
    },
    playReleaseStyle: function() {
      return {
        height: `${this.baseSize}px`,
        width: `${this.baseSize}px`,
        borderRadius: '2px',
        backgroundColor: this.backgroundColor
      }
    },
    arrowStyle: function() {
      return {
        height: `${this.baseSize / 3}px`,
        width: `${this.baseSize / 3}px`,
        margin: 'auto',
        display: 'flex'
      }
    },
    pauseStyle: function() {
      let style = {
        width: `${this.baseSize / 2.6}px`,
        height: `${this.baseSize / 2.8}px`,
        backgroundImage: `url(${require('~/assets/images/Pause_icon.svg')})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }
      if (this.baseSize > 60) {
        style[
          'backgroundImage'
        ] = `url(${require('~/assets/images/Pause_icon_Big.svg')})`
      }
      return style
    },
    playStyle: function() {
      let style = {
        marginLeft: `${this.baseSize / 12}px`
      }
      return style
    }
  },
  methods: {
    onClick() {
      if (this.active) {
        this.$emit('pause')
      } else {
        this.$emit('play')
      }
    }
  }
}
</script>
