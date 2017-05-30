<template>
  <div class="release-list-summary" v-if="releases">
    <div class="release-list-summary__header">
      <h3>
        <template v-if="status === 'new' && genre">Latest </template>
        <template v-if="getRoute()">
          <nuxt-link :to="getRoute()">{{ title }}</nuxt-link>
        </template>
        <template v-else>
          <span>{{ title }}</span>
        </template>
      </h3>
    </div>
    <release-list :releases="releases" :loading="loading"></release-list>
  </div>
</template>

<script>
  import ReleaseList from './ReleaseList'
  import NuxtLink from '../../.nuxt/components/nuxt-link'

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
    components: {NuxtLink, ReleaseList},
    props: ['pageSize', 'status', 'title', 'genre', 'releases'],
    name: 'ReleaseListSummary',
    data: function () {
      return {
        count: (this.pageSize || 1) * getReleaseListColumnNumber(),
        loading: false
      }
    },
    methods: {
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
          route = {name: 'releases-upcoming'}
        } else if (this.status === 'back') {
          route = {name: 'releases-back'}
        }
        return route
      }
    }
  }
</script>
