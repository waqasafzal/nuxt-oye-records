<template>
  <div 
    v-if="order" 
    class="order">
    <div class="d-none d-md-flex justify-content-between">
      <h3>
        Order #{{ order.pk }} ({{ order.date }})
      </h3>
      <template v-if="!order.downloadDisabled">
        <div 
          v-if="order.isPaid || !order.isSelfCollector" 
          class="download" 
          @click="onDownload">Download invoice</div>
        <div 
          v-else 
          class="download disabled">Download disabled</div>
      </template>
    </div>
    <template v-if="loading">
      <loading-spinner :loading="loading"/>
    </template>
    <template v-else-if="items">
      <div class="cart__lines">
        <div
          v-for="(cartLine, cli) in items"
          :key="`order-item-${cli}`"
          class="cart__line">
          <nuxt-link :to="{name: 'releases-slug', params: {'slug': cartLine.release.slug}}">

            <div class="d-none d-md-flex row">
              <div class="col-2">
                <img 
                  :src="cartLine.release.smallImageUrl" 
                  class="">
              </div>
              <div class="col-4">
                <div class="cart__line__product__info">
                  <div class="release__name">{{ cartLine.release.artistFirstName }} {{ cartLine.release.artistLastName }}</div>
                  <div class="release__title">{{ cartLine.release.title }}</div>
                  <div 
                    v-if="order.status === 'Paid'" 
                    class="release__shipping">
                    <div :class="['product__info__availability', cartLine.release.availability.status]"/>
                    <div>
                      <template v-if="cartLine.release.availability.status === 'out'">
                        <span>Shipping as soon as possible</span>
                      </template>
                      <template v-else-if="cartLine.release.availability.status === 'upcoming'">
                        <span>Preorder {{ cartLine.release.releasedAt }}</span>
                      </template>
                      <template v-else>Ready for shipping</template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4">{{ cartLine.quantity }}x</div>
              <div class="col-2">{{ cartLine.release.price.gross }}&euro;</div>
            </div>
            <div class="d-sm-flex d-md-none row">
              <div class="col-12">
                <div class="d-flex flex-row">
                  <img 
                    :src="cartLine.release.smallImageUrl" 
                    class="charts__detail__thumb">
                  <div class="d-flex flex-column order__item__detail">
                    <div class="order__item__times">{{ cartLine.quantity }}x</div>
                    <div class="cart__line__product__info">
                      <div class="release__name">{{ cartLine.release.artistFirstName }} {{ cartLine.release.artistLastName }}</div>
                      <div class="release__title">{{ cartLine.release.title }}</div>
                      <div>{{ cartLine.release.price.gross }}&euro;</div>
                      <div 
                        v-if="order.status === 'Paid'" 
                        class="release__shipping">
                        <div :class="['product__info__availability', cartLine.release.availability.status]"/>
                        <div>
                          <template v-if="cartLine.release.availability.status === 'out'">
                            <span>Shipping as soon as possible</span>
                          </template>
                          <template v-else-if="cartLine.release.availability.status === 'upcoming'">
                            <span>Preorder {{ cartLine.release.releasedAt }}</span>
                          </template>
                          <template v-else>Ready for shipping</template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getAuthHeader } from '../../utils/auth/index'
import gql from 'graphql-tag'
import LoadingSpinner from '../shared/LoadingSpinner'
import { release } from '../graphql/releases'

export default {
  name: 'Order',
  components: { LoadingSpinner },
  props: {
    order: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      items: undefined,
      loading: false
    }
  },
  apollo: {
    items: {
      query: gql`
          query Order($pk: ID!) {
            order(pk: $pk) {
              items {
                release {
                  ...Release
                  releasedAt
                  smallImageUrl: thumbnailUrl(size: 100)
                }
                quantity
              }
            }
          }
          ${release}
        `,
      variables () {
        return {
          pk: this.order && this.order.pk
        }
      },
      update(data) {
        return data.order.items
      },
      watchLoading(isLoading, countModifier) {
        this.loading = isLoading
      }
    }
  },
  methods: {
    onDownload() {
      let config = {
        headers: {
          Authorization: getAuthHeader(this.$store)
        }
      }
      var orderPk = this.order.pk
      this.$axios
        .post(
          __API__ + `/oye/invoice-sign/`,
          { orderId: this.order.pk },
          config
        )
        .then(data => {
          var token = data.body.token
          window.open(
            __API__ + `/oye/invoice/${orderPk}.pdf?token=${token}`,
            '_self'
          )
        })
    }
  }
}
</script>
