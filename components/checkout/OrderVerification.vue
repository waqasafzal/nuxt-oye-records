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
  import { order } from '../graphql/cart'

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
        if (merchantSig) {
          var verifyParams = {}
          for (let key in params) {
            if (key !== 'merchantSig') {
              verifyParams[key] = params[key]
            }
          }
        }
        this.verificationStatus = 'verifying'
        apolloClient.mutate({
          mutation: gql`mutation VerifyOrder($merchantSig: String!, $params: JSONString!) {
            verifyOrder(merchantSig: $merchantSig, transactionParams: $params) {
              ok
              order {
                ...Order
              }
            }
          }
          ${order}
          `,
          variables: {
            merchantSig: merchantSig,
            params: JSON.stringify(verifyParams)
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
