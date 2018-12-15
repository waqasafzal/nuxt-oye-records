<template>
  <div v-if="release">
    <nuxt-link 
      :to="{name: 'releases-slug', params: { slug: release.slug }}" 
      class="d-none d-md-block">
      <div 
        v-if="release" 
        class="frontpage__weekly__item__content d-flex flex-row">
        <div class="frontpage__weekly__item__info">
          <div class="feature-category">{{ category }}</div>
          <div class="frontpage__weekly__item__content__artist">{{ release.name }}</div>
          <div class="frontpage__weekly__item__content__title">{{ release.title }}</div>
          <release-button-bar :release="release"/>
        </div>
        <div class="frontpage__weekly__item__image">
          <img :src="release.featureImageUrl" >
        </div>
      </div>
    </nuxt-link>
    <nuxt-link 
      :to="{name: 'releases-slug', params: { slug: release.slug }}" 
      class="d-md-none">
      <div class="mobile frontpage__weekly__item__content">
        <img 
          :src="release.featureImageUrl" 
          class="feature-image" >
        <div class="d-flex release-name">
          <div class="feature-category">{{ category }}</div>
          <div class="artist">{{ release.name }}</div>
          <div class="title">{{ release.title }}</div>
          <release-button-bar 
            :size="48" 
            :release="release" />
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import PlayReleaseButton from '../releases/PlayReleaseButton'
import ReleaseButtonBar from '../releases/ReleaseButtonBar'
import AddToCartButton from '../cart/AddToCartButton'

export default {
  name: 'WeekFeature',
  components: { AddToCartButton, ReleaseButtonBar, PlayReleaseButton },
  props: {
    category: {
      type: String,
      default: null
    },
    release: {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {
      slug: this.featureReleaseId
    }
  },
  computed: {
    contentStyle() {
      return `background-image: url(${this.release.featureImageUrl})`
    }
  }
}
</script>
