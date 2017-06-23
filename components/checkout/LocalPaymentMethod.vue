<template>
  <div class="payment__local">
    <img v-for="logo in logos" :src="logo" />
  </div>
</template>

<script>
  export default {
    name: 'LocalPaymentMethod',
    props: ['data', 'variant'],
    computed: {
      logos () {
        return this.$store.getters.getLogos(this.variant)
      }
    }
  }
</script>
