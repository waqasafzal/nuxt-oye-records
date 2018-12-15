<template>
  <div class="checkout__content">
    <div class="row">
      <div class="col-12 checkout__content__col centered-form-panel pay-order__panel">
        <div class="pay-order__header">
          <h3>Order Payment</h3>
          <div 
            class="pay-order__cancel" 
            @click="onCancel">
            <div class="close"/><span>Cancel</span>
          </div>
          <div class="pay-order__summary">You have an unpaid order over {{ totalAmount }} &euro;</div>
        </div>
        <component :is="selectedPaymentView"/>
      </div>
    </div>
  </div>
</template>

<script>
import CardPayment from '~/components/checkout/CardPayment'
import LocalPayments from '~/components/checkout/LocalPayments'
import { getPrice } from '../../utils/math'
export default {
  name: 'PayOrder',
  computed: {
    selectedPaymentView() {
      let paymentType = this.paymentType
      if (paymentType) {
        if (paymentType !== 'creditcard') {
          return LocalPayments
        }
      }
      return CardPayment
    },
    totalAmount() {
      return (
        this.order &&
        getPrice(this.order.price + this.order.porto, {
          vatExcluded: this.order.excludedVat,
          vatRate: this.order.excludedVat
        })
      )
    },
    paymentType() {
      return this.order && this.order.paymentType
    },
    order() {
      return this.$store.getters.getUnpaidOrder
    }
  },
  methods: {
    onCancel() {
      let order = this.order
      let vm = this
      this.$store.dispatch('cancelOrder', { id: order.pk }).then(() => {
        if (order) {
          vm.$store.commit('SET_SELECTED_PAYMENT_OPTION', {
            id: order.paymentType
          })
        }
      })
    }
  }
}
</script>
