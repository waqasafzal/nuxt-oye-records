<template id="releasepage">
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="page__header">
          <h1>
            <slot>{{ category }}</slot>
          </h1>
          <meta-genre-filter class="d-none d-md-flex" v-if="showFilter" @slug-selected="onSlugSelected"></meta-genre-filter>
          <filter-results-options class="d-none d-md-flex float-right" v-if="showFilter" :daysOptions="filterDaysOptions" @filter-changed="onFilterChanged"
                                  ></filter-results-options>
        </div>
        <release-filter-panel :daysOptions="filterDaysOptions" upcoming="status === 'upcoming'" :filterOnly="true" @filter-changed="onFilterChanged" :metaGenres="genres" class="d-flex d-md-none">
        </release-filter-panel>
        <release-list id="releaselist" class="releaselist-box" :releases="releases" :loading="loading"></release-list>
      </div>
    </div>
  </div>
</template>

<script>

  import Vue from 'vue'

  import ReleaseList from './ReleaseList.vue'
  import FilterResultsOptions from '../shared/FilterResultsOptions'
  import MetaGenreFilter from '../genres/MetaGenreFilter'
  import ReleaseFilterPanel from '../features/mobile/ReleaseFilterPanel'
  import apolloClient from '~/plugins/apollo'
  import gql from 'graphql-tag'

  Vue.component('release-list', ReleaseList)

  export default {
    components: {
      ReleaseFilterPanel,
      MetaGenreFilter,
      FilterResultsOptions
    },
    name: 'ReleasePage',
    props: {
      'pageSize': Number,
      'status': String,
      'releases': Object,
      'loading': Boolean,
      'showFilter': {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        filterBy: {
          status: this.status
        },
        filterOptions: {},
        genres: []
      }
    },
    methods: {
      onFilterChanged (filterOptions) {
        console.log('gilter filcj')
        this.filterBy = Object.assign({}, this.filterBy, filterOptions)
        this.$emit('filter-changed', this.filterBy)
      },
      onSlugSelected (slug) {
        this.$emit('genre-selected', slug)
      }
    },
    computed: {
      category: function () {
        if (this.status === 'new') {
          return 'New Releases'
        } else if (this.status === 'pre') {
          return 'Upcoming'
        } else if (this.status === 'used') {
          return 'Used Vinyl'
        }
      },
      filterDaysOptions () {
        if (this.status === 'pre') {
          return {
            '7': 'Next 7 days',
            '14': 'Next 14 days',
            '31': 'Next month',
            '365': 'Next year'
          }
        } else {
          return {
            '7': 'Last 7 days',
            '14': 'Last 14 days',
            '31': 'Last month',
            '365': 'Last year'
          }
        }
      }
    },
    mounted () {
      apolloClient.query({
        query: gql`query MetaGenres {
           metaGenres {
              name
              slug
           }
        }
        `
      }).then(
        ({data}) => {
          this.genres = data.metaGenres
        }
      )
    }
  }

</script>
