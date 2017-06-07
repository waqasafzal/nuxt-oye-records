<template>
  <div class="checkout__content">
    <div class="row">
      <div class="col-12 checkout__content__col">
        <h3>Choose payment method</h3>
        <template v-for="(option, i) in paymentOptions">
          <div class="radio" v-show="showOption(option)">
            <label>
              <input type="radio" name="payment" v-model="selectedPayment" :value="option">
              <span>{{option.name}}</span>
              <img :src="image" v-for="(image, i) in getPaymentImages(option.id)"/>
            </label>
          </div>
        </template>
        <proceed-button @click="onProceed" :class="['proceed-btn-payment', 'float-right-bottom', !selectedPayment ? 'disabled': '']">Review your order</proceed-button>
      </div>
    </div>
  </div>
</template>

<script>
  import apolloClient from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import * as types from '../../store/types'
  import ProceedButton from '../shared/ProceedButton'
  import { mastercardLogoSmall, paypalLogoSmall, sofortLogoSmall, visaLogoSmall } from '../../utils/logos'

  export default {
    components: {ProceedButton},
    name: 'CheckoutPayment',
    data: function () {
      return {
        selectedPayment: null
      }
    },
    computed: {
      country () {
        return this.$store.getters.getBillingAddress && this.$store.getters.getBillingAddress.country
      },
      paymentOptions () {
        return this.$store.getters.getPaymentOptions
      },
      shippingOption () {
        return this.$store.getters.getShippingOption
      }
    },
    methods: {
      getPaymentOptions (country) {
        apolloClient.query({
          query: gql`query PaymentMethods($country: String!) {
            paymentOptions(country: $country) {
              id
              name
            }
          }
          `,
          variables: {
            country: country
          }
        }).then(({data}) => {
          var paymentOptions = data.paymentOptions.slice()
          paymentOptions.push({
            id: 'store',
            name: 'Pay on pickup'
          })
          this.$store.commit(types.SET_PAYMENT_OPTIONS, paymentOptions)
          if (data.paymentOptions.length > 0) {
            if (this.shippingOption) {
              this.selectPaymentByShippingOption(this.shippingOption)
            } else {
              this.selectedPayment = data.paymentOptions[0]
            }
          }
        })
      },
      getPaymentImages (paymentRef) {
        if (paymentRef === 'paypal') {
          return [paypalLogoSmall]
        } else if (paymentRef === 'card') {
          return [visaLogoSmall, mastercardLogoSmall]
        } else if (paymentRef === 'sofort') {
          return [sofortLogoSmall]
        }
        return []
      },
      selectPaymentByShippingOption (shippingOption) {
        if (shippingOption.id === '-1') {
          for (var i = 0; i < this.paymentOptions.length; i++) {
            if (this.paymentOptions[i].id === 'store') {
              console.log('select store payment')
              this.selectedPayment = this.paymentOptions[i]
              break
            }
          }
        } else {
          this.selectedPayment = this.paymentOptions[0]
        }
      },
      showOption (option) {
        let isPickupOption = this.shippingOption && this.shippingOption.id === '-1'
        if (option.id === 'forward' && isPickupOption) {
          return false
        }
        return option.id !== 'store' || this.shippingOption && this.shippingOption.id === '-1'
      },
      onProceed () {
        this.$store.commit(types.SET_PAYMENT_OPTION_CONFIRMED)
      }
    },
    watch: {
      country (value) {
        this.getPaymentOptions(value)
      },
      shippingOption (option) {
        console.log('watch shipping Option ' + option.id)
        this.selectPaymentByShippingOption(option)
      }
    },
    mounted () {
      if (this.country) {
        this.getPaymentOptions(this.country)
      }
    }
  }
</script>
