<template>
  <div 
    v-if="authenticated" 
    class="container-fluid">
    <div class="account">
      <div class="d-flex flex-row justify-content-between">
        <div class="page__header">
          <h1>Account
          <span v-if="currentItem">&mdash; {{ currentItem }}</span></h1>
        </div>
        <button 
          v-if="currentItem === 'Charts'" 
          class="btn add-charts-btn primary" 
          @click="onAddCharts">Add New Charts</button>
      </div>
      <div class="row no-gutters justify-content-between">
        <div class="d-none d-md-flex col-md-2">
          <div class="account__nav">
            <div
              v-for="(item, index) in menuItems"
              :key="`menu-item-${index}`"
              :class="['account__menu-item', currentItem === item ? 'selected': '']"
              @click="selectItem(item)">{{ item }}</div>
            <div 
              class="account__menu-item" 
              @click="onLogout">Logout</div>
          </div>
        </div>
        <div class="d-none d-md-flex col-md-9 account__category">
          <keep-alive>
            <component 
              :is="currentAccountView" 
              :edit-charts-mode="editChartsMode" 
              @charts-saved="onChartsSaved"/>
          </keep-alive>
        </div>
        <div
          v-for="(item, index) in menuItems"
          v-if="item !== 'Charts'"
          :key="`menu-item-${index}`"
          class="d-sm-flex d-md-none col-12 account__category">
          <div 
            class="account__category__header" 
            @click="toggleItem(item)">
            <span>{{ item }}</span>
            <div class="arrow-box">
              <div :class="['arrow', currentItem !== item ? 'arrow-down' : 'arrow-up']"/>
            </div>
          </div>
          <component 
            :class="[currentItem !== item ? 'd-none': '']" 
            :is="getComponent(item)" 
            :edit-charts-mode="editChartsMode" 
            @charts-saved="onChartsSaved"/>
        </div>
      </div>
    </div>
  </div>
  <div 
    v-else 
    class="container-fluid">
    <logged-out/>
  </div>
</template>

<script>
import Vue from 'vue'
import ChartsEditor from '~/components/charts/ChartsEditor'
import { getCurrentMonth } from '~/utils/date'
import * as types from '~/store/types'
import gql from 'graphql-tag'
import MyAddresses from '~/components/account/MyAddresses'
import MyPurchases from '~/components/account/MyPurchases'
import MyCharts from '~/components/account/MyCharts'
import MyArtists from '~/components/account/MyArtists'
import MyOrders from '~/components/account/MyOrders'
import CustomerData from '~/components/account/CustomerData'
import { logout } from '../../utils/auth/index'
import LoggedOut from '../../components/shared/LoggedOut'

let component = {}
if (process.browser) {
  component = require('vue2-dropzone')
}
component.name = 'dropzone'
component.render = function(createElement) {
  const that = this._self
  return createElement(
    'form',
    {
      attrs: {
        class: 'dropzone',
        id: that.id || '',
        action: that.url || '' || __API__ + '/oye/image/'
      }
    },
    this.$slots.default
  )
}
Vue.component('dropzone', component)

export default {
  name: 'AccountDetails',
  components: {
    LoggedOut,
    ChartsEditor,
    MyAddresses,
    MyCharts,
    MyPurchases,
    MyArtists
  },
  middleware: 'authenticated',
  data: function() {
    return {
      editChartsMode: false,
      currentItem: this.$store.state.accountView,
    }
  },
  computed: {
    deviceWidth() {
      return window && window.innerWidth > 0 ? window.innerWidth : screen.width
    },
    menuItems() {
      var menuItems = [
        'Customer Data',
        'Addresses',
        'Purchases',
        'Back/Pre Orders'
      ]
      if (this.user.canPublishCharts) {
        menuItems.push('Charts')
      }
      if (this.user.artists && this.user.artists.length > 0) {
        menuItems.push('Artists')
      }
      return menuItems
    },
    authenticated() {
      return this.$store.getters.isAuthenticated
    },
    user() {
      return this.$store.state.user
    },
    currentAccountView() {
      var item = this.currentItem
      return this.getComponent(item)
    }
  },
  watch: {
    $route(options) {
      this.processRoute(options)
    }
  },
  mounted() {
    this.processRoute(this.$route)
    if (this.deviceWidth < 920) {
      this.$store.commit(types.SET_CURRENT_ACCOUNT_VIEW, null)
    }

    var vm = this
    this.$apollo
      .query({
        query: gql`
          query Account($month: Int!) {
            account {
              artists {
                name
                slug
                homeLabel
                thumbnailUrl(width: 1200, height: 300)
                charts(month: $month) {
                  edges {
                    node {
                      releases {
                        release {
                          artistFirstName
                          artistLastName
                          title
                          label
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          month: getCurrentMonth().value
        },
        fetchPolicy: 'network-only'
      })
      .then(({ data }) => {
        let account = data.account
        if (account) {
          vm.$store.commit(types.SET_USER_ARTISTS, {
            artists: account.artists
          })
        }
      })
  },
  methods: {
    selectItem(item) {
      this.$store.commit(types.SET_CURRENT_ACCOUNT_VIEW, item)
      this.currentItem = item
    },
    toggleItem(item) {
      if (this.currentItem === item) {
        this.$store.commit(types.SET_CURRENT_ACCOUNT_VIEW, null)
        this.currentItem = null
      } else {
        this.selectItem(item)
      }
    },
    onLogout() {
      let route = this.$router.resolve({ name: 'account-login' }).href
      logout(this, route)
    },
    onAddCharts() {
      this.editChartsMode = true
    },
    onChartsSaved() {
      this.editChartsMode = false
    },
    processRoute(route) {
      let params = route.params
      let item = params.page
      if (item) {
        this.$store.commit(types.SET_CURRENT_ACCOUNT_VIEW, item)
      }
    },
    getComponent(item) {
      if (item === 'Addresses') {
        return MyAddresses
      } else if (item === 'Purchases') {
        return MyPurchases
      } else if (item === 'Artists') {
        return MyArtists
      } else if (item === 'Back/Pre Orders') {
        return MyOrders
      } else if (item === 'Customer Data') {
        return CustomerData
      } else if (item === 'Charts') {
        return MyCharts
      }
    }
  }
}
</script>

<style lang="scss">
.save-charts-button {
  height: 32px;
  width: 200px;
  &:hover:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.1;
  }
}
</style>
