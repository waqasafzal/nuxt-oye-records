<template>
  <div id="app" :class="[$store.state.isSmallScreen || $store.state.isMobile ? 'mobile': '']">
    <div class="header">
      <cookie-law transitionName="slideFromTop" theme="oye" position="top" v-if="isMounted"></cookie-law>
      <account-navbar v-if="!($store.state.isSmallScreen || $store.state.isMobile)"></account-navbar>
    </div>
    <div class="force-bigger-screen d-md-none">
      The mobile version is coming soon.<br/>
      Please open the beta shop on a device with a bigger
      screen or bounce to the classic shop <a href="http://oye-records.com" target="_blank">here.</a>
    </div>
    <header class="navbar" role="navigation">
      <brand-navbar v-on:togglemenu="onToggleMobileMenu"
                    v-on:closemenu="closeMobileMenu"></brand-navbar>
    </header>
    <alerts></alerts>
    <div class="background">
      <div class="container-fluid maincontent page">
        <nuxt></nuxt>
      </div>
    </div>
    <div class="bottom">
      <div class="container-fluid">
        <primary-control-panel></primary-control-panel>
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
  import MobileMenu from '../components/navigation/MobileMenu'
  import * as types from '../store/types'
  import PrimaryControlPanel from '../components/shared/PrimaryControlPanel'
  import AudioPlayer from '../components/audio/AudioPlayer'

  export default {
    components: {AudioPlayer, PrimaryControlPanel, MobileMenu, AccountNavbar, Alerts, BrandNavbar},
    name: 'app',
    data: function () {
      return {
        isOpenMobileMenu: false,
        isPortable: false,
        isMounted: false
      }
    },
    methods: {
      mediaChange (mq) {
        console.log('mediaChange')
        if (mq.matches) {
          this.isPortable = false

          console.log('bigger')
          // window width is at least 500px
          this.$store.commit(types.SET_SMALL_SCREEN, false)
        } else {
          console.log('smaller')
          this.isPortable = true
          // window width is less than 500px
          this.$store.commit(types.SET_SMALL_SCREEN, true)
        }
      },
      onToggleMobileMenu () {
        this.$store.commit(types.SET_MOBILE_NAV, !this.isOpenMobileMenu)
      },
      closeMobileMenu () {
        this.$store.commit(types.SET_MOBILE_NAV, false)
      },
      onClosePlaylist () {
        this.noScroll = false
      },
      onOpenPlaylist () {
        this.noScroll = true
      }
    },
    computed: {
      isOpenMobileMenu () {
        return this.$store.state.showMobile
      },
      isMobile () {
        return this.$store.getters.isMobile
      },
      isSmallScreen () {
        return this.$store.state.isSmallScreen
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
          applyAfterware ({response}, next) {
            if (response.status === 401) {
            }
            next()
          }
        }
      ])
    },
    mounted () {
      this.isMounted = true
      document.addEventListener('keydown', function (e) {
        var key = e.keyCode ? e.keyCode : e.which
        let noForm = e.target.tagName.toLowerCase() !== 'input'
        if ([37, 39].includes(key) && noForm) {
          e.preventDefault()
        }
      })

      const mq = window.matchMedia('(min-width: 768px)')
      mq.addListener(this.mediaChange)

      this.$store.commit(types.SET_SMALL_SCREEN, screen.width < 768)

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
