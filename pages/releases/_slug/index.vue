<template>
  <div v-if="release">
    <div class="release-detail__header row">
      <div class="col-12">
        <div class="release-detail__back">
          <a href="#back" @click.prevent="back">
            <img src="~assets/images/arrow_right_grey.svg"/>
            Back
          </a>
        </div>
        <div class="release-detail__breadcrumb">
          <nuxt-link to="/">Home</nuxt-link>
          <template v-if="release.mainGenre">
            <span>/</span>
            <nuxt-link :to="{name: 'genres-slug', params: {slug: release.mainGenre.slug}}">{{ release.mainGenre.name }}</nuxt-link>
          </template>
          <template v-if="release.mainGenreSub && release.mainGenreSub.parentGenre">
            <span>/</span>
            <nuxt-link :to="{name: 'genres-slug-subslug', params: {slug: release.mainGenreSub.parentGenre.slug, subslug: release.mainGenreSub.slug}}">{{ release.mainGenreSub.name }}</nuxt-link>
          </template>
        </div>
      </div>
    </div>
    <div class="row product__main">
      <div id="product-schema-component">
        <json-ld-product-schema :release="release"></json-ld-product-schema>
      </div>
      <div class="col-md-6 col-12">
        <div class="product__gallery">
          <img class="d-block img-fluid"
               :src="release.thumbnailUrl" alt=""/>
        </div>
      </div>
      <div class="col-md-6 col-12 product__info">
        <h2
            class="product__info__artist">{{ release.artistFirstName }} {{ release.artistLastName }}</h2>
        <h2 class="product__info__name">{{ release.title }}</h2>
        <h5 class="product__info__label">{{ release.label }}</h5>

        <div class="product__info__price">
          <release-price :price="release.price"></release-price>
        </div>
        <release-button-bar :size=48 :release="release"></release-button-bar>
        <div class="product__info__tax-included">Tax included, Shipping not included</div>
        <release-description :release="release"></release-description>
        <div class="product__info__footer">
          <div :class="['product__info__availability', releaseStatus]"></div>
          <span>{{ inStockMessage }}</span>
          <span class="pressing">{{ release.format }} | {{ year }} - {{ pressingRegion }} | {{ release.condition
            }}</span>
        </div>
      </div>
    </div>
    <hr/>
    <div class="row product__secondary-infos">
      <div class="col-md-6 col-12 product__details">
        <h4>Share Article</h4>
        <social-sharing class="social-sharing" :url="currentRoute + '?autoplay=1'"
                        :title="pageTitle"
                        :description="release.description"
                        v-cloak inline-template>
          <div>
            <network network="facebook">
              <img class="fa fa-facebook" src="~assets/images/Facebook.svg"/>
            </network>
            <network network="twitter">
              <img class="fa fa-twitter" src="~assets/images/Twitter.svg"/>
            </network>
          </div>
        </social-sharing>
        <h4>Details</h4>
        <div class="product__details__detail">
          <span>Genre</span>
          <p>
            <span :key="genre.pk" v-for="(genre, i) in release.genres">
              <span>{{ i > 0 ? ' / ' : ''}}</span>
              <template v-if="genre.parentGenre">
                <nuxt-link :to="{name: 'genres-slug-subslug', params: {slug: genre.parentGenre.slug, subslug: genre.slug}}">{{ genre.name}}</nuxt-link>
              </template>
              <template v-else-if="genre.subgenres">
                <nuxt-link :to="{name: 'genres-slug', params: {slug: genre.slug}}">{{ genre.name}}</nuxt-link>
              </template>
            </span>
          </p>
        </div>
        <div class="product__details__detail">
          Release Date
          <p>{{ release.releasedAt }}</p>
        </div>
        <div v-if="release.catalogueNumber" class="product__details__detail">
          Cat No
          <p>{{ release.catalogueNumber }}</p>
        </div>
        <div v-if="release.chartedBy && release.chartedBy.length > 0" class="product__details__detail">
          <span>Charted By</span>
          <p>
            <span :key="'chart-' + i"
                  v-for="(publisher, i) in release.chartedBy">
              {{ i > 0 ? ' / ' : ''}}
              <nuxt-link :to="{name: 'charts-slug', params: {slug: publisher.currentCharts.slug}}">{{ publisher.name
              }}</nuxt-link>
            </span>
          </p>
        </div>
      </div>
      <div class="col-md-6 col-12 release-detail__tracklist">
        <h4>
          <template v-if="release.tracks.length > 0">
            <span>Tracklist</span>
          </template>
          <template v-else>
            <span>No Tracklist Available</span>
          </template>
        </h4>
        <div class="release-detail__tracklist__item"
             v-on:click="playTrack(track)"
             :key="i" v-for="(track, i) in release.tracks"
        >
          <template v-if="track.releasePosition">
            <div class="release-detail__tracklist__position">{{ track.releasePosition }}</div>
          </template>
          <template v-if="track.title">{{ track.title }}</template>
          <template v-else>Track {{track.position + 1}}</template>
          <div class="release-detail__tracklist__item play">
            <play-release-button :size="24" :displayOnly="true" :release="release" background="transparent"
                                 foreground="#313532"></play-release-button>
          </div>
        </div>
      </div>
    </div>
    <template v-if="release.artistReleases.length > 0">
      <div class="row">
        <div class="col-12">
          <h3 class="release-detail__related__header">More from <nuxt-link :to="{name: 'artists-query', params: {query: release.name }}">{{ release.name }}</nuxt-link></h3>
        </div>
      </div>
      <release-list :releases="release.artistReleases"></release-list>
    </template>
    <template v-if="release.labelReleases.length > 0">
      <div class="row">
        <div class="col-12">
          <h3 class="release-detail__related__header">More from <nuxt-link :to="{name: 'labels-query', params: {query: release.label }}">{{ release.label }}</nuxt-link></h3>
        </div>
      </div>
      <release-list :releases="release.labelReleases"></release-list>
    </template>
    <template v-if="release.soldReleases.length > 0">
      <div class="row">
        <div class="col-12">
          <h3 class="release-detail__related__header">Other people bought</h3>
        </div>
      </div>
      <release-list :releases="release.soldReleases"></release-list>
    </template>
  </div>
</template>

<script>
  import Vue from 'vue'
  import ReleasePrice from '../../../components/releases/ReleasePrice.vue'
  import JsonLdProductSchema from '../../../components/releases/JsonLdProductSchema.vue'
  import ReleaseButtonBar from '../../../components/releases/ReleaseButtonBar'
  import ReleaseDescription from '../../../components/releases/ReleaseDescription'
  import PlayReleaseButton from '../../../components/releases/PlayReleaseButton'
  import { createReleaseDetailsQuery } from '../../../components/releases/queries'
  import ReleaseList from '../../../components/releases/ReleaseList'

  var SocialSharing = require('vue-social-sharing')
  Vue.use(SocialSharing)

  Vue.component('release-price', ReleasePrice)

  export default {
    name: 'ReleaseDetailView',
    props: ['id', 'slug', 'subslug'],
    components: {ReleaseList, PlayReleaseButton, ReleaseDescription, ReleaseButtonBar, JsonLdProductSchema},
    data: function () {
      return {
        release: '',
        ajaxRequest: false,
        quantity: '1',
        csrftoken: ''
      }
    },
    head () {
      return {
        meta: [
          {
            hid: 'title',
            property: 'og:title',
            content: this.pageTitle
          },
          {
            hid: 'url',
            property: 'og:url',
            content: this.currentRoute
          },
          {
            hid: 'type',
            property: 'og:type',
            content: 'music.album'
          },
          {
            hid: 'description',
            property: 'og:description',
            content: this.release && this.release.description
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: this.releaseImage
          }
        ]
      }
    },
    watch: {
      $route ({params, query}) {
        this.release = ''
        let slug = params.slug
        this.$apollo.query(createReleaseDetailsQuery(slug)).then(({data}) => {
          this.release = data.release
          if (query.autoplay === '1') {
            this.playRelease()
          }
        })
      }
    },
    async asyncData ({app, params}) {
      let {data} = await app.apollo.query(createReleaseDetailsQuery(params.slug))
      return {
        release: data.release
      }
    },
    methods: {
      onAddToCartSuccess () {
      },
      addToCart (pk) {
        this.$store.dispatch('addToCart', {
          app: this,
          pk: pk,
          quantity: this.quantity
        }).catch(e => console.log(e))
      },
      playTrack (track) {
        this.$store.dispatch('playTrack', {
          track: track
        }).then(track => {
        })
      },
      onAddToCartError () {
      },
      back () {
        this.$router.go(-1)
      },
      playRelease () {
        if (this.release.tracks) {
          this.$store.dispatch('playRelease', {
            release: this.release
          })
        }
      }
    },
    computed: {
      inStockMessage: function () {
        let status = this.release.availability.status
        var message = ''
        if (status === 'out' || status === 'upcoming') {
          if (status === 'out') {
            message = 'Out of stock'
          } else {
            message = 'Upcoming'
          }
        } else {
          if (status === 'one') {
            message = 'One copy left'
          } else if (status === 'few') {
            message = 'Few copies left'
          } else if (status === 'available') {
            message = 'In Stock'
          }
          if (message) {
            message = message + ', Shipping 1-2 Days'
          }
        }
        return message
      },
      releaseStatus: function () {
        let status = this.release.availability.status
        if (status === 'out' || status === 'upcoming') {
          return 'out'
        } else {
          return status
        }
      },
      pressingRegion: function () {
        return 'EU'
      },
      year: function () {
        if (this.release) {
          let releasedAt = this.release.releasedAt
          if (releasedAt) {
            return releasedAt.split('.')[2]
          }
        }
        return 2017
      },
      pageTitle: function () {
        return 'OYE Records - ' + this.release.artistFirstName + ' ' + this.release.artistLastName + ' - ' + this.release.title
      },
      currentRoute: function () {
        return __API__ + this.$route.path
      },
      releaseImage: function () {
        return this.release && __API__ + this.release.thumbnailUrl
      }
    },
    mounted () {
      let autoplay = this.$route.query.autoplay
      if (autoplay === '1') {
        this.playRelease()
      }
    }
  }
</script>
