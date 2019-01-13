<template>
  <div class="my-addresses">
    <div class="row">
      <template v-if="editAddress">
        <div class="col-12 col-md-7">
          <address-form
            :countries="countries"
            :show-toggle="false"
            :state-address="editAddress"
            :validation="validation"
            @address-changed="onAddressChanged"
          />
          <div 
            class="btn primary" 
            @click="onSave">Save Address</div>
        </div>
      </template>
      <template v-else>
        <div class="col-12 col-lg-6">
          <template v-if="shippingAddress">
            <address-summary 
              :address="shippingAddress" 
              @change-address="onChange(shippingAddress, 'shipping')">Shipping Address</address-summary>
          </template>
          <template v-else>
            <loading-spinner/>
          </template>
        </div>
        <div class="col-12 col-lg-6">
          <address-summary 
            :address="billingAddress" 
            @change-address="onChange(billingAddress, 'billing')">Billing Address</address-summary>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import AddressSummary from '../../components/account/AddressSummary'
import AddressForm from './AddressForm'
import * as types from '../../store/types'
import LoadingSpinner from '../shared/LoadingSpinner'
export default {
  name: 'MyAddresses',
  components: { LoadingSpinner, AddressForm, AddressSummary },
  data: function() {
    return {
      editAddress: null,
      addressType: null
    }
  },
  computed: {
    shippingAddress() {
      return this.$store.getters.getShippingAddress
    },
    billingAddress() {
      return this.$store.getters.getBillingAddress
    },
    validation() {
      if (this.addressType) {
        if (this.addressType === 'billing') {
          return this.$store.getters.getBillingAddressValidation
        } else if (this.addressType === 'shipping') {
          return this.$store.getters.getShippingAddressValidation
        }
        return null
      }
    },
    countries() {
      return this.$store.state.countries
    }
  },
  methods: {
    onAddressChanged(address) {
      this.editAddress = address
    },
    onChange(address, type) {
      this.editAddress = address
      this.addressType = type
    },
    onSave() {
      this.$store
        .dispatch('validateAddress', {
          address: this.editAddress,
          type: this.addressType
        })
        .then(isValid => {
          if (isValid) {
            if (this.addressType === 'billing') {
              this.$store.commit(types.SET_BILLING_ADDRESS, this.editAddress)
            } else {
              this.$store.commit(types.SET_SHIPPING_ADDRESS, this.editAddress)
            }
            this.$store.dispatch('saveAddresses')
            this.editAddress = null
          }
        })
    }
  }
}
</script>
