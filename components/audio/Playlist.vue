<template>
  <transition name="from-bottom" @enter="onEnter">
    <div v-if="!this.$store.getters.minimizedAudioPlayer" class="playlist" ref="playlist">
      <div @click="playTrack(track)" :ref="'track-'+i" class="playlist__item d-none d-md-flex" v-for="(track, i) in tracks">
        <div class="play-box">
          <div :class="[isPlaying(i) ? 'playing': '']">
            <play-release-button :size="24" :displayOnly="true" foreground="#EBE9E6" background="transparent"></play-release-button>
          </div>
        </div>
        <div class="track-info">
          <div class="playlist-position">{{ i + 1 }}.</div>
          <div class="track-artist">{{track.release.artistLastName}}</div>&nbsp;-&nbsp;
          <div class="track-title">
            <template v-if="track.title">{{track.title}}</template>
            <template v-else>Track {{track.position + 1}}</template>
          </div>
        </div>
        <div class="release-title">{{track.release.title}}</div>
        <div class="release-label">{{track.release.label}}</div>
      </div>
      <div @click="playTrack(track)" :ref="'track-'+i" class="playlist__item d-sm-block d-md-none" v-for="(track, i) in tracks">
        <div class="play-box">
          <div :class="[isPlaying(i) ? 'playing': '']">
            <play-release-button :size="24" :displayOnly="true" foreground="#EBE9E6" background="transparent"></play-release-button>
          </div>
        </div>
        <div class="d-flex flex-row">
          <div class="d-flex flex-column track-info-panel" style="width: 100%;">
            <div class="track-info">
              <div class="playlist-position">{{ i + 1 }}.</div>
              <div class="flex-column">
                <div class="track-artist">{{track.release.artistLastName}}</div><span class="d-none d-md-inline">&nbsp;-&nbsp;</span>
                <div class="track-title">
                  <template v-if="track.title">{{track.title}}</template>
                  <template v-else>Track {{track.position + 1}}</template>
                </div>
                <div class="release-title">{{track.release.title}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="release-label">{{track.release.label}}</div>
      </div>
    </div>
  </transition>
</template>

<script>
  import PlayReleaseButton from '../releases/PlayReleaseButton'
  import * as types from '../../store/types'

  var elementInViewport = function (el) {
    return true
  }
  if (process.browser) {
    elementInViewport = function (el, playlist) {
      var itemRect = el.getBoundingClientRect()
      var playlistRect = playlist.getBoundingClientRect()
      return itemRect.top >= playlistRect.top && itemRect.bottom <= playlistRect.bottom
    }
  }

  export default {
    components: {PlayReleaseButton},
    name: 'Playlist',
    data: function () {
      return {
        currentListElement: null
      }
    },
    computed: {
      tracks () {
        return this.$store.state.player.history
      }
    },
    methods: {
      isPlaying (position) {
        return this.$store.state.player.position === position
      },
      playTrack (track) {
        this.$store.dispatch('playTrack', {
          track: track
        }).then(track => {
        })
      },
      onEnter () {
        this.scrollToCurrentTrack()
        this.$store.commit(types.SET_MINIMIZED, false)
      },
      scrollToCurrentTrack () {
        let ref = this.$refs[`track-${this.$store.state.player.position}`]
        if (ref) {
          let trackElement = ref[0]
          if (trackElement) {
            if (!elementInViewport(trackElement, this.$refs.playlist)) {
              trackElement.scrollIntoView(true)
            }
          }
        }
      }
    },
    mounted () {
      var vm = this
      this.$store.subscribe((mutation, store) => {
        var playlistMutations = [types.PLAY_TRACK, types.PLAY_BACKWARD, types.PLAY_FORWARD]
        if (playlistMutations.includes(mutation.type)) {
          vm.scrollToCurrentTrack()
        }
      })
    }
  }
</script>

<style lang="scss">
  .from-bottom-enter-active {
    transition: margin-bottom 1s ease-out;
  }

  .from-bottom-leave-active {
    /*max-height: -100%;*/
    transition: margin-bottom 1s;
  }

  .from-bottom-enter, .from-bottom-leave-to {
    margin-bottom: calc(-50% + 140px);
  }
</style>
