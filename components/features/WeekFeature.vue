<template>
  <div v-if="release">
    <nuxt-link class="d-none d-md-block" :to="{name: 'releases-slug', params: { slug: release.slug }}">
        <div class="frontpage__weekly__item__content d-flex flex-row" v-if="release">
          <div class="frontpage__weekly__item__info">
            <div class="feature-category">{{ category }}</div>
            <div class="frontpage__weekly__item__content__artist">{{ release.name }}</div>
            <div class="frontpage__weekly__item__content__title">{{ release.title }}</div>
            <release-button-bar :release="release"></release-button-bar>
          </div>
          <div class="frontpage__weekly__item__image">
            <img :src="release.featureImageUrl" />
          </div>
        </div>
    </nuxt-link>
    <nuxt-link :to="{name: 'releases-slug', params: { slug: release.slug }}" class="d-md-none">
        <div class="mobile frontpage__weekly__item__content">
          <img class="feature-image" :src="release.featureImageUrl" />
          <div class="d-flex release-name">
            <div class="feature-category">{{ category }}</div>
            <div class="artist">{{release.name}}</div>
            <div class="title">{{release.title}}</div>
            <release-button-bar :size=48 :release="release" ></release-button-bar>
          </div>
        </div>
    </nuxt-link>
  </div>
</template>

<script>
  import PlayReleaseButton from '../releases/PlayReleaseButton'
  import ReleaseButtonBar from '../releases/ReleaseButtonBar'
//  import { mapGetters } from 'vuex'
  import AddToCartButton from '../cart/AddToCartButton'

  export default {
    name: 'WeekFeature',
    components: {AddToCartButton, ReleaseButtonBar, PlayReleaseButton},
    props: ['category', 'release'],
    data: function () {
      return {
        slug: this.featureReleaseId
      }
    },
    computed: {
      contentStyle () {
        return `background-image: url(${this.release.featureImageUrl})`
      }
//      isMobile () {
//        return ``
//      },
//      ...mapGetters(['isMobile'])
    }
  }
</script>
