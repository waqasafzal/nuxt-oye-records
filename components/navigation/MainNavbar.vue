<template>
  <div class="navbar__menu">
    <nav :class="['navigation', isOpenMobile ? 'open': '']">
      <ul :class="['nav', 'navbar-nav', isHomeUrl ? 'no-border' : '']">
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/releases/new">New Releases</nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/genres">Genres</nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/releases/pre">Pre Order</nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/charts">Charts</nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/releases/used">Second Hand</nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  export default {
    name: 'MainNavbar',
    props: ['isOpenMobile'],
    computed: {
      isHomeUrl () {
        return this.$route.path === '/'
      }
    }
  }
</script>
