<template>
  <div class="my-orders">
    <table class="table">
      <thead>
      <tr>
        <th>Order</th>
        <th>Date</th>
        <th>Status</th>
        <th>Total</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <template v-for="order in orders.edges">
        <tr @click="onSelectOrder(order)">
          <td class="order-id">#{{order.node.pk}}</td>
          <td>{{order.node.date}}</td>
          <td>{{order.node.status}}</td>
          <td>{{order.node.total}}&euro;</td>
          <td class="d-flex">
            <div :class="['detail-btn', selectedOrder === order ? 'close': 'view']">
              <div class="text">
                {{selectedOrder === order ? 'Close': 'View'}}
              </div>
            </div>
          </td>
        </tr>
        <tr class="order__detail" v-if="selectedOrder === order">
          <td class="" colspan="5">
            <div class="hint-arrow"></div>
            <order :order="order.node"></order>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <div class="d-flex flex-column">
      <loading-spinner :loading="isLoading"></loading-spinner>
      <div class="d-flex flex-row">
        <button :class="['btn', 'secondary', 'btn-next', !hasNext ? 'disabled': '']" @click="loadNextPage">
          {{loadingText}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import client from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import { order, oyeCart } from '../graphql/cart'
  import Order from '../orders/Order'
  import { release } from '../graphql/releases'
  import LoadingSpinner from '../shared/LoadingSpinner'
  import * as types from '../../store/types'

  export default {
    components: {LoadingSpinner, Order},
    data: function () {
      return {
        cursor: null,
        selectedOrder: null,
        isLoading: false
      }
    },
    name: 'MyOrders',
    computed: {
      orders () {
        return this.$store.getters.getOrders
      },
      hasNext () {
        return this.orders && this.orders.hasNextPage || true
      },
      loadingText () {
        if (this.isLoading) {
          return 'Loading...'
        } else if (this.hasNext) {
          return 'Show more'
        } else {
          return 'No more orders to load'
        }
      }
    },
    methods: {
      onSelectOrder (order) {
        if (this.selectedOrder === order) {
          this.selectedOrder = null
        } else {
          this.selectedOrder = order
        }
      },
      authenticated () {
        return this.$store.getters.isAuthenticated
      },
      loadNextPage () {
        if (this.orders) {
          let edges = this.orders.edges
          if (edges && edges.length > 0) {
            let lastEdgePos = edges.length - 1
            let lastEdge = edges[lastEdgePos]
            this.cursor = lastEdge.cursor
          }
        }

        var vm = this
        if (this.hasNext) {
          this.isLoading = true
          client.query({
            query: gql`query Orders($first: Int!, $after: String) {
              orders(first: $first, after: $after) {
                edges {
                  cursor
                  node {
                    ...Order
                    cart {
                        ...OyeCart
                    }
                    releases {
                      quantity
                      release {
                        ...Release
                        smallImageUrl: thumbnailUrl(size: 100)
                      }
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                }
              }
            }
            ${release}
            ${oyeCart}
            ${order}`,
            variables: {
              first: 25,
              after: this.cursor
            },
            fetchPolicy: 'network-only'
          }).then(({data}) => {
            this.isLoading = false
            var edges = []
            if (vm.orders['edges']) {
              edges = vm.orders['edges']
            }
            let orders = {
              edges: [...edges, ...data.orders.edges],
              pageInfo: data.orders.pageInfo
            }
            vm.$store.commit(types.SET_ORDERS, orders)
          })
        }
      },
      onClose () {
        this.selectedOrder = null
      }
    },
    mounted () {
      this.loadNextPage()
    }
  }
</script>
