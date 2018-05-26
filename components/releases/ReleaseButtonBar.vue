<template>
  <div :class="['release__button-bar', release.availability.status]" v-if="release">
    <div v-if="release && hasTracks">
      <play-release-button @click.prevent.stop :size=baseSize :release="release"></play-release-button>
    </div>
    <add-to-cart-button @click.prevent.stop :withTitle="withTitle" :release="release" :size=baseSize class="release__button-bar__add-to-cart"></add-to-cart-button>
  </div>
</template>

<script>
  import AddToCartButton from '../cart/AddToCartButton'
  import PlayReleaseButton from './PlayReleaseButton'

  export default {
    components: {AddToCartButton, PlayReleaseButton},
    props: {
      release: Object,
      size: {
        type: Number,
        default: 36
      },
      withTitle: {
        type: Boolean,
        default: true
      }
    },
    name: 'ReleaseButtonBar',
    data: function () {
      return {
        baseSize: this.size
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
