<template>
  <div class="my-orders">
    <my-available-orders-table></my-available-orders-table>
    <my-missing-orders-table></my-missing-orders-table>
  </div>
</template>

<script>
  import { roundFixed } from '../../utils/math'
  import MyMissingOrdersTable from './MyMissingOrdersTable'
  import MyAvailableOrdersTable from './MyAvailableOrdersTable'

  export default {
    name: 'MyOrders',
    components: {MyAvailableOrdersTable, MyMissingOrdersTable},
    methods: {
      getPrice: function (price) {
        let parsedPrice = parseFloat(price)
        return roundFixed(parsedPrice, 2)
      }
    }
  }
</script>
