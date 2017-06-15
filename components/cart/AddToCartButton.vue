<template>
  <div v-if="release" class="add-to-cart-button" @click.prevent="addToCart" :style="addToCartButtonStyle">
    <img :style="imgStyle" src="../../assets/images/cart_small_white.svg" />
    <span>{{ orderAction }}</span>
  </div>
</template>

<script>
  export default {
    name: 'AddToCartButton',
    props: {
      quantity: {
        type: Number,
        default: 1
      },
      release: Object,
      size: {
        type: Number,
        default: 32
      }
    },
    data: function () {
      return {
        baseSize: this.size
      }
    },
    computed: {
      addToCartButtonStyle: function () {
        return {
          height: `${this.baseSize}px`,
          lineHeight: `${this.baseSize}px`
        }
      },
      orderAction () {
        let status = this.release.availability.status
        if (status === 'out') {
          return 'Backorder now'
        } else if (status === 'upcoming') {
          return 'Preorder now'
        } else {
          return 'Add to cart'
        }
      },
      imgStyle () {
        return {
          width: `${this.baseSize / 3}px`,
          marginRight: `${this.baseSize / 4.8}px`,
          marginTop: `${-1 * this.baseSize / 12}px`
        }
      }
    },
    methods: {
      addToCart () {
        this.$store.dispatch('addToCart', {
          pk: this.release.pk,
          quantity: this.quantity || 1
        }).catch(e => console.log(e))
      }
    }
  }
</script>


<style lang="scss">
  .add-to-cart-button {
    cursor: pointer;
    &:hover:after {
       content: '';
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       background-color: black;
       opacity: 0.1;
     }
  }
</style>
