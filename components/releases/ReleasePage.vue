<template id="releasepage">
  <div class="row">
    <div class="col-12">
      <div class="page__header">{{ category }}</div>
      <h3>Released Today</h3>
      <release-list id="releaselist" :releases="releases" :loading="loading"></release-list>
    </div>
  </div>
</template>

<script>

  import Vue from 'vue'

  import ReleaseList from './ReleaseList.vue'
  import NoResults from '../shared/NoResults.vue'
  import {ReleasePagingMixin} from '../releases/releases-paging-mixin'

  Vue.component('noresults', NoResults)
  Vue.component('release-list', ReleaseList)

  export default {
    name: 'ReleasePage',
    props: ['pageSize', 'status'],
    mixins: [ReleasePagingMixin],
    data: function () {
      return {
        filterBy: JSON.stringify({
          status: this.status
        })
      }
    },
    computed: {
      category: function () {
        if (this.status === 'new') {
          return 'New Releases'
        } else if (this.status === 'pre') {
          return 'Pre Order'
        } else if (this.status === 'used') {
          return 'Second Hand'
        }
      }
    }
  }

</script>
