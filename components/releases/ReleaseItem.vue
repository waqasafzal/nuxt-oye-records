<template>
  <div>
    <json-ld-product-schema :release="release"></json-ld-product-schema>
    <nuxt-link :to="{ name: 'releases-slug', params: { slug: release.slug }}">
      <div class="text-left list-item">
        <div class="resizable-list-item-outer">
          <div class="resizable-list-item-inner">
            <div class="release-list-image">
              <div class="genre" v-if="release.mainGenre">{{release.mainGenre.name}}</div>
              <img class="img-responsive" :src="release.thumbnailUrl" alt=""/>
              <play-release-button :size="size" class="release-list-play" :release="release"></play-release-button>
              <div class="format">{{release.format}}</div>
            </div>
            <div class="release-list-info">
              <div class="release-list-info__header">
                <div class="release-list-info__header__artist-name"
                     :title="release.artist_first_name">{{release.artistFirstName}} {{release.artistLastName}}
                </div>
                <releaseprice :price="release.price" :availability="release.availability"
                              class="release-list-info__header__price"/>
              </div>
              <span class="release-list-info__release-title" :title="release.title">{{release.title}}</span>
              <span class="release-list-info__label">{{ release.label }}</span>
            </div>
            <add-to-cart-button :release="release" class="release__button-bar__add-to-cart release-list-add"></add-to-cart-button>

          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>

  import Vue from 'vue'
  import ReleasePrice from './ReleasePrice.vue'
  import JsonLdProductSchema from './JsonLdProductSchema.vue'
  import PlayReleaseButton from './PlayReleaseButton'
  import AddToCartButton from '../cart/AddToCartButton'

  Vue.component('releaseprice', ReleasePrice)

  export default {
    name: 'ReleaseItem',
    components: {AddToCartButton, PlayReleaseButton, JsonLdProductSchema},
    props: ['release'],
    data: function () {
      return {
        size: 48
      }
    },
    methods: {
      getSchema () {
        const release = this.$data.release
        let data = {
          '@context': 'http://schema.org/',
          '@type': 'MusicAlbum',
          'name': release.title,
          'description': release.artistFirstName + ' ' + release.artistLastName,
          'url': release.url,
          'image': release.thumbnailUrl,
          'potentialAction': {
            '@type': 'ListenAction',
            'target': [
              {
                '@type': 'EntryPoint',
                'urlTemplate': release.url + '?autoplay=true',
                'actionPlatform': [
                  'http://schema.org/DesktopWebPlatform',
                  'http://schema.org/IOSPlatform',
                  'http://schema.org/AndroidPlatform'
                ],
                'InLanguage': 'English'
              }
            ],
            'expectsAcceptanceOf': {
              '@type': 'Offer',
              'priceCurrency': release.price.currency,
              'price': release.price.gross,
              'eligibleRegion': [
                {
                  '@type': 'Country',
                  'name': 'DE'
                },
                {
                  '@type': 'Country',
                  'name': 'AT'
                },
                {
                  '@type': 'Country',
                  'name': 'CH'
                },
                {
                  '@type': 'Country',
                  'name': 'FR'
                },
                {
                  '@type': 'Country',
                  'name': 'GB'
                }
              ]
            }
          }
        }
        return JSON.stringify(data)
      }
    }
  }
</script>
