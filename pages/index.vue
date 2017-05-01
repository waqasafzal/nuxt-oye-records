<template>
  <div>
    <front-page-teasers :mainRelease="mainRelease"
                        :singleRelease="singleOfTheWeek"
                        :albumRelease="albumOfTheWeek"
    ></front-page-teasers>
    <release-list-summary status="new" :releases="newReleases" :title="`New Releases`"></release-list-summary>
    <release-list-summary status="pre" :releases="preReleases" :title="`Coming Soon`"></release-list-summary>
    <h3>DJ Charts</h3>
    <release-list-summary status="back" :releases="backReleases" :title="`Back In Stock`"></release-list-summary>
  </div>
</template>

<script>
  import FrontPageTeasers from '../components/features/FrontPageTeasers'
  import ReleaseListSummary from '../components/releases/ReleaseListSummary'
  import { createReleaseBaseDetailsQuery, createReleaseListQuery } from '../components/releases/queries'
  import client from '../plugins/apollo'

  export default {
    components: {ReleaseListSummary, FrontPageTeasers},
    name: 'OyeIndex',
    async asyncData ({params}) {
      var filterByNew = JSON.stringify({status: 'new'})
      let newReleases = await client.query(createReleaseListQuery({first: 12, filterBy: filterByNew}))

      var filterByBack = JSON.stringify({status: 'back'})
      let backReleases = await client.query(createReleaseListQuery({first: 6, filterBy: filterByBack}))

      var filterByPre = JSON.stringify({status: 'pre'})
      let preReleases = await client.query(createReleaseListQuery({first: 6, filterBy: filterByPre}))

      let mainRelease = await client.query(createReleaseBaseDetailsQuery('lastrack-plan-a-trois'))

      let singleOfTheWeek = await client.query(createReleaseBaseDetailsQuery('psychemagik-presents-ritual-chants-dance'))

      let albumOfTheWeek = await client.query(createReleaseBaseDetailsQuery('moscoman-judahs-lion'))
      return {
        preReleases: preReleases.data.releases,
        newReleases: newReleases.data.releases,
        backReleases: backReleases.data.releases,
        mainRelease: mainRelease.data.release,
        singleOfTheWeek: singleOfTheWeek.data.release,
        albumOfTheWeek: albumOfTheWeek.data.release
      }
    }
  }
</script>
