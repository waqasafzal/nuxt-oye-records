<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="page__header">
          <div class="search">
            {{ releasesTotal }} results for <strong>{{ query }}</strong>
          </div>
        </div>
        <template v-if="releaseResults">
          <release-list 
            :releases="releaseResults" 
            :loading="loadingReleases"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ReleaseList from '../releases/ReleaseList'
export default {
  name: 'QueryResultPage',
  components: { ReleaseList },
  props: {
    releasesTotal: {
      type: Number,
      default: null
    },
    query: {
      type: String,
      default: ''
    },
    releaseResults: {
      type: Array,
      default: () => []
    },
    loadingReleases: {
      type: Boolean,
      default: false
    }
  }
}
</script>
