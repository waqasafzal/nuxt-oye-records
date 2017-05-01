<template>
  <div>
    <div class="row frontpage__teaser" v-if="mainRelease">
      <div class="col-12 frontpage__teaser__content" :style="`background-image: url(${mainRelease.thumbnailUrl})`">
        <nuxt-link :to="{name: 'releases-slug', params: {slug: mainRelease.slug}}">
          <div style="height: 100%;">
            <div class="feature-category">
              New In Stock

            </div>
            <div class="frontpage__teaser__artist">{{ mainRelease.artistFirstName }} {{ mainRelease.artistLastName }}</div>
            <div class="frontpage__teaser__title">{{ mainRelease.title }}</div>
            <release-button-bar :release="mainRelease" :size=48></release-button-bar>
          </div>
        </nuxt-link>
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
    props: ['mainRelease', 'singleRelease', 'albumRelease'],
    name: 'FrontPageTeasers'
  }
</script>
