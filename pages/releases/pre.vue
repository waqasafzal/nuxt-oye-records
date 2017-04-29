<template>
  <releases-page :status="status" :pageSize="pageSize"></releases-page>
</template>

<script>
  import Vue from 'vue'

  import ReleasePage from '../../components/releases/ReleasePage.vue'

  Vue.component('releases-page', ReleasePage)

  export default {
    name: 'PreOrderPage',
    data: function () {
      return {
        pageSize: 5,
        status: 'pre'
      }
    }
  }
</script>
