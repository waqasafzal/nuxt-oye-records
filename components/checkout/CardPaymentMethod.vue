<template>
  <div class="payment__card__panel">
    <div @click="onDelete" class="delete">&times;</div>
    <div class="payment__card" v-if="data">
      <div class="payment__card__info payment__card__element">
        <div class="card__holder">Holdername: {{ data.holderName }}</div>
        <div class="card__number">Number: **** **** **** {{ data.number }}</div>
        <div class="card__expiry">Expiry: {{ data.expiryMonth }}/{{ data.expiryYear}}</div>
      </div>
      <div class="payment__card__image payment__card__element">
        <img :src="paymentImage" v-if="paymentImage"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { getAuthHeader } from '../../utils/auth/index'
  export default {
    name: 'CardPaymentMethod',
    props: ['objectId', 'data', 'variant'],
    computed: {
      paymentImage () {
        let options = this.$store.getters.getPaymentOptions
        if (options) {
          for (var i = 0; i < options.length; i++) {
            let option = options[i]
            if (option.logos) {
              for (var j = 0; j < option.logos.length; j++) {
                let methodLogo = option.logos[j]
                if (methodLogo.variant === this.variant) {
                  return methodLogo.logo
                }
              }
            }
          }
        }
      }
    },
    methods: {
      onDelete () {
        var vm = this
        this.$http.delete(`${__API__}/oye/adyen-payment-method/${this.objectId}/`, {
          headers: {
            Authorization: getAuthHeader()
          }
        }).then(
          data => {
            vm.$store.dispatch('addAlert', {message: 'Your saved payment method has been removed'})
            vm.$emit('deleted')
          }
        )
      }
    }
  }
</script>
