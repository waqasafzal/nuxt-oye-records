<template>
  <div class="footer container-fluid">
    <div class="logo-copyright">
      &copy; 2017
    </div>
    <div class="terms">
      <nuxt-link :to="{name: 'info-imprint'}">Imprint</nuxt-link>|
      <nuxt-link :to="{name: 'info-terms-and-conditions'}">Terms</nuxt-link>|
      <nuxt-link :to="{name: 'info-privacy'}">Privacy</nuxt-link>
    </div>
    <div class="creators">
      <a href="mailto: buero@nanonansen.de">Design Nano Nansen</a>&nbsp;|
      <a href="mailto: till.kolter@gmail.com">Development Till Kolter</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Footer'
  }
</script>
