<template>
  <div class="play-release-button" v-if="hasTracks" :style="playReleaseStyle" @click.prevent="playRelease">
    <div :style="arrowStyle">
      <div :style="arrowRightStyle"></div>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag'
  import {releaseDetails} from '../graphql/releases'

  export default {
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
    methods: {
      playRelease () {
        if (this.release && (!this.release.tracks || this.release.tracks.length === 0)) {
          this.fetchRelease()
        } else {
          this.$store.dispatch('playRelease', {
            release: this.release
          }).then(track => {
          })
        }
      },
      fetchRelease () {
        var vm = this
        this.$apollo.query({
          query: gql`query Release($pk: ID!) {
            release (pk: $pk){
              ...ReleaseDetails
            }
          }
          ${releaseDetails}
          `,
          variables: {
            pk: this.release.pk
          }
        }).then((result) => {
          vm.release = result.data.release
          vm.playRelease()
        })
      }
    },
    data: function () {
      return {
        baseSize: this.size,
        ratio: 1.1,
        foregroundColor: this.foreground,
        backgroundColor: this.background
      }
    },
    computed: {
      playReleaseStyle: function () {
        return {
          height: `${this.baseSize}px`,
          width: `${this.baseSize}px`,
          transform: 'scaleX(-1)',
          borderRadius: '2px',
          backgroundColor: this.backgroundColor
        }
      },
      arrowStyle: function () {
        return {
          textAlign: 'center'
        }
      },
      arrowRightStyle: function () {
        return {
          width: 0,
          height: 0,
          borderRadius: `${this.baseSize / 16}px`,
          borderTop: `${this.baseSize / (4 * this.ratio)}px solid transparent`,
          borderBottom: `${this.baseSize / (4 * this.ratio)}px solid transparent`,
          borderRight: `${this.baseSize / 4}px solid ${this.foregroundColor}`,
          margin: '0px auto 0px auto',
          position: 'relative',
          right: `${this.baseSize * 0.1 / 2}px`,
          top: `${(this.baseSize / 4) * this.ratio}px`
        }
      },
      hasTracks () {
        let release = this.release
        return release && release.hasTracks || (release.tracks && release.tracks.length > 0)
      }
    }
  }
</script>

<style lang="scss">
  .play-release-button {
    &:hover:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 0.5;
    }
  }
</style>
