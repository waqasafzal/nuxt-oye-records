<template>
  <div>
    <div 
      v-if="releases && (!fixed || !loading)"
      class="row">
      <release-item 
        v-for="(release, i) in getReleases(releases)"
        :release="getRelease(release)"
        :key="i"
        class="col-6 col-sm-6 col-md-3 col-lg-2 product-list"/>
    </div>
    <loading-spinner :loading="loading"/>
  </div>
</template>

<script>
import Vue from 'vue'
import { releasesConnections } from '../graphql/releases'

import LoadingSpinner from '../shared/LoadingSpinner.vue'
import ReleaseItem from './ReleaseItem.vue'

Vue.component('release-item', ReleaseItem)
Vue.component('loading-spinner', LoadingSpinner)

export default {
  name: 'ReleaseList',
  props: {
    releases: {
      type: [Object, Array],
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  fragments: {
    releases: releasesConnections
  },
  methods: {
    getRelease(item) {
      return item.node || item.release || item
    },
    getReleases(items) {
      return items.edges || items
    }
  },
}
</script>
