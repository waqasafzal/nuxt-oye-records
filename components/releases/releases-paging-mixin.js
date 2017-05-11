import { getReleaseListColumnNumber } from '../utils'
import client from '../../plugins/apollo'
import { createReleaseListQuery } from './queries'

const DEFAULT_PAGE_SIZE = 5

export const ReleasePagingMixin = function (filterBy) {
  var asyncData = async function ({params}) {
    let {data} = await client.query(createReleaseListQuery({filterBy: filterBy}))
    return {
      releases: data.releases
    }
  }

  return {
    props: {
      pageSize: {
        type: Number,
        default: DEFAULT_PAGE_SIZE
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
    asyncData: asyncData,
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

        // Fetch more data and transform the original result
        this.loading = true
        var vm = this
        client.query(createReleaseListQuery({
          first: this.count,
          filterBy: filterBy,
          after: this.cursor
        })).then(({data}) => {
          vm.loading = false
          vm.releases = {
            edges: [...vm.releases['edges'], ...data.releases.edges],
            pageInfo: data.releases.pageInfo
          }
          vm.showMoreEnabled = data.releases.pageInfo.hasNextPage
        })
      }
    }
  }
}
