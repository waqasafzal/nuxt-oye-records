<template>
  <div>
    <div class="page__header">All {{getHeader()}}</div>
    <div class="charts-archive" v-if="chartsMap">
      <template v-for="(yearMap, year) in chartsMap">
        <div class="charts-archive__month" v-for="(monthMap, month) in yearMap">
          <h2>{{month}} &mdash; {{year}}</h2>
          <div class="row">
            <chart-item :chart="chart"
                        class="col-sm-6 col-md-4 charts-infobox"
                        :key="'chart-'+i"
                        v-for="(chart, i) in monthMap"></chart-item>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import client from '~plugins/apollo'
  import ChartItem from '~/components/charts/ChartItem'
  import { appendCharts } from '~/utils/charts'
  import { createChartsArchiveQuery } from '~/components/graphql/charts'

  export default {
    components: {ChartItem},
    name: 'ChartsArchive',
    async asyncData ({params}) {
      let {data} = await client.query(createChartsArchiveQuery(params.category))
      let charts = data.charts
      return {
        charts: data.charts,
        chartsMap: appendCharts({}, charts.edges),
        hasNextPage: charts.pageInfo.hasNextPage,
        cursor: charts.pageInfo.endCursor
      }
    },
    data () {
      return {
        category: this.$route.params.category,
        charts: '',
        chartsMap: {},
        hasNextPage: true,
        cursor: null
      }
    },
    methods: {
      getHeader () {
        let category = this.$route.params.category
        if (category === 'artist') {
          return 'DJ Charts'
        } else if (category === 'staff') {
          return 'Staff Charts'
        }
      },
      checkInfiniteScrolling () {
        if (this.$el.offsetHeight > 0 && !this.loading && this.hasNextPage &&
          (window.innerHeight + window.scrollY) >= this.$el.offsetHeight) {
          this.loadMore()
        }
      },
      loadMore () {
        // Fetch more data and transform the original result
        this.loading = true
        var vm = this
        client.query(createChartsArchiveQuery(this.category, this.cursor)).then(
          ({data}) => {
            vm.chartsMap = appendCharts(vm.chartsMap, data.charts.edges)
            vm.hasNextPage = data.charts.pageInfo.hasNextPage
            vm.cursor = data.charts.pageInfo.endCursor
          }
        )
      }
    }
  }
</script>
