<template>
  <releases-page
    :status="status" 
    :page-size="pageSize" 
    :releases="releases" 
    :loading="loading" 
    @genre-selected="onGenreChanged"/>
</template>

<script>
import Vue from 'vue'

import ReleasePage from '../../components/releases/ReleasePage.vue'
import {
  ApolloReleasesMixin,
  ReleasePagingMixin
} from '../../components/releases/releases-paging-mixin'

Vue.component('releases-page', ReleasePage)

const filterBy = JSON.stringify({
  status: 'used'
})

export default {
  name: 'PreOrderPage',
  mixins: [
    ApolloReleasesMixin(filterBy),
    ReleasePagingMixin(filterBy)
  ],
  data: function() {
    return {
      status: 'used'
    }
  },
  head() {
    return {
      title: 'OYE Records - Used Vinyl',
      meta: [
        {
          hid: 'title',
          property: 'og:title',
          content: 'OYE Records - Used Vinyl'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Save money and dig for some lost exclusives.'
        }
      ]
    }
  }
}
</script>
