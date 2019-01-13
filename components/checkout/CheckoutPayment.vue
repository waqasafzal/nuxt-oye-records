<template>
  <div class="row checkout__content">
    <div class="col-md-6 col-12 checkout__content__col">
      <!--<div class="row">-->
      <h3>Choose payment method</h3>
      <!--<div class="col-md-6 col-12 payment-methods">-->
      <template v-for="(option, i) in paymentOptions">
        <div
          v-show="showOption(option)"
          :key="`payment-option-${i}`"
          class="radio">
          <label>
            <input 
              v-model="selectedPayment" 
              :value="option" 
              type="radio" 
              name="payment">
            <span>{{ option.name }}</span>
            <img
              v-for="(image, j) in option.logos"
              :key="`checkout-logo-${j}`"
              :src="image.logo">
          </label>
        </div>
      </template>
      <!--</div>-->
    </div>
    <div class="col-md-6 col-12 checkout__content__col">
      <template v-if="availableMethods && availableMethods.length > 0">
        <h3>Saved {{ selectedPayment.name }} payments</h3>
        <div 
          v-for="(method, i) in availableMethods"
          :key="`payment-method-${i}`"
          class="radio checkout__payment__method">
          <input 
            v-model="selectedPaymentMethod" 
            :value="method" 
            type="radio" 
            class="payment__method"
            name="payment-methods">
          <component 
            :key="`paymentMethod-${selectedPayment.id}-${i}`" 
            :is="paymentMethodComponent(selectedPayment)" 
            :data="getPaymentData(selectedPayment, method)"
            :variant="method.variant" 
            :object-id="method.id" 
            @deleted="onPaymentDeleted(method)"/>
        </div>
        <div class="radio checkout__payment__method">
          <input 
            v-model="selectedPaymentMethod" 
            type="radio" 
            class="payment__method" 
            name="payment-method">
          <span>New payment data ...</span>
        </div>
      </template>
      <proceed-button 
        :class="['float-right-bottom', !selectedPayment ? 'disabled': '']"
        @click="onProceed">
        Review your order

      </proceed-button>
    </div>
    <!--</div>-->
  </div>
</template>

<script>
import * as types from '../../store/types'
import ProceedButton from '../shared/ProceedButton'
import {
  mastercardLogoSmall,
  paypalLogoSmall,
  sofortLogoSmall,
  visaLogoSmall
} from '../../utils/logos'
import CardPaymentMethod from '~/components/checkout/CardPaymentMethod'

export default {
  name: 'CheckoutPayment',
  components: { ProceedButton },
  data: function() {
    return {
      selectedPayment: null,
      selectedPaymentMethod: null
    }
  },
  computed: {
    country() {
      return (
        this.$store.getters.getBillingAddress &&
        this.$store.getters.getBillingAddress.country
      )
    },
    paymentOptions() {
      return this.$store.getters.getPaymentOptions
    },
    shippingOption() {
      return this.$store.getters.getShippingOption
    },
    availableMethods() {
      return this.selectedPayment && this.selectedPayment.methods
    }
  },
  watch: {
    country(value) {
      this.getPaymentOptions(value)
    },
    shippingOption(option) {
      this.selectPaymentByShippingOption(option)
    },
    selectedPayment(payment) {
      this.$store.commit(types.SET_SELECTED_PAYMENT_OPTION, payment)
      if (this.availableMethods && this.availableMethods.length > 0) {
        this.selectedPaymentMethod = this.availableMethods[0]
      } else {
        this.selectedPaymentMethod = null
      }
    },
    selectedPaymentMethod(method) {
      this.$store.commit(types.SET_SELECTED_PAYMENT_METHOD, method)
    }
  },
  mounted() {
    if (this.country) {
      this.getPaymentOptions(this.country)
    }
  },
  methods: {
    getPaymentOptions(country) {
      this.$store
        .dispatch('getPaymentOptions', {
          country: country
        })
        .then((data) => {
          // const {paymentOptions} = data
          this.$store.commit(types.SET_PAYMENT_OPTIONS, data)
          if (data.paymentOptions && data.paymentOptions.length > 0) {
            if (this.shippingOption) {
              this.selectPaymentByShippingOption(this.shippingOption)
            } else {
              this.selectedPayment = paymentOptions[0]
            }
          }
        })
    },
    getPaymentImages(paymentRef) {
      if (paymentRef === 'paypal') {
        return [paypalLogoSmall()]
      } else if (paymentRef === 'creditcard') {
        return [visaLogoSmall(), mastercardLogoSmall()]
      } else if (paymentRef === 'sofort') {
        return [sofortLogoSmall()]
      }
      return []
    },
    selectPaymentByShippingOption(shippingOption) {
      if (shippingOption && shippingOption.id === '-1') {
        for (var i = 0; i < this.paymentOptions.length; i++) {
          if (this.paymentOptions[i].id === 'cash') {
            this.selectedPayment = this.paymentOptions[i]
            break
          }
        }
      } else {
        if (this.paymentOptions) {
          this.selectedPayment = this.paymentOptions[0]
        }
      }
    },
    paymentMethodComponent(paymentOption) {
      if (paymentOption.id === 'creditcard') {
        return CardPaymentMethod
      }
    },
    getPaymentData(paymentOption, paymentMethod) {
      if (paymentOption.id === 'creditcard') {
        return paymentMethod.cardData
      }
    },
    showOption(option) {
      return true
    },
    onProceed() {
      this.$store.dispatch('setPaymentOptionConfirmed')
    },
    onPaymentDeleted(method) {
      this.$store.commit(types.DELETE_PAYMENT_METHOD, method)
      if (
        this.selectedPayment &&
        this.selectedPayment.methods.includes(method)
      ) {
        this.selectedPayment = Object.assign({}, this.selectedPayment)
        let methods = this.selectedPayment.methods
        for (var i = 0; i < methods.length; i++) {
          this.selectedPayment.methods = methods.filter(item => item !== method)
        }
      }
    }
  }
}
</script>
