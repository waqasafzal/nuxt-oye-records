<template>
  <div class="order">
    <div class="d-flex justify-content-between">
      <h3>
        Order #{{order.pk}} ({{order.date}})
      </h3>
      <div class="download">Download invoice</div>
    </div>
    <div class="cart__lines">
      <div class="cart__line" v-for="quantified in order.releases">
        <nuxt-link :to="{name: 'releases-slug', params: {'slug': quantified.release.slug}}">

          <div class="row">
            <div class="col-2">
              <img class="" :src="quantified.release.smallImageUrl" />
            </div>
            <div class="col-4">
              <div class="cart__line__product__info">
                <div class="release__name">{{ quantified.release.artistFirstName }} {{ quantified.release.artistLastName }}</div>
                <div class="release__title">{{ quantified.release.title }}</div>
                <div v-if="order.status === 'Paid'" class="release__shipping">
                  <div :class="['product__info__availability', quantified.release.availability.status]"></div>
                  <div>
                    <template v-if="quantified.release.availability.status === 'out'">
                      <span>Shipping as soon as possible</span>
                    </template>
                    <template v-else-if="quantified.release.availability.status === 'upcoming'">
                      <span>Preorder {{quantified.release.releasedAt}}</span>
                    </template>
                    <template v-else>Ready for shipping</template>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-4">
              {{quantified.quantity}}x
            </div>
            <div class="col-2">
              {{quantified.release.price.gross}}&euro;
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Order',
    props: ['order']
  }
</script>
