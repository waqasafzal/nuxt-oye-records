<template>
  <form class="shipping-address__form" method="post" @submit.prevent="onSubmit">
    <fieldset>
      <div class="form-group">
        <input class="form-control"
               type="text"
               placeholder="First name *"
               v-model="address.firstName"
               required>
      </div>

      <div class="form-group">
        <input class="form-control"
               type="text"
               placeholder="Last name *"
               v-model="address.lastName"
               required>
      </div>

      <div class="form-group">
        <input class="form-control"
               type="text"
               placeholder="Company"
               v-model="address.company">
      </div>

      <div class="form-group">
        <input class="form-control"
               type="text"
               placeholder="Street *"
               v-model="address.street"
               required />
        <input class="form-control form-field__number"
               type="number"
               placeholder="Number *"
               v-model.number="address.number"
               required />
      </div>
      <div class="form-group">
        <input class="form-control"
               type="text"
               placeholder="Address Extra"
               v-model="address.addressExtra" />
      </div>
      <div class="form-group">
        <input class="form-control form-field__city"
               type="text"
               name="city"
               placeholder="City *"
               v-model="address.city"
               required />
        <input class="form-control form-field__zip"
               type="number"
               name="zip"
               placeholder="Zip *"
               v-model.number="address.zip"
               required />
      </div>
      <div class="form-group">
        <select class="form-control"
                name="country"
                v-model.lazy="address.country"
                :value="address.country"
                required>
          <option :value="country.name" v-for="(country, i) in countries">{{country.name}}</option>
        </select>
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
      }
    },
    data: function () {
      let address = this.getAddressData()
      return {
        address: address,
        seperateBilling: false,
        country: null
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
        })
    }
  }
</script>
