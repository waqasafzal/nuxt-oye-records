<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="charts__header">
          <div class="page__header">
            {{ pageHeader }}
          </div>
          <div class="charts__share">
            <div class="charts__share__row">
              <div>Share Charts</div>
              <social-sharing 
                v-cloak 
                :url="currentRoute"
                :title="pageTitle"
                :description="description"
                class="social-sharing" 
                inline-template>
                <div>
                  <network network="facebook">
                    <img 
                      class="fa fa-facebook" 
                      src="~assets/images/Facebook.svg">
                  </network>
                  <network network="twitter">
                    <img 
                      class="fa fa-twitter" 
                      src="~assets/images/Twitter.svg">
                  </network>
                </div>
              </social-sharing>
            </div>
          </div>
        </div>
        <div class="charts__detail row">
          <div class="chart__detail__list col-12 col-md-8">
            <nuxt-link 
              v-for="(chartedRelease, i) in chart.releases"
              :key="'chart-item-'+i"
              :to="{name: 'releases-slug', params: {slug: chartedRelease.release.slug}}"
              class="charts__detail__item">
              <div class="charts__detail__rank">{{ chartedRelease.rank + 1 }}</div>
              <div class="charts__detail__thumb">
                <img :src="chartedRelease.release.thumbnailUrl">
              </div>
              <div class="charts__detail__info-box">
                <div class="release-artist-name">{{ artistName(chartedRelease.release) }}</div>
                <div class="release-title">{{ chartedRelease.release.title }}</div>
              </div>
              <div class="charts__detail__price d-none d-md-flex">
                <release-price :price="chartedRelease.release.price"/>
              </div>
              <div class="charts__detail__buttons">
                <release-button-bar :release="chartedRelease.release"/>
              </div>
            </nuxt-link>
          </div>
          <div class="charts__detail__more col-12 col-md-3 offset-md-1">
            <div class="charts__detail__publisher-box">
              <div class="publisher-image">
                <img :src="chart.imageUrl">
              </div>
              <div class="publisher-name">{{ name }}</div>
              <div 
                v-if="!isBestseller" 
                class="publisher-label">
                <template v-if="chart.artist">{{ chart.artist.homeLabel }}</template>
                <template v-else>OYE Staff</template>
              </div>
            </div>
            <div class="charts__detail__more-charts">
              <div
                v-for="(relatedChart, rci) in chart.relatedCharts"
                :key="`related-chart-${rci}`"
                class="chart-related">
                <nuxt-link :to="{name: 'charts-slug', params: {slug: relatedChart.slug}}">
                  <img src="../../../assets/images/arrow_right_grey.svg">
                  {{ possessive }} {{ chartsName(relatedChart) }} Charts {{ chartsYear(relatedChart) }}
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
// import client from '~/plugins/apollo'
import { getMonthFromString } from '~/utils/date'
import ReleasePrice from '../../../components/releases/ReleasePrice'
import ReleaseButtonBar from '../../../components/releases/ReleaseButtonBar'
import { createChartsDetailQuery } from '../../../components/charts/queries'
import gql from 'graphql-tag'
import { getMonthFromName } from '../../../utils/date'
import { releasePlayerInfo } from '../../../components/graphql/releases'
import { capitalizeFirstLetter } from '../../../utils/string'
import {bestsellerCharts} from '../../../components/graphql/charts'

export default {
  name: 'ChartsDetailPage',
  components: { ReleaseButtonBar, ReleasePrice },
  computed: {
    name() {
      return (
        (this.chart.artist && this.chart.artist.name) ||
        (this.chart.user && this.chart.user.firstName) ||
        ''
      )
    },
    possessive() {
      return `${this.name}${this.name.endsWith('s') ? "'" : "'s"}`
    },
    pageHeader: function() {
      if (this.isBestseller) {
        return `Bestseller \u2014 ${this.bestsellerHeader}`
      } else {
        return `${this.possessive} ${this.chartsName(
          this.chart
        )} Charts ${this.chartsYear(this.chart)}`
      }
    },
    pageTitle: function() {
      return `OYE Records \u2014 ${this.pageHeader}`
    },
    currentRoute() {
      return __API__ + this.$route.path
    },
    chartsImage() {
      return this.chart && __API__ + this.chart.imageUrl
    },
    description() {
      const chart = this.chart
      const chartItems = []
      for (let i = 0; i < chart.releases.length; i++) {
        let chartedRelease = chart.releases[i]
        let release = chartedRelease.release
        if (release) {
          chartItems.push(
            `${chartedRelease.rank + 1}. ${release.artistLastName} - ${
              release.title
            }`
          )
        }
      }
      return chartItems.join(', ')
    }
  },
  watch: {
    $route(options) {
      let params = options.params
      this.$apollo.query(createChartsDetailQuery(params.slug))
      .then(({ data }) => {
        this.chart = data.chart
      })
    }
  },
  methods: {
    artistName(release) {
      return release.artistFirstName
        ? release.artistFirstName + ' '
        : '' + release.artistLastName
    },
    chartsName(chart) {
      return chart.name ? chart.name : getMonthFromString(chart.createdAt).name
    },
    chartsYear(chart) {
      return chart.name ? '' : new Date(chart.createdAt).getFullYear()
    }
  },
  apollo: {

  },
  async asyncData({ app, params }) {
    const client = app.apolloProvider.clients.defaultClient
    const slug = params.slug
    const parts = slug.split('-')
    let imageTag = ''

    if (parts[0] === 'bestseller') {
      let filterBy = null
      let bestsellerHeader = ''
      if (parts[1] === 'genre') {
        const genreSlug = parts.slice(2, parts.length - 2).join('-')

        imageTag = 'monthly'
        const monthName = parts[parts.length - 2]
        const month = getMonthFromName(monthName)
        const year = parts[parts.length - 1]

        filterBy = JSON.stringify({
          status: 'bestsellers',
          metagenres: [genreSlug],
          year_month: `${year}-${month}`
        })
        const {data} = await client.query({
          query: gql`
            query GenreNames {
              metaGenres {
                name
                slug
              }
            }
          `
        })
        const genreName = data.metaGenres.find(x => x.slug === genreSlug).name
        // for (let j = 0; j < genreNameResponse.data.metaGenres.length; j++) {
        //   let genre = genreNameResponse.data.metaGenres[j]
        //   if (genre.slug === genreSlug) {
        //     genreName = genre.name
        //   }
        // }
        const capitalizedMonth = capitalizeFirstLetter(monthName)
        bestsellerHeader = `${genreName} \u2014 ${capitalizedMonth} ${year}`
      } else {
        const isWeekly = slug.endsWith('week')
        if (isWeekly) {
          imageTag = 'weekly'
          filterBy = JSON.stringify({
            status: 'bestsellers',
            period: 7
          })
          bestsellerHeader = 'Last 7 days'
        } else {
          imageTag = 'monthly'
          const monthName = parts[1]
          const year = parts[2]
          const month = getMonthFromName(monthName)
          filterBy = JSON.stringify({
            status: 'bestsellers',
            year_month: `${year}-${month}`
          })
          const capitalizedMonth = capitalizeFirstLetter(monthName)
          bestsellerHeader = `${capitalizedMonth} ${year}`
        }
      }
      const result = await client.query({
        query: bestsellerCharts,
        variables: {
          filterBy: filterBy,
          imageTag: imageTag
        }
      })
      const edges = result.data.releases.edges
      const releases = []
      for (let i = 0; i < edges.length; i++) {
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
      const { data } = await client.query(createChartsDetailQuery(slug))
      return {
        chart: data.chart,
        isBestseller: false
      }
    }
  },
  head() {
    return {
      title: this.pageTitle,
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
          hid: 'og:description',
          property: 'og:description',
          content: this.description
        },
        {
          hid: 'description',
          name: 'description',
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

<style>
.my-charts {
  width: 100%;
}
</style>
