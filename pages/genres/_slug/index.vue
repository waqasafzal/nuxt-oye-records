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
  import ReleaseList from '../../../components/releases/ReleaseList.vue'
//  import gql from 'graphql-tag'
  import {getReleaseListColumnNumber} from '../../../components/utils'
  import ReleaseItem from '../../../components/releases/ReleaseItem'
  import Dropdown from '../../../components/shared/Dropdown'
  import LoadingSpinner from '../../../components/shared/LoadingSpinner'
  import client from '../../../plugins/apollo'
  import { createReleaseListQuery } from '../../../components/releases/queries'
  import { createGenreQuery } from '../../../components/genres/queries'

  const MAX_BESTSELLERS = 40

  export default {
    components: {
      LoadingSpinner,
      Dropdown,
      ReleaseItem,
      ReleaseList
    },
    name: 'GenreDetailPage',
    props: ['genre'],
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
        genreSlug: this.slug,
        genreSubslug: this.subslug,
        bsPageSize: getReleaseListColumnNumber() * (2 / 3),
        currentSlide: 1
      }
    },
    async asyncData ({params}) {
      let releaseFilterParams = {}
      if (params.subslug) {
        releaseFilterParams['subgenres'] = [params.subslug]
      } else if (params.slug) {
        releaseFilterParams['genres'] = [params.slug]
      }
      let genreReleases = await client.query(createReleaseListQuery({filterBy: JSON.stringify(releaseFilterParams)}))

      releaseFilterParams['status'] = 'bestsellers'
      let bestsellerReleases = await client.query(createReleaseListQuery({filterBy: JSON.stringify(releaseFilterParams)}))

      let options = {
        slug: params.subslug || params.slug,
        isSubgenre: typeof params.subslug !== 'undefined'
      }
      let detailGenreResults = await client.query(createGenreQuery(options))

      return {
        detailGenre: detailGenreResults.data.detailGenre,
        releases: genreReleases.data.releases,
        bestsellers: bestsellerReleases.data.releases
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
          this.currentSlide = index
        }
      },
      onSelected (value) {
        let location = {
          name: 'genres-slug-subslug',
          params: {
            slug: this.detailGenre.slug,
            subslug: value.slug,
            genre: value
          }
        }
        this.$router.push(location)
      }
    },
    watch: {
      $route (options) {
        let params = options.params

        this.detailGenre = params.genre
        let slug = params.slug
        let subslug = params.subslug

        if (typeof this.detailGenre === 'undefined') {
          client.query(
            createGenreQuery({
              slug: subslug || slug,
              sub: typeof subslug === 'undefined'
            })
          ).then((result) => {
            vm.loading = false
            vm.detailGenre = result.data.detailGenre
          })
        }

        let releaseFilterParams = {}
        if (subslug) {
          releaseFilterParams['subgenres'] = [subslug]
        } else if (slug) {
          releaseFilterParams['genres'] = [slug]
        }

        var vm = this
        this.loading = true
        this.releases = []
        client.query(
          createReleaseListQuery({filterBy: JSON.stringify(releaseFilterParams)})
        ).then(({data}) => {
          vm.loading = false
          vm.releases = data.releases
        })

        releaseFilterParams['status'] = 'bestsellers'
        this.bestsellers = []
        this.bsLoading = true
        client.query(
          createReleaseListQuery({filterBy: JSON.stringify(releaseFilterParams)})
        ).then(({data}) => {
          vm.bestsellers = data.releases
          vm.bsLoading = false
        })
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
