<template>
  <div class="checkout__review">
    <h3>Review your order</h3>
    <checkout-overview class="checkout__overview"></checkout-overview>
    <cart-content :review="true"></cart-content>
    <div v-show="placingOrder" class="placing-order">
      <div class="vmargin-auto hmargin-auto">
        <loading-spinner :loading="true"></loading-spinner>
        <span class="loading-text">Placing order...</span>
      </div>
    </div>
  </div>
</template>

<script>
  import CartContent from '../cart/CartContent'
  import ProceedButton from '../shared/ProceedButton'
  import * as types from '../../store/types'
  import apolloClient from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import { order, oyeCart } from '../graphql/cart'
  import CheckoutOverview from './CheckoutOverview'
  import LoadingSpinner from '../shared/LoadingSpinner'
  import { mapGetters } from 'vuex'

  export default {
    components: {LoadingSpinner, CheckoutOverview, ProceedButton, CartContent},
    name: 'OrderReview',
    data: function () {
      return {
        placingOrder: false
      }
    },
    watch: {
      selectedPaymentMethod (value) {
        this.switchButtonText(value)
      }
    },
    computed: {
      isSelfCollector () {
        let shippingOption = this.$store.getters.getShippingOption
        return shippingOption && shippingOption.id === '-1'
      },
      cartId () {
        return this.$store.getters.getCart.pk
      },
      porto () {
        let shippingOption = this.$store.getters.getShippingOption
        return shippingOption && shippingOption.price
      },
      shippingId () {
        let address = this.$store.getters.getShippingAddress
        return address && address.id
      },
      billingId () {
        let address = this.$store.getters.getBillingAddress
        return address && address.id
      },
      paymentOption () {
        return this.$store.getters.getSelectedPaymentOption
      },
      selectedPaymentMethod () {
        return this.$store.getters.getSelectedPaymentMethod
      },
      vatExcluded () {
        return this.$store.getters.isVatExcluded
      },
      isLocalPayment () {
        let option = this.paymentOption
        return !['creditcard', 'cash'].includes(option)
      },
      ...mapGetters(['isOnlyPresale'])
    },
    methods: {
      onPlaceOrder () {
        if (!this.$store.state.checkout.termsAgreed) {
          this.$store.dispatch('addAlert', {level: 'error', message: 'You must agree to the terms of conditions to proceed.'})
        } else {
          this.placingOrder = true
          apolloClient.mutate({
            mutation: gql`mutation PlaceOrder($cartId: ID!, $isSelfCollector: Boolean, $porto: Float, $shippingId: ID, $billingId: ID, $payment: String, $paymentMethodId: ID, $vatExcluded: Boolean, $email: String) {
              placeOrder(cartId: $cartId, isSelfCollector: $isSelfCollector, porto: $porto, billingId: $billingId, shippingId: $shippingId, payment: $payment, paymentMethodId: $paymentMethodId, vatExcluded: $vatExcluded, email: $email) {
                order {
                  ...Order
                  releases {
                    quantity
                    release {
                      ...Release
                      smallImageUrl: thumbnailUrl(size: 100)
                    }
                  }
                }
                paymentUrl
                notInStock {
                  quantity
                  release {
                    slug
                    name
                    title
                  }
                }
                cart {
                  ...OyeCart
                }
              }
            }
            ${order}
            ${oyeCart}
            `,
            variables: {
              isSelfCollector: this.isSelfCollector,
              billingId: this.billingId,
              shippingId: this.shippingId,
              cartId: this.cartId,
              porto: this.porto,
              vatExcluded: this.vatExcluded,
              payment: this.paymentOption && this.paymentOption.id || '',
              paymentMethodId: this.selectedPaymentMethod && this.selectedPaymentMethod.id,
              email: this.$store.state.checkout.guestEmail
            }
          }).then(
            ({data}) => {
              this.placingOrder = false
              if (data.placeOrder.paymentUrl) {
                this.$store.commit(types.SET_PAYPAL_PAYMENT_URL)
                this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 8)
                window.location.href = data.placeOrder.paymentUrl
              } else {
                let order = data.placeOrder.order
                this.$store.commit(types.SET_UNPAID_ORDER, order)
                if (!order.isPaid && !order.isSelfCollector) {
                  this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 5)
                  if (order.shippingCountry) {
                    this.$store.dispatch('setShippingCountry', order)
                  }
                  this.$store.commit(types.ADD_ALERT, {
                    level: 'info',
                    message: 'Your order has been placed. Please fulfill order with payment.'
                  })
                } else {
                  let purchases = this.$store.getters.getPurchases
                  if (purchases && purchases.edges) {
                    purchases = {
                      edges: [{node: order}, ...purchases.edges],
                      pageInfo: purchases.edges
                    }
                    this.$store.commit(types.SET_PURCHASES, purchases)
                  }
                  this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 6)
                }
              }
            }
          )
        }
      },
      switchButtonText (paymentMethod) {
        let button = {
          f: this.onPlaceOrder
        }
        if (this.isOnlyPresale) {
          button['text'] = 'Preorder Now'
        } else if (paymentMethod) {
          button['text'] = 'Pay Order'
        } else {
          button['text'] = 'Place Order'
        }
        this.$store.commit(types.SET_BUTTON_BAR_BUTTONS, [button])
      }
    },
    mounted () {
      this.$store.commit(types.SET_BUTTON_BAR_SHOW, true)
      this.$store.commit(types.SET_BUTTON_BAR_CONTINUE, false)
      this.switchButtonText(this.selectedPaymentMethod)
      if (this.isOnlyPresale) {
        this.$store.commit(types.SET_SHIPPING_OPTION, {
          name: 'No shipping',
          price: 0.0
        })
      }
    },
    beforeDestroy () {
      this.$store.commit(types.SET_BUTTON_BAR_SHOW, false)
    }
  }
</script>
