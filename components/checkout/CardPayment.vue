<template>
  <div class="card-payment">
    <form 
      id="adyen-encrypted-form" 
      ref="adyen-encrypted-form" 
      class="card-payment__form" 
      method="post" 
      @submit.prevent>
      <div class="form-group flex-column">
        <label for="cardNumber">Card Number</label>
        <input 
          id="cardNumber" 
          ref="cardNumber" 
          type="text" 
          class="form-control" 
          data-encrypted-name="number" 
          @keypress="onCardNumberChanged">
      </div>
      <div class="form-group flex-column owner">
        <label for="owner">Name On Card</label>
        <input 
          id="owner" 
          type="text" 
          class="form-control" 
          data-encrypted-name="holderName">
      </div>
      <div class="form-group flex-row">
        <div class="form-group-item cvc">
          <label for="cvc">CVC</label>
          <input 
            id="cvc" 
            type="text" 
            class="form-control" 
            autocomplete="off" 
            data-encrypted-name="cvc">
        </div>
        <div class="form-group-item">
          <label>Expiration Date</label>
          <div class="card-payment__expiration">
            <select 
              id="expiryMonth" 
              class="form-control" 
              data-encrypted-name="expiryMonth">
              <option 
                value="" 
                disabled 
                selected>Month</option>
              <option value="1">January</option>
              <option value="2">February </option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <select 
              id="expiryYear" 
              class="form-control" 
              data-encrypted-name="expiryYear">
              <option 
                value="" 
                disabled 
                selected>Year</option>
              <option
                v-for="(year, y) in years"
                :key="`year-${y}`"
                :value="year">{{ year }}</option>
            </select>
          </div>
        </div>
      </div>
      <input 
        :value="timestamp" 
        type="hidden" 
        data-encrypted-name="generationtime">
    </form>
    <div style="display: flex">
      <proceed-button 
        class="float-right-bottom" 
        type="submit" 
        form="adyen-encrypted-form">Pay Order</proceed-button>
    </div>
  </div>
</template>

<script>
// import apolloClient from '~/plugins/apollo'
import gql from 'graphql-tag'
import ProceedButton from '../shared/ProceedButton'
import { getAuthHeader } from '../../utils/auth/index'
import { roundFixed } from '../../utils/math'
import * as types from '../../store/types'
import { creditCardFormat } from '~/utils/forms'

const encryptedBlobFieldName = 'myBlobField'

export default {
  name: 'CheckoutPayment',
  components: { ProceedButton },
  data: function() {
    var range = [...Array(10).keys()]
    let year = new Date().getFullYear()
    let years = []
    for (var i in range) {
      let y = parseInt(year) + parseInt(i)
      years.push(y)
    }
    return {
      timestamp: '',
      years: years
    }
  },
  computed: {
    postPaymentActionUrl() {
      return __API__ + '/oye/pay/'
    },
    totalAmount() {
      return this.order && roundFixed(this.order.price + this.order.porto)
    },
    order() {
      return this.$store.getters.getUnpaidOrder
    }
  },
  mounted() {
    this.$apollo
      .query({
        query: gql`
          query PaymentInfo {
            timestamp
          }
        `
      })
      .then(({ data }) => {
        this.timestamp = data.timestamp
      })
    var form = this.$refs['adyen-encrypted-form']
    var options = {}

    options.name = encryptedBlobFieldName
    options.onsubmit = this.onSubmit

    // eslint-disable-next-line no-undef
    adyen.createEncryptedForm(form, options)
  },
  methods: {
    onCardNumberChanged(e) {
      var cardNumberField = this.$refs['cardNumber']
      cardNumberField.value = creditCardFormat(cardNumberField.value)
    },
    onSubmit(e) {
      var form = this.$refs['adyen-encrypted-form']
      var element = form.elements[encryptedBlobFieldName]
      if (element) {
        var encryptedData = element.value
        var authHeader = getAuthHeader(this.$store)
        this.$axios
          .post(
            __API__ + '/oye/pay/',
            {
              paymentData: encryptedData,
              orderId: this.order.pk,
              orderPrice: this.order.price + this.order.porto
            },
            {
              headers: {
                Authorization: authHeader
              }
            }
          )
          .then(
            data => {
              let resultCode = data.body.resultCode
              if (resultCode === 'Authorised') {
                this.$store.dispatch('addAlert', {
                  message: 'Your order has been paid.',
                  level: 'info'
                })
                this.$store.dispatch('getCart')
                this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, 6)
              } else if (resultCode === 'Received') {
                this.$store.dispatch('addAlert', {
                  message:
                    'Your payment has been received. Authorization from payment provider pending.',
                  level: 'warning'
                })
              } else if (resultCode === 'Refused') {
                this.$store.dispatch('addAlert', {
                  message: 'Your payment has been refused.',
                  level: 'error'
                })
              }
            },
            err => {
              this.$store.dispatch('addAlert', {
                message: 'Your payment data was invalid.',
                level: 'error'
              })
              console.error('err: ' + err)
            }
          )
      }
    }
  }
}
</script>
