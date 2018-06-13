<template>
  <releases-page @genre-selected="onGenreChanged" @filter-changed="onFilterChanged" :status="status" :pageSize="pageSize" :releases="releases" :loading="loading"></releases-page>
</template>

<script>
  import Vue from 'vue'

  import ReleasePage from '../../components/releases/ReleasePage.vue'
  import {ReleasePagingMixin} from '../../components/releases/releases-paging-mixin'

  Vue.component('releases-page', ReleasePage)

  const filterBy = JSON.stringify({
    status: 'pre'
  })

  export default {
    name: 'PreOrderPage',
    mixins: [ReleasePagingMixin(filterBy)],
    data: function () {
      return {
        pageSize: 5,
        status: 'pre'
      }
    },
    head () {
      return {
        title: 'OYE Records - Upcoming Releases',
        meta: [
          {
            hid: 'title',
            property: 'og:title',
            content: 'OYE Records - Upcoming Releases'
          },
          {
            hid: 'description',
            name: 'description',
            content: 'Stay fresh all the time and reserve whats hot tomorrow.'
          }
        ]
      }
    }
  }
</script>
