<template>
  <query-result-page :releasesTotal="releasesTotal"
                     :query="query"
                     :loadingReleases="loadingReleases"
                     :releaseResults="releases"></query-result-page>
</template>

<script>
  import apolloClient from '~/plugins/apollo'
  import {ReleasePagingMixin} from '../../../components/releases/releases-paging-mixin'
  import { createReleaseListQuery } from '../../../components/releases/queries'
  import QueryResultPage from '../../../components/search/QueryResultPage'

  export default {
    components: {QueryResultPage},
    name: 'LabelReleasesPage',
    mixins: [ReleasePagingMixin()],
    data: function () {
      return {
        filterBy: JSON.stringify({
          label: this.query
        }),
        loadingReleases: false
      }
    },
    computed: {
      releasesTotal () {
        return this.releases.edges.length
      }
    },
    asyncData: async function ({params}) {
      let filterBy = JSON.stringify({
        label: params.query
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
    },
    methods: {
      loadMore () {

      }
    }
  }
</script>
