<template>
  <script 
    v-if="releases"
    type="application/ld+json"
    v-html="itemList" />
</template>

<script>
  import {getReleaseProduct} from '../../utils/ldjson'

  export default {
    name: 'JsonLdItemList',
    props: {
      releases: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      itemList() {
        return {
          '@context': 'http://schema.org',
          '@type': 'ItemList',
          url: __API__ + this.$route.path,
          numberOfItems: this.releases.length,
          itemListElement: this.releases.map(x => getReleaseProduct(x, this.$router))
        }
      }
    }
  }
</script>
