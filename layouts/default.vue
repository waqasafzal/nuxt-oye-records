<template>
  <div id="app">
    <account-navbar></account-navbar>
    <header class="navbar" role="navigation">
      <brand-navbar :isOpenMobile="isOpenMobileMenu" v-on:togglemenu="onToggleMobileMenu"
                    v-on:closemenu="closeMobileMenu"></brand-navbar>
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
  import AccountNavbar from '../components/navigation/AccountNavbar'
  var AudioPlayer = require('../components/audio/AudioPlayer')

  export default {
    components: {AccountNavbar, Alerts, BrandNavbar, AudioPlayer},
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
      },
      onClosePlaylist () {
        this.noScroll = false
      },
      onOpenPlaylist () {
        this.noScroll = true
      }
    }
  }
</script>
