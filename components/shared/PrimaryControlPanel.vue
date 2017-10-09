<template>
  <div class="cart__bottom-bar-panel" v-if="$store.state.primaryButtonBar.show">
    <div class="cart__bottom-bar d-flex flex-row justify-content-between" slot="bottom">
      <div v-if="$store.state.primaryButtonBar.showContinue">
        <nuxt-link class="cart__continue-button" to="/" >
          <div>
            <span class="helper"></span>
            <img src="../../assets/images/arrow_right_green.svg" class="arrow-rotated"/>
            <span>Continue shopping</span>
          </div>
        </nuxt-link>
      </div>
      <div class="checkout__toc" v-if="$store.getters.getCheckoutState === 4">
        <div class="d-flex">
          <div>
            <input v-model="termsAgreed" type="checkbox"/>
          </div>
          <span>
            I acknowledge the
            <nuxt-link target="_blank" :to="{name: 'info-toc'}">Terms</nuxt-link>
            and
            <nuxt-link target="_blank"
                       :to="{name: 'info-privacy'}">privacy policy
            </nuxt-link>
            of OYE Records and agree to them.<br/>
            <nuxt-link :to="{path: 'info/toc#cancel'}" target="_blank">Here you can find more information on your right of withdrawal.</nuxt-link>
          </span>
        </div>
      </div>
      <div>
        <proceed-button :key="i" v-for="(handler, i) in $store.state.primaryButtonBar.buttons"
                        class="cart__checkout-button" @click="handler.f">{{ handler.text }}
        </proceed-button>
      </div>
    </div>
  </div>
</template>

<script>
  import ProceedButton from './ProceedButton'
  import * as types from '../../store/types'
  export default {
    components: {ProceedButton},
    name: 'PrimaryControlPanel',
    data () {
      return {
        termsAgreed: false
      }
    },
    watch: {
      termsAgreed (value) {
        this.$store.commit(types.SET_TERMS_AGREED, value)
      }
    },
    mounted () {
      this.$store.commit(types.SET_TERMS_AGREED, false)
    }
  }
</script>
