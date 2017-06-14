<template>
  <div v-if="release">
  <nuxt-link :to="{name: 'releases-slug', params: { slug: release.slug }}">
    <div class="frontpage__weekly__item__content" v-if="release" :style="`background-image: url(${release.thumbnailUrl})`">
      <div class="feature-category">{{ category }}</div>
      <div class="frontpage__weekly__item__content__artist">{{ release.name }}</div>
      <div class="frontpage__weekly__item__content__title">{{ release.title }}</div>
      <release-button-bar :release="release"></release-button-bar>
    </div>
  </nuxt-link>
  </div>
</template>

<script>
  import PlayReleaseButton from '../releases/PlayReleaseButton'
  import ReleaseButtonBar from '../releases/ReleaseButtonBar'

  export default {
    name: 'WeekFeature',
    components: {ReleaseButtonBar, PlayReleaseButton},
    props: ['category', 'release'],
    data: function () {
      return {
        slug: this.featureReleaseId
      }
    }
  }
</script>
