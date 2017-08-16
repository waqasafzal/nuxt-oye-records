<template>
  <div class="cart">
    <template v-if="linesAvailable">
      <template v-if="cart.lines.length > 0">
        <div class="cart__table-header d-sm-none">
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
                    <div :class="['product__info__availability', line.release.availability.status]"></div>
                    <div>
                      <template v-if="line.backorder">Shipping as soon as possible</template>
                      <template v-else-if="line.release.availability.status === 'upcoming'">
                        Preorder {{line.release.releasedAt}}
                      </template>
                      <template v-else>Ready for shipping</template>
                    </div>
                  </div>
                </div>
              </nuxt-link>
            </div>
            <div class="col-2 cart__line__cell">
              <div class="cart-cell-center flex-align-right">{{getPrice(line.release.price.gross)}} &euro;</div>
            </div>
            <div class="col-1"></div>
            <div class="col-1 cart__line__cell">
              <div class="cart__line__quantity cart-cell-center">
                <form class="form-cart">
                  <div :class="['form-group', line.quantity.errors ? 'has-error': '']" tabindex="-1">
                    <select class="form-control"
                            name="id_quantity"
                            v-model.lazy="line.quantity"
                            @change="onChange(line, $event)"
                            :value="line.quantity" required>
                      <option :value="n" v-for="n in getQuantityOptions(line.quantity)">{{ n }}</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-2 cart__line__cell">
              <p class="flex-align-right cart-cell-center">{{ getPrice(line.lineTotal) }} &euro;</p>
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
              <h4 class="flex-align-right cart-cell-center text-right">{{ getPrice(cart.totalAvailableNet) }} &euro;</h4>
            </div>
          </div>
          <div v-if="review" class="row">
            <div class="col-2 offset-8 cart__line__cell">
              <h4 class="cart-cell-center">Shipping</h4>
            </div>
            <div class="col-1 cart__line__cell">
              <h4 class="flex-align-right cart-cell-center text-right">{{ getPrice(shipping) }} &euro;</h4>
            </div>
          </div>
          <div class="row cart__vat">
            <div :class="[vatExcluded ? 'col-3': 'col-2', 'offset-8', 'cart__line__cell', 'cart__vat__title']">
              <span class="cart-cell-center">
                <template v-if="!vatExcluded">
                  incl. VAT (19%)
                </template>
                <template v-else>
                  All prices exclude VAT as your selected shipping country is outside the EU.
                </template>
              </span>
            </div>
            <div v-if="!vatExcluded" class="col-1 cart__line__cell cart__vat__amount">
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
              <h4 class="flex-align-right cart-cell-center text-right"><strong>{{ getPrice(total) }} &euro;</strong></h4>
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
        <div class="cart__bottom-bar row">
          <!--<template v-if="!review">-->
            <slot>
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
            </slot>
          <!--</template>-->
        </div>
    </template>
    <template v-else>
      <div class="cart__empty">
        <h1>Looks like your cart is empty.</h1>
        <nuxt-link to="/"><div class="btn btn-primary">Start Shopping</div></nuxt-link>
      </div>
    </template>
  </div>
</template>

<script>
  import ReleasePrice from '~/components/releases/ReleasePrice'
  import ProceedButton from '../shared/ProceedButton'
  import { roundFixed } from '../../utils/math'

  const MAX_QUANTITY = 5

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
        return this.$store.getters.getCart
      },
      cartUpdating () {
        return this.$store.state.cartUpdating
      },
      shipping () {
        return this.$store.getters.getShippingOption && this.$store.getters.getShippingOption.price || '0.00'
      },
      vat () {
        var value = (this.total / 100) * this.vatRate
        return roundFixed(value)
      },
      vatRate () {
        return this.$store.getters.getVat
      },
      vatExcluded () {
        return this.$store.getters.isVatExcluded
      },
      total () {
        return roundFixed(parseFloat(this.cart.totalAvailable) + parseFloat(this.shipping))
      }
    },
    methods: {
      onChange (line, event) {
        this.$store.dispatch('updateCart', {
          line: line,
          value: event.target.value
        })
      },
      onDelete: function (line) {
        this.$store.dispatch('removeCartLine', {
          pk: line.release.pk,
          preorder: line.preorder
        })
      },
      getPrice: function (price) {
        let parsedPrice = parseFloat(price)
        if (this.vatExcluded) {
          parsedPrice = parsedPrice * ((100 - this.vatRate) / 100)
        }
        return roundFixed(parsedPrice, 2)
      },
      getQuantityOptions (lineQuantity) {
        return lineQuantity > MAX_QUANTITY ? lineQuantity : MAX_QUANTITY
      }
    }
  }

</script>
