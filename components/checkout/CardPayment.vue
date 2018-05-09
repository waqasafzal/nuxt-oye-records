<template>
  <div class="card-payment">
    <form class="card-payment__form" ref="adyen-encrypted-form" method="post" @submit.prevent id="adyen-encrypted-form">
      <div class="form-group flex-column">
        <label for="cardNumber">Card Number</label>
        <input @keypress="onCardNumberChanged" ref="cardNumber" type="text" id="cardNumber" class="form-control" data-encrypted-name="number">
        <!--<span ref="cardType" id="cardType"></span>-->
      </div>
      <div class="form-group flex-column owner">
        <label for="owner">Name On Card</label>
        <input type="text" id="owner" class="form-control" data-encrypted-name="holderName">
      </div>
      <div class="form-group flex-row">
        <div class="form-group-item cvc">
          <label for="cvc">CVC</label>
          <input type="text" id="cvc" class="form-control" autocomplete="off" data-encrypted-name="cvc">
        </div>
        <div class="form-group-item">
          <label>Expiration Date</label>
          <div class="card-payment__expiration">
            <select class="form-control" id="expiryMonth" data-encrypted-name="expiryMonth">
              <option value="" disabled selected>Month</option>
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
            <select class="form-control" id="expiryYear" data-encrypted-name="expiryYear">
              <option value="" disabled selected>Year</option>
              <option v-for="year in years" :value="year">{{year}}</option>
            </select>
          </div>
        </div>
      </div>
      <input type="hidden" :value="timestamp" data-encrypted-name="generationtime"/>
    </form>
    <div style="display: flex">
      <proceed-button class="float-right-bottom" type="submit" form="adyen-encrypted-form">Pay Order</proceed-button>
    </div>
  </div>
</template>

<script>
  import apolloClient from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import ProceedButton from '../shared/ProceedButton'
  import { getAuthHeader } from '../../utils/auth/index'
  import { getPrice, roundFixed } from '../../utils/math'
  import * as types from '../../store/types'
  import { creditCardFormat } from '~/utils/forms'

  const encryptedBlobFieldName = 'myBlobField'

  export default {
    components: {ProceedButton},
    name: 'CheckoutPayment',
    computed: {
      postPaymentActionUrl () {
        return __API__ + '/oye/pay/'
      },
      totalAmount () {
        return this.order && this.price
      },
      order () {
        return this.$store.getters.getUnpaidOrder
      },
      price () {
        return getPrice(
          this.order.price + this.order.porto,
          {vatExcluded: this.order.vatExcluded, vatRate: this.order.vatRate}
        )
      }
    },
    data: function () {
      var range = [...Array(6).keys()]
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
    methods: {
      onCardNumberChanged (e) {
        var cardNumberField = this.$refs['cardNumber']
        cardNumberField.value = creditCardFormat(cardNumberField.value)
      },
      onSubmit (e) {
        var form = this.$refs['adyen-encrypted-form']
        var element = form.elements[encryptedBlobFieldName]
        if (element) {
          var encryptedData = element.value
          var authHeader = getAuthHeader()
          this.$http.post(__API__ + '/oye/pay/', {
            paymentData: encryptedData,
            orderId: this.order.pk,
            orderPrice: this.price
          }, {
            headers: {
              Authorization: authHeader
            }
          }).then(data => {
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
                message: 'Your payment has been received. Authorization from payment provider pending.',
                level: 'warning'
              })
            } else if (resultCode === 'Refused') {
              this.$store.dispatch('addAlert', {
                message: 'Your payment has been refused.',
                level: 'error'
              })
            }
          }, err => {
            this.$store.dispatch('addAlert', {
              message: 'Your payment data was invalid.',
              level: 'error'
            })
            console.error('err: ' + err)
          })
        }
      }
    },
    mounted () {
      apolloClient.query({
        query: gql`query PaymentInfo {
            timestamp
        }
        `
      }).then(({data}) => {
        this.timestamp = data.timestamp
      })
      var form = this.$refs['adyen-encrypted-form']
      var options = {}

      options.name = encryptedBlobFieldName
      options.onsubmit = this.onSubmit

      // eslint-disable-next-line no-undef
      adyen.createEncryptedForm(form, options)
    }
  }
</script>
