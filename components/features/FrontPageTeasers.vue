<template>
  <div>
    <div class="row frontpage__teaser">
      <div class="col-12 frontpage__teaser__content">
        <div class="slider" @mouseenter="disableSlider" @mouseleave="enableSlider">
          <template v-for="(release, i) in featuredReleases">
            <transition name="slide-fade" mode="out-in">
              <div :key="'release-'+i"
                   v-if="i === currentFeature"
                   class="slide"
                   :style="`background-image: url(${release.thumbnailUrl})`">
                <nuxt-link :to="{name: 'releases-slug', params: {slug: release.slug}}">
                  <div style="height: 100%;">
                    <div class="feature-category">New In Stock</div>
                    <div class="frontpage__teaser__artist">{{ release.artistFirstName }} {{ release.artistLastName}}

                    </div>
                    <div class="frontpage__teaser__title">{{ release.title }}</div>
                    <release-button-bar :release="release" :size=48></release-button-bar>
                  </div>
                </nuxt-link>
              </div>
            </transition>
          </template>
        </div>
      </div>
    </div>
    <div class="row frontpage__weekly__panel">
      <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 frontpage__weekly__item__cell">
        <week-feature class="frontpage__weekly__item" :release="singleRelease"
                      :category="`Single Of The Week`"></week-feature>
      </div>
      <div class="col-xl-6 col-md-12 col-sm-12 frontpage__weekly__item__cell">
        <week-feature class="frontpage__weekly__item" :release="albumRelease"
                      :category="`Album Of The Week`"></week-feature>
      </div>
    </div>
  </div>
</template>

<script>
  import WeekFeature from './WeekFeature'
  import ReleaseButtonBar from '../releases/ReleaseButtonBar'

  export default {
    components: {ReleaseButtonBar, WeekFeature},
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
      disableSlider () {
        this.sliderDisabled = true
      },
      enableSlider () {
        this.sliderDisabled = false
      }
    },
    mounted () {
      window.setInterval(this.incrementRelease, 5000)
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
