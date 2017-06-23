<template>
  <div class="checkout">
    <keep-alive>
      <component :is="currentCheckoutView"></component>
    </keep-alive>
  </div>
</template>

<script>
  import apolloClient from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import store from '~/store'
  import * as types from '~/store/types'
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
    async asyncData ({params}) {
      var {data} = await apolloClient.query({
        query: gql`query Country {
          countries {
            name
          }
        }
        `
      })
      store.commit(types.SET_COUNTRIES, data.countries)
      return {}
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
    },
    methods: {
      calculateCheckoutState () {
        this.$store.dispatch('enterCheckout')
      }
    }
  }
</script>
