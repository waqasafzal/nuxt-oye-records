<template>
  <form class="shipping-address__form" method="post" @submit.prevent="onSubmit">
    <fieldset>
      <div :class="['form-group', 'input-validation', firstNameError ? 'has-danger' : '']">
        <input class="form-control"
               type="text"
               id="first"
               ref="first"
               placeholder="Given name *"
               v-model="address.firstName"
               required>
        <div v-if="firstNameError" class="error">{{ firstNameError }}</div>
      </div>

      <div :class="['form-group', 'input-validation', lastNameError ? 'has-danger': '']">
        <input class="form-control"
               type="text"
               placeholder="Family name *"
               v-model="address.lastName"
               required>
        <div v-if="lastNameError" class="error">{{ lastNameError }}</div>
      </div>

      <div class="form-group">
        <input class="form-control"
               type="text"
               placeholder="Company"
               v-model="address.company">
      </div>

      <div :class="['form-group', streetError ? 'has-danger' : '']">
        <div class="form-group-item input-validation">
          <input class="form-control"
                 type="text"
                 placeholder="Street *"
                 v-model="address.street"
                 required />
          <div v-if="streetError" class="error">{{ streetError }}</div>
        </div>
        <div :class="['form-group-item', 'form-field__number', 'input-validation', numberError ? 'has-danger' : '']">
          <input class="form-control"
                 type="text"
                 placeholder="Number *"
                 v-model="address.number"
                 required />
          <div v-if="numberError" class="error">{{ numberError }}</div>
        </div>
      </div>
      <div class="form-group">
        <input class="form-control"
               type="text"
               placeholder="Address Extra"
               v-model="address.addressExtra" />
      </div>
      <div class="form-group">
        <div :class="['form-group-item', 'input-validation', cityError ? 'has-danger' : '']">
          <input class="form-control form-field__city"
                 type="text"
                 name="city"
                 placeholder="City *"
                 v-model="address.city"
                 required />
          <div v-if="cityError" class="error">{{ cityError }}</div>
        </div>
        <div :class="['form-group-item', 'form-field__zip', 'input-validation', zipError ? 'has-danger': '']">
          <input class="form-control"
                 type="text"
                 name="zip"
                 placeholder="Zip *"
                 v-model="address.zip"
                 required />
          <div v-if="zipError" class="error">{{ zipError }}</div>
        </div>
      </div>
      <div :class="['form-group', 'input-validation', countryError ? 'has-danger' : '']">
        <select class="form-control has-danger"
                name="country"
                v-model.lazy="address.country"
                :value="address.country"
                required>
          <option value="" disabled selected>Select your country</option>
          <option :value="country.name" v-for="(country, i) in countries">{{country.name}}</option>
        </select>
        <div v-if="countryError" class="error">{{ countryError }}</div>
      </div>
      <div class="checkbox-panel" v-if="addressType === 'shipping'" @change="onSeperateBillingChange">
        <input type="checkbox"
               id="seperate-billing"
               name="seperate-billing"/>
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
      stateAddress: Object,
      addressType: {
        type: String,
        default: 'shipping'
      },
      countries: {
        type: Array,
        default: []
      },
      focussed: {
        type: Boolean,
        default: false
      },
      validation: Object
    },
    data: function () {
      let address = this.getAddressData()
      return {
        address: address,
        seperateBilling: false,
        country: null
      }
    },
    computed: {
      firstNameError () {
        return this.validation.firstName
      },
      lastNameError () {
        return this.validation.lastName
      },
      streetError () {
        return this.validation.street
      },
      numberError () {
        return this.validation.number
      },
      zipError () {
        return this.validation.zip
      },
      cityError () {
        return this.validation.city
      },
      countryError () {
        return this.validation.country
      }
    },
    watch: {
      stateAddress (value) {
        if (!this.country) {
          this.country = value.country
          this.$emit('country-selected', this.country)
        }
        let address = this.getAddressData()
        if (!addressEquals(this.address, address)) {
          this.address = address
        }
      },
      countries (value) {
        this.address.country = this.country
      },
      focussed (value) {
        if (value) {
          this.focus()
        }
      }
    },
    methods: {
      onSeperateBillingChange () {
        this.seperateBilling = !this.seperateBilling
        this.$emit('seperate-billing-changed', this.seperateBilling)
      },
      getAddressData () {
        let address = {
          firstName: this.stateAddress && this.stateAddress.firstName || '',
          lastName: this.stateAddress && this.stateAddress.lastName || '',
          company: this.stateAddress && this.stateAddress.company || '',
          street: this.stateAddress && this.stateAddress.street || '',
          number: this.stateAddress && this.stateAddress.number || '',
          addressExtra: this.stateAddress && this.stateAddress.addressExtra || '',
          city: this.stateAddress && this.stateAddress.city || '',
          zip: this.stateAddress && this.stateAddress.zip || ''
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
      focus () {
        this.$refs['first'].focus()
      }
    },
    mounted () {
      let vm = this
      this.$watch(
        'address',
        function () {
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
        }, {
          deep: true
        }
      )
      if (this.focussed) {
        this.focus()
      }
    }
  }
</script>
