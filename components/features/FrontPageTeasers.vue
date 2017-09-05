<template>
  <div>
    <div class="row frontpage__teaser">
      <div class="col-12 frontpage__teaser__content">
        <div class="slider-left-control" @click="slideBackward"><img src="~assets/images/Slider_Arrow_Left_Icon.svg"/></div>
        <div class="slider-right-control" @click="slideForward"><img src="~assets/images/Slider_Arrow_Right_Icon.svg"/></div>
        <div class="slider" @mouseenter="disableSlider" @mouseleave="enableSlider">
          <template v-for="(release, i) in featuredReleases">
            <transition name="slide-fade" mode="out-in">
              <div :key="'release-'+i"
                   v-show="i === currentFeature"
                   class="slide">
                <template v-if="!$store.state.isSmallScreen">
                  <div class="slide__inner" :style="`background-image: url(${release.featureImageUrl})`">
                    <div class="feature-category">
                      <nuxt-link :to="{name: 'releases-new'}">New In Stock</nuxt-link>
                    </div>
                    <nuxt-link class="release-info" :key="'release-'+i" :to="{name: 'releases-slug', params: {slug: release.slug}}">
                      <div class="release-name">
                        <div class="frontpage__teaser__artist">{{ release.name }}</div>
                        <div class="frontpage__teaser__title">{{ release.title }}</div>
                      </div>
                      <release-button-bar :release="release" :size=48></release-button-bar>
                    </nuxt-link>
                  </div>
                </template>
                <template v-else>
                  <div class="slide__inner">
                    <div class="release">
                      <div class="release-image">
                        <img :src="release.featureImageUrl" />
                        <div class="release-navigation d-flex">
                          <play-release-button class="vmargin-auto" :size="100" :release="release"></play-release-button>
                          <!--<release-button-bar :size=48 :release="release"></release-button-bar>-->
                        </div>
                      </div>
                    </div>
                    <div class="release-action d-flex flex-row justify-content-between">
                      <div class="release-info">
                        <div class="release-artist">
                          {{ release.name }}
                        </div>
                        <div class="release-artist">
                          {{ release.title }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </transition>
          </template>
        </div>
      </div>
    </div>
    <div class="row frontpage__weekly__panel">
      <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 frontpage__weekly__item__cell">
        <week-feature class="frontpage__weekly__item" :release="singleRelease"
                      :category="`Single Of The Week`"></week-feature>
      </div>
      <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 frontpage__weekly__item__cell">
        <week-feature class="frontpage__weekly__item" :release="albumRelease"
                      :category="`Album Of The Week`"></week-feature>
      </div>
    </div>
  </div>
</template>

<script>
  import WeekFeature from './WeekFeature'
  import ReleaseButtonBar from '../releases/ReleaseButtonBar'
  import PlayReleaseButton from '../releases/PlayReleaseButton'
  import AddToCartButton from '../cart/AddToCartButton'
  import { swipedetect } from '~/utils/native'

  export default {
    components: {AddToCartButton, PlayReleaseButton, ReleaseButtonBar, WeekFeature},
    props: ['featuredReleases', 'singleRelease', 'albumRelease'],
    name: 'FrontPageTeasers',
    data: function () {
      return {
        currentFeature: 0,
        sliderDisabled: false
      }
    },
    methods: {
      incrementRelease () {
        if (!this.sliderDisabled) {
          if (this.featuredReleases) {
            if (this.currentFeature < this.featuredReleases.length - 1) {
              this.currentFeature++
            } else if (this.currentFeature === this.featuredReleases.length - 1) {
              this.currentFeature = 0
            }
          }
        }
      },
      decrementRelease () {
        if (!this.sliderDisabled) {
          if (this.featuredReleases) {
            if (this.currentFeature > 0) {
              this.currentFeature--
            } else {
              this.currentFeature = this.featuredReleases.length - 1
            }
          }
        }
      },
      slideForward () {
        this.incrementRelease()
        this.stopAutopager()
        this.startAutopager()
      },
      slideBackward () {
        this.decrementRelease()
        this.stopAutopager()
        this.startAutopager()
      },
      disableSlider () {
        this.sliderDisabled = true
      },
      enableSlider () {
        this.sliderDisabled = false
      },
      startAutopager () {
        if (!this.autopager) {
          this.autopager = window.setInterval(this.incrementRelease, 5000)
        }
      },
      stopAutopager () {
        if (this.autopager) {
          window.clearInterval(this.autopager)
          this.autopager = undefined
        }
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

      var el = document.getElementById('app')
      swipedetect(el, function (swipedir) {
        // swipedir contains either "none", "left", "right", "top", or "down"
        console.log(`swipedir ${swipedir}`)
//        el.innerHTML = 'Swiped <span style="color:yellow">' + swipedir + '</span>'
      })
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

  @keyframes left-to-right-out {
    from {
      margin-left: 0;
    }
    to {
      margin-left: 100%;
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

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
  }

  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: opacity 1s;
  }

  /*.fade-enter-to, .fade-leave {*/
  /*opacity: 1;*/
  /*}*/
  /*.fade-enter-to {*/
  /*opacity: 1;*/
  /*}*/

</style>
