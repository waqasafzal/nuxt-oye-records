<template>
  <div id="app">
    <header class="navbar" role="navigation">
      <brand-navbar :isOpenMobile="isOpenMobileMenu" v-on:togglemenu="onToggleMobileMenu" v-on:closemenu="closeMobileMenu"></brand-navbar>
    </header>
    <div class="background">
      <alerts></alerts>
      <div class="container maincontent page">
        <nuxt></nuxt>
      </div>
      <audio-player></audio-player>
    </div>
  </div>
</template>

<script>
  import BrandNavbar from '../components/navigation/BrandNavbar'
  import Alerts from '../components/shared/Alerts'
  var AudioPlayer = require('../components/audio/AudioPlayer')

  export default {
    components: {Alerts, BrandNavbar, AudioPlayer},
    name: 'app',
    data: function () {
      return {
        isOpenMobileMenu: false
      }
    },
    methods: {
      onToggleMobileMenu () {
        this.isOpenMobileMenu = !this.isOpenMobileMenu
      },
      closeMobileMenu () {
        this.isOpenMobileMenu = false
      }
    }
  }
</script>
