<template>
  <div class="row checkout__content checkout__addresses">
    <div class="col-md-6 checkout__content__col">
      <h3>Shipping Address</h3>
      <address-form 
        :focussed="isShippingAddressFocussed" 
        :countries="countries"
        :state-address="shippingAddress"
        :validation="shippingAddressValidation"
        :include-email="isGuestCheckout"
        @seperate-billing-changed="onSeperateBillingChanged"
        @email-changed="onEmailChanged"
        @address-changed="onShippingAddressChanged"/>
      <template v-if="register">
        <h3>Create User Account</h3>
        <register-form 
          :submit="false" 
          @user-changed="onUserRegistrationChanged"/>
      </template>
    </div>
    <div class="col-md-6 checkout__content__col">
      <div class="billing-address__form__panel">
        <h3>Billing Address</h3>
        <template v-if="differentBilling">
          <address-form 
            :focussed="isBillingAddressFocussed"
            :countries="countries"
            :validation="billingAddressValidation"
            :state-address="billingAddress"
            address-type="billing"
            @address-changed="onBillingAddressChanged"/>
        </template>
        <template v-else>
          <div class="checkout__addresses__content">Same as billing address</div>
        </template>
      </div>
      <div class="shipping-model__panel">
        <h3>Shipping Method</h3>
        <template v-if="cartShippingOptions.length > 0">
          <form class="checkout__addresses__content">
            <template v-for="(shippingOption, i) in cartShippingOptions">
              <div 
                :key="`cart-shipping-option-${i}`" 
                class="radio">
                <label>
                  <input 
                    :ref="i === 0 ? 'first' : ''"
                    v-model="shippingMethod"
                    :value="shippingOption"
                    type="radio"
                    name="shipping">
                  <span>{{ shippingOption.name }} ({{ shippingOption.price }} &euro;)</span>
                  <img :src="getShippingIcon(shippingOption)" >
                </label>
              </div>
            </template>
          </form>
        </template>
        <template v-else>
          <span class="checkout__addresses__content">You must set shipping country before you can select shipping</span>
        </template>
      </div>
      <div class="float-right-bottom">
        <proceed-button @click="onProceed">Proceed to payment
        </proceed-button>
      </div>
    </div>
  </div>
</template>

<script>
import AddressForm from '../account/AddressForm'
import ProceedButton from '../shared/ProceedButton'
import * as types from '../../store/types'
import RegisterForm from '../account/RegisterForm'
import { getInitialUser } from '../../store/utils'

const shippingIcons = {
  dhl: require('../../assets/images/shipping/icon_dhl.png'),
  pickup: require('../../assets/images/shipping/icon_storepickup.png')
}

export default {
  name: 'CheckoutAddress',
  components: { RegisterForm, ProceedButton, AddressForm },
  data: function() {
    return {
      differentBilling: false,
      shippingOptions: [],
      shippingMethod: null,
      billingAddressChanged: false,
      shippingAddressChanged: false,
      user: getInitialUser(),
      guestEmail: ''
    }
  },
  computed: {
    shippingCountry() {
      return this.$store.getters.getShippingCountry
    },
    cartShippingOptions() {
      return this.$store.getters.getShippingOptions
    },
    selectedBillingAddress() {
      return this.$store.getters.getBillingAddress
    },
    shippingAddressValidation() {
      return this.$store.getters.getShippingAddressValidation
    },
    billingAddressValidation() {
      return this.$store.getters.getBillingAddressValidation
    },
    shippingAddress() {
      return this.$store.getters.getShippingAddress
    },
    billingAddress() {
      return this.$store.getters.getBillingAddress
    },
    countries() {
      return this.$store.state.countries
    },
    register() {
      return this.$store.getters.isRegisterCheckout
    },
    focussedInput() {
      return this.$store.getters.getCheckoutFocussedInput
    },
    isShippingAddressFocussed() {
      return this.focussedInput === 'shippingAddress'
    },
    isBillingAddressFocussed() {
      return this.focussedInput === 'billingAddress'
    },
    isShippingOptionFocussed() {
      return this.focussedInput === 'shippingOption'
    },
    isGuestCheckout() {
      return this.$store.state.checkout.guest
    }
  },
  watch: {
    cartShippingOptions(value) {
      if (value.length > 0) {
        this.shippingMethod = value[0]
      }
    },
    shippingMethod(value) {
      this.$store.commit(types.SET_SHIPPING_OPTION, value)
    },
    shippingCountry(value) {
      this.$store
        .dispatch('setShippingCountry', { country: value })
        .then(shippingOptions => {
          this.$store.commit(types.SET_SHIPPING_OPTIONS, shippingOptions)
        })
    },
    isBillingAddressFocussed(value) {
      if (value) {
        this.differentBilling = true
      }
    },
    isShippingOptionFocussed(value) {
      if (value) {
        this.$refs.first[0].focus()
      }
    }
  },
  mounted() {
    let shippingOptions = this.$store.getters.getShippingOptions
    if (shippingOptions.length > 0) {
      this.shippingMethod = shippingOptions[0]
    }
  },
  methods: {
    onSeperateBillingChanged(value) {
      this.differentBilling = value
    },
    onShippingAddressChanged(address) {
      this.$store.commit(types.SET_SHIPPING_ADDRESS, address)
      if (!this.differentBilling) {
        this.$store.commit(types.SET_BILLING_ADDRESS, address)
        this.billingAddressChanged = true
      }
      this.shippingAddressChanged = true
    },
    onBillingAddressChanged(address) {
      this.$store.commit(types.SET_BILLING_ADDRESS, address)
      this.billingAddressChanged = true
    },
    onUserRegistrationChanged(value) {
      this.user = value
    },
    getShippingIcon(option) {
      if (option.name === 'DHL') {
        return shippingIcons.dhl
      } else if (option.name.includes('Pickup')) {
        return shippingIcons.pickup
      }
    },
    async onProceed() {
      var validateShippingAddress = this.$store.dispatch('validateAddress', {
        address: this.shippingAddress,
        type: 'shipping'
      })
      var isShippingValid = await validateShippingAddress

      var validateBillingAddress = this.$store.dispatch('validateAddress', {
        address: this.billingAddress,
        type: 'billing'
      })
      var isBillingValid = await validateBillingAddress

      var isEmailValid = true
      if (this.isGuestCheckout) {
        var emailValidation = this.$store.dispatch('emailValidation', {
          email: this.guestEmail
        })
        isEmailValid = await emailValidation
      }

      var validateUser = this.$store.dispatch('validateUserForm', {
        user: this.user
      })
      let isUserValid = await validateUser

      if (
        isShippingValid &&
        isBillingValid &&
        (!this.register || isUserValid) &&
        isEmailValid
      ) {
        if (this.isGuestCheckout) {
          this.$store.commit(types.SET_GUEST_EMAIL, this.guestEmail)
        }
        if (this.register) {
          var billingAddress = {}
          Object.assign(billingAddress, this.billingAddress)
          delete billingAddress['complete']

          var shippingAddress = {}
          Object.assign(shippingAddress, this.shippingAddress)
          delete shippingAddress['complete']
          this.$store
            .dispatch('createNewUser', {
              user: this.user,
              billingAddress: billingAddress,
              shippingAddress: shippingAddress
            })
            .then(({ data }) => {
              this.$store.dispatch('addAlert', {
                level: 'info',
                message:
                  'Your account has been registered, but you can continue shopping. ' +
                  'Please confirm your email address within the next 24 hours.'
              })
              this.$store.commit(types.SET_SHIPPING_ADDRESS_CONFIRMED)
            })
        } else {
          this.$store.commit(types.SET_SHIPPING_ADDRESS_CONFIRMED)
        }
      } else {
        this.$store.dispatch('addAlert', {
          level: 'error',
          message: 'Please make sure that all required data is correct.'
        })
      }
    },
    onEmailChanged(value) {
      this.guestEmail = value
    }
  }
}
</script>
