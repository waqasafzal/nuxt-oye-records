<template>
  <div class="complete">
    <h2>Payment Verification</h2>
    <h3>Status {{ verificationStatus }}</h3>
  </div>
</template>

<script>
  import apolloClient from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import * as types from '../../store/types'
  import { order, oyeCart } from '../graphql/cart'

  export default {
    name: 'CompleteCheckout',
    data: function () {
      return {
        verificationStatus: 'unverified'
      }
    },
    mounted () {
      let params = this.$route.query
      if (params) {
        let merchantSig = params['merchantSig']
        let paymentProvider = null
        if (merchantSig) {
          paymentProvider = 'adyen'
        } else if (params['provider'] === 'paypal') {
          paymentProvider = 'paypal'
        }
        this.verificationStatus = 'verifying'
        apolloClient.mutate({
          mutation: gql`mutation VerifyOrder($provider: String!, $params: JSONString!) {
            verifyOrder(provider: $provider, transactionParams: $params) {
              ok
              order {
                ...Order
                cart {
                  ...OyeCart
                }
              },
              newCart {
                ...OyeCart
              }
            }
          }
          ${order}
          ${oyeCart}
          `,
          variables: {
            provider: paymentProvider, // merchantSig,
            params: JSON.stringify(params)
          }
        }).then(({data}) => {
          let verified = data.verifyOrder.ok
          this.verificationStatus = verified ? 'verified' : 'not verified'
          if (verified) {
            this.$store.commit(types.ADD_ALERT, {
              level: 'info',
              message: 'The payment could be verified.'
            })
            this.$store.commit(types.SET_UNPAID_ORDER, data.verifyOrder.order)
            this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 6)
            if (data.verifyOrder.newCart) {
              this.$store.commit(types.SET_CART, data.verifyOrder.newCart)
            }
            if (!data.verifyOrder.order.isSelfCollector) {
              this.$store.dispatch('sendTransaction', data.verifyOrder.order)
            }
          } else {
            this.$store.commit(types.ADD_ALERT, {
              level: 'alert',
              message: 'The payment could not be verified. Please try again.'
            })
            this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 4)
          }
        })
      }
    }
  }
</script>
