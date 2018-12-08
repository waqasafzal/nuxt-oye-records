<template>
  <div>
    <front-page-teasers :featuredReleases="featuredReleases"
                        :singleRelease="singleOfTheWeek"
                        :albumRelease="albumOfTheWeek"
    ></front-page-teasers>
    <div class="container-fluid">
      <release-list-summary status="new" :releases="newReleases" :title="`New Releases`"></release-list-summary>
      <release-list-summary status="pre" :releases="preReleases" :title="`Coming Soon`"></release-list-summary>
      <div class="charts__summary" v-if="charts && charts.edges.length > 0">
        <h3><nuxt-link :to="{name: 'charts'}">Charts</nuxt-link></h3>
        <div class="row">
          <chart-item class="col-12 col-sm-12 col-lg-3" :chart="chart.node" :key="'chart-'+i" v-for="(chart, i) in charts.edges"></chart-item>
        </div>
      </div>
      <release-list-summary status="back" :releases="backReleases" :title="`Back In Stock`"></release-list-summary>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag'
  import FrontPageTeasers from '../components/features/FrontPageTeasers'
  import ReleaseListSummary from '../components/releases/ReleaseListSummary'
  import client from '../plugins/apollo'
  import ReleaseList from '../components/releases/ReleaseList'
  import { release, tracksFragment } from '../components/graphql/releases'
  import ChartItem from '../components/charts/ChartItem'

  export default {
    components: {ChartItem, ReleaseListSummary, FrontPageTeasers},
    name: 'OyeIndex',
    async asyncData ({params}) {
      var filterByNew = JSON.stringify({status: 'new', period: 14})
      var filterByBack = JSON.stringify({status: 'back'})
      var filterByPre = JSON.stringify({status: 'pre'})
      let {data} = await client.query({
        query: gql`query FrontPageReleases($filterByNew: JSONString!, $filterByBack: JSONString!, $filterByPre: JSONString!) {
          newReleases: releases(first: 12, filterBy: $filterByNew) {
              ...Releases
          }
          backReleases: releases(first: 6, filterBy: $filterByBack) {
              ...Releases
          }
          preReleases: releases(first: 6, filterBy: $filterByPre) {
              ...Releases
          }
          features {
            features {
              ...Release
              featureImageUrl
              tracks {
                ...Tracks
              }
            }
            singleOfTheWeek {
              ...Release
              featureImageUrl
              tracks {
                ...Tracks
              }
            }
            albumOfTheWeek {
              featureImageUrl
              ...Release
              tracks {
                ...Tracks
              }
            }
          }
          charts(first: 4) {
            edges {
              node {
                slug
                name
                imageUrl(height: 168, width: 300)
                category
                artist {
                  slug
                  name
                  homeLabel
                }
                user {
                  firstName
                }
              }
            }
          }
        }
        ${ReleaseList.fragments.releases}
        ${release}
        ${tracksFragment}
        `,
        variables: {
          filterByNew: filterByNew,
          filterByBack: filterByBack,
          filterByPre: filterByPre
        }
      })

      return {
        preReleases: data.preReleases,
        newReleases: data.newReleases,
        backReleases: data.backReleases,
        featuredReleases: data.features.features,
        singleOfTheWeek: data.features.singleOfTheWeek,
        albumOfTheWeek: data.features.albumOfTheWeek,
        charts: data.charts
      }
    }
  }
</script>
