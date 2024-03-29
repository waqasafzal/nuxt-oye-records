<template>
  <div>
    <h3>Outstanding</h3>
    <table class="table d-none d-md-block" v-if="items">
      <thead>
      <tr>
        <th>Release</th>
        <th>
          <div class="float-right">Price</div>
        </th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="release in items.edges">
        <td>
          <nuxt-link class="release d-flex flex-row":to="{name: 'releases-slug', params: {slug: release.node.slug}}">
            <div class="release__item">
              <img :src="release.node.smallImageUrl"/>
            </div>
            <div class="release__infos d-flex flex-column vmargin-auto">
              <div class="release__name">{{ release.node.artistFirstName }} {{ release.node.artistLastName }}</div>
              <div class="release__title">{{ release.node.title }}</div>
              <div class="release__label">{{ release.node.label }} </div>
            </div>
          </nuxt-link>
        </td>
        <td>
          <div class="float-right d-flex justify-content-around">
            <div class="release__price">{{getPrice(release.node.price.gross)}} &euro;</div>
          </div>
        </td>
        <td style="width: 200px"><div @click="onDelete(release.node)" class="delete float-right">&times;</div></td>
      </tr>
      </tbody>
    </table>
    <div class="d-sm-block d-md-none order-release-list">
      <order-release :canAdd="false" @delete-release="onDelete(release.node)" :key="`missing-${i}`" :release="release.node" v-for="(release, i) in items.edges"></order-release>
    </div>
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
  import gql from 'graphql-tag'
  import { SimplePagination } from '~/components/graphql/mixins'
  import LoadingSpinner from '~/components/shared/LoadingSpinner'
  import * as types from '../../store/types'
  import { release } from '../graphql/releases'
  import { roundFixed } from '../../utils/math'
  import OrderRelease from '../releases/OrderRelease'

  export default {
    name: 'MyMissingOrdersTable',
    mixins: [SimplePagination],
    components: {
      OrderRelease,
      LoadingSpinner
    },
    computed: {
      items () {
        return this.$store.getters.getBackOrders
      }
    },
    pagination: {
      extract (data) {
        return data.profile.backOrders
      },
      commit (items) {
        this.$store.commit(types.SET_BACK_ORDERS, items)
      },
      query () {
        return {
          query: gql`query BackOrders($first: Int!, $after: String) {
            profile {
              backOrders(first: $first, after: $after) {
                edges {
                  cursor
                  node {
                    ...Release
                    relatedId
                    relatedType
                    smallImageUrl: thumbnailUrl(size:100)
                  }
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          },
          ${release}`,
          variables: {
            first: 25,
            after: this.cursor
          }
        }
      }
    },
    methods: {
      getPrice: function (price) {
        let parsedPrice = parseFloat(price)
        return roundFixed(parsedPrice, 2)
      },
      onDelete: function (release) {
        this.$store.dispatch('removeBackOrder', {
          pk: release.relatedId,
          type: release.relatedType
        }).then((data) => {
          if (data.ok) {
            this.removeReleaseItem(release)
          }
        })
      },
      removeReleaseItem (release) {
        var relatedId = release.relatedId
        var filteredItems = this.items.edges.filter(function (item) {
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
