<template>
  <div class="summary">
    <div class="d-flex flex-row justify-content-between summary__header">
      <div class="category"><slot></slot></div>
      <div @click="onChange" class="change">Change</div>
    </div>
    <div class="summary__body">
      <div class="name">{{address.firstName}} {{address.lastName}}</div>
      <div class="street">{{address.street}} {{address.number}}</div>
      <div class="street">{{address.zip}} {{address.city}}</div>
      <div class="street">{{address.country}}</div>
      <loading-spinner :loading="loading"></loading-spinner>
    </div>
  </div>
</template>

<script>
  import LoadingSpinner from '../shared/LoadingSpinner'
  export default {
    components: {LoadingSpinner},
    name: 'AddressSummary',
    props: ['address'],
    data: function () {
      return {
        loading: true
      }
    },
    methods: {
      onChange () {
        this.$emit('change-address')
      }
    },
    beforeMount () {
    },
    updated () {
      this.loading = false
    }
  }
</script>
