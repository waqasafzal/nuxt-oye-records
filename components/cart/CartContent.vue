<template>
  <div class="cart">
    <template v-if="linesAvailable">
      <template v-if="cart.lines.length > 0">
        <div class="cart__table-header hidden-sm-down">
          <div class="row">
            <div class="col-md-5">
              <h5>Release</h5>
            </div>
            <div class="col-md-2 text-right">
              <h5>Price</h5>
            </div>
            <div class="col-md-1"></div>
            <div class="col-md-1">
              <h5>Quantity</h5>
            </div>
            <div class="col-md-2 text-right">
              <h5>Total</h5>
            </div>
          </div>
        </div>
        <div class="cart__line" :key="i"
             v-for="(line, i) in cart.lines">
          <div class="row">
            <div class="col-5 cart__line__product">
              <nuxt-link
                  :to="{name: 'releases-slug', params: {'id': line.release.pk, 'slug': line.release.slug}}">
                <img :src="line.smallImageUrl" alt=""/>
                <div class="cart__line__product__info">
                  <div class="release__name">{{ line.release.artistFirstName }} {{ line.release.artistLastName }}</div>
                  <div class="release__title">{{ line.release.title }}</div>
                  <div class="release__shipping">
                    <template v-if="!line.preorder">Ready for shipping</template>
                    <template v-else>Shipping as soon as possible</template>
                  </div>
                </div>
              </nuxt-link>
            </div>
            <div class="col-2 cart__line__cell">
              <release-price class="cart-cell-center flex-align-right" :price="line.release.price"></release-price>
            </div>
            <div class="col-1"></div>
            <div class="col-1 cart__line__cell">
              <div class="cart__line__quantity cart-cell-center">
                <form class="form-cart">
                  <div :class="[line.quantity.errors ? 'has-error': '']" tabindex="-1">
                    <input id="id_quantity" max="50" min="0" type="number"
                           v-on:change.prevent="onChange($event, line)" :value="line.quantity" required>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-2 cart__line__cell">
              <p class="flex-align-right cart-cell-center">{{ line.lineTotal }} &euro;</p>
            </div>
            <div v-if="!review" class="cart-item-delete col-1 cart__line__cell">
              <div class="flex-align-right cart-cell-center" @click="onDelete(line)">&times;</div>
            </div>
          </div>
        </div>
        <div class="cart__subtotal">
          <div class="row">
            <div class="col-2 offset-8 cart__total__subtotal cart__line__cell">
              <h4 class="cart-cell-center">Subtotal</h4>
            </div>
            <div class="col-1 cart__line__cell">
              <h4 class="flex-align-right cart-cell-center text-right">{{ cart.totalAvailableNet }} &euro;</h4>
            </div>
          </div>
          <div v-if="review" class="row">
            <div class="col-2 offset-8 cart__line__cell">
              <h4 class="cart-cell-center">Shipping</h4>
            </div>
            <div class="col-1 cart__line__cell">
              <h4 class="flex-align-right cart-cell-center text-right">{{ shipping }} &euro;</h4>
            </div>
          </div>
          <div class="row cart__vat">
            <div class="col-2 offset-8 cart__line__cell cart__vat__title">
              <span class="cart-cell-center">incl. VAT (19%)</span>
            </div>
            <div class="col-1 cart__line__cell cart__vat__amount">
              <span class="flex-align-right cart-cell-center text-right">{{ vat }} &euro;</span>
            </div>
          </div>
        </div>
        <div class="cart__total">
          <div class="row">
            <div class="col-2 offset-8 cart__line__cell">
              <h4 class="cart-cell-center">Total</h4>
            </div>
            <div class="col-1 cart__line__cell">
              <h4 class="flex-align-right cart-cell-center text-right"><strong>{{ total }} &euro;</strong></h4>
            </div>
          </div>
        </div>
      </template>
      <template v-if="cart.preorderLines.length > 0">
        <div class="cart__backorder">
          <h4>These items will be put into your backorder and will not be charged yet:</h4>
          <div :key="'preorderLine' + i"
               v-for="(line, i) in cart.preorderLines">
            <nuxt-link :to="{name: 'releases-slug', params: {slug: line.release.slug}}">
              <span>{{ line.quantity }} &times; {{ line.release.name }} - {{ line.release.title}}</span>
            </nuxt-link>
          </div>
        </div>
      </template>
      <template v-if="!review">
        <div class="cart__bottom-bar row">
          <div class="col-8">
            <nuxt-link class="cart__continue-button" to="/">
              <div>
                <span class="helper"></span>
                <img src="../../assets/images/arrow_right_green.svg" class="arrow-rotated"/>
                <span>Continue shopping</span>
              </div>
            </nuxt-link>
          </div>
          <div class="col-4">
            <proceed-button class="cart__checkout-button" @click="$router.push({name: 'checkout'})">Go to checkout</proceed-button>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="cart__empty">
        <h2>There are no products in your shopping cart.</h2>
      </div>
    </template>
  </div>
</template>

<script>
  import ReleasePrice from '~/components/releases/ReleasePrice'
  import ProceedButton from '../shared/ProceedButton'
  import { roundFixed } from '../../utils/math'

  export default {
    components: {ProceedButton, ReleasePrice},
    name: 'CartContent',
    props: {
      review: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      linesAvailable () {
        return this.cart && (this.cart.lines.length > 0 || this.cart.preorderLines.length > 0)
      },
      cart () {
        return this.$store.state.cart
      },
      cartUpdating () {
        return this.$store.state.cartUpdating
      },
      shipping () {
        return this.$store.getters.getShippingOption && this.$store.getters.getShippingOption.price || '0.00'
      },
      vat () {
        var value = (this.total / 100) * 19.0
        return roundFixed(value)
      },
      total () {
        return roundFixed(parseFloat(this.cart.totalAvailable) + parseFloat(this.shipping))
      }
    },
    methods: {
      onChange: function (e, line) {
        let targetValue = parseInt(e.target.value)
        let quantity = line.quantity
        if (targetValue !== quantity) {
          this.$store.dispatch('updateCart', {
            release: line.release,
            preorder: line.preorder,
            // line.quantity is not trustworthy since the value is not changed at the fist call
            quantity: targetValue
          })
        }
      },
      onDelete: function (line) {
        this.$store.dispatch('removeCartLine', {
          pk: line.release.pk,
          preorder: line.preorder
        })
      }
    }
  }

</script>
