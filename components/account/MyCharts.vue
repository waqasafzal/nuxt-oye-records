<template>
  <div class="my-charts">
    <template v-if="editChartsMode">
      <charts-editor @charts-saved="$emit('charts-saved')"></charts-editor>
    </template>
    <template v-else>
      <table class="charts__table table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chart in charts.edges">
            <td class="chart-row__name"><nuxt-link :to="{name: 'charts-slug', params: {slug: chart.node.slug}}">{{getName(chart.node)}}</nuxt-link></td>
            <td>{{chart.node.date}}</td>
            <td class="chart-row__category">{{chart.node.category}}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex flex-column">
        <loading-spinner :loading="isLoading"></loading-spinner>
        <div class="d-flex flex-row">
          <button :class="['btn', 'secondary', 'btn-next', !hasNext ? 'disabled': '']" @click="loadMore">
            {{loadingText}}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import client from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import { getMonthFromString } from '~/utils/date'
  import { release } from '../graphql/releases'
  import LoadingSpinner from '~/components/shared/LoadingSpinner'
  import ChartsEditor from '../charts/ChartsEditor'

  export default {
    components: {ChartsEditor, LoadingSpinner},
    name: 'MyCharts',
    props: {
      'editChartsMode': {
        type: Boolean,
        default: false
      }
    },
    computed: {
      loadingText () {
        if (this.isLoading) {
          return 'Loading...'
        } else if (this.hasNext) {
          return 'Show more'
        } else {
          return 'No more charts to load'
        }
      }
    },
    data: function () {
      return {
        isLoading: false,
        hasNext: true,
        cursor: '',
        charts: []
      }
    },
    mounted () {
      this.loadMore()
    },
    methods: {
      getName (chart) {
        var name = `${chart.user.firstName}`
        if (chart.artist) {
          name = chart.artist.name
        }
        var chartName = chart.name || getMonthFromString(chart.createdAt).name
        return `${name}'s ${chartName} Charts`
      },
      loadMore () {
        var vm = this
        if (this.hasNext) {
          this.isLoading = true
          client.query({
            query: gql`query UserCharts($after: String) {
              profile {
                charts(after: $after) {
                  edges {
                    node {
                      artist {
                        name
                      }
                      slug
                      createdAt
                      date
                      category
                      imageUrl
                      user {
                        firstName
                      }
                      releases {
                        release {
                          ...Release
                        }
                        pk
                        rank
                      }
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }
            }
            ${release}
            `,
            variables: {
              after: this.cursor
            }
          }).then(
            ({data}) => {
              var charts = data.profile.charts
              this.isLoading = false
              var edges = []
              if (vm.charts['edges']) {
                edges = vm.charts['edges']
              }
              vm.charts = {
                edges: [...edges, ...charts.edges],
                pageInfo: charts.pageInfo
              }
              vm.cursor = charts.pageInfo.endCursor
              vm.hasNext = charts.pageInfo.hasNextPage
            }
          )
        }
      }
    }
  }
</script>
