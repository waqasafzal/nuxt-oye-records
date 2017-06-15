<template>
  <query-result-page :releasesTotal="releasesTotal"
                     :query="query"
                     :loadingReleases="loadingReleases"
                     :releaseResults="releaseResults"></query-result-page>
</template>

<script>
  import ReleaseList from '../components/releases/ReleaseList'
  import { getPageSize } from '../components/utils'
  import QueryResultPage from '../components/search/QueryResultPage'

  export default {
    components: {QueryResultPage, ReleaseList},
    name: 'SearchPage',
    data: function () {
      return {
        page: 0
      }
    },
    computed: {
      loadingReleases () {
        return this.$store.state.search.loading > 0
      },
      query () {
        let storeQuery = this.$store.state.search.query
        let q = this.$route.query.q
        return storeQuery || q || ''
      },
      fields () {
        return this.$store.state.search.fields || this.$route.query.fields
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
        if (this.$el.offsetHeight > 0 && !this.loadingReleases && (this.releaseResults.length < this.releasesTotal) &&
          (window.innerHeight + window.scrollY) >= this.$el.offsetHeight) {
          this.loadMore(true)
        }
      },
      loadMore (append) {
        this.page += 1
        this.$store.dispatch('search', {
          type: 'releases',
          fields: this.fields,
          query: this.query,
          size: getPageSize(),
          page: this.page,
          append: append
        }).then(result => {
        })
      }
    }
  }
</script>
