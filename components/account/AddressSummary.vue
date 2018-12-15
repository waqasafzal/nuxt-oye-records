<template>
  <div class="summary">
    <div class="d-flex flex-row justify-content-between summary__header">
      <div class="category"><slot/></div>
      <div 
        class="change" 
        @click="onChange">Change</div>
    </div>
    <div class="summary__body">
      <div class="name">{{ address.firstName }} {{ address.lastName }}</div>
      <div class="street">{{ address.street }} {{ address.number }}</div>
      <div class="zip">{{ address.zip }} {{ address.city }}</div>
      <div class="country">{{ address.country }}</div>
      <loading-spinner :loading="loading"/>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '../shared/LoadingSpinner'
export default {
  name: 'AddressSummary',
  components: { LoadingSpinner },
  props: {
    address: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {
      loading: false,
      loaded: false
    }
  },
  created() {
    if (!this.loaded) {
      this.loading = true
      this.loaded = true
    }
  },
  updated() {
    this.loading = false
  },
  methods: {
    onChange() {
      this.$emit('change-address')
    }
  }
}
</script>
