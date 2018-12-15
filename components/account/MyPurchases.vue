<template>
  <div class="my-purchases">
    <table class="d-none d-md-block table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Date</th>
          <th>Status</th>
          <th>Total</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <template v-for="(order, oi) in items.edges">
          <tr 
            :key="`my-purchase-order-${oi}`" 
            @click="onSelectOrder(order)">
            <td class="order-id">#{{ order.node.pk }}</td>
            <td>{{ order.node.date }}</td>
            <td>{{ order.node.status }}</td>
            <td>{{ order.node.total }}&euro;</td>
            <td>
              <div :class="['detail-btn', selectedOrder === order ? 'close-detail': 'view']">
                <div class="text">{{ selectedOrder === order ? 'Close' : 'View' }}</div>
              </div>
            </td>
          </tr>
          <tr
            v-if="selectedOrder === order"
            :key="`order-${oi}`"
            class="order__detail">
            <td 
              class="" 
              colspan="5">
              <div class="hint-arrow"/>
              <order :order="order.node"/>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="d-flex d-md-none mobile-purchases">
      <div
        v-for="(order, poid) in items.edges"
        :key="`purchased-${poid}`"
        class="order-item"
        @click="onSelectOrder(order)">
        <div class="d-flex justify-content-between">
          <div>#{{ order.node.pk }}</div>
          <div class="order-info">
            <div>{{ order.node.date }}</div>
            <div>{{ order.node.status }}</div>
            <div>{{ order.node.total }}&euro;</div>
          </div>
        </div>
        <div :class="selectedOrder !== order ? 'd-none': ''">
          <order :order="order.node"/>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column">
      <loading-spinner :loading="isLoading"/>
      <div class="d-flex flex-row">
        <button 
          :class="['btn', 'secondary', 'btn-next', !hasNext ? 'disabled': '']" 
          @click="loadNextPage">{{ loadingText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { order } from '../graphql/cart'
import Order from '../orders/Order'
import LoadingSpinner from '../shared/LoadingSpinner'
import { SimplePagination } from '~/components/graphql/mixins'
import * as types from '../../store/types'

export default {
  name: 'MyPurchases',
  components: { LoadingSpinner, Order },
  mixins: [SimplePagination],
  data: function() {
    return {
      selectedOrder: null
    }
  },
  computed: {
    items() {
      return this.$store.getters.getPurchases
    }
  },
  methods: {
    onSelectOrder(order) {
      if (this.selectedOrder === order) {
        this.selectedOrder = null
      } else {
        this.selectedOrder = order
      }
    },
    authenticated() {
      return this.$store.getters.isAuthenticated
    },
    onClose() {
      this.selectedOrder = null
    }
  },
  pagination: {
    extract(data) {
      return data.orders
    },
    commit(items) {
      this.$store.commit(types.SET_PURCHASES, items)
    },
    query() {
      return {
        query: gql`
          query Orders($first: Int!, $after: String) {
            orders(first: $first, after: $after) {
              edges {
                cursor
                node {
                  ...Order
                }
              }
              pageInfo {
                hasNextPage
              }
            }
          }
          ${order}
        `,
        variables: {
          first: 25,
          after: this.cursor
        },
        fetchPolicy: 'network-only'
      }
    }
  }
}
</script>
