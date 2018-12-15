import { getReleaseListColumnNumber } from '../utils'
// import client from '../../plugins/apollo'
import { createReleaseListQuery } from './queries'
import {releaseFilterParams} from '../../utils/router'

const DEFAULT_PAGE_SIZE = 6

export const ApolloReleasesMixin = function(filterBy) {
  return {
    apollo: {
      releases: {
        ...createReleaseListQuery (),
        update: data => data.releases,
        prefetch({route, params}) {
          const filterParams = releaseFilterParams (params, route)
          Object.assign(filterParams, filterBy && JSON.parse(filterBy) || {})
          return {
            first: 30,
            after: '',
            filterBy: JSON.stringify(filterParams)
          }
        },
        manual: true,
        result({data, loading}) {
          if (!loading) {
            this.releases = data.releases
          } else {
            this.releases = undefined
          }
        },
        variables: {
          first: 30,
          after: '',
          filterBy: filterBy || JSON.stringify ({})
        }
      }
    },
    computed: {
      loading() {
        let loading = this.$apollo.queries.releases && this.$apollo.queries.releases.loading
        return loading
      }
    },
    data () {
      return {
        releases: null
      }
    }
  }
}

export const ReleasePagingMixin = function(filterBy) {
  return {
    props: {
      pageSize: {
        type: Number,
        default: DEFAULT_PAGE_SIZE
      }
    },
    data: function () {
      let pageSize = this.pageSize || 1
      // if this.filte
      return {
        count: pageSize * getReleaseListColumnNumber (),
        pageItems: this.pageSize * getReleaseListColumnNumber (),
        loadingQueriesCount: 0,
        cursor: null,
        filterOptions: {},
        genre: undefined,
        showMoreEnabled: false,
        filterBy: null
      }
    },

    mounted: function () {
      window.onscroll = this.checkInfiniteScrolling
    },
    methods: {
      reloadQuery() {
        this.filterBy = JSON.stringify (this.getLocalFilter())
        this.cursor = null
        this.releases = null
        this.loadMore ()
      },
      getLocalFilter() {
        let localFilter = this.filterBy
        if (!localFilter) {
          if (filterBy) {
            localFilter = JSON.parse (filterBy)
          } else {
            localFilter = {}
          }
        } else {
          localFilter = JSON.parse (localFilter)
        }

        if (this.genre) {
          if (this.genre.parentGenre) {
            localFilter['genres'] = [this.genre.slug]
            delete localFilter['metagenres']
            localFilter['isSubgenre'] = true
          } else {
            localFilter['metagenres'] = [this.genre.slug]
            delete localFilter['genres']
            localFilter['isSubgenre'] = false
          }
        }
        Object.assign(localFilter, this.filterOptions)
        return localFilter
      },
      onFilterChanged(filterOptions) {
        this.filterOptions = filterOptions
        this.reloadQuery ()
      },
      onGenreChanged(genre) {
        this.genre = genre
        this.reloadQuery ()
      },
      checkInfiniteScrolling() {
        if (
          this.$el.offsetHeight > 0 &&
          !this.loading &&
          !(
            this.releases &&
            this.releases.pageInfo &&
            !this.releases.pageInfo.hasNextPage
          ) &&
          window.innerHeight + window.scrollY >= this.$el.offsetHeight
        ) {
          if (
            this.releases &&
            this.releases.pageInfo &&
            this.releases.pageInfo.hasNextPage
          ) {
            this.loadMore ()
          }
        }
      },
      loadMore() {
        if (this.releases) {
          let edges = this.releases.edges
          if (edges && edges.length > 0) {
            let lastEdgePos = edges.length - 1
            let lastEdge = edges[lastEdgePos]
            this.cursor = lastEdge.cursor
          }
        }

        // Fetch more data and transform the original result
        let variables = {
          first: 30,
          filterBy: this.filterBy || filterBy,
          after: this.cursor
        }

        console.log('cursor ' + this.cursor)

        // if the cursor is set, this is a pagination query, so we fetch more
        if (this.cursor) {
          this.$apollo.queries.releases.fetchMore({
          variables,
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const releases = {
              edges: [...previousResult.releases['edges'], ...fetchMoreResult.releases.edges],
              pageInfo: fetchMoreResult.releases.pageInfo,
              __typename: previousResult.releases.__typename,
            }
            this.showMoreEnabled = fetchMoreResult.releases.pageInfo.hasNextPage

            return {
              // __typename: previousResult.releases.__typename,
              releases: releases,
              hasMore: this.showMoreEnabled
            }
          },
        })
        } else {
          this.$apollo.queries.releases.setVariables(variables)
        }
      }
    }
  }
}

