<template>
  <div 
    id="app" 
    @touchstart="startTouch" 
    @touchend="endTouch">
    <div class="header">
      <cookie-law 
        v-if="isMounted" 
        transition-name="slideFromTop" 
        theme="oye" 
        position="top"/>
      <account-navbar/>
    </div>
    <header 
      class="navbar" 
      role="navigation" 
      @click="onHeaderClick">
      <brand-navbar/>
    </header>
    <alerts/>
    <div class="background">
      <div class="maincontent page">
        <nuxt/>
      </div>
    </div>
    <mobile-menu v-if="showMobile"/>
    <div class="bottom">
      <div class="container-fluid">
        <primary-control-panel/>
      </div>
      <audio-player/>
    </div>
    <oye-footer/>
  </div>
</template>

<script>
import BrandNavbar from '../components/navigation/BrandNavbar'
import Alerts from '../components/shared/Alerts'
import AccountNavbar from '../components/navigation/AccountNavbar'
import { getAuthHeader } from '../utils/auth/index'
// import client from '../plugins/apollo'
import Vue from 'vue'
import MobileMenu from '../components/navigation/MobileMenu'
import PrimaryControlPanel from '../components/shared/PrimaryControlPanel'
import AudioPlayer from '../components/audio/AudioPlayer'
import Announcements from '../components/messages/Announcements'
import OyeFooter from '../components/navigation/Footer'
import { mapGetters } from 'vuex'
import * as types from '../store/types'

var ogImage = require('~/assets/images/fb-og-image.jpg')

export default {
  name: 'App',
  // middleware: 'auth',
  components: {
    OyeFooter,
    Announcements,
    AudioPlayer,
    PrimaryControlPanel,
    MobileMenu,
    AccountNavbar,
    Alerts,
    BrandNavbar
  },
  data: function() {
    return {
      isPortable: false,
      isMounted: false
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'image',
          property: 'og:image',
          content: `${__API__}${ogImage}`
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['showMobile'])
  },
  mounted() {
    this.isMounted = true
    document.addEventListener('keydown', function(e) {
      var key = e.keyCode ? e.keyCode : e.which
      let noForm = e.target.tagName.toLowerCase() !== 'input'
      if ([37, 39].includes(key) && noForm) {
        e.preventDefault()
      }
    })

    const mq = window.matchMedia('(min-width: 768px)')
    mq.addListener(this.mediaChange)

    //      this.$store.commit(types.SET_SMALL_SCREEN, screen.width < 768)

    var isTouch = false // var to indicate current input type (is touch versus no touch)
    var isTouchTimer
    var curRootClass = '' // var indicating current document root class ("can-touch" or "")

    function addtouchclass(e) {
      clearTimeout(isTouchTimer)
      isTouch = true

      if (curRootClass !== 'can-touch') {
        // add "can-touch' class if it's not already present
        curRootClass = 'can-touch'
        document.documentElement.classList.add(curRootClass)
      }
      isTouchTimer = setTimeout(function() {
        isTouch = false
      }, 500) // maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event
    }

    function removetouchclass(e) {
      if (!isTouch && curRootClass === 'can-touch') {
        // remove 'can-touch' class if not triggered by a touch event and class is present
        isTouch = false
        curRootClass = ''
        document.documentElement.classList.remove('can-touch')
      }
    }

    document.addEventListener('touchstart', addtouchclass, false) // this event only gets called when input type is touch
    document.addEventListener('mouseover', removetouchclass, false) // this event gets called when input type is everything from touch to mouse/ trackpad
  },
  methods: {
    beforeCreate() {
      this.$apollo.networkInterface.use([
        {
          applyMiddleware(req, next) {
            if (!req.options.headers) {
              req.options.headers = {} // Create the header object if needed.
            }
            if (process.client) {
              var jwt = Vue.cookie.get('jwt')
              var header = null
              if (jwt) {
                header = getAuthHeader(this.$store)
              }
              console.log('header is ', header)
              if (header) {
                req.options.headers['Authorization'] = header
              }
              var cart = Vue.cookie.get('cart')
              if (cart) {
                req.options.headers['X-CART-TOKEN'] = cart
              }
            }
            next()
          }
        }
      ])
      this.$apollo.networkInterface.useAfter([
        {
          applyAfterware({ response }, next) {
            if (response.status === 401) {
              // TODO error
            }
            next()
          }
        }
      ])
    },
    onClosePlaylist() {
      this.noScroll = false
    },
    onOpenPlaylist() {
      this.noScroll = true
    },
    onHeaderClick() {
      if (this.showMobile) {
        this.$store.commit(types.SET_MOBILE_NAV, false)
      }
    },
    startTouch() {},
    endTouch() {}
  }
}
</script>

<style>
  .navbar {
  z-index: 50 !important;
  top: 40px;
  position: fixed !important;
  background-color: #fff;
  width: 100vw;
  border-bottom: 1px solid #ebe9e6;
  padding: 0 !important;
}
  /*body {*/
    /*font-family: 'Roboto Condensed', sans-serif;*/
  /*}*/
</style>
