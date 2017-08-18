<template>
  <div class="row checkout__content checkout__addresses">
      <div class="col-md-6 checkout__content__col">
        <h3>Shipping Address</h3>
        <address-form :focussed="isShippingAddressFocussed" :countries="countries"
                      :stateAddress="shippingAddress"
                      :validation="shippingAddressValidation"
                      @seperate-billing-changed="onSeperateBillingChanged"
                      @address-changed="onShippingAddressChanged">
        </address-form>
        <template v-if="register">
          <h3>Create User Account</h3>
          <register-form @user-changed="onUserRegistrationChanged" :submit="false"></register-form>
        </template>
      </div>
      <div class="col-md-6 checkout__content__col">
        <div class="billing-address__form__panel">
          <h3>Billing Address</h3>
          <template v-if="differentBilling">
            <address-form :focussed="isBillingAddressFocussed"
                          :countries="countries"
                          :validation="billingAddressValidation"
                          :stateAddress="billingAddress"
                          addressType="billing"
                          @address-changed="onBillingAddressChanged"></address-form>
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
                <div class="radio">
                  <label>
                    <input type="radio"
                           :ref="i === 0 ? 'first' : ''"
                           name="shipping"
                           v-model="shippingMethod"
                           :value="shippingOption">
                    <span>{{shippingOption.name}} ({{shippingOption.price}} &euro;)</span>
                  </label>
                </div>
              </template>
            </form>
          </template>
          <template v-else>
            <span
                class="checkout__addresses__content">You must set shipping country before you can select shipping</span>
          </template>
        </div>
        <div class="float-right-bottom">
          <proceed-button @click="onProceed()">Proceed to payment
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

  export default {
    components: {RegisterForm, ProceedButton, AddressForm},
    name: 'CheckoutAddress',
    data: function () {
      return {
        differentBilling: false,
        shippingOptions: [],
        shippingMethod: null,
        billingAddressChanged: false,
        shippingAddressChanged: false,
        user: getInitialUser()
      }
    },
    computed: {
      shippingCountry () {
        return this.$store.getters.getShippingCountry
      },
      cartShippingOptions () {
        return this.$store.getters.getShippingOptions
      },
      selectedBillingAddress () {
        return this.$store.getters.getBillingAddress
      },
      shippingAddressValidation () {
        return this.$store.getters.getShippingAddressValidation
      },
      billingAddressValidation () {
        return this.$store.getters.getBillingAddressValidation
      },
      shippingAddress () {
        return this.$store.getters.getShippingAddress
      },
      billingAddress () {
        return this.$store.getters.getBillingAddress
      },
      countries () {
        return this.$store.state.countries
      },
      register () {
        return this.$store.getters.isRegisterCheckout
      },
      focussedInput () {
        return this.$store.getters.getCheckoutFocussedInput
      },
      isShippingAddressFocussed () {
        return this.focussedInput === 'shippingAddress'
      },
      isBillingAddressFocussed () {
        return this.focussedInput === 'billingAddress'
      },
      isShippingOptionFocussed () {
        return this.focussedInput === 'shippingOption'
      }
    },
    watch: {
      cartShippingOptions (value) {
        if (value.length > 0) {
          this.shippingMethod = value[0]
        }
      },
      shippingMethod (value) {
        this.$store.commit(types.SET_SHIPPING_OPTION, value)
      },
      shippingCountry (value) {
        this.$store.dispatch('setShippingCountry', {country: value}).then(shippingOptions => {
          this.$store.commit(types.SET_SHIPPING_OPTIONS, shippingOptions)
        })
      },
      isBillingAddressFocussed (value) {
        if (value) {
          this.differentBilling = true
        }
      },
      isShippingOptionFocussed (value) {
        if (value) {
          this.$refs.first[0].focus()
        }
      }
    },
    methods: {
      onSeperateBillingChanged (value) {
        this.differentBilling = value
      },
      onShippingAddressChanged (address) {
        this.$store.commit(types.SET_SHIPPING_ADDRESS, address)
        if (!this.differentBilling) {
          this.$store.commit(types.SET_BILLING_ADDRESS, address)
          this.billingAddressChanged = true
        }
        this.shippingAddressChanged = true
      },
      onBillingAddressChanged (address) {
        this.$store.commit(types.SET_BILLING_ADDRESS, address)
        this.billingAddressChanged = true
      },
      onUserRegistrationChanged (value) {
        this.user = value
      },
      async onProceed () {
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

        var validateUser = this.$store.dispatch('validateUserForm', {user: this.user})
        let isUserValid = await validateUser

        if (isBillingValid && (!this.register || isUserValid)) {
          if (this.register) {
            var billingAddress = {}
            Object.assign(billingAddress, this.billingAddress)
            delete billingAddress['complete']

            var shippingAddress = {}
            Object.assign(shippingAddress, this.shippingAddress)
            delete shippingAddress['complete']

            this.$store.dispatch('createNewUser', {
              user: this.user,
              billingAddress: billingAddress,
              shippingAddress: shippingAddress
            }).then(({data}) => {
              this.$store.dispatch('addAlert', {
                level: 'info',
                message: 'Your account has been registered, but you can continue shopping. ' +
                'Please confirm your email address within the next 24 hours.'
              })
              this.$store.commit(types.SET_SHIPPING_ADDRESS_CONFIRMED)
            })
          } else {
            this.$store.commit(types.SET_SHIPPING_ADDRESS_CONFIRMED)
          }
        } else {
          if (!isShippingValid) {
            this.$store.dispatch('addAlert', {
              level: 'error',
              message: 'Your shipping data is incomplete'
            })
          }
          if (!isBillingValid) {
            this.$store.dispatch('addAlert', {
              level: 'error',
              message: 'Your billing data is incomplete'
            })
          }
          if (!isUserValid) {
            this.$store.dispatch('addAlert', {
              level: 'error',
              message: 'Your user data is invalid'
            })
          }
        }
      }
    },
    mounted () {
      let shippingOptions = this.$store.getters.getShippingOptions
      if (shippingOptions.length > 0) {
        this.shippingMethod = shippingOptions[0]
      }
    }
  }
</script>
