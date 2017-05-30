<template>
  <div class="row">
    <div class="col-12">
      <div class="page__header">
        <div class="search">
          {{ releasesTotal }} results for <strong>{{ query }}</strong>
        </div>
      </div>
      <template v-if="releaseResults">
        <release-list :releases="releaseResults" :loading="loadingReleases"></release-list>
      </template>
    </div>
  </div>
</template>

<script>
  import ReleaseList from '../releases/ReleaseList'
  export default {
    components: {ReleaseList},
    name: 'QueryResultPage',
    props: ['releasesTotal', 'query', 'releaseResults', 'loadingReleases']
  }
</script>
