<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="page__header"><h1>Charts</h1></div>
        <div class="row">
          <div class="col-12 col-md-8">
            <div class="release-list-summary">
              <div class="release-list-summary__header">
                <h3>Bestseller</h3>
              </div>
              <div class="row">
                <chart-item 
                  :chart="monthChart"
                  class="col-sm-12 col-md-6 charts-infobox"
                />
                <chart-item 
                  :chart="weekChart"
                  class="col-sm-12 col-md-6 charts-infobox"
                />
              </div>
              <div class="release-list-summary__header">
                <h3>DJ Charts &mdash; {{ currentMonth.name }}</h3>
                <nuxt-link 
                  :to="{name: 'charts-archive-category', params: {category: 'artist'}}" 
                  class="release-list-summary__header__more">
                  <span>DJ Chart Archive</span>
                  <right-arrow/>
                </nuxt-link>
              </div>
              <template v-if="artistCharts && artistCharts.edges.length > 0">
                <div class="row">
                  <chart-item 
                    v-for="(chart, i) in artistCharts.edges"
                    :chart="chart.node"
                    :key="`artist-chart-${i}`"
                    class="col-sm-12 col-md-6 charts-infobox"/>
                </div>
              </template>
              <template v-else>No DJ Charts for {{ currentMonth.name }}</template>
              <div class="release-list-summary__header">
                <h3>Staff Charts &mdash; {{ currentMonth.name }}</h3>
                <nuxt-link 
                  :to="{name: 'charts-archive-category', params: {category: 'staff'}}" 
                  class="release-list-summary__header__more">
                  <span>Staff Chart Archive</span>
                  <right-arrow/>
                </nuxt-link>
              </div>
              <template v-if="staffCharts && staffCharts.edges.length > 0">
                <div class="row">
                  <chart-item 
                    v-for="(chart, i) in staffCharts.edges" 
                    :chart="chart.node"
                    :key="`staff-chart-${i}`"
                    class="col-sm-12 col-md-6 charts-infobox"/>
                </div>
              </template>
              <template v-else>No Staff Charts for {{ currentMonth.name }}</template>
            </div>
          </div>
          <div class="col-12 col-md-3 ml-md-auto">
            <div class="charts__overview__bestsellers">
              <div class="d-flex d-md-none bg"/>
              <div 
                class="charts__overview__bestsellers__header" 
                @click="onPlayBestsellers">
                <span>Bestseller {{ currentMonth.name }}</span>
                <div class="play">
                  <play-svg fill="#313532"/>
                </div>
              </div>
              <div v-if="bestsellers">
                <nuxt-link
                  v-for="(release, i) in bestsellers.edges"
                  :to="{name:'releases-slug', params: {slug: release.node.slug}}"
                  :key="`release-${i}`"
                  class="release-item">
                  <div class="release-thumb-box">
                    <div class="release-thumb">
                      <img 
                        :alt="getReleaseTitle(release.node)" 
                        :src="release.node.thumbnailUrl">
                      <play-release-button 
                        :size="40" 
                        :release="release.node"
                        class="chart-list-play"/>
                    </div>
                  </div>
                  <div class="release-info">
                    <div class="release-artist">{{ release.node.name }}</div>
                    <div class="release-title">{{ release.node.title }}</div>
                  </div>
                  <div class="release-price-box">
                    <release-price 
                      :price="release.node.price" 
                      class="release-price"/>
                    <add-to-cart-button :release="release.node"/>
                  </div>
                  <div class="mobile-button-bar d-flex d-md-none">
                    <release-button-bar 
                      :release="release.node" 
                      @click.prevent.stop/>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <div 
              v-if="genres" 
              class="d-none d-md-block charts__detail__more-charts">
              <h3>Genre Charts &mdash; {{ currentMonth.name }}</h3>
              <div
                v-for="(genre, i) in genres"
                :key="`genre-${i}`"
                class="chart-related">
                <nuxt-link :to="{name: 'charts-slug', params: {slug:`bestseller-genre-${genre.slug}-${currentMonth.name.toLowerCase()}-${new Date().getFullYear()}`}}">
                  <right-arrow/>
                  <span>{{ genre.name }}</span>
                </nuxt-link>
              </div>
            </div>
          </div>
          <div class="d-flex d-md-none col-12 col-md-3 ml-md-auto">
            <div class="charts__detail__more-charts">
              <h3>Genre Charts &mdash; {{ currentMonth.name }}</h3>
              <div
                v-for="(genre, i) in genres"
                :key="`genre-related-${i}`"
                class="chart-related">
                <nuxt-link :to="{name: 'charts-slug', params: {slug:`bestseller-genre-${genre.slug}-${currentMonth.name.toLowerCase()}-${new Date().getFullYear()}`}}">
                  <right-arrow/>
                  <span>{{ genre.name }}</span>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getCurrentMonth} from '~/utils/date'
  import ReleasePrice from '../../components/releases/ReleasePrice'
  import PlayReleaseButton from '../../components/releases/PlayReleaseButton'
  import ChartItem from '../../components/charts/ChartItem'
  import RightArrow from '../../components/shared/RightArrow'
  import PlaySvg from '../../components/shared/PlaySvg'
  import AddToCartButton from '../../components/cart/AddToCartButton'
  import ReleaseButtonBar from '../../components/releases/ReleaseButtonBar'
  import {createChartsOverviewQuery} from '../../components/graphql/charts'

  const currentMonth = getCurrentMonth()

export default {
  name: 'ChartsIndex',
  components: {
    ReleaseButtonBar,
    AddToCartButton,
    PlaySvg,
    RightArrow,
    ChartItem,
    PlayReleaseButton,
    ReleasePrice
  },
  data: function() {
    return {
      currentMonth: currentMonth
    }
  },
  head() {
    return {
      title: 'OYE Records - Charts',
      meta: [
        {
          hid: 'title',
          property: 'og:title',
          content: 'OYE Records - Charts'
        },
        {
          hid: 'image',
          property: 'og:image',
          content: `${__API__}${this.monthlyBestsellerThumb}`
        },
        {
          hid: 'description',
          name: 'description',
          content:
            'Get inspired by our talented artist friends and staff picks.'
        }
      ]
    }
  },
  computed: {
    monthChart() {
      return {
        slug: `bestseller-${currentMonth.name.toLowerCase()}-${new Date().getFullYear()}`,
        artist: {
          name: `Bestseller - ${currentMonth.name}`
        },
        imageUrl: this.monthlyBestsellerThumb
      }
    },
    weekChart() {
      return {
        slug: `bestseller-week`,
        artist: {
          name: `Bestseller - Last 7 Days`
        },
        imageUrl: this.weeklyBestsellerThumb
      }
    },
    artistCharts () {
      return this.charts && this.charts.artistCharts
    },
    staffCharts () {
      return this.charts && this.charts.staffCharts
    },
    bestsellers () {
      return this.charts && this.charts.bestsellers
    },
    weeklyBestsellerThumb () {
      return this.charts && this.charts.weeklyBestsellerThumb
    },
    monthlyBestsellerThumb () {
      return this.charts && this.charts.monthlyBestsellerThumb
    },
    genres () {
      return this.charts && this.charts.metaGenres
    }
  },
  methods: {
    onPlayBestsellers() {
      for (let nodeId in this.bestsellers.edges) {
        const bestseller = this.bestsellers.edges[nodeId].node
        this.$store.dispatch('playRelease', {
          release: bestseller,
          play: false
        })
      }
    },
    getReleaseTitle(release) {
      return `${release.name} - ${release.title}`
    }
  },
  async asyncData({app}) {
    const client = app.apolloProvider.clients.defaultClient
    const {data} = await client.query ({
      ...createChartsOverviewQuery (currentMonth)
    })
    return {
      charts: data
    }
  }
}
</script>
