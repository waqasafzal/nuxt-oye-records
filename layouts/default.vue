<template>
  <div id="app" :class="[isMobile ? 'mobile': '']">
    <account-navbar v-if="!isMobile"></account-navbar>
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
    computed: {
      isMobile () {
        return this.$store.getters.isMobile
      }
    },
    beforeCreate () {
      client.networkInterface.use([{
        applyMiddleware (req, next) {
          if (!req.options.headers) {
            req.options.headers = {}  // Create the header object if needed.
          }

          var jwt = Vue.cookie.get('jwt')
          var header = null
          if (jwt) {
            header = getAuthHeader()
          }
          if (header) {
            req.options.headers['Authorization'] = header
          }
          var cart = Vue.cookie.get('cart')
          if (cart) {
            req.options.headers['X-CART-TOKEN'] = cart
          }
          next()
        }
      }])
      client.networkInterface.useAfter([
        {
          applyAfterware ({ response }, next) {
            if (response.status === 401) {
            }
            next()
          }
        }
      ])
    },
    mounted () {
      document.addEventListener('keydown', function (e) {
        var key = e.keyCode ? e.keyCode : e.which
        if ([37, 39].includes(key)) {
          e.preventDefault()
        }
      })

      var isTouch = false // var to indicate current input type (is touch versus no touch)
      var isTouchTimer
      var curRootClass = '' // var indicating current document root class ("can-touch" or "")

      function addtouchclass (e) {
        clearTimeout(isTouchTimer)
        isTouch = true

        if (curRootClass !== 'can-touch') { // add "can-touch' class if it's not already present
          curRootClass = 'can-touch'
          document.documentElement.classList.add(curRootClass)
        }
        isTouchTimer = setTimeout(function () { isTouch = false }, 500) // maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event
      }

      function removetouchclass (e) {
        if (!isTouch && curRootClass === 'can-touch') { // remove 'can-touch' class if not triggered by a touch event and class is present
          isTouch = false
          curRootClass = ''
          document.documentElement.classList.remove('can-touch')
        }
      }

      document.addEventListener('touchstart', addtouchclass, false) // this event only gets called when input type is touch
      document.addEventListener('mouseover', removetouchclass, false) // this event gets called when input type is everything from touch to mouse/ trackpad
    }
  }
</script>
