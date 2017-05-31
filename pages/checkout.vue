<template>
  <keep-alive>
    Hello
    <component :is="currentCheckoutView"></component>
  </keep-alive>
</template>

<script>
  import CheckoutMethod from '~/components/checkout/CheckoutMethod'
  import CheckoutPayment from '~/components/checkout/CheckoutPayment'
  import CheckoutAddresses from '~/components/checkout/CheckoutAddresses'
  import OrderReview from '~/components/checkout/OrderReview'

  export default {
    name: 'Checkout',
    head: {
      script: [
        {src: 'https://test.adyen.com/hpp/cse/js/8214959999792925.shtml'}
      ]
    },
//    data: function () {
//      var currentCheckoutView
//      if (!this.$store.state.user.authenticated && !this.$store.state.checkout.guest) {
//        currentCheckoutView = CheckoutMethod
//      } else if (!this.$store.state.checkout.address) {
//        currentCheckoutView = CheckoutAdresses
//      } else if (!this.$store.state.checkout.payment) {
//        currentCheckoutView = CheckoutPayment
//      } else {
//        currentCheckoutView = CheckoutReview
//      }
//      return {
//        currentCheckoutView: currentCheckoutView
//      }
//    },
    computed: {
      currentCheckoutView () {
        var currentCheckoutView
        if (!this.$store.state.user.authenticated && !this.$store.state.checkout.guest) {
          currentCheckoutView = CheckoutMethod
        } else if (!this.$store.state.checkout.address) {
          currentCheckoutView = CheckoutAddresses
        } else if (!this.$store.state.checkout.payment) {
          currentCheckoutView = CheckoutPayment
        } else {
          currentCheckoutView = OrderReview
        }
        return currentCheckoutView
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
