<template>
  <transition name="from-right">
    <div 
      ref="mobile-menu" 
      class="mobile-menu" 
      @touchmove.stop>
      <nav 
        :class="['navigation']" 
        @click="onClose">
        <ul :class="['nav', 'navbar-nav']">
          <li class="nav-item">
            <nuxt-link 
              :to="{name: 'releases-new'}" 
              class="nav-link"><span>New Releases</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link 
              :to="{name: 'genres'}" 
              class="nav-link"><span>Genres</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link 
              :to="{name: 'releases-upcoming'}" 
              class="nav-link"><span>Upcoming</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link 
              :to="{name: 'charts'}" 
              class="nav-link"><span>Charts</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link 
              :to="{name: 'releases-used'}" 
              class="nav-link"><span>Second Hand</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link 
              :to="{name: 'gear'}" 
              class="nav-link"><span>DJ-Gear</span></nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link 
              :to="{name: 'account-details'}" 
              class="nav-link"><span>Account</span></nuxt-link>
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
  name: 'MobileMenu',
  components: { MainNavbar },
  mounted() {
    let app = document.getElementById('app')
    app.classList.toggle('noscroll', true)
  },
  beforeDestroy() {
    let app = document.getElementById('app')
    app.classList.toggle('noscroll', false)
  },
  methods: {
    onClose() {
      this.$store.commit(types.SET_MOBILE_NAV, false)
    }
  }
}
</script>

<style>
.from-right-enter-active {
  transition: all ease-in-out 0.3s;
}

.from-right-leave-active {
  width: 0;
  transition: all ease-in-out 0.3s;
}

.from-right-enter {
  width: 0;
}
</style>
