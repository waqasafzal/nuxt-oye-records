<template>
  <div class="navbar__search">
    <img class="hidden-md-up mobile-search-icon float-right"
         src="../../assets/images/search-icon.svg">
    <form @submit="onSubmit" class="form-inline navbar__brand__search">
      <div class="mobile-close-search hidden-md-up">
        <img src="../../assets/images/close-icon.svg">
      </div>
      <input @focus="showResults" @blur="onBlur" autocomplete="off" v-model="query" class="form-control search-input"
             type="text" name="q">
      <button class="btn btn-link" type="submit">
        <img src="../../assets/images/search-icon.svg">
      </button>
    </form>
    <div v-if="resultsVisible && hasResults" class="search__results">
      <div v-if="releasesTotal > 0" @mouseover="disableBlur" @mouseleave="enableBlur">
        <div class="search__results__header">Releases</div>
        <div @click="hideResults" class="search__results__row" v-for="item in releaseResults">
          <nuxt-link v-if="item.release" class="search__results__item"
                     :to="{name:'releases-slug', params: {slug: item.release.slug}}">
            <div class="search__release__image">
              <img :src="item.release.smallThumbnailUrl"/>
            </div>
            <div class="search__release__infos">
              <div class="search__release__name">
                <template v-if="item.release.artistFirstName">{{item.release.artistFirstName}} </template>
                {{item.release.artistLastName}}

              </div>
              <div class="search__release__title">
                {{item.release.title}}

              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div>
        <div @mouseover="disableBlur" @mouseleave="enableBlur" v-if="hasMore" @click="hideResults"
             class="search__results__item search__results__more">
          <nuxt-link :to="{name: 'search', params: {initialQuery: query, intialReleaseResults: releaseResults}}">
            + More Search Results
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import _ from 'lodash'
  import * as types from '../../store/types'
  import { getPageSize } from '../utils'

  const MAX_ARTISTS = 2
  const MAX_RELEASES = 5

  export default {
    name: 'Search',
    data: function () {
      return {
        query: '',
        searching: false,
        queryCount: 0,
        resultsVisible: false,
        artistsTotal: 0,
        blurEnabled: true
      }
    },
    watch: {
      query (val) {
        this.queryResult()
      },
      storeQuery (val) {
        this.query = val
      }
    },
    computed: {
      hasResults () {
        return this.releasesTotal > 0
      },
      hasMore () {
        return this.releasesTotal > MAX_RELEASES || this.artistsTotal.length > MAX_ARTISTS
      },
      releaseResults () {
        return this.$store.state.search.releases.results.slice(0, MAX_RELEASES)
      },
      releasesTotal () {
        return this.$store.state.search.releases.total
      },
      storeQuery () {
        return this.$store.state.search.query
      }
    },
    methods: {
      queryResult: _.debounce(
        function () {
          if (this.query) {
            this.queryCount += 1
            var identifier = this.queryCount
            this.$store.dispatch('search', {
              query: this.query,
              type: 'releases',
              size: getPageSize(),
              identifier: identifier
            })
          } else {
            this.$store.commit(types.SET_SEARCH_RESULTS, {
              type: 'releases',
              search: {
                total: 0,
                results: []
              }
            })
          }
        },
        500
      ),
      onBlur () {
        if (this.blurEnabled) {
          this.resultsVisible = false
        }
      },
      hideResults () {
        this.resultsVisible = false
      },
      showResults () {
        this.resultsVisible = true
      },
      enableBlur () {
        this.blurEnabled = true
      },
      disableBlur () {
        this.blurEnabled = false
      },
      onSubmit () {
        this.$router.push({
          name: 'search',
          query: {
            q: this.query
          }
        })
      }
    }
  }
</script>
