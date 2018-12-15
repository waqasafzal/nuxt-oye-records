<template>
  <releases-page 
    :status="status" 
    :page-size="pageSize" 
    :releases="releases" 
    :loading="loading" 
    :show-filter="false">DJ-Gear</releases-page>
</template>

<script>
import Vue from 'vue'

import {
  ApolloReleasesMixin,
  ReleasePagingMixin
} from '../components/releases/releases-paging-mixin'
import ReleasePage from '../components/releases/ReleasePage'

Vue.component('releases-page', ReleasePage)

const filterBy = JSON.stringify({
  status: 'any',
  formats: ['Merchandise', 'DJ Equipment', 'Magazine / Book', 'DVD']
})

export default {
  name: 'Merchandise',
  components: { ReleasePage },
  mixins: [
    ApolloReleasesMixin(filterBy),
    ReleasePagingMixin(filterBy)
  ],
  data: function() {
    return {
      status: 'any'
    }
  }
}
</script>
