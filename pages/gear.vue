<template>
  <releases-page :status="status" :pageSize="pageSize" :releases="releases" :loading="loading" :showFilter="false">DJ-Gear</releases-page>
</template>

<script>
  import Vue from 'vue'

  import { ReleasePagingMixin } from '../components/releases/releases-paging-mixin'
  import ReleasePage from '../components/releases/ReleasePage'

  Vue.component('releases-page', ReleasePage)

  const filterBy = JSON.stringify({
    status: 'any',
    formats: ['Merchandise', 'DJ Equipment', 'Magazine / Book', 'DVD']
  })

  export default {
    components: {ReleasePage},
    name: 'Merchandise',
    mixins: [ReleasePagingMixin(filterBy)],
    data: function () {
      return {
        status: 'any',
        pageSize: 5
      }
    }
  }
</script>
