<template>
  <div 
    v-if="release" 
    :class="['release__button-bar', release.availability.status]">
    <div 
      v-if="release && hasTracks" 
      class="play">
      <play-release-button 
        :size="baseSize" 
        :release="release" 
        @click.prevent.stop/>
    </div>
    <add-to-cart-button 
      :with-title="withTitle" 
      :release="release" 
      :size="baseSize" 
      class="release__button-bar__add-to-cart" 
      @click.prevent.stop/>
  </div>
</template>

<script>
import AddToCartButton from '../cart/AddToCartButton'
import PlayReleaseButton from './PlayReleaseButton'

export default {
  name: 'ReleaseButtonBar',
  components: { AddToCartButton, PlayReleaseButton },
  props: {
    release: {
      type: Object,
      default: null
    },
    size: {
      type: Number,
      default: 36
    },
    withTitle: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      baseSize: this.size
    }
  },
  computed: {
    hasTracks() {
      var release = this.release
      return (
        release &&
        (release.hasTracks || (release.tracks && release.tracks.length > 0))
      )
    }
  }
}
</script>
