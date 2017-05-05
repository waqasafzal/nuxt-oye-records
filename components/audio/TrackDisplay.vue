<template>
  <div v-if="currentTrack">
    <div class="track-artist">
      {{ currentTrack.release.artistFirstName }}
      {{ currentTrack.release.artistLastName }} -
    </div>
    <div class="track-title">
        <template v-if="currentTitle">{{ currentTrack.title }}</template>
        <template v-else>Track {{ currentTrack.release.position }}</template>
        -
      {{ currentTrack.release.title }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TrackDisplay',
    computed: {
      player () {
        return this.$store.state.player
      },
      currentTrack () {
        let player = this.$store.state.player
        if (player) {
          return player.currentTrack
        }
      },
      currentTitle () {
        let player = this.$store.state.player
        if (player) {
          return player.currentTrack.title
        }
      }
    },
    watch: {
      currentTrack: function (val) {
        let movingFront = this.$refs.movingFront
        let movingBack = this.$refs.movingBack
        var movings = [movingBack, movingFront]

        movings.forEach(
          function (item) {
            if (item) {
              let classList = item.classList
              let front = classList.contains('moving')
              let back = classList.contains('moving-flip')
              if (front) {
                classList.remove('moving')
              } else if (back) {
                classList.remove('moving-flip')
              }
              movingFront.offsetWidth
              if (front) {
                classList.add('moving')
              } else if (back) {
                classList.add('moving-flip')
              }
            }
          }
        )
      }
    }
  }
</script>
