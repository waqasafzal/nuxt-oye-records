<template>
  <div>
    <h3>In Stock</h3>
    <table 
      v-if="items" 
      class="d-none d-md-block table">
      <thead>
        <tr>
          <th>Release</th>
          <th>
            <div class="float-right">Price</div>
          </th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(release, ri) in items.edges" 
          :key="`my-available-releases-${ri}`">
          <td>
            <nuxt-link 
              :to="{name: 'releases-slug', params: {slug: release.node.slug}}"
              class="release d-flex flex-row">
              <div class="release__item">
                <img :src="release.node.smallImageUrl">
              </div>
              <div class="release__infos d-flex flex-column">
                <div class="release__name">{{ release.node.artistFirstName }} {{ release.node.artistLastName }}</div>
                <div class="release__title">{{ release.node.title }}</div>
                <div class="release__label">{{ release.node.label }} </div>
              </div>
            </nuxt-link>
          </td>
          <td>
            <div class="float-right d-flex justify-content-around">
              <div class="release__price">{{ getPrice(release.node.price.gross) }} &euro;</div>
            </div>
          </td>
          <td style="width: 200px">
            <div class="d-flex flex-row justify-content-between">
              <add-to-cart-button 
                :release="release.node" 
                @added="onAdded(release.node)"/>
              <div 
                class="close-detail vmargin-auto" 
                @click="onDelete(release.node)">&times;</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-sm-flex d-md-none order-release-list">
      <order-release 
        v-for="(release, i) in items.edges" 
        :key="`available-${i}`" 
        :release="release.node"/>
    </div>
    <div class="d-flex flex-column">
      <loading-spinner :loading="isLoading"/>
      <div class="d-flex flex-row">
        <button 
          :class="['btn', 'secondary', 'btn-next', !hasNext ? 'disabled': '']" 
          @click="loadNextPage">
          {{ loadingText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { SimplePagination } from '~/components/graphql/mixins'
import LoadingSpinner from '~/components/shared/LoadingSpinner'
import * as types from '../../store/types'
import { release } from '../graphql/releases'
import { roundFixed } from '../../utils/math'
import AddToCartButton from '../cart/AddToCartButton'
import OrderRelease from '../releases/OrderRelease'

export default {
  name: 'MyAvailableOrdersTable',
  components: {
    OrderRelease,
    AddToCartButton,
    LoadingSpinner
  },
  mixins: [SimplePagination],
  computed: {
    items() {
      return this.$store.getters.getAvailableOrders
    }
  },
  pagination: {
    extract(data) {
      return data.profile.backOrders
    },
    commit(items) {
      this.$store.commit(types.SET_AVAILABLE_ORDERS, items)
    },
    query() {
      return {
        query: gql`
          query BackOrders($first: Int!, $after: String) {
            profile {
              backOrders(first: $first, after: $after, available: true) {
                edges {
                  node {
                    ...Release
                    relatedId
                    smallImageUrl: thumbnailUrl(size: 100)
                  }
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          }
          ${release}
        `,
        variables: {
          first: 25
        }
      }
    }
  },
  methods: {
    getPrice: function(price) {
      let parsedPrice = parseFloat(price)
      return roundFixed(parsedPrice, 2)
    },
    onDelete: function(release) {
      this.$store
        .dispatch('removeReservation', {
          pk: release.relatedId
        })
        .then(data => {
          if (data.ok) {
            this.removeReleaseItem(release)
          }
        })
    },
    onAdded: function(release) {
      this.removeReleaseItem(release)
    },
    removeReleaseItem(release) {
      var relatedId = release.relatedId
      var filteredItems = this.items.edges.filter(function(item) {
        return item.node.relatedId !== relatedId
      })
      this.commit({
        edges: filteredItems,
        pageInfo: this.items.pageInfo
      })
    }
  }
}
</script>
