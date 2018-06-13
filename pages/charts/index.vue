<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="page__header"><h1>Charts</h1></div>
        <div class="row">
          <div class="col-12 col-md-8">
            <div class="release-list-summary">
              <div class="release-list-summary__header">
                <h3>Bestseller</h3>
              </div>
              <div class="row">
                <chart-item :chart="monthChart"
                            class="col-sm-12 col-md-6 charts-infobox"
                ></chart-item>
                <chart-item :chart="weekChart"
                            class="col-sm-12 col-md-6 charts-infobox"
                ></chart-item>
              </div>
              <div class="release-list-summary__header">
                <h3>DJ Charts &mdash; {{ currentMonth.name }}</h3>
                <nuxt-link class="release-list-summary__header__more" :to="{name: 'charts-archive-category', params: {category: 'artist'}}">
                  <span>DJ Chart Archive</span>
                  <right-arrow></right-arrow>
                </nuxt-link>
              </div>
              <template v-if="artistCharts.edges.length > 0">
                <div class="row">
                  <chart-item :chart="chart.node"
                              class="col-sm-12 col-md-6 charts-infobox"
                              :key="'chart-'+i"
                              v-for="(chart, i) in artistCharts.edges"></chart-item>
                </div>
              </template>
              <template v-else>No DJ Charts for {{ currentMonth.name }}</template>
              <div class="release-list-summary__header">
                <h3>Staff Charts &mdash; {{ currentMonth.name }}</h3>
                <nuxt-link class="release-list-summary__header__more" :to="{name: 'charts-archive-category', params: {category: 'staff'}}">
                  <span>Staff Chart Archive</span>
                  <right-arrow></right-arrow>
                </nuxt-link>
              </div>
              <template v-if="staffCharts.edges.length > 0">
                <div class="row">
                  <chart-item :chart="chart.node" class="col-sm-12 col-md-6 charts-infobox"
                              :key="'chart-'+i"
                              v-for="(chart, i) in staffCharts.edges"></chart-item>
                </div>
              </template>
              <template v-else>No Staff Charts for {{ currentMonth.name }}</template>
            </div>
          </div>
          <div class="col-12 col-md-3 ml-md-auto">
            <div class="charts__overview__bestsellers">
              <div class="d-flex d-md-none bg"></div>
              <div @click="onPlayBestsellers" class="charts__overview__bestsellers__header">
                <span>Bestseller {{ currentMonth.name }}</span>
                <div class="play">
                  <play-svg fill="#313532"></play-svg>
                </div>
              </div>
              <!--<chart-detail-row :isBestseller="true" :chart="bestsellers"></chart-detail-row>-->
              <div>
                <nuxt-link :to="{name:'releases-slug', params: {slug: release.node.slug}}"
                           class="release-item"
                           :key="'release-'+i"
                           v-for="(release, i) in bestsellers.edges">
                  <div class="release-thumb-box">
                    <div class="release-thumb">
                      <img :src="release.node.thumbnailUrl"/>
                      <play-release-button :size="40" class="chart-list-play"
                                           :release="release.node"></play-release-button>
                    </div>
                  </div>
                  <div class="release-info">
                    <div class="release-artist">{{release.node.name}}</div>
                    <div class="release-title">{{release.node.title}}</div>
                  </div>
                  <div class="release-price-box">
                    <release-price class="release-price" :price="release.node.price"></release-price>
                    <add-to-cart-button :release="release.node"></add-to-cart-button>
                  </div>
                  <div class="mobile-button-bar d-flex d-md-none">
                    <release-button-bar @click.prevent.stop :release="release.node"></release-button-bar>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <div class="d-none d-md-block charts__detail__more-charts">
              <h3>Genre Charts &mdash; {{ currentMonth.name }}</h3>
              <div class="chart-related" v-for="genre in genres">
                <nuxt-link :to="{name: 'charts-slug', params: {slug:`bestseller-genre-${genre.slug}-${currentMonth.name.toLowerCase()}-${new Date().getFullYear()}`}}">
                  <right-arrow></right-arrow>
                  <span>{{genre.name}}</span>
                </nuxt-link>
              </div>
            </div>
          </div>
          <div class="d-flex d-md-none col-12 col-md-3 ml-md-auto">
            <div class="charts__detail__more-charts">
              <h3>Genre Charts &mdash; {{ currentMonth.name }}</h3>
              <div class="chart-related" v-for="genre in genres">
                <nuxt-link :to="{name: 'charts-slug', params: {slug:`bestseller-genre-${genre.slug}-${currentMonth.name.toLowerCase()}-${new Date().getFullYear()}`}}">
                  <right-arrow></right-arrow>
                  <span>{{genre.name}}</span>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getCurrentMonth } from '~/utils/date'
  import client from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import { releasePlayerInfo } from '../../components/graphql/releases'
  import ReleasePrice from '../../components/releases/ReleasePrice'
  import PlayReleaseButton from '../../components/releases/PlayReleaseButton'
  import ChartItem from '../../components/charts/ChartItem'
  import RightArrow from '../../components/shared/RightArrow'
  import PlaySvg from '../../components/shared/PlaySvg'
  import AddToCartButton from '../../components/cart/AddToCartButton'
  import ReleaseButtonBar from '../../components/releases/ReleaseButtonBar'

  const currentMonth = getCurrentMonth()

  export default {
    components: {
      ReleaseButtonBar,
      AddToCartButton,
      PlaySvg,
      RightArrow,
      ChartItem,
      PlayReleaseButton,
      ReleasePrice
    },
    name: 'ChartsIndex',
    data: function () {
      return {
        currentMonth: currentMonth
      }
    },
    head () {
      return {
        title: 'OYE Records - Charts',
        meta: [
          {
            hid: 'title',
            property: 'og:title',
            content: 'OYE Records - Charts'
          },
          {
            hid: 'image',
            property: 'og:image',
            content: `${__API__}${this.monthlyBestsellerThumb}`
          },
          {
            hid: 'description',
            name: 'description',
            content: 'Get inspired by our talented artist friends and staff picks.'
          }
        ]
      }
    },
    computed: {
      monthChart () {
        return {
          slug: `bestseller-${currentMonth.name.toLowerCase()}-${new Date().getFullYear()}`,
          artist: {
            name: `Bestseller - ${currentMonth.name}`
          },
          imageUrl: this.monthlyBestsellerThumb
        }
      },
      weekChart () {
        return {
          slug: `bestseller-week`,
          artist: {
            name: `Bestseller - Last 7 Days`
          },
          imageUrl: this.weeklyBestsellerThumb
        }
      }
    },
    methods: {
      onPlayBestsellers () {
        for (var nodeId in this.bestsellers.edges) {
          var bestseller = this.bestsellers.edges[nodeId].node
          this.$store.dispatch('playRelease', {
            release: bestseller,
            play: false
          })
        }
      }
    },
    async asyncData ({params}) {
      var charts = await client.query({
        query: gql`query Charts ($month: Int!, $filterBy: JSONString!) {
          artistCharts: charts(category:"artist", month: $month) {
            edges {
              node {
                pk
                slug
                user {
                  firstName
                }
                artist {
                  name
                  homeLabel
                }
                imageUrl
                name
              }
            }
          },
          staffCharts: charts(category:"staff", month: $month) {
            edges {
              node {
                pk
                slug
                user {
                  firstName
                }
                imageUrl
                name
              }
            }
          },
          bestsellers: releases(first: 10, filterBy: $filterBy) {
            edges {
              node {
                slug
                name
                thumbnailUrl(size:120)
                ...ReleasePlayerInfo
                price {
                    gross
                }
                availability {
                  status
                }
              }
            }
          }
          weeklyBestsellerThumb: defaultThumbnailUrl(imageType: "charts", tag: "weekly", width: 410, height: 208)
          monthlyBestsellerThumb: defaultThumbnailUrl(imageType: "charts", tag: "monthly", width: 410, height: 208)
          metaGenres {
            name
            slug
          }
        }
        ${releasePlayerInfo}`,
        variables: {
          month: currentMonth.value + 1,
          filterBy: JSON.stringify({
            status: 'bestsellers',
            year_month: `${new Date().getFullYear()}-${currentMonth.value + 1}`
          })
        }
      })
      return {
        artistCharts: charts.data.artistCharts,
        staffCharts: charts.data.staffCharts,
        bestsellers: charts.data.bestsellers,
        weeklyBestsellerThumb: charts.data.weeklyBestsellerThumb,
        monthlyBestsellerThumb: charts.data.monthlyBestsellerThumb,
        genres: charts.data.metaGenres
      }
    }
  }
</script>

<!--<style>-->
  <!---->
<!--</style>-->
