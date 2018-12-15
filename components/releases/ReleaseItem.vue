<template>
  <div>
    <json-ld-product-schema :release="release"/>
    <nuxt-link :to="{ name: 'releases-slug', params: { slug: release.slug }}">
      <div class="d-none d-md-flex text-left list-item">
        <div class="resizable-list-item-outer">
          <div class="resizable-list-item-inner">
            <div class="release-list-image">
              <div 
                v-if="displayGenre" 
                class="genre" 
                @click.prevent="onGenreClick(displayGenre)">
                <span>{{ displayGenre.name }}</span>
              </div>
              <img 
                :src="release.thumbnailUrl" 
                class="img-responsive" 
                alt="">
              <play-release-button 
                :size="size" 
                :release="release" 
                background="#30C46C"
                class="release-list-play"/>
              <div class="format">{{ release.format }}</div>
            </div>
            <div class="release-list-info">
              <div class="release-list-info__header">
                <div 
                  class="release-list-info__header__artist-name"
                  @click.prevent="$router.push({name: 'artists-query', params: {query: release.name}})">
                  {{ release.artistFirstName }} {{ release.artistLastName }}
                </div>
                <releaseprice 
                  :price="release.price"
                  class="release-list-info__header__price"/>
              </div>
              <span class="release-list-info__release-title">{{ release.title }}</span>
              <span 
                class="release-list-info__label"
                @click.prevent="$router.push({name: 'labels-query', params: {query: release.label }})">{{ release.label }}</span>
            </div>
            <add-to-cart-button 
              :release="release"
              class="release__button-bar__add-to-cart release-list-add"/>

          </div>
        </div>
      </div>
      <div class="d-md-none text-left list-item">
        <div class="list-item-outer">
          <div class="resizable-list-item-inner">
            <div class="release-list-image">
              <div 
                v-if="release.mainGenre" 
                class="genre" 
                @click.prevent="onGenreClick(release.mainGenre)"><span>{{ release.mainGenre.name }}</span>
              </div>
              <img 
                :src="release.thumbnailUrl" 
                class="img-responsive" 
                alt="">
              <div class="format">{{ release.format }}</div>
              <!--<play-release-button background="#313532" :size=42 class="release-list-play"-->
              <!--:release="release"></play-release-button>-->
              <release-button-bar 
                :with-title="false" 
                :release="release" 
                class="release-list-play"/>
            </div>
            <div class="release-list-info">
              <div class="release-list-info__header">
                <div 
                  class="release-list-info__header__artist-name"
                  @click.prevent="$router.push({name: 'artists-query', params: {query: release.name}})">
                  {{ release.artistFirstName }} {{ release.artistLastName }}
                </div>
                <releaseprice 
                  :price="release.price"
                  class="release-list-info__header__price"/>
              </div>
              <span class="release-list-info__release-title">{{ release.title }}</span>
              <span 
                class="release-list-info__label"
                @click.prevent="$router.push({name: 'labels-query', params: {query: release.label }})">{{ release.label }}</span>
            </div>
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
import ReleaseButtonBar from './ReleaseButtonBar'

Vue.component('releaseprice', ReleasePrice)

export default {
  name: 'ReleaseItem',
  components: {
    ReleaseButtonBar,
    AddToCartButton,
    PlayReleaseButton,
    JsonLdProductSchema
  },
  props: {
    release: {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {
      size: 48
    }
  },
  computed: {
    displayGenre() {
      const mainGenreSub = this.release.mainGenreSub
      return mainGenreSub || this.release.mainGenre
    }
  },
  methods: {
    onGenreClick(genre) {
      this.$router.push({ name: 'genres-slug', params: { slug: genre.slug } })
    },
    getSchema() {
      const release = this.$data.release
      let data = {
        '@context': 'http://schema.org/',
        '@type': 'MusicAlbum',
        name: release.title,
        description: release.artistFirstName + ' ' + release.artistLastName,
        url: release.url,
        image: release.thumbnailUrl,
        potentialAction: {
          '@type': 'ListenAction',
          target: [
            {
              '@type': 'EntryPoint',
              urlTemplate: release.url,
              actionPlatform: [
                'http://schema.org/DesktopWebPlatform',
                'http://schema.org/IOSPlatform',
                'http://schema.org/AndroidPlatform'
              ],
              InLanguage: 'English'
            }
          ],
          expectsAcceptanceOf: {
            '@type': 'Offer',
            priceCurrency: release.price.currency,
            price: release.price.gross,
            eligibleRegion: [
              {
                '@type': 'Country',
                name: 'DE'
              },
              {
                '@type': 'Country',
                name: 'AT'
              },
              {
                '@type': 'Country',
                name: 'CH'
              },
              {
                '@type': 'Country',
                name: 'FR'
              },
              {
                '@type': 'Country',
                name: 'GB'
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
