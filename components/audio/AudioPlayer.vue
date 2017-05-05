<template>
  <div id="audioplayer" v-show="currentTrack">
    <div class="ap__element button-box">
      <button @click="backwards()" class="audio-control__btn backward"></button>
      <play-button ref="playBtn" size="" @play="playAudio" @pause="pauseAudio" class="audio-control__btn play" background="#30C46C"></play-button>
      <forward-button class="audio-control__btn forward" @forward="forwards()"></forward-button>
    </div>
    <div class="ap__element current-track">
      <div v-if="currentTrack" class="current-track__info-box">
        <div class="track-info">
          <div class="track-artist">
            <template v-if="currentTrack.release.artistFirstName">
              {{ currentTrack.release.artistFirstName }}
            </template>
            {{ currentTrack.release.artistLastName }}&nbsp;-&nbsp;
          </div>
          <div class="track-title">
            <template v-if="currentTrack.title">{{ currentTrack.title }}</template>
            <template v-else>Track {{ currentTrack.position }}</template>
          </div>
        </div>
        <div class="track-time">
          <div class="track-time__remaining">{{ time(currentTime / 1000) }}&nbsp;/&nbsp;</div>
          <div class="track-time__total">{{ time(duration / 1000) }}</div>
        </div>
      </div>
      <input v-model="currentTime" :style="" class="position-slider" type="range" :max="duration"></input>
    </div>
    <div class="ap__element button-box">BURGER</div>
    <div class="ap__element button-box">CART</div>
    <audio id="music" ref="music">
      <source v-if="currentTrack" :src="currentTrack.url" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
  import TrackDisplay from './TrackDisplay'
  import PlayReleaseButton from '../releases/PlayReleaseButton'
  import PlayButton from './PlayButton'
  import ForwardButton from './ForwardButton'

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
    components: {ForwardButton, PlayButton, PlayReleaseButton, TrackDisplay},
    name: 'AudioPlayer',
    data: function () {
      return {
        duration: 0,
        currentTime: 0
      }
    },
    computed: {
      duration: function () {
        return this.audio ? this.audio.duration : ''
      },
      player: function () {
        return this.$store.state.player
      },
      currentTrack: function () {
        let player = this.$store.state.player
        if (player) {
          this.reloadMusic()
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
      }
    },
    watch: {
      player: function (val) {
        this.reloadMusic()
        this.togglePlayButton()
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
        var music = this.$refs.music
        music.play()
      },
      playAudio () {
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
        if (music) {
          music.load()
          music.play()
          this.togglePlayBtn(false)
        }
        if (this.audio) {
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
      }
    },
    mounted: function () {
      this.audio = this.$el.querySelectorAll('audio')[0]
      this.init()
    }
  }

</script>

