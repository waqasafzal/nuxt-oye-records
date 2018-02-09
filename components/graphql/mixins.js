import client from '~/plugins/apollo'

const SimplePagination = {
  data: function () {
    return {
      cursor: '',
      isLoading: false,
      paginationQuery: this.$options.pagination.query,
      extract: this.$options.pagination.extract,
      commit: this.$options.pagination.commit
    }
  },
  computed: {
    items () {
      return []
    },
    hasNext () {
      if (this.items.pageInfo) {
        return this.items.pageInfo.hasNextPage
      }
      return true
    },
    loadingText () {
      if (this.isLoading) {
        return 'Loading...'
      } else if (this.hasNext) {
        return 'Show more'
      } else {
        return 'No more items to load'
      }
    }
  },
  methods: {
    loadNextPage () {
      if (this.items) {
        let edges = this.items.edges
        if (edges && edges.length > 0) {
          let lastEdgePos = edges.length - 1
          let lastEdge = edges[lastEdgePos]
          this.cursor = lastEdge.cursor
        }
      }

      var vm = this
      if (this.hasNext) {
        this.isLoading = true
        let paginationQuery = this.paginationQuery()
        paginationQuery.variables['after'] = this.cursor
        client.query(paginationQuery).then(({data}) => {
          this.isLoading = false
          var edges = []
          if (vm.items && vm.items['edges']) {
            edges = vm.items['edges']
          }
          let pageGraph = this.extract(data)
          let items = {
            edges: [...edges, ...pageGraph.edges],
            pageInfo: pageGraph.pageInfo
          }
          this.commit(items)
        })
      }
    }
  },
  mounted: function () {
    this.loadNextPage()
  }
}

export { SimplePagination }
