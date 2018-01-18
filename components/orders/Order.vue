<template>
  <div class="order">
    <div class="d-flex justify-content-between">
      <h3>
        Order #{{order.pk}} ({{order.date}})
      </h3>
      <template v-if="!order.downloadDisabled">
        <div @click="onDownload" v-if="order.isPaid || !order.isSelfCollector" class="download">Download invoice</div>
        <div class="download disabled">Download disabled</div>
      </template>
    </div>
    <template v-if="loading">
      <loading-spinner :loading="loading"></loading-spinner>
    </template>
    <template v-else-if="items">
      <div class="cart__lines">
        <div class="cart__line" v-for="cartLine in items">
          <nuxt-link :to="{name: 'releases-slug', params: {'slug': cartLine.release.slug}}">

            <div class="row">
              <div class="col-2">
                <img class="" :src="cartLine.release.smallImageUrl"/>
              </div>
              <div class="col-4">
                <div class="cart__line__product__info">
                  <div class="release__name">{{ cartLine.release.artistFirstName}} {{ cartLine.release.artistLastName }}</div>
                  <div class="release__title">{{ cartLine.release.title }}</div>
                  <div v-if="order.status === 'Paid'" class="release__shipping">
                    <div :class="['product__info__availability', cartLine.release.availability.status]"></div>
                    <div>
                      <template v-if="cartLine.release.availability.status === 'out'">
                        <span>Shipping as soon as possible</span>
                      </template>
                      <template v-else-if="cartLine.release.availability.status === 'upcoming'">
                        <span>Preorder {{cartLine.release.releasedAt}}</span>
                      </template>
                      <template v-else>Ready for shipping</template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4">{{cartLine.quantity}}x</div>
              <div class="col-2">{{cartLine.release.price.gross}}&euro;</div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import { getAuthHeader } from '../../utils/auth/index'
  import apolloClient from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import LoadingSpinner from '../shared/LoadingSpinner'
  import {release} from '../graphql/releases'

  export default {
    components: {LoadingSpinner},
    name: 'Order',
    props: ['order'],
    data () {
      return {
        items: undefined,
        loading: false
      }
    },
    methods: {
      onDownload () {
        let config = {
          headers: {
            Authorization: getAuthHeader()
          }
        }
        var orderPk = this.order.pk
        this.$http.post(__API__ + `/oye/invoice-sign/`, {orderId: this.order.pk}, config).then(
          data => {
            var token = data.body.token
            window.open(__API__ + `/oye/invoice/${orderPk}.pdf?token=${token}`, '_self')
          }
        )
      }
    },
    mounted () {
      this.loading = true
      let vm = this
      apolloClient.query({
        query: gql`query Order($pk: ID!) {
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
        ${release}`,
        variables: {
          pk: this.order.pk
        }
      }).then(({data}) => {
        vm.loading = false
        let order = data.order
        vm.items = order.items
      })
    }
  }
</script>
