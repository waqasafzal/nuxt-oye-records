<template>
  <transition v-if="$store.state.showMobile" name="from-right" @enter="onEnter">
    <div class="mobile-menu">
      <div @click="onClose" class="close">Close</div>
    </div>
  </transition>
</template>

<script>
  import * as types from '../../store/types'
  import MainNavbar from './MainNavbar'
  export default {
    components: {MainNavbar},
    name: 'MobileMenu',
    methods: {
      onClose () {
        this.$store.commit(types.SET_MOBILE_NAV, false)
      }
    }
  }
</script>

<style>
  .from-right-enter-active {
    transition: all .7s;
  }

  .from-right-leave-active {
    width: 0;
    transition: all .7s;
  }

  .from-right-enter {
    width: 0;
  }
</style>
