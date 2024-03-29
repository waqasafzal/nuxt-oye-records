<template>
  <div class="cart">
    <template v-if="linesAvailable">
      <template v-if="cart.lines.length > 0">
        <div class="cart__table-header d-none d-md-block">
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
        <modal :showBody="true" v-if="showModal" @close="showModal = false">
          <div slot="headerTitle">
            Attention!
          </div>
          <div slot="body">
            <strong>{{deleteLine.release.name}} - {{deleteLine.release.title}}</strong> is reserved for you.<br><br>
            Removing this item from cart removes the reservation and puts it back to the open crates. Do you <em>really</em> want to proceed?
          </div>
          <div slot="footer" class="hmargin-auto modal__button-bar">
            <!--<div class="modal__button-bar">-->
              <button class="button" @click="onDelete(deleteLine, true)">OK</button>
              <button class="button" @click="showModal = false">Cancel</button>
            <!--</div>-->
          </div>
        </modal>
        <div class="cart__line" :key="i"
             v-for="(line, i) in cart.lines">
          <div class="row">
            <div class="col-12 col-md-5 cart__line__product">
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
            <div class="col-3 col-md-2 cart__line__cell">
              <div class="cart-cell-center flex-align-right">{{getPrice(line.pricePerItem)}} &euro;</div>
            </div>
            <div class="col-3 offset-md-1 col-md-1 cart__line__cell">
              <div v-show="!review" class="cart__line__quantity cart-cell-center">
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
            <div :class="['col-md-2', 'cart__line__cell', review ? 'col-6' : 'col-4']">
              <p class="flex-align-right cart-cell-center">{{ getPrice(line.lineTotal) }} &euro;</p>
            </div>
            <div v-if="!review" class="cart-item-delete col-2 col-md-1 cart__line__cell">
              <div class="flex-align-right cart-cell-center" @click="onDelete(line)">&times;</div>
            </div>
          </div>
        </div>
        <div class="cart__subtotal">
          <div class="row justify-content-end">
            <div class="col-2 offset-md-9 col-md-2 cart__total__subtotal cart__line__cell">
              <h4 class="cart-cell-center">Subtotal</h4>
            </div>
            <div class="col-10 col-md-1 cart__line__cell amount">
              <h4 class="flex-align-right cart-cell-center text-right">{{ getPrice(cart.totalAvailableNet) }}
                &euro;</h4>
            </div>
          </div>
          <div class="row justify-content-end" v-if="review">
            <div class="col-4 offset-md-9 col-md-2 cart__line__cell">
              <h4 class="cart-cell-center">Shipping</h4>
            </div>
            <div class="col-8 col-md-1 cart__line__cell">
              <h4 class="flex-align-right cart-cell-center text-right">{{ getPrice(shipping) }} &euro;</h4>
            </div>
          </div>
          <div class="row justify-content-end cart__vat">
            <div :class="[vatExcluded ? 'col-md-3': 'col-md-2', 'col-4', 'cart__line__cell', 'cart__vat__title']">
              <span class="cart-cell-center">
                <template v-if="!vatExcluded">
                  incl. VAT (19%)
                </template>
                <template v-else>
                  All prices exclude VAT as your selected shipping country is outside the EU.
                </template>
              </span>
            </div>
            <div v-if="!vatExcluded" class="col-8 col-md-1 cart__line__cell cart__vat__amount">
              <span class="flex-align-right cart-cell-center text-right">{{ vat }} &euro;</span>
            </div>
          </div>
        </div>
        <!--<div class="row justify-content-end">-->
        <!--</div>-->
        <div class="cart__total">
          <div class="row justify-content-end">
            <div class="col-md-2 col-4 cart__line__cell">
              <span class="cart-cell-center">Total</span>
            </div>
            <div class="col-8 col-md-1 cart__line__cell total__value">
              <h4 class="flex-align-right cart-cell-center text-right"><strong>{{ getPrice(total) }} &euro;</strong>
              </h4>
            </div>
          </div>
        </div>
      </template>
      <template v-if="cart.preorderLines.length > 0">
        <div class="cart__backorder">
          <h4>These items will be ordered for you but will not be charged yet:</h4>
          <div :key="'preorderLine' + i"
               v-for="(line, i) in cart.preorderLines" class="d-flex cart-line">
            <nuxt-link class="cart__backorder__name" :to="{name: 'releases-slug', params: {slug: line.release.slug}}">
              <span>{{ line.quantity }} &times; {{ line.release.name }} - {{ line.release.title}}</span>
            </nuxt-link>
            <div class="cart__backorder__delete" @click="onDelete(line)">Cancel</div>
          </div>
        </div>
      </template>
      <div v-if="!review" class="d-sm-flex d-md-none cart__checkout-button__panel">
        <template>
          <proceed-button class="cart__checkout-button" @click="pushCheckout">Go to checkout</proceed-button>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="cart__empty">
        <h1>Looks like your cart is empty.</h1>
        <nuxt-link to="/">
          <div class="btn primary">Start Shopping</div>
        </nuxt-link>
      </div>
    </template>
  </div>
</template>

<script>
  import ReleasePrice from '~/components/releases/ReleasePrice'
  import ProceedButton from '../shared/ProceedButton'
  import { roundFixed, getPrice } from '../../utils/math'
  import * as types from '../../store/types'
  import CheckoutButtons from '../checkout/CheckoutButtons'
  import Modal from '../shared/Modal'

  const MAX_QUANTITY = 5

  export default {
    components: {
      Modal,
      CheckoutButtons,
      ProceedButton,
      ReleasePrice
    },
    name: 'CartContent',
    props: {
      review: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        showModal: false
      }
    },
    watch: {
      linesAvailable (value) {
        this.$store.commit(types.SET_BUTTON_BAR_SHOW, value)
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
      totalNet () {
        return this.total / (1 + this.vatRate / 100)
      },
      vat () {
        let value = (this.total - this.totalNet)
        return roundFixed(value)
      },
      vatRate () {
        return this.$store.getters.getVat
      },
      vatExcluded () {
        return this.$store.getters.isVatExcluded
      },
      total () {
        if (this.review) {
          return roundFixed(parseFloat(this.cart.totalAvailable) + parseFloat(this.shipping))
        } else {
          return roundFixed(parseFloat(this.cart.totalAvailable))
        }
      },
      primaryButtons () {
        return this.$store.primaryButtonBar.buttons
      }
    },
    methods: {
      onChange (line, event) {
        this.$store.dispatch('updateCart', {
          line: line,
          value: event.target.value
        })
      },
      onDelete: function (line, confirmed = false) {
        if (!confirmed && line.isReserved) {
          this.showModal = true
          this.deleteLine = line
        } else {
          this.$store.dispatch('removeCartLine', {
            pk: line.release.pk,
            backorder: line.backorder
          }).then(() => {
            this.showModal = false
          })
        }
      },
      getPrice: function (price) {
        return getPrice(price, {vatRate: this.vatRate, vatExcluded: this.vatExcluded})
      },
      getQuantityOptions (lineQuantity) {
        return lineQuantity > MAX_QUANTITY ? lineQuantity : MAX_QUANTITY
      },
      pushCheckout () {
        this.$router.push({name: 'checkout'})
      }
    },
    mounted () {
      this.$store.commit(types.SET_BUTTON_BAR_CONTINUE, true)
      if (!this.review) {
        this.$store.commit(types.FINISH_CHECKOUT)
        this.$store.commit(types.SET_TERMS_AGREED, false)
        this.$store.commit(types.SET_CURRENT_CHECKOUT_STATE, null)
        this.$store.commit(types.SET_BUTTON_BAR_BUTTONS, [{f: this.pushCheckout, text: 'Go to checkout'}])
        this.$store.commit(types.SET_BUTTON_BAR_SHOW, this.linesAvailable)
      }
    },
    beforeDestroy () {
      this.$store.commit(types.SET_BUTTON_BAR_SHOW, false)
      this.$store.commit(types.SET_BUTTON_BAR_CONTINUE, true)
      this.$store.commit(types.SET_BUTTON_BAR_BUTTONS, [])
    }
  }

</script>

<style lang="scss">
  .modal__button-bar {
    display: flex;
    width: 100%;
    justify-content: space-around;
    .button {
      width: 10em;
    }
  }
</style>
