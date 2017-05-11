<template id="releasepage">
  <div class="row">
    <div class="col-12">
      <div class="page__header">{{ category }}</div>
      <release-list id="releaselist" class="releaselist-box" :releases="releases" :loading="loading"></release-list>
    </div>
  </div>
</template>

<script>

  import Vue from 'vue'

  import ReleaseList from './ReleaseList.vue'
  import NoResults from '../shared/NoResults.vue'

  Vue.component('noresults', NoResults)
  Vue.component('release-list', ReleaseList)

  export default {
    name: 'ReleasePage',
    props: ['pageSize', 'status', 'releases', 'loading'],
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
          return 'Upcoming'
        } else if (this.status === 'used') {
          return 'Used Vinyl'
        }
      }
    }
  }

</script>
