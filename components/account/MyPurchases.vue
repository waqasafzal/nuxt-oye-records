<template>
  <div class="my-purchases">
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
      <template v-for="order in items.edges">
        <tr @click="onSelectOrder(order)">
          <td class="order-id">#{{order.node.pk}}</td>
          <td>{{order.node.date}}</td>
          <td>{{order.node.status}}</td>
          <td>{{order.node.total}}&euro;</td>
          <td class="d-flex">
            <div :class="['detail-btn', selectedOrder === order ? 'close-detail': 'view']">
              <div class="text">{{selectedOrder === order ? 'Close' : 'View'}}</div>
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
        <button :class="['btn', 'secondary', 'btn-next', !hasNext ? 'disabled': '']" @click="loadNextPage">{{loadingText}}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag'
  import { order, oyeCart } from '../graphql/cart'
  import Order from '../orders/Order'
  import { release } from '../graphql/releases'
  import LoadingSpinner from '../shared/LoadingSpinner'
  import { SimplePagination } from '~/components/graphql/mixins'
  import * as types from '../../store/types'

  export default {
    components: {LoadingSpinner, Order},
    mixins: [SimplePagination],
    data: function () {
      return {
        selectedOrder: null
      }
    },
    name: 'MyPurchases',
    computed: {
      items () {
        return this.$store.getters.getPurchases
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
      onClose () {
        this.selectedOrder = null
      }
    },
    pagination: {
      extract (data) {
        return data.orders
      },
      commit (items) {
        this.$store.commit(types.SET_PURCHASES, items)
      },
      query () {
        return {
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
            first: 25
          },
          fetchPolicy: 'network-only'
        }
      }
    }
  }
</script>
