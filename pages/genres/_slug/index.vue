<template>
  <div class="container-fluid">
    <div 
      v-if="detailGenre" 
      class="page__header">
      <h1>
        {{ detailGenre.name }}
      </h1>
      <dropdown 
        v-if="detailGenre.subgenres && detailGenre.subgenres.length > 0"
        :values="detailGenre.subgenres"
        class="d-none d-md-inline-block genres__detail__subgenre__selector"
        @selected="onSelected">Select Subgenre
      </dropdown>
    </div>
    <release-filter-panel 
      :change-genre="typeof detailGenre === 'undefined'" 
      :meta-genres="metaGenres" 
      class="d-flex d-md-none" 
      @filter-changed="setFilterOptions">
      <template v-if="detailGenre">{{ detailGenre.name }}</template>
    </release-filter-panel>
    <div 
      v-if="bestsellers && bestsellers.edges.length > 0"
      class="genres__detail__bestseller d-none d-md-block">
      <div 
        v-if="detailGenre" 
        class="genres__detail__bestseller__header">Bestseller {{ detailGenre.name }}</div>
      <div 
        v-if="!bsLoading && bestsellers.edges.length > 0 || bestsellers.edges"
        class="genres__detail__bestseller__carousel row">
        <div 
          class="col-12" 
          @mouseenter="disableSlider" 
          @mouseleave="enableSlider">
          <div 
            class="slider-left-control" 
            @click="slideBackward"><img
              src="~assets/images/Slider_Arrow_Left_Icon.svg"></div>
          <div 
            class="slider-right-control" 
            @click="slideForward"><img
              src="~assets/images/Slider_Arrow_Right_Icon.svg"></div>
          <transition-group name="blend">
            <div 
              v-for="(value, p) in pages"
              v-if="p === currentSlide"
              :class="'carousel__item'" 
              :key="`page-${p}`" 
              transition="blend">
              <release-item 
                v-for="(release, i) in getBestsellers(p)"
                :release="release"
                :key="`releasess-${i}-${p}`"
                class="col-md-3 product-list bestseller__item"
              />
            </div>
          </transition-group>
          <div class="col-12 ">
            <div class="carousel__controls">
              <div 
                v-for="p in pages"
                :class="['carousel__controls__button', p === currentSlide ? 'active': '']"
                :key="`select-${p}`" 
                @click="selectSlide(p)"/>
            </div>
          </div>
        </div>
      </div>
      <loading-spinner :loading="bsLoading"/>
    </div>
    <release-list
      v-if="releases"
      :releases="releases" 
      :loading="loading"/>
  </div>
  <!--</div>-->
</template>

<script>
import ReleaseList from '~/components/releases/ReleaseList.vue'
import ReleaseItem from '~/components/releases/ReleaseItem'
import Dropdown from '~/components/shared/Dropdown'
import LoadingSpinner from '~/components/shared/LoadingSpinner'
import FilterResultsOptions from '../../../components/shared/FilterResultsOptions'
import GenreDropdown from '../../../components/features/mobile/GenreDropdown'
import {
  createGenreQuery,
  createMainGenresQuery
} from '../../../components/genres/queries'
import ReleaseFilterPanel from '../../../components/features/mobile/ReleaseFilterPanel'
import {
  getFilterByGenreParams,
  releaseFilterParams
} from '../../../utils/router'
import {createReleaseListQuery} from '../../../components/releases/queries'
import {ReleasePagingMixin} from '../../../components/releases/releases-paging-mixin'

const MAX_BESTSELLERS = 40

const filterByBestsellers = {
  filterBy: JSON.stringify({status: 'bestsellers'})
}
//
// const filterByGenre = {
//   filterBy: JSON.stringify({genre: })
// }

export default {
  name: 'GenreDetailPage',
  components: {
    ReleaseFilterPanel,
    GenreDropdown,
    FilterResultsOptions,
    LoadingSpinner,
    Dropdown,
    ReleaseItem,
    ReleaseList
  },
  mixins: [ReleasePagingMixin()],
  data: function() {
    let genreId = this.genreId
    const isSubgenre = typeof this.subGenreId !== 'undefined'
    if (isSubgenre) {
      genreId = this.subGenreId
    }
    return {
      sliderDisabled: false,
      relevantGenreId: genreId,
      isSubgenre: isSubgenre,
      genreSlug: this.slug,
      genreSubslug: this.subslug,
      showMobileDropdown: false,
      bsPageSize: 4,
      currentSlide: 1,
      filterBy: getFilterByGenreParams(this.$route)
    }
  },
  apollo: {
    releases: {
      ...createReleaseListQuery(),
      variables () {
        return {
          first: 30,
          after: '',
          filterBy: getFilterByGenreParams(this.$route)
        }
      }
    },
    metaGenres: {
      ...createMainGenresQuery(12)
    },
    detailGenre: {
      ...createGenreQuery(),
      variables () {
        const params = this.$route.params || {}
        let options = {
          slug: params.subslug || params.slug,
          isSubgenre: typeof params.subslug !== 'undefined'
        }
        if (this.$route.name === 'metagenres-slug') {
          options['meta'] = true
        }
        console.log('voptions ' + JSON.stringify(options))
        return {
          slug: options.slug,
          sub: options.isSubgenre || false,
          meta: options.meta || false
        }
      }
    },
    bestsellers: {
      ...createReleaseListQuery({...filterByBestsellers}),
      variables () {
        const route = this.$route
        const filterParams = releaseFilterParams (route.params, route)
        const filterBy = JSON.parse(filterByBestsellers.filterBy)
        Object.assign(filterParams, filterBy)
        return {
          first: 30,
          after: '',
          filterBy: JSON.stringify(filterParams)
        }
      }
    }
  },
  computed: {
    pages: function() {
      if (this.bestsellers && this.bestsellers.edges) {
        return Math.ceil(this.bestsellers.edges.length / this.bsPageSize)
      }
      return 0
    },
    bsLoading() {
      return this.$apollo.queries.bestsellers.loading
    },
    loading() {
      return this.$apollo.queries.releases.loading
    }
  },
  watch: {
    $route({params, name}) {
      console.log('options ' + JSON.stringify(options))

      this.genre = params.genre
      let slug = params.slug
      let subslug = params.subslug

      // if (typeof this.detailGenre === 'undefined') {
      const genreOptions = {
        slug: subslug || slug,
        sub: typeof subslug === 'undefined'
      }

      if (name === 'metagenres-slug') {
        genreOptions['meta'] = true
      }

      this.$apollo.queries.detailGenre.setVariables({
        slug: params.slug,
        sub: params.isSubgenre || false,
        meta: params.meta || false
      })

      let filterParams = releaseFilterParams(options.params, options.route)

      this.$apollo.queries.releases.setVariables({
          first: 30,
          after: '',
          filterBy: JSON.stringify(filterParams)
      })

      this.$apollo.queries.bestsellers.setVariables({
        first: 30,
        after: '',
        filterBy: Object.assign({}, filterParams, {status: 'bestsellers'})
      })
        // .query(
        //   createReleaseListQuery({ filterBy: JSON.stringify(filterParams) })
        // )
        // .then(({ data }) => {
        //   vm.bestsellers = data.releases
        //   vm.bsLoading = false
        // })
    }
  },
  mounted() {
    var vm = this
    window.addEventListener('visibilitychange', function() {
      let state = document.visibilityState
      if (state === 'visible') {
        vm.startAutopager()
      } else {
        vm.stopAutopager()
      }
    })
    this.startAutopager()
  },
  methods: {
    setFilterOptions(options) {
      this.onFilterChanged(options)
    },
    getBestsellers(pageIndex) {
      let from = (pageIndex - 1) * this.bsPageSize
      let to = pageIndex * this.bsPageSize
      var bestsellers = []
      let bestsellerEdges = this.bestsellers.edges
      for (var i = from; i < to && i < bestsellerEdges.length; i++) {
        const bestsellerEdge = bestsellerEdges[i]
        if (typeof bestsellerEdge !== 'undefined') {
          bestsellers.push(bestsellerEdge.node)
        }
      }
      return bestsellers
    },
    selectSlide(index) {
      if (index !== this.currentSlide) {
        this.currentSlide = index
      }
    },
    slideBackward() {
      this.decrementSlide()
      this.stopAutopager()
      this.startAutopager()
    },
    slideForward() {
      this.incrementSlide()
      this.stopAutopager()
      this.startAutopager()
    },
    disableSlider() {
      //        this.sliderDisabled = true
      this.stopAutopager()
    },
    enableSlider() {
      //        this.sliderDisabled = false
      this.startAutopager()
    },
    incrementSlide() {
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
    decrementSlide() {
      if (!this.sliderDisabled) {
        if (this.pages) {
          if (this.currentSlide > 1) {
            this.currentSlide--
          } else {
            this.currentSlide = this.pages
          }
        }
      }
    },
    startAutopager() {
      if (!this.autopager) {
        this.autopager = window.setInterval(this.incrementSlide, 5000)
      }
    },
    stopAutopager() {
      if (this.autopager) {
        window.clearInterval(this.autopager)
        this.autopager = undefined
      }
    },
    onSelected(value) {
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
  }
}
</script>

<style>
.blend-enter-active,
.blend-leave-active {
  transition: opacity 0.3s ease;
}

.blend-enter,
.blend-leave-active {
  height: 0;
  opacity: 0;
}
</style>
