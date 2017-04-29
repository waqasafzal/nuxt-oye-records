<template>
  <div>
    <front-page-teasers></front-page-teasers>
    <release-list-summary status="new" pageSize=3  :title="`New Releases`"></release-list-summary>
    <release-list-summary status="pre" :title="`Coming Soon`"></release-list-summary>
    <h3>DJ Charts</h3>
    <release-list-summary status="back" :title="`Back In Stock`"></release-list-summary>
  </div>
</template>

<script>
  import FrontPageTeasers from '../components/features/FrontPageTeasers'
  import ReleaseListSummary from '../components/releases/ReleaseListSummary'

  export default {
    components: {ReleaseListSummary, FrontPageTeasers},
    name: 'OyeIndex'
  }
</script>
