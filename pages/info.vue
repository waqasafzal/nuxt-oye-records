<template>
  <div class="info container-fluid">
    <div class="d-flex flex-row justify-content-between">
      <div class="page__header">
        <h1>Info &mdash; {{ menuItems[currentAccountView] }}</h1>
      </div>
    </div>
    <div class="row no-gutters justify-content-start">
      <div class="col-12 col-md-3">
        <div class="info__nav">
          <nuxt-link
            v-for="(item, i) in Object.keys(menuItems)"
            :key="`info-${i}`"
            :to="{name: `info-${item}`}">{{ menuItems[item] }}
          </nuxt-link>
        </div>
      </div>
      <div class="col-12 col-md-7 account__category info-panel">
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
          questions: 'Questions',
          'terms-and-conditions': 'Terms & Conditions',
          shipping: 'Shipping & Delivery',
          payment: 'Payment Methods',
          privacy: 'Privacy policy',
          imprint: 'Imprint'
        },
        currentItem: 'Questions'
      }
    },
    computed: {
      currentAccountView() {
        return this.$route.name.replace ('info-', '')
      }
    },
    methods: {
      selectItem(item) {
        this.currentItem = item
      }
    }
  }
</script>

<style lang="scss">
  .info {
    @include media-breakpoint-down(sm) {
      h1 {
        margin-bottom: 0;
      }
      margin-bottom: 4rem;
    }
    h1 {
      margin-bottom: 2rem;
    }
    &-panel {
      padding-top: 32px;
      h1, h2, h3, h4, h5 {
        margin: inherit;
        margin-bottom: 1rem;
      }
      overflow: scroll;
      max-height: 450px;
      @include media-breakpoint-down(sm) {
        overflow: auto;
      }
    }
    a {
      color: $brand-color-green;
      &:hover {
        text-decoration: underline;
      }
    }
  }

</style>
