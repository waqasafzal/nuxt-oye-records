<template>
  <play-button :release="playableRelease"
               :size="size"
               :foreground="foreground"
               :background="background"
               v-if="displayOnly || hasTracks"
               @play="playRelease"
               @pause="onPause"
               :displayOnly="displayOnly"
  ></play-button>
</template>

<script>
  import gql from 'graphql-tag'
  import {releaseDetails} from '../graphql/releases'
  import client from '../../plugins/apollo'
  import PlayButton from '../audio/PlayButton'
  import * as types from '../../store/types'
  import GoogleAnalytics from '~/mixins/ga'

  export default {
    components: {PlayButton},
    mixins: [GoogleAnalytics],
    name: 'PlayReleaseButton',
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
//        default: '#30C46C'
      },
      displayOnly: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        playableRelease: this.release
      }
    },
    methods: {
      playRelease () {
        if (this.displayOnly) {
          return
        }
        if (this.playableRelease && (!this.playableRelease.tracks || this.playableRelease.tracks.length === 0)) {
          this.fetchRelease()
        } else {
          this.trackEvent('Audio', 'play-release', `${this.playableRelease.name} - ${this.playableRelease.title}`)

          this.$store.dispatch('playRelease', {
            release: this.playableRelease
          }).then(track => {
          })
        }
      },
      fetchRelease () {
        var vm = this
        client.query({
          query: gql`query Release($slug: String!) {
            release (slug: $slug){
              ...ReleaseDetails
            }
          }
          ${releaseDetails}
          `,
          variables: {
            slug: this.playableRelease.slug
          }
        }).then((result) => {
          let playableRelease = result.data.release
          vm.playableRelease = playableRelease
          this.trackEvent('Audio', 'play-release', `${playableRelease.name} - ${playableRelease.title}`)

          this.$store.dispatch('playRelease', {
            release: playableRelease
          }).then(track => {
          })
        })
      },
      onPause () {
        if (this.displayOnly) {
          return
        }
        this.$store.commit(types.PAUSE_TRACK)
      }
    },
    computed: {
      hasTracks () {
        var release = this.release
        return release && (release.hasTracks || (release.tracks && release.tracks.length > 0))
      }
    }
  }
</script>
