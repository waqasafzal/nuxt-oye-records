<template>
  <div class="row">
    <div class="col-12">
      <div class="page__header">New Releases</div>
      <template v-if="releasedToday.edges.length > 0">
        <h3>Released Today</h3>
        <release-list :releases="releasedToday"></release-list>
      </template>
      <template v-if="releasedLast7.edges.length > 0">
        <h3>Released last 7 days</h3>
        <release-list :releases="releasedLast7"></release-list>
      </template>
      <template v-if="releasedLast30.edges.length > 0">
        <h3>Released last 30 days</h3>
        <release-list :releases="releasedLast30"></release-list>
      </template>
      <h3>All Releases</h3>
      <release-list id="releaselist" :releases="releases" :loading="loading"></release-list>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue'
  import {ReleasePagingMixin} from '../../components/releases/releases-paging-mixin'
  import client from '~/plugins/apollo'

  import ReleasePage from '../../components/releases/ReleasePage.vue'
  import { createReleaseListQuery } from '../../components/releases/queries'

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
    data: function () {
      return {
        pageSize: 5,
        status: 'new'
      }
    }
  }
</script>
