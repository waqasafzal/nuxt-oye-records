<template>
  <div class="marquee">
    <template v-if="currentTrack">
      <p class="moving" ref="movingFront">
        {{ currentTrack.release.artistFirstName }}
        {{ currentTrack.release.artistLastName }} -
        <template v-if="currentTitle">{{ currentTrack.title }}</template>
        <template v-else>Track {{ currentTrack.release.position }}</template>
        -
        {{ currentTrack.release.title }}
      </p>
      <p class="moving-flip" ref="movingBack">
        {{ currentTrack.release.artistFirstName }}
        {{ currentTrack.release.artistLastName }} -
        <template v-if="currentTrack.title">{{ currentTrack.title }}</template>
        <template v-else>Track {{ currentTrack.release.position }}</template>
        -
        {{ currentTrack.release.title }}
      </p>
    </template>
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

<style>
  .marquee {
    width: auto;
    padding: .5em;
    height: 2em;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
  }

  .marquee .moving {
    display: inline-block;
    padding-left: 100%;
    animation: marquee 8s linear -4s infinite;
  }

  .marquee .moving-flip {
    display: inline-block;
    padding-left: 100%;
    animation: marquee-flip 12s linear 6s infinite;
  }
  @keyframes marquee {
    0%   { transform: translate(-100%, 0); }
    100% { transform: translate(0, 0); }
  }
  @keyframes marquee-flip {
    0%   { transform: translate(-100%, 0); }
    100% { transform: translate(0, 0); }
  }
</style>
