<template>
  <div>
    <div class="frontpage__teaser">
      <div class="container-fluid">
        <div class="row">
        </div>
        <div class="col-12 frontpage__teaser__content d-none d-lg-flex">
          <div class="slider-left-control" @click="slideBackward"><img src="~assets/images/Slider_Arrow_Left_Icon.svg"/>
          </div>
          <div class="slider-right-control" @click="slideForward"><img
              src="~assets/images/Slider_Arrow_Right_Icon.svg"/>
          </div>
          <div ref="slider" :class="['slider', animate ? 'animateXyz': '']" @mouseenter="disableSlider"
               @mouseleave="enableSlider">
            <template v-for="(release, i) in featuredReleases">
              <transition :name="transitionName" mode="out-in">
                <div :key="'release-'+i"
                     v-show="i === currentFeature"
                     ref="slide" :class="['slide', animate ? '': '']">
                  <div class="slide__inner" :style="backgroundImage(release)">
                    <div class="vmargin-auto">
                      <div class="feature-category">
                        <nuxt-link :to="{name: 'releases-new'}">
                          <template v-if="release.availability.status === 'upcoming'">Coming Soon</template>
                          <template v-else>New In Stock</template>
                        </nuxt-link>
                      </div>
                      <nuxt-link class="release-info" :key="'release-'+i"
                                 :to="{name: 'releases-slug', params: {slug: release.slug}}">
                        <div class="release-name">
                          <div class="frontpage__teaser__artist">{{ release.name }}</div>
                          <div class="frontpage__teaser__title">{{ release.title }}</div>
                        </div>
                        <release-button-bar :release="release" :size=48></release-button-bar>
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
            <agile :options="sliderOptions">
              <div class="slide" v-for="(release, i) in featuredReleases">
                <nuxt-link class="frontpage__teaser__item" :key="'release-'+i"
                           :to="{name: 'releases-slug', params: {slug: release.slug}}">
                  <img :src="release.featureImageUrl" />
                  <div class="d-flex release-name">
                    <nuxt-link class="category" :to="{name: 'releases-new'}">
                      <template v-if="release.availability.status === 'upcoming'">Coming Soon</template>
                      <template v-else>New In Stock</template>
                    </nuxt-link>
                    <div class="artist">{{i}} {{release.name}}</div>
                    <div class="title">{{release.title}}</div>
                    <release-button-bar :size=54 :release="release" ></release-button-bar>
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
          <week-feature class="frontpage__weekly__item" :release="singleRelease"
                        :category="`Single Of The Week`"></week-feature>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 frontpage__weekly__item__cell">
          <week-feature class="frontpage__weekly__item" :release="albumRelease"
                        :category="`Album Of The Week`"></week-feature>
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

  export default {
    components: {AddToCartButton, PlayReleaseButton, ReleaseButtonBar, WeekFeature},
    props: ['featuredReleases', 'singleRelease', 'albumRelease'],
    name: 'FrontPageTeasers',
    data: function () {
      return {
        currentFeature: 0,
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
      transitionName () {
        return this.touch ? '' : this.animate ? this.direction < 0 ? 'from-left' : 'from-right' : 'slide-fade'
      },
      nextLeft () {
        if (this.currentFeature > 0) {
          return this.currentFeature - 1
        } else {
          return this.featuredReleases.length - 1
        }
      },
      nextRight () {
        if (this.currentFeature < this.featuredReleases.length - 1) {
          return this.currentFeature + 1
        } else {
          return 0
        }
      }
    },
    methods: {
      incrementRelease (force) {
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
      decrementRelease (force) {
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
      slideForward () {
        this.incrementRelease(false)
        this.stopAutopager()
        this.startAutopager()
      },
      slideBackward () {
        this.decrementRelease(false)
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
      },
      backgroundImage (release) {
        if (!this.$store.state.isSmallScreen) {
          return {
            backgroundImage: `url(${release.featureImageUrl})`
          }
        }
        return {}
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

      // https://css-tricks.com/the-javascript-behind-touch-friendly-sliders/
      var sliderRef = this.$refs.slider
      var slides = this.$refs.slide
      var holderRef = this.$refs.holder

      if (navigator.msMaxTouchPoints) {
        sliderRef.classList.add('ms-touch')

        // Listed for the scroll event and move the image with translate.
        sliderRef.addEventListener('scroll', function () {
          slides.css('transform', 'translate3d(-' + (100 - vm.$el.scrollLeft() / 6) + 'px,0,0)')
        })
      } else {
        var slider = {

          // The elements.
          el: {
            slider: sliderRef,
            holder: holderRef,
            imgSlide: slides
          },

          // The stuff that makes the slider work.
          slideWidth: sliderRef.offsetWidth, // Calculate the slider width.

          // Define these as global variables so we can use them across the entire script.
          touchstartx: undefined,
          touchmovex: undefined,
          movex: undefined,
          index: 0,
          longTouch: undefined,
          lastLeft: undefined,
          lastRight: undefined,
          current: undefined,
          slideLongTouchTimeout: undefined,
          startAutopagerTimeout: undefined,

          // continued

          init: function () {
            this.bindUIEvents()
          },

          bindUIEvents: function () {
            clearTimeout(this.sliderLongTouchTimeout)
            this.el.slider.addEventListener('touchstart', function (event) {
              slider.start(event)
            })

            this.el.slider.addEventListener('touchmove', function (event) {
              slider.move(event)
            })

            this.el.slider.addEventListener('touchend', function (event) {
              slider.end(event)
            })

            this.longTouch = false
            this.sliderLongTouchTimeout = setTimeout(function () {
              // Since the root of setTimout is window we can’t reference this. That’s why this variable says window.slider in front of it.
              slider.longTouch = true
            }, 250)
          },

          start: function (event) {
            clearTimeout(this.sliderLongTouchTimeout)
            // Test for flick.
            this.longTouch = false
            this.sliderLongTouchTimeout = setTimeout(function () {
              slider.longTouch = true
            }, 250)

            // Get the original touch position.
            this.touchstartx = event.targetTouches[0].pageX

            // The movement gets all janky if there's a transition on the elements.
            vm.animate = false
            vm.touch = true

            for (var i = 0; i < this.el.imgSlide.length; i++) {
              if (i !== vm.currentFeature) {
                this.el.imgSlide[i].style.display = 'none'
              }
            }
          },

          move: function (event) {
            vm.stopAutopager()
            // Continuously return touch position.
            this.touchmovex = event.targetTouches[0].pageX
            // Calculate distance to translate holder.
            this.movex = (this.touchstartx - this.touchmovex)
            // Defines the speed the images should move at.

            if (this.current) {
              this.current.style.transform = ''
              this.current.style.left = ''
              this.current.style.display = 'none'
            }
            if (this.lastRight) {
              this.lastRight.style.transform = ''
              this.lastRight.style.left = ''
              this.lastRight.style.display = 'none'
            }
            if (this.lastLeft) {
              this.lastLeft.style.transform = ''
              this.lastLeft.style.left = ''
              this.lastLeft.style.display = 'none'
            }
            if (this.movex < 0) {
              this.lastLeft = this.el.imgSlide[vm.nextLeft]
              this.current = this.el.imgSlide[vm.currentFeature]
              this.current.style.left = -1 * this.movex + 'px'
              this.current.style.display = ''
              this.lastLeft.style.left = -1 * this.movex - this.slideWidth + 'px'
              this.lastLeft.style.display = ''
              vm.direction = 1
            } else if (this.movex > 0) {
              vm.direction = -1
              this.lastRight = this.el.imgSlide[vm.nextRight]
              this.current = this.el.imgSlide[vm.currentFeature]
              this.current.style.left = -1 * this.movex + 'px'
              this.current.style.display = ''
              this.lastRight.style.left = -1 * this.movex + this.slideWidth + 'px'
              this.lastRight.style.display = ''
            }
            vm.touch = true
          },

          end: function (event) {
            // Calculate the distance swiped.
            clearTimeout(this.startAutopagerTimeout)
            if (this.movex) {
              var absMove = Math.abs(this.movex)
              // Calculate the index. All other calculations are based on the index.
//            var newCurrent = null
              var changed = false
              if (absMove > this.slideWidth / 2) {
                if (this.movex > 0) {
                  vm.incrementRelease(true)
                  vm.direction = -1
//                newCurrent = this.lastRight
                  changed = true
                } else if (this.movex < 0) {
                  vm.decrementRelease(true)
                  changed = true
//                newCurrent = this.lastRight
                } else {
                }
              } else {
              }
              // Move and animate the elements.
              vm.animate = true
              console.log(`${vm.currentFeature} ${this.slideWidth} r: ${this.lastRight} l: ${this.lastLeft} c: ${this.current}`)
//            var s = this
//
//            if (!changed) {
//
//            }
              if (this.lastRight) {
//              this.lastRight.style.left = 'inherit'
                let left = parseInt(this.lastRight.style.left.split('px')[0])
                if (changed) {
                  this.lastRight.style.transform = 'translate3d(' + -1 * left + 'px,0,0)'
                  this.current.style.transform = 'translate3d(' + -1 * left + 'px,0,0)'
                } else {
                  let currentLeft = parseInt(this.current.style.left.split('px')[0])
                  this.lastRight.style.transform = `translate3d(${-1 * currentLeft}px, 0, 0)`
                  this.current.style.transform = `translate3d(${-1 * currentLeft}px, 0, 0)`
                }
              }
              if (this.lastLeft) {
                let left = parseInt(this.lastLeft.style.left.split('px')[0])
                if (changed) {
                  this.current.style.transform = 'translate3d(' + -1 * left + 'px,0,0)'
                  this.lastLeft.style.transform = 'translate3d(' + -1 * left + 'px,0,0)'
                } else {
                  let currentLeft = parseInt(this.current.style.left.split('px')[0])
                  this.lastLeft.style.transform = `translate3d(${-1 * currentLeft}px, 0, 0)`
                  this.current.style.transform = `translate3d(${-1 * currentLeft}px, 0, 0)`
                }
              }

              var lastLeft = this.lastLeft
              var lastRight = this.lastRight
              var current = this.current

              this.startAutopagerTimeout = setTimeout(function () {
                vm.touch = false
                vm.startAutopager()
                lastLeft.style.transform = ''
                lastLeft.style.left = ''
                lastRight.style.transform = ''
                lastRight.style.left = ''
                current.style.transform = ''
                current.style.left = ''
                var style = this.el.imgSlide[this.currentFeature].style
                style.left = ''
                style.transform = ''
              }, 300)

//              for (var i = 0; i < this.el.imgSlide.length; i++) {
//              console.log(`${i} ${i !== vm.currentFeature} current: ${vm.currentFeature} imgSlide: ${this.el.imgSlide[i]}`)
//                if (i !== vm.currentFeature) {
//                  this.el.imgSlide[i].style.display = 'none'
//                }
//              }
            }
          }
        }
        slider.init()
      }
    },
    beforeDestroy () {
      window.clearInterval(this.autopager)
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
    transition: all .7s;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
  }

  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: opacity 1s;
  }

  .slide-enter, .slide-leave-to {
    left: 0;
  }

  .slide-enter-active, .slide-leave-active {
    transition: left 1s;
  }

</style>
