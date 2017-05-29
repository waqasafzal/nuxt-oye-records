<template>
  <div>
    <front-page-teasers :featuredReleases="featuredReleases"
                        :singleRelease="singleOfTheWeek"
                        :albumRelease="albumOfTheWeek"
    ></front-page-teasers>
    <release-list-summary status="new" :releases="newReleases" :title="`New Releases`"></release-list-summary>
    <release-list-summary status="pre" :releases="preReleases" :title="`Coming Soon`"></release-list-summary>
    <h3>DJ Charts</h3>
    <div class="row">
      <chart-item class="col-6 col-md-3" :chart="chart.node" v-for="(chart, i) in charts.edges"></chart-item>
    </div>
    <release-list-summary status="back" :releases="backReleases" :title="`Back In Stock`"></release-list-summary>
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
      var filterByNew = JSON.stringify({status: 'new'})
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
              tracks {
                ...Tracks
              }
            }
            singleOfTheWeek {
              ...Release
              tracks {
                ...Tracks
              }
            }
            albumOfTheWeek {
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
