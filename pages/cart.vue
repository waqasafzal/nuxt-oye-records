<template>
  <div>
    <div class="page__header">Cart</div>
    <cart-content></cart-content>
  </div>
</template>

<script>
  import CartContent from '~/components/cart/CartContent'
  export default {
    components: {CartContent},
    name: 'CartPage'
  }

</script>
