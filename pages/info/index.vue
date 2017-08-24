<template>
  <div class="info">
    <div class="d-flex flex-row justify-content-between">
      <h1>Info - {{ currentItem }}</h1>
    </div>
    <div class="row no-gutters justify-content-start">
      <div class="col-2">
        <div class="account__nav">
          <div @click="selectItem(item)" v-for="item in Object.keys(menuItems)" :class="['account__menu-item', currentItem === item ? 'selected': '']">{{item}}</div>
        </div>
      </div>
      <div class="col-7 account__category info-panel">
        <keep-alive>
          <component :is="currentAccountView"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
  import Privacy from '~/components/info/Privacy'
  import Payment from '~/components/info/Payment'
  import Shipping from '~/components/info/Shipping'
  import Imprint from '~/components/info/Imprint'
  import Terms from '~/components/info/Terms'

  export default {
    name: 'CustomerInfo',
    data: function () {
      return {
        menuItems: {
          'Terms & Conditions': Terms,
          'Shipping & Delivery': Shipping,
          'Payment Methods': Payment,
          'Privacy policy': Privacy,
          'Imprint': Imprint
        },
        currentItem: 'Shipping & Delivery'
      }
    },
    computed: {
      currentAccountView () {
        return this.menuItems[this.currentItem]
      }
    },
    methods: {
      selectItem (item) {
        this.currentItem = item
      }
    }
  }
</script>
