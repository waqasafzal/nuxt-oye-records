<template id="releasepage">
  <div class="row">
    <div class="col-12">
      <div class="page__header">
        {{ category }}
        <meta-genre-filter @slug-selected="onSlugSelected"></meta-genre-filter>
        <filter-results-options :daysOptions="filterDaysOptions" @filter-changed="onFilterChanged" class="float-right"></filter-results-options>
      </div>
      <release-list id="releaselist" class="releaselist-box" :releases="releases" :loading="loading"></release-list>
    </div>
  </div>
</template>

<script>

  import Vue from 'vue'

  import ReleaseList from './ReleaseList.vue'
  import NoResults from '../shared/NoResults.vue'
  import FilterResultsOptions from '../shared/FilterResultsOptions'
  import MetaGenreFilter from '../genres/MetaGenreFilter'

  Vue.component('noresults', NoResults)
  Vue.component('release-list', ReleaseList)

  export default {
    components: {MetaGenreFilter, FilterResultsOptions},
    name: 'ReleasePage',
    props: ['pageSize', 'status', 'releases', 'loading'],
    data: function () {
      return {
        filterBy: JSON.stringify({
          status: this.status
        }),
        filterOptions: {}
      }
    },
    methods: {
      onFilterChanged (filterOptions) {
        this.$emit('filter-changed', filterOptions)
        if (filterOptions.date) {
          this.filterBy['date'] = filterOptions.date
        }
        if (filterOptions.formats) {
          this.filterBy['formats'] = filterOptions.formats
        }
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
        }
      }
    }
  }

</script>
