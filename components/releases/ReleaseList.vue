<template>
  <div>
    <div class="row">
      <release-item :release="getRelease(release)"
                    v-for="(release, i) in getReleases(releases)"
                    :key="i"
                    class="col-12 col-sm-6 col-md-3 col-lg-2 product-list">
      </release-item>
    </div>
    <loading-spinner :loading="loading"></loading-spinner>
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
    props: ['releases', 'loading'],
    fragments: {
      releases: releasesConnections
    },
    methods: {
      getReleases (items) {
        let releases = items.edges || items
        return releases
      },
      getRelease (item) {
        let release = item.node || item.release || item
        return release
      }
    }
  }
</script>
