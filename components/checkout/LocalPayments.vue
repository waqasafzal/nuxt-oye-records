<template>
  <div>
    <form method="post" action="https://test.adyen.com/hpp/skipDetails.shtml" id="adyenForm" name="adyenForm" target="_parent">
      <input type="hidden" :name="key" :value="value" v-for="(value, key) in paymentFormData" />
      <input type="submit" value="Pay" />
    </form>
  </div>
</template>

<script>
  import gql from 'graphql-tag'
  import apolloClient from '~/plugins/apollo'

  const baseUrl = __API__.includes('localhost') ? 'http://localhost:3000' : __API__

  export default {
    name: 'LocalPayment',
    data: function () {
      return {
        paymentFormData: {}
      }
    },
    computed: {
      order () {
        return this.$store.getters.getUnpaidOrder
      },
      resultUrl () {
        return baseUrl + this.$router.resolve({name: 'checkout-complete'}).href
      }
    },
    methods: {
      getPublicPaymentData () {
        apolloClient.query({
          query: gql`query PaymentData($orderId: ID!, $resultUrl: String) {
                  paymentFormData(orderId: $orderId, resultUrl: $resultUrl)
                }
                `,
          variables: {
            orderId: this.order.id,
            resultUrl: this.resultUrl
          }
        }).then(({data}) => {
          this.paymentFormData = JSON.parse(data.paymentFormData)
        })
      }
    },
    mounted () {
      this.getPublicPaymentData()
    }
  }
</script>
