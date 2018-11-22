<template id="releasepage">
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="page__header">
          <h1>
            <slot>{{ category }}</slot>
          </h1>
          <meta-genre-filter @genre-selected="onGenreSelected" class="d-none d-md-block" v-if="showFilter" @slug-selected="onSlugSelected"></meta-genre-filter>
          <filter-results-options class="d-none d-md-flex float-right" v-if="showFilter" :daysOptions="filterDaysOptions" @filter-changed="onFilterChanged"
          ></filter-results-options>
        </div>
        <release-filter-panel :daysOptions="filterDaysOptions" :filterOnly="true" @genre-selected="onGenreSelected" @filter-changed="onFilterChanged"
                              :metaGenres="genres" class="d-flex d-md-none" v-if="showFilter">
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
        genres: [],
        selectedGenre: undefined
      }
    },
    methods: {
      onFilterChanged (filterOptions) {
        this.filterBy = Object.assign({}, this.filterBy, filterOptions)
        this.$emit('filter-changed', this.filterBy)
      },
      onGenreSelected (genre) {
        this.selectedGenre = genre
        this.$emit('genre-selected', genre)
      },
      onSlugSelected (slug) {
        this.$emit('genre-selected', slug)
      }
    },
    computed: {
      category: function () {
        let category
        if (this.status === 'new') {
          category = 'New Releases'
        } else if (this.status === 'pre') {
          category = 'Upcoming'
        } else if (this.status === 'used') {
          category = 'Used Vinyl'
        }
        if (this.selectedGenre) {
          category = category + ' ' + this.selectedGenre.name
        }
        return category
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
        `
      }).then(
        ({data}) => {
          this.genres = data.metaGenres
        }
      )
    }
  }

</script>
