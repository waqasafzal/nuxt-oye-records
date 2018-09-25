<template>
  <transition name="from-right">
    <div @touchmove.stop class="mobile-menu" ref="mobile-menu">
      <nav @click="onClose" :class="['navigation']">
        <ul :class="['nav', 'navbar-nav']">
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'releases-new'}"><span>New Releases</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'genres'}"><span>Genres</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'releases-upcoming'}"><span>Upcoming</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'charts'}"><span>Charts</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'releases-used'}"><span>Second Hand</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'gear'}"><span>DJ-Gear</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{name: 'account-details'}"><span>Account</span></nuxt-link>
          </li>
        </ul>
        <ul class="nav-more">
          <li class="nav-item">
            <nuxt-link :to="{name: 'newsletter'}">Newsletter</nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{name: 'info'}">Customer Information</nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{name: 'info-imprint'}">Imprint</nuxt-link>
          </li>
        </ul>
      </nav>
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
    },
    mounted () {
      let app = document.getElementById('app')
      app.classList.toggle('noscroll', true)
    },
    beforeDestroy () {
      let app = document.getElementById('app')
      app.classList.toggle('noscroll', false)
    }
  }
</script>

<style>
  .from-right-enter-active {
    transition: all ease-in-out .3s;
  }

  .from-right-leave-active {
    width: 0;
    transition: all ease-in-out .3s;
  }

  .from-right-enter {
    width: 0;
  }
</style>
