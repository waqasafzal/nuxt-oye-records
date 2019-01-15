<template>
  <div class="navbar__search">
    <div 
      :class="['d-flex', 'd-lg-none', 'vmargin-auto', !searchHidden ? 'search-visible': '']" 
      @click="toggleSearchForm">
      <search-svg/>
    </div>
    <transition 
      name="from-top" 
      @enter="focusSearch">
      <div 
        v-show="!searchHidden" 
        :class="['navbar__brand__search', searchActive ? 'active': '', 'd-md-block']">
        <form 
          :class="['form-inline']" 
          @submit.prevent="onSubmit">
          <input 
            v-on-clickaway="onBlur" 
            ref="search" 
            v-model="query" 
            autocomplete="off" 
            class="form-control search-input" 
            type="search"
            name="q" 
            @focus="showResults">
          <button 
            class="btn btn-link d-none d-md-flex" 
            type="submit">
            <img 
              alt="search icon" 
              src="../../assets/images/search-icon.svg">
          </button>
          <div 
            v-if="loading" 
            class="search__spinner">
            <img 
              alt="search loader" 
              src="../../assets/images/search_loader.svg" >
          </div>
        </form>
        <div 
          v-if="resultsVisible && hasResults" 
          class="search__results">
          <div style="height: 100%; overflow: auto; position: relative;">
            <div 
              v-if="artistsResults.length > 0" 
              @mouseover="disableBlur" 
              @mouseleave="enableBlur">
              <div class="search__results__header">Artists</div>
              <div 
                v-for="(item, ai) in artistsResults"
                :key="`search-artist-${ai}`"
                class="search__results__row" 
                @click="setQuery(item.artist.name, ['artist_name'])">
                <nuxt-link 
                  v-if="item.artist" 
                  :to="{name:'artists-query', params: { query: item.artist.name }}"
                  class="search__results__item">
                  <div class="search__artist__image">
                    <template v-if="item.artist.smallThumbnailUrl">
                      <img :src="item.artist.smallThumbnailUrl">
                    </template>
                    <template v-else>
                      <img src="../../assets/images/defaults/Default_User.png" >
                    </template>
                  </div>
                  <div class="search__release__infos">
                    <div class="search__release__name">{{ item.artist.name }}</div>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <div 
              v-if="labelResults.length > 0" 
              @mouseover="disableBlur" 
              @mouseleave="enableBlur">
              <div class="search__results__header">Labels</div>
              <div
                v-for="(item, li) in labelResults"
                :key="`label-${li}`"
                class="search__results__row"
                @click="hideResults">
                <nuxt-link 
                  v-if="item.label" 
                  :to="{name:'labels-query', params: { query: item.label.name }}"
                  class="search__results__item">
                  <div class="search__artist__image">
                    <img src="../../assets/images/defaults/Default_Cover.png" >
                  </div>
                  <div class="search__release__infos">
                    <div class="search__release__name">{{ item.label.name }}</div>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <div 
              v-if="releasesTotal > 0" 
              @mouseover="disableBlur" 
              @mouseleave="enableBlur">
              <div class="search__results__header">Releases</div>
              <div
                v-for="(item, ri) in releaseResults"
                :key="`search-release-${ri}`"
                class="search__results__row"
                @click="hideResults">
                <nuxt-link 
                  v-if="item.release" 
                  :to="{name:'releases-slug', params: {slug: item.release.slug}}"
                  class="search__results__item">
                  <div class="search__release__image">
                    <img :src="item.release.smallThumbnailUrl">
                  </div>
                  <div class="search__release__infos">
                    <div class="search__release__name">
                      <template v-if="item.release.artistFirstName">{{ item.release.artistFirstName }} </template>
                      {{ item.release.artistLastName }}

                    </div>
                    <div class="search__release__title">{{ item.release.title }}</div>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <div>
              <div 
                v-if="hasMore" 
                class="search__results__item search__results__more" 
                @mouseover="disableBlur" 
                @mouseleave="enableBlur"
                @click="hideResults">
                <nuxt-link :to="{name: 'search', params: {initialQuery: query, intialReleaseResults: releaseResults}}">
                  + More Search Results
                </nuxt-link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash'
import * as types from '../../store/types'
import { getPageSize } from '../utils'

import { mixin as clickaway } from 'vue-clickaway'
import SearchSvg from '../shared/SearchSvg'
import { mapGetters } from 'vuex'

const MAX_ARTISTS = 2
const MAX_RELEASES = 3
const MAX_LABELS = 1

export default {
  name: 'Search',
  components: { SearchSvg },
  mixins: [clickaway],
  data: function() {
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
  computed: {
    ...mapGetters(['searchHidden']),
    deviceWidth() {
      return window.innerWidth > 0 ? window.innerWidth : screen.width
    },
    searchActive() {
      return this.resultsVisible && this.query
    },
    loading() {
      return this.$store.state.search.loading > 0
    },
    hasResults() {
      return (
        this.releasesTotal > 0 ||
        this.releaseResults.length > 0 ||
        this.artistsResults.length > 0
      )
    },
    hasMore() {
      return (
        this.releasesTotal > MAX_RELEASES ||
        this.artistsTotal.length > MAX_ARTISTS
      )
    },
    releaseResults() {
      let search = this.$store.state.search
      let results = [
        ...search.catnoReleases.results,
        ...search.releases.results
      ].slice(0, MAX_RELEASES)
      return results
    },
    artistsResults() {
      return this.$store.state.search.artists.results.slice(0, MAX_ARTISTS)
    },
    labelResults() {
      return this.$store.state.search.labels.results.slice(0, MAX_LABELS)
    },
    releasesTotal() {
      let search = this.$store.state.search
      return search.releases.total + search.catnoReleases.total
    },
    storeQuery() {
      return this.$store.state.search.query
    }
  },
  watch: {
    query(val) {
      if (val.toLowerCase() !== this.lastQuery.toLowerCase()) {
        this.queryResult()
      }
      this.lastQuery = val
    },
    storeQuery(val) {
      this.query = val
    }
  },
  mounted() {
    if (this.deviceWidth < 900) {
      this.$store.commit(types.SET_SEARCH_HIDDEN, true) // searchHidden = true
      this.$refs.search.placeholder =
        'Search for artist name, release name, label, ...'
    } else {
      this.$store.commit(types.SET_SEARCH_HIDDEN, false)
    }
  },
  methods: {
    queryResult: _.debounce(function() {
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
    }, 500),
    onBlur() {
      if (this.blurEnabled) {
        this.resultsVisible = false
      }
    },
    hideResults() {
      this.resultsVisible = false
    },
    showResults() {
      this.resultsVisible = true
    },
    enableBlur() {
      this.blurEnabled = true
    },
    disableBlur() {
      this.blurEnabled = false
    },
    onSubmit() {
      this.$router.push({
        name: 'search',
        query: {
          q: this.query
        }
      })

      const search = this.$refs.search
      search.setAttribute('readonly', 'readonly')
      search.setAttribute('disabled', 'true')
      setTimeout(function() {
        search.blur() // actually close the keyboard
        // Remove readonly attribute after keyboard is hidden.
        search.removeAttribute('readonly')
        search.removeAttribute('disabled')
      }, 100)

      this.$store.commit(types.SET_SEARCH_HIDDEN, true)
      this.hideResults()
    },
    setQuery(query, fields) {
      this.$store.commit(types.SET_QUERY, {
        query,
        fields: JSON.stringify(fields)
      })
      this.hideResults()
    },
    toggleSearchForm() {
      this.$store.commit(types.SET_SEARCH_HIDDEN, !this.searchHidden)
    },
    focusSearch() {
      const search = this.$refs.search
      search.focus()
    }
  }
}
</script>
