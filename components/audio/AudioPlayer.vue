<template>
  <div v-on-clickaway="onClickaway">
    <playlist v-if="showPlaylist"></playlist>
    <div v-show="currentTrack">
      <div id="audioplayer">
        <div class="ap__element button-box audio-control">
          <div class="audio-control__buttons">
            <backward-button @backward="backwards()" class="audio-control__btn"></backward-button>
            <play-button :release="currentTrack && currentTrack.release" ref="playBtn" @play="onPlay" @pause="onPause"
                         class="audio-control__btn" background="#30C46C"></play-button>
            <forward-button class="audio-control__btn" @forward="forwards()"></forward-button>
          </div>
        </div>
        <div class="ap__element current-track">
          <nuxt-link v-if="currentTrack" class="current-track__info-box"
                     :to="{name: 'releases-slug', params: {slug: currentTrack.release.slug}}">
            <div class="track-info d-flex row">
              <div class="track-name d-flex flex-row col-12">
                <div class="track-artist">
                  <template v-if="currentTrack.release.artistFirstName">
                    {{ currentTrack.release.artistFirstName }}

                  </template>
                  {{ currentTrack.release.artistLastName }}&nbsp;-&nbsp;

                </div>
                <div class="track-title">
                  <template v-if="currentTrack.title">{{ currentTrack.title }}</template>
                  <template v-else>Track {{ currentTrack.position + 1 }}</template>
                </div>
              </div>
              <div class="release-title col-12">{{ currentTrack.release.title }}</div>
            </div>
            <div class="track-time">
              <div class="track-time__remaining">{{ time(currentTime / 1000) }}&nbsp;/&nbsp;</div>
              <div class="track-time__total">{{ time(duration / 1000) }}</div>
            </div>
          </nuxt-link>
          <div class="position-slider">
            <input v-model="currentTime" type="range" :max="duration"></input>
            <div class="slider">
              <div class="slider-fill" :style="sliderStyle"></div>
            </div>
          </div>
        </div>
        <div class="ap__element button-box link-box" @click="onBurgerClick">
          <div :class="[showPlaylist ? 'close-playlist': 'burger-menu']"></div>
        </div>
        <div @click="onCartClick" class="ap__element button-box link-box">
          <div class="add-to-cart">
            <img src="../../assets/images/cart_small_white.svg"/>
          </div>
        </div>
      </div>
      <audio id="music" ref="music">
        <source ref="clip" v-if="currentTrack" :src="currentTrack.url" type="audio/mpeg">
      </audio>
    </div>
  </div>
</template>

<script>
  import TrackDisplay from './TrackDisplay'
  import PlayReleaseButton from '../releases/PlayReleaseButton'
  import PlayButton from './PlayButton'
  import ForwardButton from './ForwardButton'
  import BackwardButton from './BackwardButton'
  import * as types from '../../store/types'
  import CartSvg from '../shared/Cart'
  import Playlist from './Playlist'
  import { mixin as clickaway } from 'vue-clickaway'

  const convertTimeHHMMSS = (val) => {
    if (val > 0) {
      let hhmmss = new Date(val * 1000).toISOString().substr(11, 8)
      return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss
    } else {
      return '00:00'
    }
  }

  const PRECISION_FACTOR = 1000

  export default {
    components: {Playlist, CartSvg, BackwardButton, ForwardButton, PlayButton, PlayReleaseButton, TrackDisplay},
    name: 'AudioPlayer',
    mixins: [clickaway],
    data: function () {
      return {
        duration: 0,
        currentTime: 0
      }
    },
    computed: {
      showPlaylist () {
        return this.$store.state.player.playlistVisible
      },
      player: function () {
        return this.$store.state.player
      },
      playing: function () {
        return this.$store.state.player.playing
      },
      currentTrack: function () {
        let player = this.$store.state.player
        if (player && player.currentTrack) {
//          console.log('')
//          this.reloadMusic()
          return player.currentTrack
        }
      },
      playlistPos: function () {
        return this.player.currentTrack ? this.player.position + 1 : 0
      },
      playlistLength: function () {
        if (this.player) {
          return this.player.history.length
        } else {
          return 0
        }
      },
      sliderStyle: function () {
        return {
          width: `${100 * this.currentTime / this.duration}%`
        }
      }
    },
    watch: {
      currentTrack (val) {
        console.log('currentTrack changed ' + val.url)
        this.reloadMusic()
      },
      player: function (val) {
        console.log('player changed' + val)
        this.reloadMusic()
      },
      playing: function (val) {
        console.log('playing changed: ' + val)
        if (!val) {
          this.pauseAudio()
        } else {
          this.playAudio()
        }
      },
      currentTime: function (val) {
        let number = (val / PRECISION_FACTOR)
        let diff = this.audio.currentTime - number
        // if the change diff is big enough to assume a user triggered skip
        if (diff > 1 || diff < -1) {
          this.audio.currentTime = number
        }
      }
    },
    methods: {
      pauseAudio () {
        console.log('pauseAudio')
        var music = this.$refs.music
        music.pause()
      },
      playAudio () {
        console.log('playAudio')
        var music = this.$refs.music
        music.play()
      },
      backwards () {
        this.$store.dispatch('prevTrack')
      },
      forwards () {
        this.$store.dispatch('nextTrack')
      },
      reloadMusic () {
        let music = this.$refs.music
        console.log('reloadMusic' + music)
        let clip = this.$refs.clip
        if (this.audio) {
          console.log(clip)
          if (music) {
            clip.src = this.currentTrack.url
            music.pause()

            console.log('preload')
            music.load()
            console.log('load')
            music.play()
            console.log('play')
          }
          this.duration = this.audio.duration
        }
      },
      init: function () {
        this.audio.addEventListener('timeupdate', this._handlePlayingUI)
        this.audio.addEventListener('ended', this.forwards)
      },
      _handlePlayingUI: function (e) {
        let currTime = parseInt(this.audio.currentTime * PRECISION_FACTOR)
        this.currentTime = currTime
        this.duration = this.audio.duration * PRECISION_FACTOR
      },
      time: function (val) {
        return convertTimeHHMMSS(val)
      },
      onPause: function () {
        this.$store.commit(types.PAUSE_TRACK)
      },
      onPlay: function () {
        if (this.currentTrack) {
          this.$store.commit(types.PLAY_TRACK, this.currentTrack)
        }
      },
      onCartClick () {
        if (this.currentTrack) {
          let release = this.currentTrack.release
          this.$store.dispatch('addToCart', {
            pk: release.pk,
            quantity: 1
          })
        }
      },
      onBurgerClick () {
        this.$store.commit(types.SET_PLAYLIST_VISIBLE, !this.$store.state.player.playlistVisible)
      },
      onClickaway () {
        this.$store.commit(types.SET_PLAYLIST_VISIBLE, false)
      }
    },
    mounted: function () {
      this.audio = this.$el.querySelectorAll('audio')[0]
      this.init()

      var vm = this
      document.addEventListener('keydown', function (e) {
        var key = e.keyCode ? e.keyCode : e.which

        let noText = e.target.type !== 'text'
        if (key === 32 && noText) {
          e.preventDefault()
          if (vm.playing) {
            vm.$store.commit(types.PAUSE_TRACK)
          } else {
            vm.$store.commit(types.PLAY_TRACK, vm.currentTrack)
          }
        } else if (key === 37 && noText) {
          e.preventDefault()
          vm.backwards()
        } else if (key === 39 && noText) {
          e.preventDefault()
          vm.forwards()
        }
      })
    }
  }

</script>

