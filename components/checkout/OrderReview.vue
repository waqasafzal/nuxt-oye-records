<template>
  <div class="checkout__review">
    <h3>Review your order</h3>
    <checkout-overview class="checkout__overview"></checkout-overview>
    <cart-content :review="true">
      <div class="col-12" style="display: flex; padding-right: 0px;">
        <template v-if="!selectedPaymentMethod">
          <proceed-button class="float-right-bottom place-order-btn" @click="onPlaceOrder">Place Order</proceed-button>
        </template>
        <template v-else>
          <proceed-button class="float-right-bottom place-order-btn" @click="onPlaceOrder">Pay Order</proceed-button>
        </template>
      </div>
    </cart-content>
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

  export default {
    components: {CheckoutOverview, ProceedButton, CartContent},
    name: 'OrderReview',
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
      }
    },
    methods: {
      onPlaceOrder () {
        apolloClient.mutate({
          mutation: gql`mutation PlaceOrder($cartId: ID!, $isSelfCollector: Boolean, $porto: Float, $shippingId: ID, $billingId: ID, $payment: String, $paymentMethodId: ID, $vatExcluded: Boolean) {
            placeOrder(cartId: $cartId, isSelfCollector: $isSelfCollector, porto: $porto, billingId: $billingId, shippingId: $shippingId, payment: $payment, paymentMethodId: $paymentMethodId, vatExcluded: $vatExcluded) {
              order {
                ...Order
              }
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
            payment: this.paymentOption.id,
            paymentMethodId: this.selectedPaymentMethod && this.selectedPaymentMethod.id
          }
        }).then(
          ({data}) => {
            let order = data.placeOrder.order
            this.$store.commit(types.SET_UNPAID_ORDER, order)
            if (!order.isPaid) {
              this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 5)
              if (order.shippingCountry) {
                this.$store.dispatch('setShippingCountry', order)
              }
              this.$store.commit(types.ADD_ALERT, {
                level: 'info',
                message: 'Your order has been placed. Please fulfill order with payment.'
              })
            } else {
              this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 6)
            }
            // set the new cart
//            this.$store.dispatch('setCart', {cart: data.placeOrder.cart})
          }
        )
      }
    }
  }
</script>
