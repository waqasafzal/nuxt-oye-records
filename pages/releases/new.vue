<template>
  <releases-page :status="status" :pageSize="pageSize" :releases="releases" :loading="loading"></releases-page>
</template>

<script>
  import Vue from 'vue'
  import {ReleasePagingMixin} from '../../components/releases/releases-paging-mixin'

  import ReleasePage from '../../components/releases/ReleasePage.vue'

  const filterBy = JSON.stringify({
    status: 'new'
  })

  Vue.component('releases-page', ReleasePage)

  export default {
    name: 'NewReleases',
    mixins: [ReleasePagingMixin(filterBy)],
    data: function () {
      return {
        pageSize: 5,
        status: 'new'
      }
    }
  }
</script>
