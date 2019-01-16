<template>
  <script 
    type="application/ld+json"
    v-html="productSchema"/>
</template>

<script>
  import {getReleaseProduct} from '../../utils/ldjson'

export default {
  name: 'JsonLdProductSchema',
  props: {
    release: {
      type: Object,
      default: null
    }
  },
  computed: {
    productSchema() {
      return getReleaseProduct(this.release, this.$router, {withPlace: true})
    }
  }
}
</script>
