<template>
  <div class="col-12 release-list-summary" v-if="releases">
    <div class="release-list-summary__header">
      <h3>
        <template v-if="status === 'new' && genre">Latest </template>
        {{ title }}
      </h3>
      <nuxt-link v-if="getRoute()" :to="getRoute()" class="release-list-summary__header__more">
        View all
        <template v-if="genre">{{ title }}</template>
        <img src="../../assets/images/arrow_right_grey.svg"/>
      </nuxt-link>
    </div>
    <release-list :releases="releases" :loading="loading"></release-list>
  </div>
</template>

<script>
  import ReleaseList from './ReleaseList'
//  import gql from 'graphql-tag'

  var getReleaseListColumnNumber
  if (process.BROWSER_BUILD) {
    var utils = require('../utils')
    getReleaseListColumnNumber = utils.getReleaseListColumnNumber
  } else {
    getReleaseListColumnNumber = function () {
      return 6
    }
  }

  export default {
    components: {ReleaseList},
    props: ['pageSize', 'status', 'title', 'genre', 'releases'],
    name: 'ReleaseListSummary',
    data: function () {
      return {
        count: (this.pageSize || 1) * getReleaseListColumnNumber(),
        loading: false
      }
    },
    methods: {
//      filterBy: function () {
//        let filterBy = {
//          'status': this.status
//        }
//        if (this.genre) {
//          var genreIds = []
//          if (this.genre.pk) {
//            genreIds.push(this.genre.pk)
//          } else {
//            let subgenreIds = this.genre.genres.map(x => x.pk)
//            genreIds = genreIds.concat(subgenreIds)
//          }
//          filterBy['genres'] = genreIds
//          filterBy['status'] = 'any'
//        }
//        return JSON.stringify(filterBy)
//      },
      getRoute: function () {
        var route
        if (this.status === 'new') {
          if (this.genre) {
            if (this.genre.id) {
              route = {
                name: 'genres-slug',
                params: {slug: this.genre.slug, genre: this.genre}
              }
            }
          } else {
            route = {name: 'releases-new'}
          }
        } else if (this.status === 'pre') {
          route = {name: 'releases-pre'}
        } else if (this.status === 'back') {
          route = {name: 'releases-back'}
        }
        return route
      }
//    },
//    apollo: {
//      // Query with parameters
//      releases () {
//        return {
//          query: gql`query Releases($first: Int!, $filterBy: JSONString!) {
//            releases(first: $first, filterBy: $filterBy) {
//              ...Releases
//            }
//          }
//          ${ReleaseList.fragments.releases}
//          `,
//          variables () {
//            return {
//              first: this.count,
//              filterBy: this.filterBy
//            }
//          },
//          loadingKey: 'loadingQueriesCount',
//          watchLoading (isLoading, countModifier) {
//            this.loading = isLoading
//          }
//        }
//      }
    }
  }
</script>
