<template>
  <div v-if="release">
    <nuxt-link :to="{name: 'releases-slug', params: { slug: release.slug }}">
      <template v-if="!$store.state.isSmallScreen">
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
      </template>
      <template v-else>
        <div class="d-flex row">
          <div class="col-6">
            <div class="feature">
              <img :src="release.thumbnailUrl"/>
            </div>
          </div>
          <div class="col-6" v-if="release">
            <div style="height: 100%" class="content d-flex flex-column justify-content-between">
              <div class="d-flex flex-column">
                <div>{{ category }}</div>
                <div >{{ release.name }}</div>
              </div>
              <div class="title block-with-text">{{ release.title }}</div>
              <div class="release-btn-bar d-flex flex-row">
                <play-release-button class="release-btn" :size=48 :release="release"></play-release-button>
                <add-to-cart-button class="release-btn" :size=48 :withTitle="false" :release="release"></add-to-cart-button>
              </div>
            </div>
            <!--<release-button-bar size="24" :release="release"></release-button-bar>-->
          </div>
        </div>
      </template>
    </nuxt-link>
  </div>
</template>

<script>
  import PlayReleaseButton from '../releases/PlayReleaseButton'
  import ReleaseButtonBar from '../releases/ReleaseButtonBar'
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
    }
  }
</script>
