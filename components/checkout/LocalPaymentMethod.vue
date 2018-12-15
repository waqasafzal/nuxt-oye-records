<template>
  <div class="payment__local">
    <img
      v-for="(logo, l) in logos"
      :key="`local-payment-logo-${l}`"
      :src="logo" >
  </div>
</template>

<script>
export default {
  name: 'LocalPaymentMethod',
  props: {
    data: {
      type: Object,
      default: null
    },
    variant: {
      type: Object,
      default: null
    }
  },
  computed: {
    logos() {
      return this.$store.getters.getLogos(this.variant)
    }
  }
}
</script>
