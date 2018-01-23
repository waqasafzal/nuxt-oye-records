<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-12">
        <div class="page__header">
          <h1>New Releases</h1>

          <meta-genre-filter @slug-selected="onGenreChanged"></meta-genre-filter>
          <filter-results-options @filter-changed="onFilterOptionsChanged" class="float-right"></filter-results-options>
        </div>
        <div class="release-list-panel" v-if="releasedToday.edges.length > 0">
          <h3>Released Today</h3>
          <release-list :releases="releasedToday"></release-list>
        </div>
        <div class="release-list-panel" v-if="releasedLast7.edges.length > 0">
          <h3>Released last 7 days</h3>
          <release-list :releases="releasedLast7"></release-list>
        </div>
        <div class="release-list-panel" v-if="releasedLast30.edges.length > 0">
          <h3>Released last 30 days</h3>
          <release-list :releases="releasedLast30"></release-list>
        </div>
        <h3>All Releases</h3>
        <release-list id="releaselist" :releases="releases" :loading="loading"></release-list>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { ReleasePagingMixin } from '../../components/releases/releases-paging-mixin'
  import client from '~/plugins/apollo'

  import ReleasePage from '../../components/releases/ReleasePage.vue'
  import { createReleaseListQuery } from '../../components/releases/queries'
  import FilterResultsOptions from '../../components/shared/FilterResultsOptions'
  import MetaGenreFilter from '../../components/genres/MetaGenreFilter'

  const filterBy = JSON.stringify({
    status: 'new'
  })

  const filterByPeriod = function (period) {
    return JSON.stringify({
      status: 'new',
      period: period
    })
  }

  Vue.component('releases-page', ReleasePage)

  export default {
    components: {MetaGenreFilter, FilterResultsOptions},
    name: 'NewReleases',
    mixins: [ReleasePagingMixin(filterBy)],
    asyncData: async function ({params}) {
      let releasedTodayResults = await client.query(createReleaseListQuery({filterBy: filterByPeriod(1)}))
      let releasedLast7Results = await client.query(createReleaseListQuery({filterBy: filterByPeriod(7)}))
      let releasedLast30Results = await client.query(createReleaseListQuery({filterBy: filterByPeriod(30)}))
      let {data} = await client.query(createReleaseListQuery({filterBy: filterBy}))
      return {
        releasedToday: releasedTodayResults.data.releases,
        releasedLast7: releasedLast7Results.data.releases,
        releasedLast30: releasedLast30Results.data.releases,
        releases: data.releases
      }
    },
    watch: {
      filterBy (value) {
        let days = this.filterOptions.days

        this.releasedToday = {edges: []}
        this.releasedLast7 = {edges: []}
        this.releasedLast30 = {edges: []}
        if (days) {
          if (days >= 1) {
            client.query(createReleaseListQuery({filterBy: this.getFilterByPeriod(1)})).then(
              ({data}) => {
                this.releasedToday = data.releases
              }
            )
          }
          if (days >= 7) {
            client.query(createReleaseListQuery({filterBy: this.getFilterByPeriod(days)})).then(
              ({data}) => {
                this.releasedLast7 = data.releases
              }
            )
          }
          if (days >= 31) {
            client.query(createReleaseListQuery({filterBy: this.getFilterByPeriod(days)})).then(
              ({data}) => {
                this.releasedLast30 = data.releases
              }
            )
          }
        } else {
          client.query(createReleaseListQuery({filterBy: this.getFilterByPeriod(1)})).then(
            ({data}) => {
              this.releasedToday = data.releases
            }
          )
          client.query(createReleaseListQuery({filterBy: this.getFilterByPeriod(7)})).then(
            ({data}) => {
              this.releasedLast7 = data.releases
            }
          )
          client.query(createReleaseListQuery({filterBy: this.getFilterByPeriod(30)})).then(
            ({data}) => {
              this.releasedLast30 = data.releases
            }
          )
        }
      }
    },
    methods: {
      onFilterOptionsChanged (options) {
        this.onFilterChanged(options)
      },
      getFilterByPeriod (period) {
        let filterByDict = {
          status: 'new',
          period: period
        }
        if (this.filterBy) {
          filterByDict = JSON.parse(this.filterBy)
          filterByDict['period'] = period
        }
        return JSON.stringify(filterByDict)
      }
    },
    data: function () {
      return {
        pageSize: 5,
        status: 'new'
      }
    },
    head () {
      return {
        title: 'OYE Records - New Releases',
        meta: [
          {
            hid: 'title',
            property: 'og:title',
            content: 'OYE Records - New Releases'
          }
        ]
      }
    }
  }
</script>
