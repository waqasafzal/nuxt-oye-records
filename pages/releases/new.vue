<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="page__header">
          <h1>New Releases {{ genre && genre.name }}</h1>

          <meta-genre-filter 
            class="d-none d-md-flex" 
            @genre-selected="onGenreSelected"/>
          <filter-results-options 
            class="d-none d-md-flex float-right"
            @filter-changed="onFilterOptionsChanged"/>
        </div>
        <release-filter-panel
          :filter-only="true"
          :meta-genres="genres" 
          :change-genre="typeof genre !== 'undefined'"
          class="d-flex d-md-none" 
          @genre-selected="onGenreChanged"
          @filter-changed="onFilterOptionsChanged"/>
        <template v-if="!loadingPeriods">
          <div
            v-if="releasedToday && releasedToday.edges.length > 0"
            class="release-list-panel">
            <h3>Released Today</h3>
            <release-list
              :fixed="true"
              :releases="releasedToday"
              :loading="todayLoading"/>
          </div>
          <div
            v-if="releasedLast7 && releasedLast7.edges.length > 0"
            class="release-list-panel">
            <h3>Released last 7 days</h3>
            <release-list
              :fixed="true"
              :loading="releases7Loading"
              :releases="releasedLast7"/>
          </div>
          <div
            v-if="releasedLast30"
            class="release-list-panel">
            <h3>Released last 30 days</h3>
            <release-list
              :fixed="true"
              :loading="releases30Loading"
              :releases="releasedLast30"/>
          </div>
          <template v-if="releases && releases.edges.length > 0">
            <h3>All Releases</h3>
            <release-list
              id="releaselist"
              :releases="releases"
              :loading="loading"/>
          </template>
          <template v-else-if="!releasesFound">
            <div><h2>No new {{ genre && `${genre.name} ` }} found</h2></div>
          </template>
        </template>
        <template v-else>
          <loading-spinner :loading="true"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ApolloReleasesMixin,
  ReleasePagingMixin
} from '../../components/releases/releases-paging-mixin'
import gql from 'graphql-tag'
import ReleaseList from '../../components/releases/ReleaseList'
import {createReleaseListQuery} from '../../components/releases/queries'
import FilterResultsOptions from '../../components/shared/FilterResultsOptions'
import MetaGenreFilter from '../../components/genres/MetaGenreFilter'
import ReleaseFilterPanel from '../../components/features/mobile/ReleaseFilterPanel'

const filterBy = JSON.stringify({ status: 'new' })
const filterByPeriod = function(period, options={}) {
  return JSON.stringify({
    status: 'new',
    period: period,
    ...options,
  })
}

let releaseListTodayQuery = createReleaseListQuery ({filterBy: filterByPeriod (1)})
let releaseList7Query = createReleaseListQuery ({filterBy: filterByPeriod (7)})
let releaseList30Query = createReleaseListQuery ({filterBy: filterByPeriod (30)})
// let releaseQuery = ApolloReleasesMixin (filterBy).apollo

export default {
  name: 'NewReleases',
  components: {
    ReleaseFilterPanel,
    MetaGenreFilter,
    FilterResultsOptions,
    ReleaseList
  },
  mixins: [
    ApolloReleasesMixin(filterBy),
    ReleasePagingMixin (filterBy)
  ],
  data: function () {
    return {
      status: 'new',
      // genres: [],
      genre: undefined,
      todayLoading: false,
      releases7Loading: false,
      releases30Loading: false
    }
  },
  apollo: {
    releasedToday: {
      ...releaseListTodayQuery,
      watchLoading(isLoading, countModifier) {
        this.todayLoading = isLoading
      }
    },
    releasedLast7: {
      ...releaseList7Query,
      watchLoading(isLoading, countModifier) {
        this.releases7Loading = isLoading
      }
    },
    releasedLast30: {
      ...releaseList30Query,
      watchLoading(isLoading, countModifier) {
        this.releases30Loading = isLoading
      }
    },
    // ...releaseQuery,
    genres: {
      query: gql`
        query MetaGenres {
          metaGenres {
            name
            slug
            genres {
              name
              slug
              parentGenre {
                slug
                name
              }
            }
          }
        }
      `,
      update: data => data.metaGenres
    }
  },
  computed: {
    // ...ApolloReleasesMixin (filterBy).computed,
    releasesFound () {
      return !this.releasedLast7
        && !this.releasedLast30
        && !this.releasedToday
        && !this.releases
    },
    loadingPeriods () {
      return this.todayLoading
        || this.releases7Loading
        || this.releases30Loading
    }
  },
  // mounted() {
  //   this.$apollo
  //     .query({
  //       query: gql`
  //         query MetaGenres {
  //           metaGenres {
  //             name
  //             slug
  //             genres {
  //               name
  //               slug
  //               parentGenre {
  //                 slug
  //                 name
  //               }
  //             }
  //           }
  //         }
  //       `
  //     })
  //     .then(({ data }) => {
  //       this.genres = data.metaGenres
  //     })
  // },
  methods: {
    onFilterOptionsChanged(options) {
      this.onFilterChanged (options)
    },
    getFilterByPeriod(period) {
      let filterByDict = {
        status: 'new',
        period: period
      }
      if (this.filterBy) {
        filterByDict = JSON.parse (this.filterBy)
        filterByDict['period'] = period
      }
      return JSON.stringify (filterByDict)
    },
    onGenreSelected(genre) {
      this.onGenreChanged (genre)
      let localFilter = this.getLocalFilter ()
      const paging = {first: 30, after: ''}
      this.$apollo.queries.releasedToday.refetch({
        filterBy: filterByPeriod (1, localFilter),
        ...paging
      })
      this.$apollo.queries.releasedLast7.refetch({
        filterBy: filterByPeriod (7, localFilter),
        ...paging
      })
      this.$apollo.queries.releasedLast30.refetch({
        filterBy: filterByPeriod (30, localFilter),
        ...paging
      })
    },
    head() {
      return {
        title: 'OYE Records - New Releases',
        meta: [
          {
            hid: 'title',
            property: 'og:title',
            content: 'OYE Records - New Releases'
          },
          {
            hid: 'description',
            name: 'description',
            content: 'Keep yourself updated with the hottest new releases.'
          }
        ]
      }
    }
  }
}
</script>
