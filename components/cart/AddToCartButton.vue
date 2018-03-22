<template>
  <div v-if="release" :class="['add-to-cart-button', release.availability.status]" @click.prevent="addToCart"
       :style="addToCartButtonStyle">
    <div class="d-flex flex-row vmargin-auto">
      <!--<div style="width: auto; height: auto">-->
      <img :style="imgStyle" src="../../assets/images/cart_small_white.svg"/>
      <!--</div>-->
      <span :style="textStyle" v-if="withTitle"> {{ orderAction }}</span>
    </div>
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
        default: 36
      },
      withTitle: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        baseSize: this.size
      }
    },
    computed: {
      addToCartButtonStyle: function () {
        let style = {
          height: `${this.baseSize}px`,
          lineHeight: `${this.baseSize / 2}px`,
          flexFlow: 'row',
          overFlow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginTop: 'auto',
          marginBottom: 'auto'

        }
        return style
      },
      textStyle () {
        return {
          marginLeft: '2px',
          marginTop: 'auto',
          marginBottom: 'auto',
          height: `${this.baseSize * 2 / 3}px`,
          lineHeight: `${this.baseSize * 2 / 3 + Math.round(this.baseSize / 24)}px`,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          width: '100%'
        }
      },
      orderAction () {
        let status = this.release.availability.status
        if (['out', 'deleted'].includes(status)) {
          return 'Backorder'
        } else if (status === 'upcoming') {
          return 'Preorder'
        } else {
          return 'Add To Cart'
        }
      },
      imgStyle () {
        return {
          width: `${this.baseSize / 3}px`,
          marginRight: `${this.baseSize / 4.8}px`
        }
      }
    },
    methods: {
      addToCart () {
        this.$store.dispatch('addToCart', {
          pk: this.release.pk,
          quantity: this.quantity || 1
        }).then(() => {
          this.$emit('added')
        }).catch(e => console.log(e))
      }
    }
  }
</script>


<style lang="scss">
  .add-to-cart-button {
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    img {
      margin-left: auto;
    }
    &:hover {
      background-color: #29AB5D !important;
    }
    &.one {
      overflow: inherit !important;
      text-overflow: inherit !important;
      white-space: inherit !important;
    }
  }
</style>
