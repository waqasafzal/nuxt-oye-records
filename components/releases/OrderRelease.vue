<template>
  <div class="order-release">
    <nuxt-link :to="{name: 'release-slug', props: {slug: release.slug}}" class="release__item">
      <img :src="release.smallImageUrl"/>
    </nuxt-link>
    <nuxt-link :to="{name: 'release-slug', props: {slug: release.slug}}" class="release__infos d-flex flex-column">
      <div class="release__name">{{ release.artistFirstName }} {{ release.artistLastName }}</div>
      <div class="release__title">{{ release.title }}</div>
      <div class="release__label">{{ release.label }} </div>
      <div class="release__price">{{getPrice(release.price.gross)}} &euro;</div>
    </nuxt-link>
    <div class="order-controls d-flex flex-row justify-content-between">
      <add-to-cart-button v-if="canAdd" @added="onAdded" :release="release.node"></add-to-cart-button>
      <div @click="onDelete" v-if="canDelete" class="close-detail vmargin-auto">&times;</div>
    </div>
  </div>
</template>

<script>
  import { roundFixed } from '../../utils/math'

  export default {
    name: 'OrderRelease',
    props: {
      release: Object,
      canDelete: {
        type: Boolean,
        default: true
      },
      canAdd: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      getPrice: function (price) {
        let parsedPrice = parseFloat(price)
        return roundFixed(parsedPrice, 2)
      },
      onAdded () {
        this.$emit('add-release')
      },
      onDelete () {
        this.$emit('delete-release')
      }
    }
  }
</script>
