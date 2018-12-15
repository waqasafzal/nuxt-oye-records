<template>
  <releases-page
    :status="status" 
    :page-size="pageSize" 
    :releases="releases" 
    :loading="loading" 
    @genre-selected="onGenreChanged" 
    @filter-changed="onFilterChanged"/>
</template>

<script>
import Vue from 'vue'

import ReleasePage from '../../components/releases/ReleasePage.vue'
import {
  ApolloReleasesMixin,
  ReleasePagingMixin
} from '../../components/releases/releases-paging-mixin'

Vue.component('releases-page', ReleasePage)

const filterBy = JSON.stringify({ status: 'pre' })

export default {
  name: 'PreOrderPage',
  mixins: [
    ApolloReleasesMixin(filterBy),
    ReleasePagingMixin(filterBy)
  ],
  data: function() {
    return {
      status: 'pre'
    }
  },
  head() {
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
