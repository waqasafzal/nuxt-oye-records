<template>
  <div id="audioplayer" v-show="currentTrack">
    <audio id="music" ref="music">
      <source v-if="currentTrack" :src="currentTrack.url" type="audio/mpeg">
    </audio>
    <track-display></track-display>

    <div class="row">
      <div class="col-4 audio-control__btn-panel">
        <button @click="backwards()" class="audio-control__btn backward"></button>
        <button @click="playAudio()" class="audio-control__btn play" ref="playBtn"></button>
        <button @click="forwards()" class="audio-control__btn forward"></button>
      </div>
      <div class="col-8">
        <vue-slider :dotSize="10" class="position-slider" id="position-slider" tooltip="hidden" :formatter="time" :max="duration"
                    v-model="currentTime"></vue-slider>
        <div class="audio-control__stats">
          <div class="audio-control__stats__time">{{ time(currentTime) }} / {{ time(duration) }}</div>
          <div class="audio-control__stats__count">{{ playlistPos }} / {{ playlistLength }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import TrackDisplay from './TrackDisplay'

  const convertTimeHHMMSS = (val) => {
    if (val > 0) {
      let hhmmss = new Date(val * 1000).toISOString().substr(11, 8)
      return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss
    } else {
      return '00:00'
    }
  }

  export default {
    components: {TrackDisplay},
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
        let diff = this.audio.currentTime - val
        // if the change diff is big enough to assume a user triggered skip
        if (diff > 1 || diff < -1) {
          this.audio.currentTime = val
        }
      }
    },
    methods: {
      togglePlayBtn (doPlay) {
        var playBtn = this.$refs.playBtn
        let classNames = playBtn.classList
        if (!doPlay) {
          classNames.remove('play')
          classNames.add('pause')
        } else {
          classNames.remove('pause')
          classNames.add('play')
        }
      },
      playAudio () {
        var music = this.$refs.music
        if (music.paused) {
          music.play()
        } else {
          music.pause()
        }
        this.togglePlayBtn(music.paused)
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
        let currTime = parseInt(this.audio.currentTime)
        let percentage = parseInt((currTime / this.totalDuration) * 100)
        this.progressStyle = `width:${percentage}%;`
        this.currentTime = currTime
        this.duration = this.audio.duration
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

