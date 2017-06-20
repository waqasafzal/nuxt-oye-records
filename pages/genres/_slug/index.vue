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
        <div class="col-12" @mouseenter="disableSlider" @mouseleave="enableSlider">
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
  import ReleaseList from '~/components/releases/ReleaseList.vue'
  import {getReleaseListColumnNumber} from '~/components/utils'
  import ReleaseItem from '~/components/releases/ReleaseItem'
  import Dropdown from '~/components/shared/Dropdown'
  import LoadingSpinner from '~/components/shared/LoadingSpinner'
  import client from '~/plugins/apollo'
  import { createReleaseListQuery } from '~/components/releases/queries'
  import { createGenreQuery } from '~/components/genres/queries'
  import {ReleasePagingMixin} from '~/components/releases/releases-paging-mixin'

  const MAX_BESTSELLERS = 40

  const releaseFilterParams = function (params, route) {
    let releaseFilterParams = {}
    if (route && route.name === 'metagenres-slug') {
      releaseFilterParams['metagenres'] = [params.slug]
    } else if (params.subslug) {
      releaseFilterParams['subgenres'] = [params.subslug]
    } else if (params.slug) {
      releaseFilterParams['genres'] = [params.slug]
    }
    return releaseFilterParams
  }

  export default {
    components: {
      LoadingSpinner,
      Dropdown,
      ReleaseItem,
      ReleaseList
    },
    name: 'GenreDetailPage',
    props: ['genre'],
    mixins: [ReleasePagingMixin()],
    data: function () {
      var genreId = this.genreId
      var isSubgenre = typeof this.subGenreId !== 'undefined'
      if (isSubgenre) {
        genreId = this.subGenreId
      }
      return {
        releases: [],
        bestsellers: [],
        sliderDisabled: false,
        loading: false,
        bsLoading: false,
        relevantGenreId: genreId,
        isSubgenre: isSubgenre,
        detailGenre: this.genre,
        genreSlug: this.slug,
        genreSubslug: this.subslug,
        bsPageSize: getReleaseListColumnNumber() * (2 / 3),
        currentSlide: 1,
        filterBy: JSON.stringify(releaseFilterParams(this.$route.params, this.$route))
      }
    },
    async asyncData ({route, params}) {
      var filterParams = releaseFilterParams(params, route)

      let genreReleases = await client.query(createReleaseListQuery({filterBy: JSON.stringify(filterParams)}))

      filterParams['status'] = 'bestsellers'
      let bestsellerReleases = await client.query(createReleaseListQuery({filterBy: JSON.stringify(filterParams)}))

      let options = {
        slug: params.subslug || params.slug,
        isSubgenre: typeof params.subslug !== 'undefined'
      }
      if (route.name === 'metagenres-slug') {
        options['meta'] = true
      }
      let detailGenreResults = await client.query(createGenreQuery(options))

      return {
        detailGenre: detailGenreResults.data.detailGenre,
        releases: genreReleases.data.releases,
        bestsellers: bestsellerReleases.data.releases
      }
    },
    computed: {
      pages: function () {
        if (this.bestsellers.edges) {
          return Math.ceil(this.bestsellers.edges.length / this.bsPageSize)
        }
      }
    },
    methods: {
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
      disableSlider () {
        this.sliderDisabled = true
      },
      enableSlider () {
        this.sliderDisabled = false
      },
      incrementSlide () {
        if (!this.sliderDisabled) {
          if (this.pages) {
            if (this.currentSlide < this.pages) {
              this.currentSlide++
            } else if (this.currentSlide === this.pages) {
              this.currentSlide = 1
            }
          }
        }
      },
      startAutopager () {
        if (!this.autopager) {
          this.autopager = window.setInterval(this.incrementSlide, 5000)
        }
      },
      stopAutopager () {
        if (this.autopager) {
          window.clearInterval(this.autopager)
          this.autopager = undefined
        }
      },
      onSelected (value) {
        var location = {}
        if (value.parentGenre) {
          location['name'] = 'genres-slug-subslug'
          location['params'] = {
            slug: value.parentGenre.slug,
            subslug: value.slug,
            genre: value
          }
        } else {
          location['name'] = 'genres-slug'
          location['params'] = {
            slug: value.slug,
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
    },
    mounted () {
      var vm = this
      window.addEventListener('visibilitychange', function () {
        let state = document.visibilityState
        if (state === 'visible') {
          vm.startAutopager()
        } else {
          vm.stopAutopager()
        }
      })
      this.startAutopager()
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
