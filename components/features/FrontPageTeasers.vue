<template>
  <div>
    <div class="row frontpage__teaser" v-if="release">
      <div class="col-12 frontpage__teaser__content" :style="`background-image: url(${release.thumbnailUrl})`">
        <nuxt-link :to="{name: 'release-id-slug', params: {id: release.pk, slug: release.slug}}">
          <div style="height: 100%;">
            <div class="feature-category">
              New In Stock

            </div>
            <div class="frontpage__teaser__artist">{{ release.artistFirstName }} {{ release.artistLastName }}</div>
            <div class="frontpage__teaser__title">{{ release.title }}</div>
            <release-button-bar :release="release" :size=48></release-button-bar>
          </div>
        </nuxt-link>
      </div>
    </div>
    <div class="row frontpage__weekly__panel">
      <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 frontpage__weekly__item__cell">
        <week-feature class="frontpage__weekly__item" :featureReleaseId="singleOfTheWeek"
                      :category="`Single Of The Week`"></week-feature>
      </div>
      <div class="col-xl-6 col-md-12 col-sm-12 frontpage__weekly__item__cell">
        <week-feature class="frontpage__weekly__item" :featureReleaseId="albumOfTheWeek"
                      :category="`Album Of The Week`"></week-feature>
      </div>
    </div>
  </div>
</template>

<script>
  import WeekFeature from './WeekFeature'
  import {ReleaseFeature} from '../releases/release-feature-mixin'
  import ReleaseButtonBar from '../releases/ReleaseButtonBar'

  export default {
    components: {ReleaseButtonBar, WeekFeature},
    mixins: [ReleaseFeature],
    name: 'FrontPageTeasers',
    data: function () {
      return {
        singleOfTheWeek: 'moscoman-judahs-lion',
        albumOfTheWeek: 'psychemagik-presents-ritual-chants-dance',
        slug: 'lastrack-plan-a-trois'
      }
    }
  }
</script>
