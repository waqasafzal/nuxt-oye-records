<template>
  <div id="app">
    <header class="navbar" role="navigation">
      <account-navbar></account-navbar>
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
      }
    },
    beforeCreate () {
      client.networkInterface.use([{
        applyMiddleware (req, next) {
          if (!req.options.headers) {
            req.options.headers = {}  // Create the header object if needed.
          }
          var item = localStorage.getItem('token')
          if (item !== 'undefined') {
            req.options.headers['Authorization'] = 'Token ' + item
          }

          var crsftoken = Vue.cookie.get('csrftoken')

          var cart = Vue.cookie.get('cart')
          if (cart) {
            req.options.headers['X-CART-TOKEN'] = cart
          }
          if (!crsftoken) {
            this.fetchStatus(function () {
              crsftoken = Vue.cookie.get('csrftoken')
              req.options.headers['X-CSRFToken'] = crsftoken
              next()
            })
          } else {
            req.options.headers['X-CSRFToken'] = crsftoken
            next()
          }
        }
      }])
    }
  }
</script>
