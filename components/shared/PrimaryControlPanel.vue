<template>
  <div class="cart__bottom-bar-panel" v-if="$store.state.primaryButtonBar.show">
    <div class="cart__bottom-bar d-flex flex-row justify-content-between" slot="bottom">
      <div>
        <nuxt-link class="cart__continue-button" to="/" v-if="$store.state.primaryButtonBar.showContinue">
          <div>
            <span class="helper"></span>
            <img src="../../assets/images/arrow_right_green.svg" class="arrow-rotated"/>
            <span>Continue shopping</span>
          </div>
        </nuxt-link>
      </div>
      <div>
        <proceed-button :key="i" v-for="(handler, i) in $store.state.primaryButtonBar.buttons" class="cart__checkout-button" @click="handler.f">{{ handler.text }}</proceed-button>
      </div>
    </div>
  </div>
</template>

<script>
  import ProceedButton from './ProceedButton'
  export default {
    components: {ProceedButton},
    name: 'PrimaryControlPanel'
  }
</script>
