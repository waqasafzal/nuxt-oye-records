<template>
  <div>
    <div class="card__holder">Holder Name: {{ data.holderName }}</div>
    <div class="card__number">Number: **** **** **** {{ data.number }}</div>
    <div class="card__expiry">Expiry: {{ data.expiryMonth }}/{{ data.expiryYear}}</div>
  </div>
</template>

<script>
  export default {
    name: 'CardPaymentMethod',
    props: ['data']
  }
</script>
