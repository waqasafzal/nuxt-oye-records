<template>
  <div v-if="this.$store.getters.isAuthenticated" class="account">
    <div class="d-flex flex-row justify-content-between">
      <h1>Account - {{ currentItem }}</h1>
      <button @click="onAddCharts" v-if="currentItem === 'Charts'" class="btn add-charts-btn primary">Add New Charts</button>
    </div>
    <div class="row no-gutters justify-content-between">
      <div class="col-2">
        <div class="account__nav">
          <div @click="selectItem(item)" v-for="(item, view, index) in menuItems" :class="['account__menu-item', currentItem === item ? 'selected': '']">{{item}}</div>
          <div @click="onLogout" class="account__menu-item">Logout</div>
        </div>
      </div>
      <div class="col-9 account__category">
        <keep-alive>
          <component :is="currentAccountView" :editChartsMode="editChartsMode" @charts-saved="onChartsSaved"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import ChartsEditor from '~/components/charts/ChartsEditor'
  import client from '~/plugins/apollo'
  import { getCurrentMonth } from '~/utils/date'
  import * as types from '~/store/types'
  import gql from 'graphql-tag'
  import MyAddresses from '~/components/account/MyAddresses'
  import MyOrders from '~/components/account/MyOrders'
  import MyCharts from '~/components/account/MyCharts'
  import MyArtists from '~/components/account/MyArtists'
  import { logout } from '../../utils/auth/index'

  let component = {}
  if (process.browser) {
    component = require('vue2-dropzone')
  }
  component.name = 'dropzone'
  component.render = function (createElement) {
    const that = this._self
    return createElement('form', {
      attrs: {
        class: 'dropzone',
        id: that.id || '',
        action: that.url || '' || __API__ + '/oye/image/'
      }
    }, this.$slots.default)
  }
  Vue.component('dropzone', component)

  export default {
    components: {ChartsEditor, MyAddresses, MyCharts, MyOrders, MyArtists},
    name: 'AccountDetails',
    middleware: 'authenticated',
    data: function () {
      var menuItems = [
        'Addresses',
        'My Orders',
        'Charts',
        'My Artists'
      ]
      return {
        menuItems: menuItems,
        editChartsMode: false
      }
    },
    watch: {
      $route (options) {
        this.processRoute(options)
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      },
      currentItem () {
        return this.$store.state.accountView
      },
      currentAccountView () {
        var item = this.currentItem
        if (item === 'Addresses') {
          return MyAddresses
        } else if (item === 'My Orders') {
          return MyOrders
        } else if (item === 'My Artists') {
          return MyArtists
        } else {
          return MyCharts
        }
      }
    },
    mounted () {
      this.processRoute(this.$route)

      var vm = this
      client.query({
        query: gql`query Account($month: Int!) {
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
      }).then(({data}) => {
        let account = data.account
        if (account) {
          vm.$store.commit(types.SET_USER_ARTISTS, {
            artists: account.artists
          })
        }
      })
    },
    methods: {
      selectItem (item) {
        this.$store.commit(types.SET_CURRENT_ACCOUNT_VIEW, item)
        this.currentItem = item
      },
      onLogout () {
        logout(this, '/')
      },
      onAddCharts () {
        this.editChartsMode = true
      },
      onChartsSaved () {
        this.editChartsMode = false
      },
      processRoute (route) {
        let params = route.params
        let item = params.page
        if (item) {
          this.$store.commit(types.SET_CURRENT_ACCOUNT_VIEW, item)
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
