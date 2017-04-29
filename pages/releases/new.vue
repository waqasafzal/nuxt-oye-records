<template>
  <releases-page :status="status" :pageSize="pageSize"></releases-page>
</template>

<script>
  import Vue from 'vue'

  import ReleasePage from '../../components/releases/ReleasePage.vue'

  Vue.component('releases-page', ReleasePage)

  export default {
    name: 'NewReleases',
    data: function () {
      return {
        pageSize: 5,
        status: 'new'
      }
    }
  }
</script>
