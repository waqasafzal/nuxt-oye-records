<template>
  <div class="checkout">
    <keep-alive>
      <component :is="currentCheckoutView"></component>
    </keep-alive>
  </div>
</template>

<script>

  import CheckoutMethod from '~/components/checkout/CheckoutMethod'
  import CheckoutPayment from '~/components/checkout/CheckoutPayment'
  import CheckoutAddresses from '~/components/checkout/CheckoutAddresses'
  import OrderReview from '~/components/checkout/OrderReview'
  import PayOrder from '~/components/checkout/PayOrder'

  export default {
    name: 'Checkout',
    head: {
      script: [
        {src: 'https://test.adyen.com/hpp/cse/js/8214959999792925.shtml'}
      ]
    },
    computed: {
      currentCheckoutView () {
        var currentCheckoutView
        let checkoutState = this.$store.getters.getCheckoutState
        if (checkoutState === 1) {
          currentCheckoutView = CheckoutMethod
        } else if (checkoutState === 2) {
          currentCheckoutView = CheckoutAddresses
        } else if (checkoutState === 3) {
          currentCheckoutView = CheckoutPayment
        } else if (checkoutState === 4) {
          currentCheckoutView = OrderReview
        } else if (checkoutState === 5) {
          currentCheckoutView = PayOrder
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
