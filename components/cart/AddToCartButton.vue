<template>
  <div v-if="release" class="add-to-cart-button" @click.prevent="addToCart"
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
//          width: `${this.baseSize}px`,
          lineHeight: `${this.baseSize / 2}px`,
          display: 'flex',
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
          marginRight: `${this.baseSize / 4.8}px`
//          ,
//          ,
//          marginTop: `${-1 * this.baseSize / 16}rem`
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
    /*position: relative;*/
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    img {
      /*margin-top: auto;*/
      /*margin-bottom: auto;*/
      margin-left: auto;
      /*margin-right: auto;*/
    }
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
