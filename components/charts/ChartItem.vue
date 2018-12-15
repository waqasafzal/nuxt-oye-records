<template>
  <nuxt-link
    v-if="chart"
    :to="{name: 'charts-slug', params: {slug: chart.slug}}" 
    class="chart-item">
    <div class="chart-banner">
      <img :src="chart.imageUrl">
    </div>
    <template v-if="chart.artist">
      <div class="charts-infobox__name">{{ chart.artist.name }}</div>
      <template v-if="chart.name">{{ chart.name }} Charts</template>
      <div class="charts-infobox__label">{{ chart.artist.homeLabel }}</div>
    </template>
    <template v-else>
      <div class="charts-infobox__name">{{ chart.user.firstName }}</div>
      <template v-if="chart.name">{{ chart.name }} Charts</template>
      <div class="charts-infobox__label">OYE Staff</div>
    </template>
  </nuxt-link>
</template>

<script>
export default {
  name: 'ChartItem',
  props: {
    chart: {
      type: Object,
      default: null
    }
  }
}
</script>
