<template>
  <div class="complete">
    <h2>Thank you for your order!</h2>
    <h3>Order number: <span class="order-complete__number">#{{ lastOrderNo }}</span></h3>
    <div class="complete__summary">
      Your order has been placed and is being processed.
      <div v-if="!isSelfCollector">When the item(s) are shipped, you will receive an
      email with the details. You can track this order
      through <nuxt-link :to="{name: 'account-details', params: {page: 'Purchases'}}">my orders</nuxt-link> page.</div>
      <div v-else>When the item(s) are ready for pick up, you will receive an email.</div>
    </div>
  </div>
</template>

<script>
import * as types from '../../store/types'
export default {
  name: 'OrderComplete',
  data: function() {
    let unpaidOrder = this.$store.getters.getUnpaidOrder
    var lastOrderNo
    if (unpaidOrder) {
      lastOrderNo = unpaidOrder.pk
    }
    return {
      lastOrderNo: lastOrderNo,
      isSelfCollector: false
    }
  },
  computed: {
    order() {
      return this.$store.getters.getUnpaidOrder
    }
  },
  watch: {
    order(value) {
      if (value) {
        this.lastOrderNo = value.pk
      }
    }
  },
  mounted() {
    this.$store.commit(types.SET_UNPAID_ORDER, null)
    this.$store.commit(types.SET_TERMS_AGREED, false)

    // set the current self collector property
    let shippingOption = this.$store.getters.getShippingOption
    this.isSelfCollector = shippingOption && shippingOption.id === '-1'
    // get new cart object from server
    this.$store.dispatch('getCart')
  }
}
</script>
