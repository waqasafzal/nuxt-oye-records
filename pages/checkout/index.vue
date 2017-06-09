<template>
  <div class="checkout">
    <keep-alive>
      <component :is="currentCheckoutView"></component>
    </keep-alive>
  </div>
</template>

<script>
  import CheckoutImpossible from '~/components/checkout/CheckoutImpossible'
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
        var currentCheckoutView = CheckoutImpossible
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
      // checkout?authResult=PENDING&merchantReference=117134&merchantSig=rAu7yMZaVtYJ%2B7IZK5dKC9JJWitDvuK6lbiN6du1zoQ%3D&paymentMethod=sepadirectdebit&pspReference=8514970348545135&shopperLocale=de_DE&skinCode=ru4CHIJf
    },
    methods: {
      calculateCheckoutState () {
        this.$store.dispatch('enterCheckout')
      }
    }
  }
</script>
