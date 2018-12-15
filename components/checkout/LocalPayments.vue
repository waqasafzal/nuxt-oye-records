<template>
  <div>
    <form 
      id="adyenForm" 
      :action="adyenUrl" 
      method="post" 
      name="adyenForm" 
      target="_parent">
      <input 
        v-for="(value, key) in paymentFormData" 
        :name="key"
        :key="`payment-${key}`"
        :value="value" 
        type="hidden" >
    </form>

    <div class="d-flex flex-column local-payment-info">
      <div class="d-flex flex-row local-payment-selected">
        <span> Selected payment method: </span>
        <img
          v-for="(image, i) in getLogos(order.paymentType)"
          :key="`payment-logo-${i}`" 
          :src="image" >
      </div>
      <span>Please click the button below to proceed with the external payment provider.</span>
    </div>

    <div class="d-flex justify-content-around">
      <template v-if="isPaypal">
        <proceed-button 
          form="adyenForm" 
          @click="sendPaypal">Pay</proceed-button>
      </template>
      <template v-else>
        <proceed-button 
          type="submit" 
          form="adyenForm">Pay</proceed-button>
      </template>
    </div>

  </div>
</template>

<script>
import gql from 'graphql-tag'
// import apolloClient from '~/plugins/apollo'
import ProceedButton from '../shared/ProceedButton'
import * as types from '../../store/types'

const baseUrl = __API__.includes('localhost')
  ? 'http://localhost:3000'
  : __API__

export default {
  name: 'LocalPayment',
  components: { ProceedButton },
  data: function() {
    return {
      paymentFormData: {}
    }
  },
  computed: {
    order() {
      return this.$store.getters.getUnpaidOrder
    },
    resultUrl() {
      return (
        baseUrl +
        this.$router.resolve({ name: 'checkout', query: { verify: true } }).href
      )
    },
    isPaypal() {
      return this.order.paymentType === 'paypal'
    },
    adyenUrl() {
      return __ADYEN_SKIN__
    }
  },
  mounted() {
    this.getPublicPaymentData()
  },
  methods: {
    getPublicPaymentData() {
      this.$apollo
        .query({
          query: gql`
            query PaymentData($orderId: ID!, $resultUrl: String) {
              paymentFormData(orderId: $orderId, resultUrl: $resultUrl)
            }
          `,
          variables: {
            orderId: this.order.pk,
            resultUrl: this.resultUrl
          }
        })
        .then(({ data }) => {
          this.paymentFormData = JSON.parse(data.paymentFormData)
        })
    },
    getLogos(paymentType) {
      return this.$store.getters.getLogos(paymentType)
    },
    sendPaypal() {
      if (this.order.paymentUrl) {
        this.$store.commit(types.SET_PAYPAL_PAYMENT_URL, this.order.paymentUrl)
        this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 8)
        window.location.href = this.order.paymentUrl
      }
    }
  }
}
</script>
