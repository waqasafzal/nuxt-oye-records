<template>
  <div class="navbar__search">
    <img class="d-md-none mobile-search-icon float-right"
         src="../../assets/images/search-icon.svg">
    <div :class="['navbar__brand__search', searchActive ? 'active': '']">
      <form @submit.prevent="onSubmit" :class="['form-inline']">
        <div class="mobile-close-search d-md-none">
          <img src="../../assets/images/close-icon.svg">
        </div>
        <input v-on-clickaway="onBlur" @focus="showResults" autocomplete="off" v-model="query" class="form-control search-input"
               type="text" name="q">
        <button class="btn btn-link" type="submit">
          <img src="../../assets/images/search-icon.svg">
        </button>
        <div class="search__spinner" v-if="loading">
          <img src="../../assets/images/search_loader.svg" />
        </div>
      </form>
      <div v-if="resultsVisible && hasResults" class="search__results">
        <div v-if="artistsResults.length > 0" @mouseover="disableBlur" @mouseleave="enableBlur">
          <div class="search__results__header">Artists</div>
          <div @click="setQuery(item.artist.name, ['artist_name'])" class="search__results__row" v-for="item in artistsResults">
            <nuxt-link v-if="item.artist" class="search__results__item"
                       :to="{name:'artists-query', params: { query: item.artist.name }}">
              <div class="search__artist__image">
                <template v-if="item.artist.smallThumbnailUrl">
                  <img :src="item.artist.smallThumbnailUrl"/>
                </template>
                <template v-else>
                  <img src="../../assets/images/defaults/Default_User.png" />
                </template>
              </div>
              <div class="search__release__infos">
                <div class="search__release__name">{{ item.artist.name }}</div>
              </div>
            </nuxt-link>
          </div>
        </div>
        <div v-if="labelResults.length > 0" @mouseover="disableBlur" @mouseleave="enableBlur">
          <div class="search__results__header">Labels</div>
          <div @click="hideResults" class="search__results__row" v-for="item in labelResults">
            <nuxt-link v-if="item.label" class="search__results__item"
                       :to="{name:'labels-query', params: { query: item.label.name }}">
              <div class="search__artist__image">
                <img src="../../assets/images/defaults/Default_Cover.png" />
              </div>
              <div class="search__release__infos">
                <div class="search__release__name">{{ item.label.name }}</div>
              </div>
            </nuxt-link>
          </div>
        </div>
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
                <div class="search__release__title">{{item.release.title}}</div>
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
  </div>
</template>

<script>

  import _ from 'lodash'
  import * as types from '../../store/types'
  import { getPageSize } from '../utils'

  import { mixin as clickaway } from 'vue-clickaway'

  const MAX_ARTISTS = 2
  const MAX_RELEASES = 3
  const MAX_LABELS = 1

  export default {
    name: 'Search',
    mixins: [ clickaway ],
    data: function () {
      return {
        query: '',
        searching: false,
        queryCount: 0,
        resultsVisible: false,
        artistsTotal: 0,
        blurEnabled: true,
        lastQuery: ''
      }
    },
    watch: {
      query (val) {
        if (val.toLowerCase() !== this.lastQuery.toLowerCase()) {
          this.queryResult()
        }
        this.lastQuery = val
      },
      storeQuery (val) {
        this.query = val
      }
    },
    computed: {
      searchActive () {
        return this.resultsVisible && this.query
      },
      loading () {
        return this.$store.state.search.loading > 0
      },
      hasResults () {
        return this.releasesTotal > 0 || this.releaseResults.length > 0 || this.artistsResults.length > 0
      },
      hasMore () {
        return this.releasesTotal > MAX_RELEASES || this.artistsTotal.length > MAX_ARTISTS
      },
      releaseResults () {
        let search = this.$store.state.search
        let results = [...search.catnoReleases.results, ...search.releases.results].slice(0, MAX_RELEASES)
        return results
      },
      artistsResults () {
        return this.$store.state.search.artists.results.slice(0, MAX_ARTISTS)
      },
      labelResults () {
        return this.$store.state.search.labels.results.slice(0, MAX_LABELS)
      },
      releasesTotal () {
        let search = this.$store.state.search
        return search.releases.total + search.catnoReleases.total
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
            this.$store.dispatch('search', {
              query: this.query,
              type: 'artists',
              size: 2
            })
            this.$store.dispatch('search', {
              query: this.query,
              type: 'labels',
              size: 2
            })
          } else {
            this.$store.commit(types.SET_SEARCH_RESULTS, {
              type: 'releases',
              search: {
                total: 0,
                results: []
              }
            })
            this.$store.commit(types.SET_SEARCH_RESULTS, {
              type: 'artists',
              search: {
                total: 0,
                results: []
              }
            })
            this.$store.commit(types.SET_SEARCH_RESULTS, {
              type: 'labels',
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
        this.hideResults()
      },
      setQuery (query, fields) {
        this.$store.commit(types.SET_QUERY, {query, fields: JSON.stringify(fields)})
        this.hideResults()
      }
    }
  }
</script>
