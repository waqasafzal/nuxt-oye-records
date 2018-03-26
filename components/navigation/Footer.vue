<template>
  <div :class="['footer', moveHigher ? 'higher' : '']">
    <div class="container-fluid footer-flex">
      <div class="logo-copyright">
        &copy; 2017 - 2018
      </div>
      <div class="terms">
        <nuxt-link :to="{name: 'info-imprint'}">Imprint</nuxt-link>|
        <nuxt-link :to="{name: 'info-terms-and-conditions'}">Terms</nuxt-link>|
        <nuxt-link :to="{name: 'info-privacy'}">Privacy</nuxt-link>
      </div>
      <div class="creators">
        <a href="http://www.nanonansen.de">Design Nano Nansen</a>&nbsp;|
        <a href="mailto: till.kolter@gmail.com">Development Till Kolter</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Footer',
    computed: {
      moveHigher () {
        return this.$store.state.primaryButtonBar.show || this.$store.getters.showAudioPlayer
      }
    }
  }
</script>
