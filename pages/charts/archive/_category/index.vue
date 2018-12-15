<template>
  <div class="container-fluid">
    <div class="page__header">All {{ getHeader() }}</div>
    <div 
      v-if="sortedCharts" 
      class="charts-archive">
      <template v-for="yearMap in sortedCharts">
        <div
          v-for="(monthMap, month) in yearMap[1]"
          :key="`charts-archive-month-${month}`"
          class="charts-archive__month">
          <h2>{{ month }} &mdash; {{ yearMap[0] }}</h2>
          <div class="row">
            <chart-item 
              v-for="(chart, i) in monthMap"
              :chart="chart"
              :key="'chart-'+i"
              class="col-sm-6 col-md-4 charts-infobox"/>
          </div>
        </div>
      </template>
    </div>
    <loading-spinner :loading="loading"/>
  </div>
</template>

<script>
// import client from '~/plugins/apollo'
import ChartItem from '~/components/charts/ChartItem'
import { appendCharts } from '~/utils/charts'
import { createChartsArchiveQuery } from '~/components/graphql/charts'
import LoadingSpinner from '~/components/shared/LoadingSpinner'

export default {
  name: 'ChartsArchive',
  components: { LoadingSpinner, ChartItem },
  async asyncData({ params }) {
    let { data } = await this.$apollo.query(
      createChartsArchiveQuery(params.category)
    )
    let charts = data.charts
    return {
      charts: data.charts,
      chartsMap: appendCharts({}, charts.edges),
      hasNextPage: charts.pageInfo.hasNextPage,
      cursor: charts.pageInfo.endCursor
    }
  },
  data() {
    return {
      category: this.$route.params.category,
      charts: '',
      chartsMap: {},
      hasNextPage: true,
      cursor: null,
      loading: false
    }
  },
  computed: {
    sortedCharts() {
      let keysSorted = Object.keys(this.chartsMap).sort(function(a, b) {
        return b - a
      })
      let sortedCharts = []
      for (var j = 0; j < keysSorted.length; j++) {
        let year = keysSorted[j]
        sortedCharts.push([year, this.chartsMap[year]])
      }
      return sortedCharts
    }
  },
  mounted() {
    window.onscroll = this.checkInfiniteScrolling
  },
  methods: {
    getHeader() {
      let category = this.$route.params.category
      if (category === 'artist') {
        return 'DJ Charts'
      } else if (category === 'staff') {
        return 'Staff Charts'
      }
    },
    checkInfiniteScrolling() {
      if (
        this.$el.offsetHeight > 0 &&
        !this.loading &&
        this.hasNextPage &&
        window.innerHeight + window.scrollY >= this.$el.offsetHeight
      ) {
        this.loadMore()
      }
    },
    loadMore() {
      // Fetch more data and transform the original result
      this.loading = true
      var vm = this
      this.$apollo
        .query(createChartsArchiveQuery(this.category, this.cursor))
        .then(({ data }) => {
          vm.loading = false
          vm.chartsMap = appendCharts(vm.chartsMap, data.charts.edges)
          vm.hasNextPage = data.charts.pageInfo.hasNextPage
          vm.cursor = data.charts.pageInfo.endCursor
        })
    }
  }
}
</script>
