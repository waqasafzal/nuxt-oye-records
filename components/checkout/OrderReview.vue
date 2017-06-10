<template>
  <div class="checkout__review">
    <div class="checkout__content">
      <div class="row">
        <div class="col-12 checkout__content__col">
          <h3>Review your order</h3>
        </div>
      </div>
      <cart-content :review="true"></cart-content>
    </div>
    <proceed-button class="float-right-bottom place-order-btn" @click="onProceed">Place Order</proceed-button>
  </div>
</template>

<script>
  import CartContent from '../cart/CartContent'
  import ProceedButton from '../shared/ProceedButton'
  import * as types from '../../store/types'
  import apolloClient from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import { oyeCart } from '../graphql/cart'

  export default {
    components: {ProceedButton, CartContent},
    name: 'OrderReview',
    computed: {
      isSelfCollector () {
        let shippingOption = this.$store.getters.getShippingOption
        return shippingOption && shippingOption.id === '-1'
      },
      cartId () {
        return this.$store.state.cart.pk
      },
      porto () {
        let shippingOption = this.$store.getters.getShippingOption
        return shippingOption && shippingOption.price
      },
      shippingId () {
        let address = this.$store.shippingAddress
        return address && address.id
      },
      billingId () {
        let address = this.$store.billingAddress
        return address && address.id
      },
      paymentOption () {
        return this.$store.state.selectedPaymentOption
      }
    },
    methods: {
      onProceed () {
        apolloClient.mutate({
          mutation: gql`mutation PlaceOrder($cartId: ID!, $isSelfCollector: Boolean, $porto: Float, $shippingId: ID, $billingId: ID, $payment: String) {
            placeOrder(cartId: $cartId, isSelfCollector: $isSelfCollector, porto: $porto, billingId: $billingId, shippingId: $shippingId, payment: $payment) {
              order {
                id
                price
                porto
                isPaid
                paymentType
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
          ${oyeCart}
          `,
          variables: {
            isSelfCollector: this.isSelfCollector,
            billingId: this.billingId,
            shippingId: this.shippingId,
            cartId: this.cartId,
            porto: this.porto,
            payment: this.paymentOption.id
          }
        }).then(
          ({data}) => {
            let order = data.placeOrder.order
            if (!order.isPaid) {
              this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 5)
              this.$store.commit(types.SET_UNPAID_ORDER, order)
              this.$store.commit(types.ADD_ALERT, {
                level: 'info',
                message: 'Your order has been placed. Please fulfill order with payment.'
              })
            } else {
              this.$store.commit(types.FINISH_CHECKOUT)
              this.$router.push('/')
              if (this.isSelfCollector) {
                this.$store.commit(types.ADD_ALERT, {
                  level: 'info',
                  message: 'Your order has been placed. We will inform you via mail, when your package is ready for pickup'
                })
              }
            }
            // set the new cart
            this.$store.commit(types.SET_CART, data.placeOrder.cart)
          }
        )
      }
    }
  }
</script>
