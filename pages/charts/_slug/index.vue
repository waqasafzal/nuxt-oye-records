<template>
  <div class="row">
    <div class="col-12">
      <div class="charts__header">
        <div class="page__header">
          {{ pageHeader }}
        </div>
        <div class="charts__share">
          <div class="charts__share__row">
            <div>Share Charts</div>
            <social-sharing class="social-sharing" :url="currentRoute"
                            :title="pageTitle"
                            :description="description"
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
          </div>
        </div>
      </div>
      <div class="charts__detail row">
        <div class="chart__detail__list col-12 col-md-8">
          <nuxt-link class="charts__detail__item"
                     :key="'chart-item-'+i"
                     v-for="(chartedRelease, i) in chart.releases"
                     :to="{name: 'releases-slug', params: {slug: chartedRelease.release.slug}}">
            <div class="charts__detail__rank">{{chartedRelease.rank + 1}}</div>
            <div class="charts__detail__thumb">
              <img :src="chartedRelease.release.thumbnailUrl"/>
            </div>
            <div class="charts__detail__info-box">
              <div class="release-artist-name">{{ artistName(chartedRelease.release) }}</div>
              <div class="release-title">{{ chartedRelease.release.title }}</div>
            </div>
            <div class="charts__detail__price">
              <release-price :price="chartedRelease.release.price"></release-price>
            </div>
            <div class="charts__detail__buttons">
              <release-button-bar :release="chartedRelease.release"></release-button-bar>
            </div>
          </nuxt-link>
        </div>
        <div class="charts__detail__more col-12 col-md-3 offset-md-1">
          <div class="charts__detail__publisher-box">
            <div class="publisher-image">
              <img :src="chart.imageUrl"/>
            </div>
            <div class="publisher-name">{{ name }}</div>
            <div class="publisher-label" v-if="!isBestseller">
              <template v-if="chart.artist">{{ chart.artist.homeLabel }}</template>
              <template v-else>OYE Staff</template>
            </div>
          </div>
          <div class="charts__detail__more-charts">
            <div class="chart-related" v-for="relatedChart in chart.relatedCharts">
              <nuxt-link :to="{name: 'charts-slug', params: {slug: relatedChart.slug}}">
                <img src="../../../assets/images/arrow_right_grey.svg"/>
                {{ possessive }} {{ chartsName(relatedChart) }} Charts {{ chartsYear(relatedChart) }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import client from '~/plugins/apollo'
  import { getMonthFromString } from '~/utils/date'
  import ReleasePrice from '../../../components/releases/ReleasePrice'
  import ReleaseButtonBar from '../../../components/releases/ReleaseButtonBar'
  import { createChartsDetailQuery } from '../../../components/charts/queries'
  import gql from 'graphql-tag'
  import { getMonthFromName } from '../../../utils/date'
  import { releasePlayerInfo } from '../../../components/graphql/releases'
  import { capitalizeFirstLetter } from '../../../utils/string'

  export default {
    components: {ReleaseButtonBar, ReleasePrice},
    name: 'ChartsDetailPage',
    computed: {
      name () {
        return (this.chart.artist && this.chart.artist.name) || this.chart.user && this.chart.user.firstName || ''
      },
      possessive () {
        return this.name + this.name.endsWith('s') ? '\'' : '\'s'
      },
      pageHeader: function () {
        if (this.isBestseller) {
          return `Bestseller \u2014 ${this.bestsellerHeader}`
        } else {
          return `${this.name}'s ${this.chartsName(this.chart)} Charts ${this.chartsYear(this.chart)}`
        }
      },
      pageTitle: function () {
        return `OYE Records \u2014 ${this.pageHeader}`
      },
      currentRoute () {
        return __API__ + this.$route.path
      },
      chartsImage () {
        return this.chart && __API__ + this.chart.imageUrl
      },
      description () {
        var chart = this.chart
        var chartItems = []
        for (var i = 0; i < chart.releases.length; i++) {
          let chartedRelease = chart.releases[i]
          let release = chartedRelease.release
          chartItems.push(`${chartedRelease.rank + 1}. ${release.artistLastName} - ${release.title}`)
        }
        return chartItems.join(', ')
      }
    },
    methods: {
      artistName (release) {
        return release.artistFirstName ? release.artistFirstName + ' ' : '' + release.artistLastName
      },
      chartsName (chart) {
        return chart.name || getMonthFromString(chart.createdAt).name
      },
      chartsYear (chart) {
        return new Date(chart.createdAt).getFullYear()
      }
    },
    watch: {
      $route (options) {
        let params = options.params
        client.query(createChartsDetailQuery(params.slug)).then(
          ({data}) => {
            this.chart = data.chart
          }
        )
      }
    },
    async asyncData ({params}) {
      let slug = params.slug
      var parts = slug.split('-')
      var monthName
      var year
      var month
      var imageTag = ''
      if (parts[0] === 'bestseller') {
        var filterBy = null
        var bestsellerHeader = ''
        if (parts[1] === 'genre') {
          imageTag = 'monthly'
          var genreSlug = parts.slice(2, parts.length - 2).join('-')
          monthName = parts[parts.length - 2]
          year = parts[parts.length - 1]
          month = getMonthFromName(monthName)
          filterBy = JSON.stringify({
            status: 'bestsellers',
            metagenres: [genreSlug],
            year_month: `${year}-${month}`
          })
          let genreNameResponse = await client.query({
            query: gql`query GenreNames {
                metaGenres {
                    name
                    slug
                }
            }`
          })
          let genreName = ''
          for (var j = 0; j < genreNameResponse.data.metaGenres.length; j++) {
            let genre = genreNameResponse.data.metaGenres[j]
            if (genre.slug === genreSlug) {
              genreName = genre.name
            }
          }
          bestsellerHeader = `${genreName} \u2014 ${capitalizeFirstLetter(monthName)} ${year}`
        } else {
          let isWeekly = slug.endsWith('week')
          if (isWeekly) {
            imageTag = 'weekly'
            filterBy = JSON.stringify({
              status: 'bestsellers',
              period: 7
            })
            bestsellerHeader = 'Last 7 days'
          } else {
            imageTag = 'monthly'
            monthName = parts[1]
            year = parts[2]
            month = getMonthFromName(monthName)
            filterBy = JSON.stringify({
              status: 'bestsellers',
              year_month: `${year}-${month}`
            })
            bestsellerHeader = `${capitalizeFirstLetter(monthName)} ${year}`
          }
        }
        var result = await client.query({
          query: gql`query Bestseller($filterBy: JSONString!, $imageTag: String!) {
            releases(first: 10, filterBy: $filterBy) {
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
              defaultThumbnailUrl(imageType: "charts", tag: $imageTag, width: 600, height: 384)
            }
          ${releasePlayerInfo}`,
          variables: {
            filterBy: filterBy,
            imageTag: imageTag
          }
        })
        var edges = result.data.releases.edges
        var releases = []
        for (var i = 0; i < edges.length; i++) {
          releases.push({
            rank: i,
            release: edges[i].node
          })
        }
        return {
          chart: {
            releases: releases,
            imageUrl: result.data.defaultThumbnailUrl
          },
          isBestseller: true,
          bestsellerHeader: bestsellerHeader
        }
      } else {
        var {data} = await client.query(createChartsDetailQuery(slug))
        return {
          chart: data.chart,
          isBestseller: false
        }
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
            content: 'music.playlist'
          },
          {
            hid: 'description',
            property: 'og:description',
            content: this.description
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: this.chartsImage
          }
        ]
      }
    }
  }
</script>
