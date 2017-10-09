<template>
  <div class="info">
    <div class="d-flex flex-row justify-content-between">
      <h1>Info - {{ menuItems[currentAccountView] }}</h1>
    </div>
    <div class="row no-gutters justify-content-start">
      <div class="col-3">
        <div class="info__nav">
          <nuxt-link :key="`info-${i}`" v-for="(item, i) in Object.keys(menuItems)" :to="{name: `info-${item}`}">{{menuItems[item]}}</nuxt-link>
        </div>
      </div>
      <div class="col-7 account__category info-panel">
        <nuxt-child :key="currentAccountView"/>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'CustomerInfo',
    middleware: ['default-redirect'],
    data: function () {
      return {
        menuItems: {
          'questions': 'Questions',
          'toc': 'Terms & Conditions',
          'shipping': 'Shipping & Delivery',
          'payment': 'Payment Methods',
          'privacy': 'Privacy policy',
          'imprint': 'Imprint'
        },
        currentItem: 'Questions'
      }
    },
    computed: {
      currentAccountView () {
        return this.$route.name.replace('info-', '')
      }
    },
    methods: {
      selectItem (item) {
        this.currentItem = item
      }
    }
//    created () {
//      if (this.$route.name === 'info') {
//        return this.$router.push({name: 'info-questions'})
//      }
//    }
  }
</script>
