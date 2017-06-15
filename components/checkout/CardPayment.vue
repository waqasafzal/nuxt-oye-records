<template>
  <div>
    <h3>Card Payment</h3>
    <div>Pay Order {{ totalAmount }} &euro;</div>
    <p><strong>Credit Card Test data</strong></p>
    <p>Number: 2223 0000 4841 0010</p>
    <p>CVC: 737</p>
    <p>Expiry 10/2020</p>
    <form ref="adyen-encrypted-form" method="post" @submit.prevent id="adyen-encrypted-form">
      <div class="form-group owner">
        <label for="owner">Card Holder</label>
        <input type="text" id="owner" class="form-control" data-encrypted-name="holderName">
      </div>
      <div class="form-group cvc">
        <label for="cvc">CVC</label>
        <input type="text" id="cvc" class="form-control" autocomplete="off" data-encrypted-name="cvc">
      </div>
      <div class="form-group">
        <label for="cardNumber">Card Number</label>
        <input type="text" id="cardNumber" class="form-control" data-encrypted-name="number">
      </div>
      <div class="form-group">
        <label for="expiryMonth">Month</label>
        <select id="expiryMonth" data-encrypted-name="expiryMonth">
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
      </div>
      <div class="form-group">
        <label for="expiryYear">Year</label>
        <select id="expiryYear" data-encrypted-name="expiryYear">
          <option value="2017">2017</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
        </select>
      </div>
      <input type="hidden" :value="timestamp" data-encrypted-name="generationtime"/>
    </form>
    <proceed-button class="float-right-bottom" type="submit" form="adyen-encrypted-form">Pay Order</proceed-button>
  </div>
</template>

<script>
  import gql from 'graphql-tag'
  import ProceedButton from '../shared/ProceedButton'
  import { getAuthHeader } from '../../utils/auth/index'
  import { roundFixed } from '../../utils/math'
  import * as types from '../../store/types'

  const encryptedBlobFieldName = 'myBlobField'

  export default {
    components: {ProceedButton},
    name: 'CheckoutPayment',
    computed: {
      postPaymentActionUrl () {
        return __API__ + '/oye/pay/'
      },
      totalAmount () {
        return this.order && roundFixed(this.order.price + this.order.porto)
      },
      order () {
        return this.$store.getters.getUnpaidOrder
      }
    },
    data: function () {
      return {
        timestamp: ''
      }
    },
    methods: {
      onSubmit (e) {
        var form = this.$refs['adyen-encrypted-form']
        var element = form.elements[encryptedBlobFieldName]
        if (!element) {
          // console.log('element does not exists for the first time')
        }
        if (element) {
          var encryptedData = element.value
          var authHeader = getAuthHeader()
          this.$http.post(__API__ + '/oye/pay/', {
            paymentData: encryptedData,
            orderId: this.order.id,
            orderPrice: this.order.price + this.order.porto
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
              this.$store.commit(types.SET_UNPAID_ORDER, null)
              this.$router.push('/')
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
            console.log('err: ' + err)
          })
        } else {
          console.error('form element does not exist')
        }
      }
    },
    mounted () {
      this.$apollo.query({
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
