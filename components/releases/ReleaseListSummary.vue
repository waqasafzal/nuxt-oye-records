<template>
  <div 
    v-if="releases" 
    class="release-list-summary">
    <div class="release-list-summary__header">
      <h3>
        <slot>
          <template v-if="status === 'new' && genre">Latest </template>
          <template v-if="getRoute()">
            <nuxt-link :to="getRoute()">{{ title }}</nuxt-link>
          </template>
          <template v-else>
            <span>{{ title }}</span>
          </template>
        </slot>
      </h3>
      <nuxt-link 
        v-if="getRoute()" 
        :to="getRoute()" 
        class="release-list-summary__header__more">
        View all
        <template v-if="genre">{{ title }}</template>
        <right-arrow/>
      </nuxt-link>
    </div>
    <release-list 
      :releases="releases" 
      :loading="loading"/>
  </div>
</template>

<script>
import ReleaseList from './ReleaseList'
import RightArrow from '../shared/RightArrow'

var getReleaseListColumnNumber
if (process.BROWSER_BUILD) {
  var utils = require('../utils')
  getReleaseListColumnNumber = utils.getReleaseListColumnNumber
} else {
  getReleaseListColumnNumber = function() {
    return 6
  }
}

export default {
  name: 'ReleaseListSummary',
  components: { RightArrow, ReleaseList },
  props: {
    pageSize: {
      type: Number,
      default: 25
    },
    status: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    genre: {
      type: Object,
      default: null
    },
    releases: {
      type: [Array, Object],
      default: null
    }
  },
  data: function() {
    return {
      count: (this.pageSize || 1) * getReleaseListColumnNumber(),
      loading: false
    }
  },
  methods: {
    getRoute: function() {
      var route
      if (this.status === 'new') {
        if (this.genre) {
          route = {
            params: { slug: this.genre.slug, genre: this.genre }
          }
          if (this.genre.id) {
            route['name'] = 'genres-slug'
          } else {
            route['name'] = 'metagenres-slug'
          }
        } else {
          route = { name: 'releases-new' }
        }
      } else if (this.status === 'pre') {
        route = { name: 'releases-upcoming' }
      } else if (this.status === 'back') {
        route = { name: 'releases-back' }
      }
      return route
    }
  }
}
</script>
