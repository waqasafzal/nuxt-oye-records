<template id="releasepage">
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="page__header">
          <h1>
            <slot>{{ category }}</slot>
          </h1>
          <meta-genre-filter 
            v-if="showFilter" 
            class="d-none d-md-block" 
            @genre-selected="onGenreSelected" 
            @slug-selected="onSlugSelected"/>
          <filter-results-options 
            v-if="showFilter" 
            :days-options="filterDaysOptions" 
            class="d-none d-md-flex float-right" 
            @filter-changed="onFilterChanged"
          />
        </div>
        <release-filter-panel 
          v-if="showFilter" 
          :days-options="filterDaysOptions" 
          :filter-only="true" 
          :meta-genres="genres"
          class="d-flex d-md-none" 
          @genre-selected="onGenreSelected" 
          @filter-changed="onFilterChanged"/>
        <release-list
          id="releaselist"
          :releases="releases"
          :loading="loading" 
          class="releaselist-box"/>
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
// import apolloClient from '~/plugins/apollo'
import gql from 'graphql-tag'

Vue.component('release-list', ReleaseList)

export default {
  name: 'ReleasePage',
  components: {
    ReleaseFilterPanel,
    MetaGenreFilter,
    FilterResultsOptions
  },
  props: {
    pageSize: {
      type: Number,
      default: 25
    },
    status: {
      type: String,
      default: 'new'
    },
    releases: {
      type: [Object, Array],
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    showFilter: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      filterBy: {
        status: this.status
      },
      filterOptions: {},
      genres: [],
      selectedGenre: undefined
    }
  },
  computed: {
    category: function() {
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
    filterDaysOptions() {
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
  mounted() {
    this.$apollo
      .query({
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
        `
      })
      .then(({ data }) => {
        this.genres = data.metaGenres
      })
  },
  methods: {
    onFilterChanged(filterOptions) {
      this.filterBy = Object.assign({}, this.filterBy, filterOptions)
      this.$emit('filter-changed', this.filterBy)
    },
    onGenreSelected(genre) {
      this.selectedGenre = genre
      this.$emit('genre-selected', genre)
    },
    onSlugSelected(slug) {
      this.$emit('genre-selected', slug)
    }
  }
}
</script>
