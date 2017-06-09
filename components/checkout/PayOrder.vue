<template>
  <div class="checkout__content">
    <h2>Order Payment</h2>
    <h3>You have an unpaid order over {{ totalAmount }} &euro;</h3>
    <component :is="selectedPaymentView"></component>
  </div>
</template>

<script>
  import CardPayment from '~/components/checkout/CardPayment'
  import { roundFixed } from '../../utils/math'
  export default {
    name: 'PayOrder',
    computed: {
      selectedPaymentView () {
        return CardPayment
      },
      totalAmount () {
        return this.order && roundFixed(this.order.price + this.order.porto)
      },
      order () {
        return this.$store.getters.getUnpaidOrder
      }
    }
  }
</script>
