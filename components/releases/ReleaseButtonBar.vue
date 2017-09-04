<template>
  <div class="release__button-bar" v-if="release">
    <div class="play" v-if="release.tracks.length > 0">
      <play-release-button :size=baseSize :release="release"></play-release-button>
    </div>
    <add-to-cart-button :release="release" :size=baseSize class="release__button-bar__add-to-cart"></add-to-cart-button>
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
      }
    },
    name: 'ReleaseButtonBar',
    data: function () {
      return {
        baseSize: this.size
      }
    }
  }

</script>
