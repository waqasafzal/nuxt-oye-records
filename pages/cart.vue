<template>
  <div class="container-fluid">
    <div class="page__header">
      <h1>Cart</h1>
    </div>
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
