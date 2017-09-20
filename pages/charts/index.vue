<template>
  <div class="row">
    <div class="col-12">
      <div class="page__header">Charts</div>
      <div class="row">
        <div class="col-12 col-md-8">
          <div class="release-list-summary">
            <div class="release-list-summary__header">
              <h3>DJ Charts - {{ currentMonth.name }}</h3>
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
              <h3>Staff Charts - {{ currentMonth.name }}</h3>
            </div>
            <div class="row">
              <chart-item :chart="chart.node" class="col-sm-12 col-md-6 charts-infobox"
                          :key="'chart-'+i"
                          v-for="(chart, i) in staffCharts.edges"></chart-item>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3 ml-md-auto">
          <div class="charts__overview__bestsellers">
            <div class="charts__overview__bestsellers__header">Bestseller {{ currentMonth.name }}</div>
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
                </div>
              </nuxt-link>
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

  const currentMonth = getCurrentMonth()

  export default {
    components: {ChartItem, PlayReleaseButton, ReleasePrice},
    name: 'ChartsIndex',
    data: function () {
      return {
        currentMonth: currentMonth
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
              }
            }
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
        bestsellers: charts.data.bestsellers
      }
    }
  }
</script>
