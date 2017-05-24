<template>
  <keep-alive>
    Hello
    <component :is="currentCheckoutView"></component>
  </keep-alive>
</template>

<script>
  import CheckoutMethod from '~/components/checkout/CheckoutMethod'
//  import Vue from 'vue'

//  Vue.component('checkout', CheckoutMethod)

  export default {
    name: 'Checkout',
    data: function () {
      return {
        currentCheckoutView: CheckoutMethod
      }
    },
//    components: {
//      'checkout': CheckoutMethod
//    },
    mounted () {
      this.calculateCheckoutState()
    },
    methods: {
      calculateCheckoutState () {
        this.$store.dispatch('enterCheckout')
      }
    }
  }
</script>
