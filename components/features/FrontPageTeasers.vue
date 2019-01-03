<template>
  <div v-if="featuredReleases">
    <div class="frontpage__teaser">
      <div class="container-fluid">
        <div class="row"/>
        <div class="col-12 frontpage__teaser__content d-none d-lg-flex">
          <div 
            class="slider-left-control" 
            @click="slideBackward"><img src="~/assets/images/Slider_Arrow_Left_Icon.svg">
          </div>
          <div 
            class="slider-right-control" 
            @click="slideForward"><img
              src="~/assets/images/Slider_Arrow_Right_Icon.svg">
          </div>
          <div 
            ref="slider" 
            :class="['slider', animate ? 'animateXyz': '']" 
            @mouseenter="disableSlider"
            @mouseleave="enableSlider">
            <template v-for="(release, i) in featuredReleases">
              <transition
                :key="'transition-release-'+i"
                :name="transitionName"
                mode="out-in">
                <div 
                  v-if="i === currentFeature"
                  ref="slide"
                  :key="'release-'+i" 
                  :class="['slide', animate ? '': '']">
                  <div 
                    :style="backgroundImage(release, i === currentFeature)"
                    class="slide__inner">
                    <div class="vmargin-auto">
                      <div class="feature-category">
                        <nuxt-link :to="{name: 'releases-new'}">
                          <template v-if="release.availability.status === 'upcoming'">Coming Soon</template>
                          <template v-else>New In Stock</template>
                        </nuxt-link>
                      </div>
                      <nuxt-link 
                        :key="'mobile-release-'+i" 
                        :to="{name: 'releases-slug', params: {slug: release.slug}}"
                        class="release-info">
                        <div class="release-name">
                          <div class="frontpage__teaser__artist">{{ release.name }}</div>
                          <div class="frontpage__teaser__title">{{ release.title }}</div>
                        </div>
                        <release-button-bar 
                          :release="release" 
                          :size="48"/>
                      </nuxt-link>
                    </div>
                  </div>
                </div>
              </transition>
            </template>
          </div>
        </div>
        <div class="col-12 frontpage__teaser__content d-lg-none">
          <no-ssr placeholder="Loading...">
            <agile 
              :options="sliderOptions" 
              @beforeChange="beforeAgileSlideChange($event)"
              @afterChange="afterAgileSlideChange($event)"
            >
              <div
                v-for="(release, i) in featuredReleases"
                :key="`release-${i}`"
                class="slide">
                <nuxt-link
                  v-if="[currentMobileSlide, nextMobileSlide].includes(i)" 
                  :key="'release-'+i"
                  :to="{name: 'releases-slug', params: {slug: release.slug}}"
                  class="frontpage__teaser__item"
                >
                  <img :data-src="release.featureImageUrl" >
                  <div class="d-flex release-name">
                    <nuxt-link 
                      :to="{name: 'releases-new'}" 
                      class="category">
                      <template v-if="release.availability.status === 'upcoming'">Coming Soon</template>
                      <template v-else>New In Stock</template>
                    </nuxt-link>
                    <div class="artist">{{ release.name }}</div>
                    <div class="title">{{ release.title }}</div>
                    <release-button-bar 
                      :size="54" 
                      :release="release"/>
                  </div>
                </nuxt-link>
              </div>
            </agile>
          </no-ssr>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row frontpage__weekly__panel">
        <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 frontpage__weekly__item__cell">
          <week-feature 
            :release="singleRelease" 
            :category="`Single Of The Week`"
            class="frontpage__weekly__item"/>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 frontpage__weekly__item__cell">
          <week-feature 
            :release="albumRelease" 
            :category="`Album Of The Week`"
            class="frontpage__weekly__item"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WeekFeature from './WeekFeature'
import ReleaseButtonBar from '../releases/ReleaseButtonBar'
import PlayReleaseButton from '../releases/PlayReleaseButton'
import AddToCartButton from '../cart/AddToCartButton'
import NoSSR from 'vue-no-ssr'

export default {
  name: 'FrontPageTeasers',
  components: {
    AddToCartButton,
    PlayReleaseButton,
    ReleaseButtonBar,
    WeekFeature,
    'no-ssr': NoSSR
  },
  props: {
    featuredReleases: {
      type: Array,
      default: null
    },
    singleRelease: {
      type: Object,
      default: null
    },
    albumRelease: {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {
      currentFeature: 0,
      currentMobileSlide: 0,
      nextMobileSlide: 0,
      sliderDisabled: false,
      animate: false,
      touch: false,
      direction: 0,
      sliderOptions: {
        autoplay: true,
        dots: false,
        arrows: false
      }
    }
  },
  computed: {
    transitionName() {
      return this.touch
        ? ''
        : this.animate
          ? this.direction < 0
            ? 'from-left'
            : 'from-right'
          : 'slide-fade'
    },
    nextLeft() {
      if (this.currentFeature > 0) {
        return this.currentFeature - 1
      } else {
        return this.featuredReleases.length - 1
      }
    },
    nextRight() {
      if (this.currentFeature < this.featuredReleases.length - 1) {
        return this.currentFeature + 1
      } else {
        return 0
      }
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
  beforeDestroy() {
    window.clearInterval(this.autopager)
  },
  methods: {
    incrementRelease(force) {
      if (force || !this.sliderDisabled) {
        if (this.featuredReleases.length > 0) {
          if (this.currentFeature < this.featuredReleases.length - 1) {
            this.currentFeature++
          } else {
            this.currentFeature = 0
          }
        }
      }
    },
    decrementRelease(force) {
      if (force || !this.sliderDisabled) {
        if (this.featuredReleases.length > 0) {
          if (this.currentFeature > 0) {
            this.currentFeature--
          } else {
            this.currentFeature = this.featuredReleases.length - 1
          }
        }
      }
    },
    slideForward() {
      this.incrementRelease(false)
      this.stopAutopager()
      this.startAutopager()
    },
    slideBackward() {
      this.decrementRelease(false)
      this.stopAutopager()
      this.startAutopager()
    },
    disableSlider() {
      this.sliderDisabled = true
    },
    enableSlider() {
      this.sliderDisabled = false
    },
    startAutopager() {
      if (!this.autopager) {
        this.autopager = window.setInterval(this.incrementRelease, 5000)
      }
    },
    stopAutopager() {
      if (this.autopager) {
        window.clearInterval(this.autopager)
        this.autopager = undefined
      }
    },
    beforeAgileSlideChange(event) {
      console.log(event)
      this.currentMobileSlide = event.currentSlide
      this.nextMobileSlide = event.goToNext
    },
    afterAgileSlideChange(event) {
      this.currentMobileSlide = event.currentSlide
    },
    backgroundImage(release, show) {
      console.log('bi: ' + release.slug + ' ' + show);
      if (!this.$store.state.isSmallScreen) {
        const backgroundImage = show && `url(${release.featureImageUrl})` || 'none'
        return { backgroundImage }
      }
      return {}
    }
  }
}
</script>

<style>
@keyframes left-to-right-in {
  from {
    margin-left: -100%;
  }
  to {
    margin-left: 0;
  }
}

@keyframes right-to-left-in {
  from {
    margin-left: 100%;
  }
  to {
    margin-left: 0;
  }
}

@keyframes left-to-right-out {
  from {
    margin-left: 0;
  }
  to {
    margin-left: 100%;
  }
}

@keyframes right-to-left-out {
  from {
    margin-left: 0;
  }
  to {
    margin-left: -100%;
  }
}

.from-right-enter-active {
  animation-name: left-to-right-in;
  animation-duration: 1s;
}

.from-right-leave-active {
  animation-name: left-to-right-out;
  animation-duration: 1s;
}

.from-left-enter-active {
  animation-name: right-to-left-in;
  animation-duration: 1s;
}

.from-left-leave-active {
  animation-name: right-to-left-out;
  animation-duration: 1s;
  transition: all 0.7s;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 1s;
}

.slide-enter,
.slide-leave-to {
  left: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: left 1s;
}
</style>
