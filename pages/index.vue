<template>
  <div>
    <front-page-teasers 
      :featured-releases="featuredReleases"
      :single-release="singleOfTheWeek"
      :album-release="albumOfTheWeek"
    />
    <div class="container-fluid">
      <release-list-summary 
        :releases="newReleases" 
        :title="`New Releases`" 
        status="new"/>
      <release-list-summary 
        :releases="preReleases" 
        :title="`Coming Soon`" 
        status="pre"/>
      <div 
        v-if="charts && charts.edges.length > 0" 
        class="charts__summary">
        <h3><nuxt-link :to="{name: 'charts'}">Charts</nuxt-link></h3>
        <div class="row">
          <chart-item 
            v-for="(chart, i) in charts.edges" 
            :chart="chart.node" 
            :key="'chart-'+i" 
            class="col-12 col-sm-12 col-lg-3"/>
        </div>
      </div>
      <release-list-summary 
        :releases="backReleases" 
        :title="`Back In Stock`" 
        status="back"/>
    </div>
  </div>
</template>

<script>
import FrontPageTeasers from '../components/features/FrontPageTeasers'
import ReleaseListSummary from '../components/releases/ReleaseListSummary'
import { frontPageQueries } from '../components/graphql/releases'
import ChartItem from '../components/charts/ChartItem'

const filterByNew = JSON.stringify({ status: 'new', period: 14 })
const filterByBack = JSON.stringify({ status: 'back' })
const filterByPre = JSON.stringify({ status: 'pre' })

const filterParams = {
  filterByNew,
  filterByBack,
  filterByPre
}

export default {
  name: 'OyeIndex',
  components: { ChartItem, ReleaseListSummary, FrontPageTeasers },
  computed: {
    preReleases() {
      return this.FrontPageReleases && this.FrontPageReleases.preReleases
    },
    newReleases() {
      return this.FrontPageReleases && this.FrontPageReleases.newReleases
    },
    backReleases() {
      return this.FrontPageReleases && this.FrontPageReleases.backReleases
    },
    featuredReleases() {
      return this.FrontPageReleases && this.FrontPageReleases.features.features
    },
    singleOfTheWeek() {
      return (
        this.FrontPageReleases
        && this.FrontPageReleases.features.singleOfTheWeek
      )
    },
    albumOfTheWeek() {
      return (
        this.FrontPageReleases && this.FrontPageReleases.features.albumOfTheWeek
      )
    },
    charts() {
      return this.FrontPageReleases && this.FrontPageReleases.charts
    }
  },
  async asyncData({ app, params }) {
    const client = app.apolloProvider.clients.defaultClient
    let { data } = await client.query({
      query: frontPageQueries,
      variables: { ...filterParams }
    })

    return {
      FrontPageReleases: data
    }
  }
}
</script>
