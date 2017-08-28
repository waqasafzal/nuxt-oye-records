<template>
  <div class="complete">
    <h2>Thank you for your order!</h2>
    <h3>Order number: <span class="order-complete__number">#{{orderNo}}</span></h3>
    <div class="complete__summary">
      Your order has been placed and is being processed.
      <div v-if="!isSelfCollector">When the item(s) are shipped, you will receive an
        email with the details. You can track this order
        through <nuxt-link :to="{name: 'account-details', params: {page: 'Orders'}}">my orders</nuxt-link> page.</div>
      <div v-else>When the item(s) are ready for pick up, you will receive an email.</div>
    </div>
  </div>
</template>

<script>
  import * as types from '../../store/types'
  export default {
    name: 'OrderComplete',
    data: function () {
      var orderNo = this.$store.getters.getUnpaidOrder.pk
      this.$store.commit(types.SET_UNPAID_ORDER, null)
      return {
        orderNo: orderNo
      }
    },
    computed: {
      isSelfCollector () {
        let shippingOption = this.$store.getters.getShippingOption
        return shippingOption && shippingOption.id === '-1'
      }
    }
  }
</script>
