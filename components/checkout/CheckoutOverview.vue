<template>
  <div class="row">
    <div class="col-12 col-md-3">
      <checkout-parameter @change="onChangeShipping" :lines="getAddressLines(shippingAddress)">Shipping Address</checkout-parameter>
    </div>
    <div class="col-12 col-md-3">
      <checkout-parameter @change="onChangeBilling" :lines="getAddressLines(billingAddress)">Billing Address</checkout-parameter>
    </div>
    <div class="col-12 col-md-3">
      <checkout-parameter @change="onChangeShippingMethod" :lines="shippingMethodLines">Shipping Method</checkout-parameter>
    </div>
    <div class="col-12 col-md-3">
      <checkout-parameter @change="onChangePaymentMethod" :lines="paymentOptionLines">
        Payment Method
        <component slot="extra" :is="paymentMethodComponent" :data="getPaymentMethodData(paymentMethod)" :variant="paymentOption.id"></component>
      </checkout-parameter>
    </div>
  </div>
</template>

<script>
  import CheckoutParameter from './CheckoutParameter'
  import CardPaymentMethod from './CardPaymentMethod'
  import LocalPaymentMethod from './LocalPaymentMethod'
  import * as types from '../../store/types'
  export default {
    components: {CardPaymentMethod, CheckoutParameter, LocalPaymentMethod},
    name: 'CheckoutOverview',
    computed: {
      shippingAddress () {
        return this.$store.getters.getShippingAddress
      },
      billingAddress () {
        return this.$store.getters.getBillingAddress
      },
      shippingMethodLines () {
        let shippingOption = this.$store.getters.getShippingOption
        let lines = []
        if (shippingOption) {
          lines.push(`${shippingOption.name} (${shippingOption.price}€)`)
        }
        return lines
      },
      paymentOption () {
        return this.$store.getters.getSelectedPaymentOption
      },
      paymentOptionLines () {
        let selectedPaymentOption = this.paymentOption
        let lines = []
        if (selectedPaymentOption) {
          lines.push(selectedPaymentOption.name)
        }
        return lines
      },
      paymentMethod () {
        return this.$store.getters.getSelectedPaymentMethod
      },
      paymentMethodComponent () {
        if (this.paymentMethod) {
          if (this.paymentOption.id === 'creditcard') {
            return CardPaymentMethod
          }
        } else {
          return LocalPaymentMethod
        }
      }
    },
    methods: {
      getAddressLines (address) {
        var lines = []
        if (address) {
          lines.push(`${address.firstName} ${address.lastName}`)
          lines.push(`${address.street} ${address.number}`)
          lines.push(`${address.addressExtra}`)
          lines.push(`${address.zip} ${address.city}`)
          lines.push(`${address.country}`)
        }
        return lines
      },
      getPaymentMethodData (method) {
        if (this.paymentOption.id === 'creditcard') {
          return method.cardData
        }
        return {}
      },
      onChangePaymentMethod () {
        this.$store.commit(types.CHANGE_PAYMENT_METHOD)
      },
      onChangeBilling () {
        this.$store.commit(types.CHANGE_BILLING)
      },
      onChangeShipping () {
        this.$store.commit(types.CHANGE_SHIPPING)
      },
      onChangeShippingMethod () {
        this.$store.commit(types.CHANGE_SHIPPING_OPTION)
      }
    }
  }
</script>
