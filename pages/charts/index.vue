<template>
  <div class="row">
    <div class="col-12">
      <div class="page__header">Charts</div>
      <div class="row">
        <div class="col-8">
          <div class="release-list-summary">
            <div class="release-list-summary__header">
              <h3>DJ Charts - {{ currentMonth.name }}</h3>
            </div>
            <template v-if="artistCharts.edges.length > 0">
              <div class="row">
                <nuxt-link :to="{name: 'charts-slug', params: {slug: chart.node.slug}}"
                           class="col-sm-12 col-md-6 charts-infobox"
                           :key="'chart-'+i"
                           v-for="(chart, i) in artistCharts.edges">
                  <img :src="chart.node.imageUrl"/>
                  <template v-if="chart.node.artist">
                    <div class="charts-infobox__name">{{ chart.node.artist.name }}</div>
                    <template v-if="chart.node.name">{{ chart.node.name }}</template>
                    <div class="charts-infobox__label">{{ chart.node.artist.homeLabel }}</div>
                  </template>
                  <template v-else>
                    <div class="charts-infobox__name">{{ chart.node.user.firstName }}</div>
                    <template v-if="chart.node.name">{{ chart.node.name }}</template>
                  </template>
                </nuxt-link>
              </div>
            </template>
            <template v-else>No DJ Charts for {{ currentMonth.name }}</template>
            <div class="release-list-summary__header">
              <h3>Staff Charts - {{ currentMonth.name }}</h3>
            </div>
            <div class="row">
              <nuxt-link :to="{name: 'charts-slug', params: {slug: chart.node.slug}}"
                         class="col-sm-12 col-md-6 charts-infobox"
                         :key="'staff-chart-'+i"
                         v-for="(chart, i) in staffCharts.edges">
                <img :src="chart.node.imageUrl"/>
                <div class="charts-infobox__name">
                  <template v-if="chart.node.artist">{{ chart.node.artist.name }}</template>
                  <template v-else>{{ chart.node.user.firstName }}</template>
                  <template v-if="chart.node.name">{{ chart.node.name }}</template>
                </div>
              </nuxt-link>
            </div>
          </div>
          <div class="col-4">
            <div>Bestseller - {{ currentMonth.name }}</div>
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

  const currentMonth = getCurrentMonth()

  export default {
    name: 'ChartsIndex',
    data: function () {
      return {
        currentMonth: currentMonth
      }
    },
    async asyncData ({params}) {
      var charts = await client.query({
        query: gql`query Charts ($month: Int!) {
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
          }
        }`,
        variables: {
          month: currentMonth.value
        }
      })
      return {
        artistCharts: charts.data.artistCharts,
        staffCharts: charts.data.staffCharts
      }
    }
  }
</script>
