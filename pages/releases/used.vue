<template>
  <releases-page @genre-selected="onGenreChanged" :status="status" :pageSize="pageSize" :releases="releases" :loading="loading"></releases-page>
</template>

<script>
  import Vue from 'vue'

  import ReleasePage from '../../components/releases/ReleasePage.vue'
  import {ReleasePagingMixin} from '../../components/releases/releases-paging-mixin'

  Vue.component('releases-page', ReleasePage)

  const filterBy = JSON.stringify({
    status: 'used'
  })

  export default {
    name: 'PreOrderPage',
    mixins: [ReleasePagingMixin(filterBy)],
    data: function () {
      return {
        pageSize: 5,
        status: 'used'
      }
    },
    head () {
      return {
        title: 'OYE Records - Used Vinyl',
        meta: [
          {
            hid: 'title',
            property: 'og:title',
            content: 'OYE Records - Used Vinyl'
          },
          {
            hid: 'description',
            property: 'description',
            content: 'Save money and dig for some lost exclusives.'
          }
        ]
      }
    }
  }
</script>
