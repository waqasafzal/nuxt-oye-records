<template>
  <play-button :size="size" :foreground="foreground" :background="background" v-if="hasTracks" @play="playRelease"></play-button>
</template>

<script>
  import gql from 'graphql-tag'
  import {releaseDetails} from '../graphql/releases'
  import client from '../../plugins/apollo'
  import PlayButton from '../audio/PlayButton'

  export default {
    components: {PlayButton},
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
      }
    },
    data: function () {
      return {
        playableRelease: this.release
      }
    },
    methods: {
      playRelease () {
        if (this.playableRelease && (!this.playableRelease.tracks || this.playableRelease.tracks.length === 0)) {
          this.fetchRelease()
        } else {
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
          vm.playableRelease = result.data.release
          vm.playRelease()
        })
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
