<template>
  <div class="payment__card">
    <div class="payment__card__image payment__card__element">
      <img :src="paymentImage" v-if="paymentImage"/>
    </div>
    <div class="payment__card__info payment__card__element">
      <div class="card__holder">Holder Name: {{ data.holderName }}</div>
      <div class="card__number">Number: **** **** **** {{ data.number }}</div>
      <div class="card__expiry">Expiry: {{ data.expiryMonth }}/{{ data.expiryYear}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CardPaymentMethod',
    props: ['data', 'variant'],
    computed: {
      paymentImage () {
        let options = this.$store.getters.getPaymentOptions
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
  }
</script>
