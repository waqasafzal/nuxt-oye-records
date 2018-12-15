<template>
  <form 
    class="shipping-address__form" 
    method="post" 
    @submit.prevent="onSubmit">
    <fieldset>
      <div :class="['form-group', 'input-validation', firstNameError ? 'has-danger' : '']">
        <input 
          id="first"
          ref="first"
          v-model="address.firstName"
          class="form-control"
          type="text"
          placeholder="Given name *"
          required>
        <div 
          v-if="firstNameError" 
          class="error">{{ firstNameError }}</div>
      </div>

      <div :class="['form-group', 'input-validation', lastNameError ? 'has-danger': '']">
        <input 
          v-model="address.lastName"
          class="form-control"
          type="text"
          placeholder="Family name *"
          required>
        <div 
          v-if="lastNameError" 
          class="error">{{ lastNameError }}</div>
      </div>

      <div class="form-group">
        <input 
          v-model="address.company"
          class="form-control"
          type="text"
          placeholder="Company">
      </div>

      <div :class="['form-group', streetError ? 'has-danger' : '']">
        <div class="form-group-item input-validation">
          <input 
            v-model="address.street"
            class="form-control"
            type="text"
            placeholder="Street *"
            required >
          <div 
            v-if="streetError" 
            class="error">{{ streetError }}</div>
        </div>
        <div :class="['form-group-item', 'form-field__number', 'input-validation', numberError ? 'has-danger' : '']">
          <input 
            v-model="address.number"
            class="form-control"
            type="text"
            placeholder="Number *"
            required >
          <div 
            v-if="numberError" 
            class="error">{{ numberError }}</div>
        </div>
      </div>
      <div class="form-group">
        <input 
          v-model="address.addressExtra"
          class="form-control"
          type="text"
          placeholder="Address Extra" >
      </div>
      <div class="form-group">
        <div :class="['form-group-item', 'input-validation', cityError ? 'has-danger' : '']">
          <input 
            v-model="address.city"
            class="form-control form-field__city"
            type="text"
            name="city"
            placeholder="City *"
            required >
          <div 
            v-if="cityError" 
            class="error">{{ cityError }}</div>
        </div>
        <div :class="['form-group-item', 'form-field__zip', 'input-validation', zipError ? 'has-danger': '']">
          <input 
            v-model="address.zip"
            class="form-control"
            type="text"
            name="zip"
            placeholder="Zip *"
            required >
          <div 
            v-if="zipError" 
            class="error">{{ zipError }}</div>
        </div>
      </div>
      <div 
        v-if="includeEmail" 
        class="form-group">
        <div :class="['form-group-item', 'input-validation', emailError ? 'has-danger' : '']">
          <input 
            v-model="email"
            class="form-control"
            type="email"
            placeholder="Email *"
            required >
          <div 
            v-if="emailError" 
            class="error">{{ emailError }}</div>
        </div>
      </div>
      <div :class="['form-group', 'input-validation', countryError ? 'has-danger' : '']">
        <select 
          v-model.lazy="address.country"
          :value="address.country"
          class="form-control has-danger"
          name="country"
          required>
          <option 
            value="" 
            disabled 
            selected>Select your country</option>
          <option
            v-for="(country, i) in countries"
            :key="`country-${i}`"
            :value="country.name">{{ country.name }}</option>
        </select>
        <div 
          v-if="countryError" 
          class="error">{{ countryError }}</div>
      </div>
      <div 
        v-if="showToggle && addressType === 'shipping'" 
        class="checkbox-panel" 
        @change="onSeperateBillingChange">
        <input 
          id="seperate-billing"
          type="checkbox"
          name="seperate-billing">
        Use different billing address
      </div>
    </fieldset>
  </form>
</template>

<script>
import { addressEquals } from '../../utils/address'
export default {
  name: 'AddressForm',
  props: {
    stateAddress: { type: Object, default: null },
    addressType: {
      type: String,
      default: 'shipping'
    },
    focussed: {
      type: Boolean,
      default: false
    },
    showToggle: {
      type: Boolean,
      default: true
    },
    includeEmail: {
      type: Boolean,
      default: false
    },
    validation: { type: Object, default: null }
  },
  data: function() {
    let address = this.getAddressData()
    return {
      address: address,
      seperateBilling: false,
      country: address.country,
      email: ''
    }
  },
  computed: {
    firstNameError() {
      return this.validation.firstName
    },
    lastNameError() {
      return this.validation.lastName
    },
    streetError() {
      return this.validation.street
    },
    numberError() {
      return this.validation.number
    },
    zipError() {
      return this.validation.zip
    },
    emailError() {
      return this.$store.getters.getUserFormEmailError
    },
    cityError() {
      return this.validation.city
    },
    countryError() {
      return this.validation.country
    },
    countries() {
      return this.$store.state.countries
    }
  },
  watch: {
    stateAddress(value) {
      if (!this.country) {
        this.country = value.country
      }
      let address = this.getAddressData()
      if (!addressEquals(this.address, address)) {
        this.address = address
      }
    },
    countries(value) {
      this.address.country = this.country
    },
    focussed(value) {
      if (value) {
        this.focus()
      }
    },
    country(value) {
      this.$emit('country-selected', value)
    },
    email(value) {
      this.$emit('email-changed', value)
    }
  },
  mounted() {
    let vm = this
    this.$watch(
      'address',
      function() {
        var newAddress = {}
        for (var key in vm.address) {
          newAddress[key] = vm.address[key]
        }

        if (!newAddress.country && this.country) {
          newAddress['country'] = this.country
        }
        if (!addressEquals(newAddress, vm.stateAddress)) {
          vm.$emit('address-changed', newAddress)
        }
      },
      {
        deep: true
      }
    )
    if (this.focussed) {
      this.focus()
    }
    this.$store.dispatch('getCountries')
  },
  methods: {
    onSeperateBillingChange() {
      this.seperateBilling = !this.seperateBilling
      this.$emit('seperate-billing-changed', this.seperateBilling)
    },
    getAddressData() {
      let address = {
        firstName: (this.stateAddress && this.stateAddress.firstName) || '',
        lastName: (this.stateAddress && this.stateAddress.lastName) || '',
        company: (this.stateAddress && this.stateAddress.company) || '',
        street: (this.stateAddress && this.stateAddress.street) || '',
        number: (this.stateAddress && this.stateAddress.number) || '',
        addressExtra:
          (this.stateAddress && this.stateAddress.addressExtra) || '',
        city: (this.stateAddress && this.stateAddress.city) || '',
        zip: (this.stateAddress && this.stateAddress.zip) || ''
      }
      let id = this.stateAddress && this.stateAddress.id
      if (id) {
        address['id'] = id
      }

      if (this.stateAddress && this.stateAddress.country) {
        address['country'] = this.stateAddress.country
      } else if (this.country) {
        address['country'] = this.country
      } else {
        address['country'] = ''
      }
      return address
    },
    focus() {
      this.$refs['first'].focus()
    }
  }
}
</script>
