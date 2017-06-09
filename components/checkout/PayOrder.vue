<template>
  <div class="checkout__content">
    <div class="row">
      <div class="col-12 checkout__content__col">
        <h2>Order Payment</h2>
        <h3>You have an unpaid order over {{ totalAmount }} &euro;</h3>
        <component :is="selectedPaymentView"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import CardPayment from '~/components/checkout/CardPayment'
  import LocalPayments from '~/components/checkout/LocalPayments'
  import { roundFixed } from '../../utils/math'
  export default {
    name: 'PayOrder',
    computed: {
      selectedPaymentView () {
        let paymentType = this.paymentType
        if (paymentType) {
          if (paymentType !== 'creditcard') {
            return LocalPayments
          }
        }
        return CardPayment
      },
      totalAmount () {
        return this.order && roundFixed(this.order.price + this.order.porto)
      },
      paymentType () {
        return this.order && this.order.paymentType
      },
      order () {
        return this.$store.getters.getUnpaidOrder
      }
    }
  }
</script>
