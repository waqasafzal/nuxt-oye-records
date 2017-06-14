<template>
  <div id="app">
    <!-- a placeholder for the google analytics script -->
    <div>
      <script>
        // eslint-disable-next-line no-unused-vars
        var nothing = function () {
          console.log('never called. never do nothing')
        }
      </script>
    </div>
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
  import { getAuthHeader } from '../utils/auth/index'
  import client from '../plugins/apollo'
  import Vue from 'vue'

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
    },
    beforeCreate () {
      client.networkInterface.use([{
        applyMiddleware (req, next) {
          if (!req.options.headers) {
            req.options.headers = {}  // Create the header object if needed.
          }

          var jwt = Vue.cookie.get('jwt')
          if (jwt) {
            var header = getAuthHeader()
            if (header) {
              req.options.headers['Authorization'] = header
            }
          }
          var cart = Vue.cookie.get('cart')
          if (cart) {
            req.options.headers['X-CART-TOKEN'] = cart
          }
          next()
        }
      }])
    }
  }
</script>
