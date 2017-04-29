<template>
  <div class="page">
    <div class="page__header" v-if="detailGenre">
      {{ detailGenre.name }}

      <dropdown class="genres__detail__subgenre__selector"
                v-if="detailGenre.subgenres && detailGenre.subgenres.length > 0"
                @selected="onSelected"
                :values="detailGenre.subgenres">Select Subgenre
      </dropdown>
    </div>
    <div class="genres__detail__bestseller">
      <div class="genres__detail__bestseller__header" v-if="detailGenre">Bestseller {{ detailGenre.name }}</div>
      <div class="genres__detail__bestseller__carousel row"
           v-if="!bsLoading && (bestsellers.length > 0 || bestsellers.edges)">
        <div class="col-12">
          <transition-group name="blend">
            <div :class="'carousel__item'" :key="p" v-for="p in pages" v-if="p === currentSlide" transition="blend">
              <release-item v-for="(release, i) in getBestsellers(p)"
                            class="col-md-3 product-list bestseller__item"
                            :release="release.node"
                            :key="i"
              ></release-item>
            </div>
          </transition-group>
          <div class="col-12 ">
            <div class="carousel__controls">
              <div @click="selectSlide(p)" :class="['carousel__controls__button', p === currentSlide ? 'active': '']"
                   :key="p+'s'" v-for="p in pages">
              </div>
            </div>
          </div>
        </div>
      </div>
      <loading-spinner :loading="bsLoading"></loading-spinner>
    </div>

    <release-list :releases="releases" :loading="loading"></release-list>
  </div>
</template>

<script>
  import ReleaseList from '../../components/releases/ReleaseList.vue'
  import {ReleasePagingMixin} from '../../components/releases/releases-paging-mixin'
  import gql from 'graphql-tag'
  import {getReleaseListColumnNumber} from '../../components/utils'
  import ReleaseItem from '../../components/releases/ReleaseItem'
  import Dropdown from '../../components/shared/Dropdown'
  import LoadingSpinner from '../../components/shared/LoadingSpinner'

  const MAX_BESTSELLERS = 40

  export default {
    components: {
      LoadingSpinner,
      Dropdown,
      ReleaseItem,
      ReleaseList
    },
    mixins: [ReleasePagingMixin],
    name: 'GenreDetailPage',
    props: ['genreId', 'subGenreId', 'genre'],
    data: function () {
      var genreId = this.genreId
      var isSubgenre = typeof this.subGenreId !== 'undefined'
      if (isSubgenre) {
        genreId = this.subGenreId
      }
      return {
        releases: [],
        bestsellers: [],
        loading: false,
        bsLoading: false,
        relevantGenreId: genreId,
        isSubgenre: isSubgenre,
        detailGenre: this.genre,
        bsPageSize: getReleaseListColumnNumber() * (2 / 3),
        currentSlide: 1
      }
    },
    computed: {
      filterBy: function () {
        return this.getFilterByParameter()
      },
      pages: function () {
        if (this.bestsellers.edges) {
          return Math.ceil(this.bestsellers.edges.length / this.bsPageSize)
        }
      }
    },
    methods: {
      getFilterByParameter (status) {
        let filterBy = {}
        if (status) {
          filterBy['status'] = status
        }
        if (this.subGenreId) {
          filterBy['subgenres'] = [this.subGenreId]
        } else if (this.genreId) {
          filterBy['genres'] = [this.genreId]
        }
        return JSON.stringify(filterBy)
      },
      getPageSize (status) {
        if (status === 'bestsellers') {
          return MAX_BESTSELLERS
        } else {
          return this.pageItems
        }
      },
      getBestsellers (pageIndex) {
        let from = (pageIndex - 1) * this.bsPageSize
        let to = (pageIndex) * this.bsPageSize
        var bestsellers = []
        let bestsellerEdges = this.bestsellers.edges
        for (var i = from; i < to && i < bestsellerEdges.length; i++) {
          bestsellers.push(bestsellerEdges[i])
        }
        return bestsellers
      },
      selectSlide (index) {
        if (index !== this.currentSlide) {
          console.log('INDEX ' + index)
          this.currentSlide = index
        }
      },
      onSelected (value) {
        let location = {
          name: 'SubGenreDetailPage',
          params: {
            genreId: this.detailGenre.pk,
            slug: this.detailGenre.slug,
            subGenreId: value.pk,
            subSlug: value.slug,
            genre: value
          }
        }
        this.$router.push(location)
      }
    },
    watch: {
      $route () {
        console.log('route reload')

        if (this.genre) {
          this.detailGenre = this.genre
        } else {
          var genreId = this.genreId
          var isSubgenre = typeof this.subGenreId !== 'undefined'
          if (isSubgenre) {
            genreId = this.subGenreId
          }
          this.relevantGenreId = genreId
          this.isSubgenre = isSubgenre

          var vm = this

          this.$apollo.queries.detailGenre.fetchMore({
            // New variables
            variables: {
              pk: this.relevantGenreId,
              sub: this.isSubgenre
            },
            // Transform the previous result with new data
            updateQuery: (previousResult, {fetchMoreResult}) => {
              let data = fetchMoreResult
              vm.detailGenre = data.detailGenre

              return {
                detailGenre: data.detailGenre
              }
            }
          })
        }
        this.releases = []
        this.bestsellers = []
      }
    },
    apollo: {
      detailGenre: function () {
        return {
          query: gql`query Genre($pk: ID!, $sub: Boolean) {
            detailGenre: genre(pk: $pk, sub: $sub) {
              pk
              name
              slug
              subgenres {
                pk
                name
                slug
              }
            }
          }`,
          variables: function () {
            return {
              pk: this.relevantGenreId,
              sub: this.isSubgenre
            }
          }
        }
      },
      bestsellers: function () {
        return {
          query: gql`query Bestsellers($first: Int!, $after: String, $filterBy: JSONString!) {
            bestsellers: releases(first: $first, after: $after, filterBy: $filterBy) {
                ...Releases
            }
          }
          ${ReleaseList.fragments.releases}
          `,
          variables: function () {
            return {
              first: MAX_BESTSELLERS,
              after: '',
              filterBy: this.getFilterByParameter('bestsellers')
            }
          },
          watchLoading (isLoading, countModifier) {
            this.bsLoading = isLoading
          }
        }
      }
    }
  }
</script>

<style>
  .blend-enter-active,
  .blend-leave-active {
    transition: opacity .3s ease;
  }

  .blend-enter,
  .blend-leave-active {
    height: 0;
    opacity: 0;
  }
</style>
