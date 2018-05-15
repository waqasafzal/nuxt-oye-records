<template>
  <div v-if="release">
    <nuxt-link :to="{name: 'releases-slug', params: { slug: release.slug }}">
        <div class="frontpage__weekly__item__content flex-row d-none d-lg-flex" v-if="release">
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
        <div class="frontpage__weekly__item__content d-md-none">
          <img :src="release.featureImageUrl" />
          <div class="d-flex release-name">
            <nuxt-link class="category" :to="{name: 'releases-new'}">
              <template v-if="release.availability.status === 'upcoming'">Coming Soon</template>
              <template v-else>New In Stock</template>
            </nuxt-link>
            <div class="artist">{{release.name}}</div>
            <div class="title">{{release.title}}</div>
            <release-button-bar :size="toInt72" :release="release" ></release-button-bar>
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
