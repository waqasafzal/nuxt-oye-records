<template>
  <releases-page :status="status" :pageSize="pageSize" :releases="releases" :loading="loading"></releases-page>
</template>

<script>
  import Vue from 'vue'

  import ReleasePage from '../../components/releases/ReleasePage.vue'
  import {ReleasePagingMixin} from '../../components/releases/releases-paging-mixin'

  Vue.component('releases-page', ReleasePage)

  const filterBy = JSON.stringify({
    status: 'back'
  })

  export default {
    name: 'BackInStockPage',
    mixins: [ReleasePagingMixin(filterBy)],
    data: function () {
      return {
        pageSize: 5,
        status: 'back'
      }
    },
    head () {
      return {
        title: 'OYE Records - Back In Stock',
        meta: [
          {
            hid: 'title',
            property: 'og:title',
            content: 'OYE Records - Back In Stock'
          }
        ]
      }
    }
  }
</script>
