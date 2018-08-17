<template>
  <nuxt-link class="chart-item" :to="{name: 'charts-slug', params: {slug: chart.slug}}">
    <div class="chart-banner">
      <img :src="chart.imageUrl"/>
    </div>
    <template v-if="chart.artist">
      <div class="charts-infobox__name">{{ chart.artist.name }}</div>
      <template v-if="chart.name">{{ chart.name }}</template>
      <div class="charts-infobox__label">{{ chart.artist.homeLabel }}</div>
    </template>
    <template v-else>
      <div class="charts-infobox__name">{{ chart.user.firstName }}</div>
      <template v-if="chart.name">{{ chart.name }}</template>
      <div class="charts-infobox__label">OYE Staff</div>
    </template>
  </nuxt-link>
</template>

<script>
  export default {
    name: 'ChartItem',
    props: ['chart']
  }
</script>
