<template>
  <div class="row">
    <div class="col-12">
      <div class="charts__header">
        <div class="page__header">{{ name }}'s {{ chartsName(chart) }} Charts {{ chartsYear(chart) }}</div>
        <div class="charts__share">
          <div class="charts__share__row">
            <div>Share Charts</div>
            <social-sharing class="social-sharing" :url="currentRoute"
                            :title="pageTitle"
                            :description="description"
                            v-cloak inline-template>
              <div>
                <network network="facebook">
                  <img class="fa fa-facebook" src="~assets/images/Facebook.svg" />
                </network>
                <network network="twitter">
                  <img class="fa fa-twitter" src="~assets/images/Twitter.svg" />
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
            <div class="publisher-label">
              <template v-if="chart.artist">{{ chart.artist.homeLabel }}</template>
              <template v-else>OYE Staff</template>
            </div>
          </div>
          <div class="charts__detail__more-charts">
            <div class="chart-related" v-for="relatedChart in chart.relatedCharts">
              <nuxt-link :to="{name: 'charts-slug', params: {slug: relatedChart.slug}}">
                <img src="../../../assets/images/arrow_right_grey.svg"/>
                {{ name }}'s {{ chartsName(relatedChart) }} Charts {{ chartsYear(relatedChart) }}
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
  import NuxtLink from '../../../.nuxt/components/nuxt-link'
  import { createChartsDetailQuery } from '../../../components/charts/queries'

  export default {
    components: {NuxtLink, ReleaseButtonBar, ReleasePrice},
    name: 'ChartsDetailPage',
    computed: {
      name () {
        return (this.chart.artist && this.chart.artist.name) || this.chart.user.firstName
      },
      pageTitle: function () {
        return `OYE Records - ${this.name}'s ${this.chartsName(this.chart)} Charts ${this.chartsYear(this.chart)}`
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
      var {data} = await client.query(createChartsDetailQuery(params.slug))
      return {
        chart: data.chart
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
