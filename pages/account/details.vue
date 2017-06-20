<template>
  <div class="row">
    <div class="col-12">
      <div class="page__header">Account</div>
      {{ user.name }}
      <div class="account__artists__section" v-if="user.artists && user.artists.length > 0">
        <h3>Your Artists</h3>
        <div class="account__artists row">
          <div class="account__artist col-md-6" v-for="artist in user.artists">
            <nuxt-link :to="{name: 'account-artists-slug', params: {slug: artist.slug}}">
              <img :src="artist.thumbnailUrl"/>
              <div>{{ artist.name }}</div>
              <div>{{ artist.homeLabel }}</div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div v-if="user.isStaff" class="account__staff_section">
        <h3>Your Staff Settings</h3>
        <charts-editor v-if="user.canPublishCharts"></charts-editor>
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
    components: {ChartsEditor},
    name: 'AccountDetails',
    middleware: 'authenticated',
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    mounted () {
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
