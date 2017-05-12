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
                <div class="col-sm-12 col-md-6 charts-infobox" v-for="chart in artistCharts.edges">
                  <img :src="chart.node.image"/>
                  <div class="charts-infobox__name">
                    <template v-if="chart.node.artist">
                      {{ chart.node.artist.name }}


                    </template>
                    <template v-else>
                      {{ chart.node.user.firstName }}


                    </template>
                    <template v-if="chart.node.name">
                      {{ chart.node.name }}


                    </template>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              No DJ Charts for {{ currentMonth.name }}


            </template>
            <div class="release-list-summary__header">
              <h3>Staff Charts - {{ currentMonth.name }}</h3>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-6 charts-infobox" v-for="chart in staffCharts.edges">
                <img :src="chart.node.image"/>
                <div class="charts-infobox__name">
                  <template v-if="chart.node.artist">
                    {{ chart.node.artist.name }}


                  </template>
                  <template v-else>
                    {{ chart.node.user.firstName }}


                  </template>
                  <template v-if="chart.node.name">
                    {{ chart.node.name }}


                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div>Bestseller - {{ currentMonth.name }}</div>
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
                user {
                  firstName
                }
                artist {
                  name
                }
                category
                name
              }
            }
          },
          staffCharts: charts(category:"staff", month: $month) {
            edges {
              node {
                user {
                  firstName
                }
                category
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
