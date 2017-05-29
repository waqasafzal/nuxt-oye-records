<template>
  <keep-alive>
    Hello
    <component :is="currentCheckoutView"></component>
  </keep-alive>
</template>

<script>
//  import CheckoutMethod from '~/components/checkout/CheckoutMethod'
  import CheckoutPayment from '~/components/checkout/CheckoutPayment'

  export default {
    name: 'Checkout',
    head: {
      script: [
        {src: 'https://test.adyen.com/hpp/cse/js/8214959999792925.shtml'}
      ]
    },
    data: function () {
      return {
        currentCheckoutView: CheckoutPayment
      }
    },
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
