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
  import ReleaseList from '../components/releases/ReleaseList'
  import { getPageSize } from '../components/utils'

  export default {
    components: {ReleaseList},
    name: 'SearchPage',
    data: function () {
      return {
        loadingReleases: false,
        page: 0
      }
    },
    computed: {
      query () {
        let storeQuery = this.$store.state.search.query
        let q = this.$route.query.q
        return storeQuery || q || ''
      },
      releaseResults () {
        return this.$store.state.search.releases.results
      },
      releasesTotal () {
        return this.$store.state.search.releases.total
      }
    },
    mounted () {
      let storeQuery = this.$store.state.query
      if (this.query && (this.releaseResults.length < this.releasesTotal || typeof storeQuery === 'undefined')) {
        this.loadMore(false)
      }
      window.onscroll = this.checkInfiniteScrolling
    },
    methods: {
      checkInfiniteScrolling () {
        if (!this.loadingReleases && (this.releaseResults.length < this.releasesTotal) &&
          (window.innerHeight + window.scrollY) >= this.$el.offsetHeight) {
          this.loadMore(true)
        }
      },
      loadMore (append) {
        this.page += 1
        this.loadingReleases = true
        this.$store.dispatch('search', {
          type: 'releases',
          query: this.query,
          size: getPageSize(),
          page: this.page,
          append: append
        }).then(result => {
          this.loadingReleases = false
        })
      }
    }
  }
</script>
