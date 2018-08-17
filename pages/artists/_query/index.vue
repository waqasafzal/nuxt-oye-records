<template>
  <query-result-page :releasesTotal="releasesTotal"
                     :query="query"
                     :loadingReleases="loading"
                     :releaseResults="releases"></query-result-page>
</template>

<script>
  import apolloClient from '~/plugins/apollo'
  import {ReleasePagingMixin} from '../../../components/releases/releases-paging-mixin'
  import { createReleaseListQuery } from '../../../components/releases/queries'
  import QueryResultPage from '../../../components/search/QueryResultPage'

  export default {
    components: {QueryResultPage},
    name: 'ArtistReleasesPage',
    mixins: [ReleasePagingMixin()],
    data: function () {
      return {
        filterBy: JSON.stringify({
          artist: this.$route.params.query
        })
      }
    },
    head () {
      return {
        title: `Artist ${this.query} at OYE Records`,
        meta: [
          {
            hid: 'og:title',
            property: 'og:title',
            content: `Artist ${this.query} at OYE Records`
          }
        ]
      }
    },
    computed: {
      releasesTotal () {
        return this.releases.edges.length
      }
    },
    asyncData: async function ({params}) {
      let filterBy = JSON.stringify({
        artist: params.query
      })
      let {data} = await apolloClient.query(
        createReleaseListQuery({
          filterBy: filterBy
        })
      )
      return {
        releases: data.releases,
        query: params.query
      }
    }
  }
</script>
