<template>
  <div 
    v-if="$store.state.primaryButtonBar.show" 
    class="cart__bottom-bar-panel">
    <div 
      slot="bottom" 
      class="cart__bottom-bar d-flex flex-row justify-content-between">
      <div v-if="$store.state.primaryButtonBar.showContinue">
        <nuxt-link 
          class="cart__continue-button" 
          to="/" >
          <div>
            <span class="helper"/>
            <img
              alt="arrow right"
              src="../../assets/images/arrow_right_green.svg" 
              class="arrow-rotated">
            <span>Continue shopping</span>
          </div>
        </nuxt-link>
      </div>
      <div 
        v-if="$store.getters.getCheckoutState === 4" 
        class="checkout__toc">
        <div class="d-flex">
          <div>
            <input 
              v-model="termsAgreed" 
              type="checkbox">
          </div>
          <span>
            I acknowledge the
            <nuxt-link 
              :to="{name: 'info-terms-and-conditions'}" 
              target="_blank">Terms</nuxt-link>
            and
            <nuxt-link 
              :to="{name: 'info-privacy'}"
              target="_blank">privacy policy
            </nuxt-link>
            of OYE Records and agree to them.<br>
            <nuxt-link 
              :to="{path: 'info/terms-and-conditions#cancel'}" 
              target="_blank">Here you can find more information on your right of withdrawal.</nuxt-link>
          </span>
        </div>
      </div>
      <div>
        <proceed-button 
          v-for="(handler, i) in $store.state.primaryButtonBar.buttons" 
          :key="i"
          class="cart__checkout-button" 
          @click="handler.f">{{ handler.text }}
        </proceed-button>
      </div>
    </div>
  </div>
</template>

<script>
import ProceedButton from './ProceedButton'
import * as types from '../../store/types'
import { mapGetters } from 'vuex'
export default {
  name: 'PrimaryControlPanel',
  components: { ProceedButton },
  data() {
    return {
      termsAgreed: false
    }
  },
  computed: {
    ...mapGetters({
      stateTermsAgreed: 'termsAgreed'
    })
  },
  watch: {
    termsAgreed(value) {
      this.$store.commit(types.SET_TERMS_AGREED, value)
    },
    stateTermsAgreed(value) {
      this.termsAgreed = value
    }
  },
  mounted() {
    this.$store.commit(types.SET_TERMS_AGREED, false)
    //    },
    //    beforeDestroyed () {
    //      this.$store.commit()
  }
}
</script>
