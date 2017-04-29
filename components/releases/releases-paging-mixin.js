import {getReleaseListColumnNumber} from '../utils'
import ReleaseList from '../releases/ReleaseList.vue'
import gql from 'graphql-tag'

export const ReleasePagingMixin = {
  props: {
    pageSize: {
      type: Number,
      default: 5
    }
  },
  data: function () {
    let pageSize = this.pageSize || 1
    return {
      count: pageSize * getReleaseListColumnNumber(),
      pageItems: this.pageSize * getReleaseListColumnNumber(),
      loading: false,
      loadingQueriesCount: 0,
      releases: [],
      cursor: null,
      showMoreEnabled: false
    }
  },
  computed: {
    filterBy: function () {
      return JSON.stringify({})
    }
  },
  apollo: {
    // Query with parameters
    releases: function () {
      return {
        query: gql`query Releases($first: Int!, $after: String, $filterBy: JSONString!) {
            releases(first: $first, after: $after, filterBy: $filterBy) {
                ...Releases
            }
        }
        ${ReleaseList.fragments.releases}
        `,
        variables: {
          first: 30,
          filterBy: this.filterBy,
          after: ''
        },
        loadingKey: 'loadingQueriesCount',
        watchLoading (isLoading, countModifier) {
          this.loading = isLoading
        }
      }
    }
  },
  mounted: function () {
    window.onscroll = this.checkInfiniteScrolling
  },
  methods: {
    checkInfiniteScrolling () {
      if (!this.loading && !(this.releases && this.releases.pageInfo && !this.releases.pageInfo.hasNextPage) &&
        (window.innerHeight + window.scrollY) >= this.$el.offsetHeight) {
        if (this.releases && this.releases.pageInfo && this.releases.pageInfo.hasNextPage) {
          this.loadMore()
        }
      }
    },
    loadMore () {
      if (this.releases) {
        let edges = this.releases.edges
        if (edges && edges.length > 0) {
          let lastEdgePos = edges.length - 1
          let lastEdge = edges[lastEdgePos]
          this.cursor = lastEdge.cursor
        }
      }

      this.loading = true

      // Fetch more data and transform the original result
      let releases = this.$apollo.queries.releases
      if (releases) {
        releases.fetchMore({
          // New variables
          variables: {
            first: this.count,
            filterBy: this.filterBy,
            after: this.cursor
          },
          // Transform the previous result with new data
          updateQuery: (previousResult, {fetchMoreResult}) => {
            this.loading = false
            let data = fetchMoreResult
            const newTags = data.releases.edges
            const hasMore = data.releases.pageInfo.hasNextPage

            this.showMoreEnabled = hasMore

            return {
              releases: {
                // Merging the tag list
                edges: [...previousResult.releases.edges, ...newTags],
                pageInfo: data.releases.pageInfo
              }
            }
          }
        })
      }
    }
  }
}
