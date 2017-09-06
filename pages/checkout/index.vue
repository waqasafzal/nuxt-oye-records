<template>
  <div class="checkout">
    <keep-alive>
      <component v-if="currentCheckoutView" :is="currentCheckoutView"></component>
    </keep-alive>
    <checkout-buttons></checkout-buttons>
  </div>
</template>

<script>
  import CheckoutMethod from '~/components/checkout/CheckoutMethod'
  import CheckoutPayment from '~/components/checkout/CheckoutPayment'
  import CheckoutAddresses from '~/components/checkout/CheckoutAddresses'
  import OrderReview from '~/components/checkout/OrderReview'
  import PayOrder from '~/components/checkout/PayOrder'
  import OrderComplete from '~/components/checkout/OrderComplete'
  import OrderVerification from '~/components/checkout/OrderVerification'
  import * as types from '../../store/types'
  import CheckoutOverview from '../../components/checkout/CheckoutOverview'
  import CheckoutButtons from '../../components/checkout/CheckoutButtons'

  export default {
    components: {CheckoutButtons, CheckoutOverview},
    name: 'Checkout',
    computed: {
      currentCheckoutView () {
        var currentCheckoutView = null
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
        } else if (checkoutState === 6) {
          currentCheckoutView = OrderComplete
        } else if (checkoutState === 7) {
          currentCheckoutView = OrderVerification
        }
        return currentCheckoutView
      }
    },
    watch: {
      currentCheckoutView (view) {
        if (this.checkoutView === CheckoutAddresses && this.checkoutView !== view) {
          if (this.$store.getters.hasChangedAddresses) {
            this.$store.dispatch('saveAddresses')
          }
        }
        this.checkoutView = view
      }
    },
    mounted () {
      this.calculateCheckoutState()
      let query = this.$route.query
      if (query.verify) {
        this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 7)
      }
    },
    methods: {
      calculateCheckoutState () {
        this.$store.dispatch('enterCheckout')
      }
    }
  }
</script>
