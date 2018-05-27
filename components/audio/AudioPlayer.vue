<template>
  <div>
    <!--<div class="audio-panel" v-show="showPlayer" v-on-clickaway="onClickaway">-->
      <playlist v-if="showPlayer && showPlaylist"></playlist>
  <transition name="player-from-bottom">
      <div v-show="showPlayer" id="audioplayer">
        <div class="audioplayer d-none d-md-flex">
          <div class="ap__element button-box audio-control">
            <div class="audio-control__buttons">
              <backward-button @backward="backwards()" class="audio-control__btn"></backward-button>
              <play-button :release="currentTrack && currentTrack.release" ref="playBtn" @play="onPlay" @pause="onPause"
                           class="audio-control__btn play" background="#30C46C"></play-button>
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
              <div class="slider" @click.capture="onClickSlider">
                <div class="slider-fill" :style="sliderStyle"></div>
              </div>
            </div>
          </div>
          <div @click="onCartClick" class="ap__element button-box add-to-cart">
            <div>
              <img src="../../assets/images/cart_small_white.svg"/>
            </div>
          </div>
          <div class="ap__element button-box link-box" @click="onBurgerClick">
            <div :class="[showPlaylist ? 'close-playlist': 'burger-menu']"></div>
          </div>
          <div @click="onClose" class="ap_element button-box link-box">
            <div class="close-playlist"></div>
          </div>
        </div>
        <div class="audioplayer d-sm-flex d-md-none">
          <div class="controls">
            <div class="flex-row d-flex">
              <div @click="onCartClick" class="ap__element add-to-cart">
                <div class="cart-button">
                  <img src="../../assets/images/cart_small_white.svg"/>
                </div>
              </div>
              <div class="ap__element playlist-button" @click="onBurgerClick">
                <div :class="[showPlaylist ? 'close-playlist': 'burger-menu']"></div>
              </div>
              <div @click="onClose" class="ap_element button-box close-playlist-box">
                <div class="close-playlist"></div>
              </div>
            </div>
          </div>
          <div class="d-flex flex-row">
            <div class="position-slider">
              <div class="slider" @click.capture="onClickSlider">
                <div class="slider-fill" :style="sliderStyle"></div>
              </div>
            </div>
            <div class="track-time">
              <div class="track-time__remaining">{{ time(currentTime / 1000) }}&nbsp;/&nbsp;</div>
              <div class="track-time__total">{{ time(duration / 1000) }}</div>
            </div>
          </div>
          <div v-if="currentTrack && currentTrack.release" class="current-track current-track__info-box d-flex flex-row justify-content-between">
            <div class="release-image">
              <img :src="currentTrack.release.thumbnailUrl" />
            </div>
            <div class="track-info d-flex flex-column">
              <div>
                <div class="track-name d-flex flex-row col-12">
                  <div class="track-artist">
                    <template v-if="currentTrack.release.artistFirstName">
                      {{ currentTrack.release.artistFirstName }}
                    </template>
                    {{ currentTrack.release.artistLastName }}<span class="d-none d-md-block">&nbsp;-&nbsp;</span>
                  </div>
                  <div class="track-title">
                    <template v-if="currentTrack.title">{{ currentTrack.title }}</template>
                    <template v-else>Track {{ currentTrack.position + 1 }}</template>
                  </div>
                </div>
                <div class="release-title col-12">{{ currentTrack.release.title }}</div>
              </div>
              <div style="margin-top: auto">
                <div class="ap__element button-box audio-control">
                  <div class="audio-control__buttons flex-row">
                    <backward-button @backward="backwards()" class="audio-control__btn"></backward-button>
                    <play-button :release="currentTrack && currentTrack.release" ref="playBtn" @play="onPlay" @pause="onPause"
                                 class="audio-control__btn play" background="#30C46C"></play-button>
                    <forward-button class="audio-control__btn" @forward="forwards()"></forward-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <em>NEW AUDIO</em>
        </div>
      </div>
  </transition>
      <audio id="music" ref="music">
        <source ref="clip" v-if="currentTrack" :src="currentTrack.url" type="audio/mpeg">
      </audio>
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
  import { mapGetters } from 'vuex'

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
        // ,
        // visible: false
      }
    },
    computed: {
      ...mapGetters({
        visible: 'showAudioPlayer'
      }),
      showPlaylist () {
        return this.$store.state.player.playlistVisible
      },
      player () {
        return this.$store.state.player
      },
      playing () {
        return this.$store.state.player.playing
      },
      currentTrack () {
        let player = this.$store.state.player
        if (player && player.currentTrack) {
          return player.currentTrack
        }
      },
      showPlayer () {
        let name = this.$route.name
        return this.visible && (name === null || !['checkout', 'cart'].includes(name) && !name.startsWith('account'))
      },
      playlistPos () {
        return this.player.currentTrack ? this.player.position + 1 : 0
      },
      playlistLength () {
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
      showPlayer (value) {
        if (!value) {
          this.onPause()
        }
      },
      currentTrack (val) {
        this.reloadMusic()
      },
      player: function (val) {
        this.reloadMusic()
      },
      playing: function (val) {
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
          const release = this.currentTrack.release
          // eslint-disable-next-line no-undef
          ga('send', 'event', 'Audio', 'skip', `${release.name} - ${release.title}`)
          this.audio.currentTime = number
        }
      }
    },
    methods: {
      onClickSlider (e) {
        let offsetWidth = e.target.offsetParent.offsetWidth
        let currentTime = this.duration * e.offsetX / offsetWidth
        this.currentTime = currentTime
      },
      pauseAudio () {
        var music = this.$refs.music
        music.pause()
      },
      playAudio () {
        this.$store.commit(types.SET_PLAYER_VISIBLE, true)
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
        let clip = this.$refs.clip
        if (this.audio) {
          if (music) {
            if (clip) {
              clip.src = this.currentTrack.url
            }
            music.pause()
            music.load()
            music.play()
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
            release: release,
            quantity: 1
          })
        }
      },
      onBurgerClick () {
        this.$store.commit(types.SET_PLAYLIST_VISIBLE, !this.$store.state.player.playlistVisible)
      },
      onClickaway () {
        this.$store.commit(types.SET_PLAYLIST_VISIBLE, false)
      },
      onClose () {
        this.$store.commit(types.SET_PLAYER_VISIBLE, false)
        // this.visible = false
      },
      onKeyDown (e) {
        if (this.visible) {
          var key = e.keyCode ? e.keyCode : e.which
          let noText = e.target.type !== 'text'
          if (key === 32 && noText) {
            e.preventDefault()
            if (this.playing) {
              this.$store.commit(types.PAUSE_TRACK)
            } else {
              this.$store.commit(types.PLAY_TRACK, this.currentTrack)
            }
          } else if (key === 37 && noText) {
            e.preventDefault()
            this.backwards()
          } else if (key === 39 && noText) {
            e.preventDefault()
            this.forwards()
          }
        }
      }
    },
    mounted: function () {
      this.audio = this.$el.querySelectorAll('audio')[0]
      this.init()

      document.addEventListener('keydown', this.onKeyDown)
    },
    beforeDestroy () {
      document.removeEventListener('keydown', this.onKeyDown)
    }
  }

</script>


<style lang="scss">
  .player-from-bottom-enter-active {
    transition: margin-bottom 1s;
  }

  .player-from-bottom-leave-active {
    transition: margin-bottom 1s;
  }

  .player-from-bottom-enter, .player-from-bottom-leave-to {
    margin-bottom: -100%;
  }
</style>
