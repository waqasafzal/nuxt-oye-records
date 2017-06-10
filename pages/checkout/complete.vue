<template>
  <div class="checkout__content">
    <div class="row">
      <div class="col-12 checkout__content__col">
        <h3>Verification status {{ verificationStatus }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
  import apolloClient from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import * as types from '../../store/types'

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
            }
          }
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
            this.$store.commit(types.SET_UNPAID_ORDER, null)
            this.$router.push('/')
          } else {
            this.$store.commit(types.ADD_ALERT, {
              level: 'alert',
              message: 'The payment could not be verified. Please try again.'
            })
            this.$router.push({name: 'checkout'})
          }
        })
      }
    }
  }
</script>
