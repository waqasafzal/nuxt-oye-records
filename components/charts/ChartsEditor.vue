<template>
  <div>
    <div @click="proceedChartsForm" class="button">
      <template v-if="editChartsMode">
        Save {{ currentMonth }} charts
      </template>
      <template v-else>
        <template v-if="typeof currentCharts.pk !== 'undefined'">Edit {{ currentMonth }} charts</template>
        <template v-else>Create {{ currentMonth }} charts</template>
      </template>
    </div>
    <div v-show="editChartsMode" class="account__add-charts">
      <template v-if="!artist">
        <template v-if="!currentChartsImageUrl">
          <dropzone v-if="!currentChartsImageUrl" :maxNumberOfFiles=1
                    id="myVueDropzone"
                    width="75%"
                    height="208px"
                    url="/oye/image/" v-on:vdropzone-success="substituteImageUrl"
                    :headers="headers"
          >
            <input type="hidden" name="payload" :value="imageUploadPayload">
          </dropzone>
        </template>
        <template v-else>
          <img :src="currentCharts.imageUrl" width="100%"/>
        </template>
      </template>
      <div class="row">
        <div class="charts__form col-8">
          <form>
            <input type="text" placeholder="Charts name (optional)" v-model="chartsName">
            <div v-for="(chartItem, n) in currentCharts.releases" class="charts__item-box">
              <div class="charts__rank">#{{n + 1}}</div>
              <template v-if="!chartItem.release.result || currentChartItem === n">
                <input @blur="onBlur" @focus="onChartItemFocus(n)" :id="'release' + n"
                       @keyup="search(chartItem.release)" class="charts__input__release"
                       v-model="chartItem.release.value"
                       placeholder="Search release..."
                >
              </template>
              <template v-else>
                <div @click="onChartItemFocus(n)" class="charts__display">
                  <img :src="chartItem.release.result.smallThumbnailUrl"/>
                  <div class="charts__display__info">
                    <template v-if="chartItem.release.result.artistFirstName">
                      {{ chartItem.release.result.artistFirstName }} -
                    </template>
                    {{ chartItem.release.result.artistLastName }} -
                        {{ chartItem.release.result.title }}
                  </div>
                </div>
              </template>
            </div>
          </form>
        </div>
        <div class="charts__search-results col-4">
          <template v-if="isVisibleSearch">
            <div class="search__results__header">Search results</div>
            <div class="search__results__body">
              <div @click="setResult(item)" class="search__results__row" v-for="item in currentResults"
                   @mouseover="disableBlur" @mouseleave="enableBlur">
                <div class="search__results__item">
                  <div class="search__release__image">
                    <img :src="item.release.smallThumbnailUrl"/>
                  </div>
                  <div class="search__release__infos">
                    <div class="search__release__name">
                      <template v-if="item.release.artistFirstName">{{item.release.artistFirstName}} </template>
                      {{item.release.artistLastName}}
                    </div>
                    <div class="search__release__title">{{item.release.title}}</div>
                  </div>
                </div>
              </div>
              <loading-spinner :loading="searchLoading"></loading-spinner>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import { getCurrentMonth } from '~/utils/date'
  import { getAuthHeader } from '~/utils/auth/index'
  import { callReleaseSearchQuery } from '../search/queries'
  import client from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import Vue from 'vue'
  import LoadingSpinner from '../shared/LoadingSpinner'

  let component = {}
  if (process.browser) {
    component = require('vue2-dropzone')
  }
  component.name = 'dropzone'
  component.render = function (createElement) {
    const that = this._self
    return createElement('form', {
      attrs: {
        class: 'dropzone',
        id: that.id || '',
        action: that.url || '' || __API__ + '/oye/image/'
      }
    }, this.$slots.default)
  }
  Vue.component('dropzone', component)

  const createReleasesList = function () {
    var releases = []
    for (var i = 0; i < 10; i++) {
      releases.push({
        release: {
          value: ''
        }
      })
    }
    return releases
  }

  export default {
    components: {LoadingSpinner},
    name: 'ChartsEditor',
    props: {
      artist: Object
    },
    data: function () {
      return {
        editChartsMode: false,
        currentCharts: {
          releases: createReleasesList()
        },
        currentChartsImageUrl: '',
        currentChartItem: -1,
        lastChartItem: -1,
        currentResults: [],
        searchLoading: false,
        currentMonth: getCurrentMonth().name,
        isVisibleSearch: false,
        blurEnabled: true,
        uploadUrl: __API__ + '/oye/image/',
        imageUploadPayload: JSON.stringify({
          target: {
            type: 'charts'
          }
        }),
        chartsName: ''
      }
    },
    computed: {
      hasCurrentCharts () {
        return typeof this.currentCharts.pk !== 'undefined'
      },
      payload () {
        return {
          target: {
            type: 'charts',
            id: this.currentCharts.pk
          }
        }
      },
      headers () {
        if (process.browser) {
          var jwt = this.$cookie.get('jwt')
          if (jwt) {
            var header = getAuthHeader()
            return {
              Authorization: header
            }
          }
        }
      }
    },
    watch: {
      artist (value) {
        this.queryCharts()
      }
    },
    methods: {
      proceedChartsForm () {
        if (!this.editChartsMode) {
          this.editChartsMode = true
        } else {
          this.onSaveCharts()
        }
      },
      search: _.debounce(
        function (release) {
          this.currentResults = []
          this.searchLoading = true
          let fieldsList = ['artist_name', 'title', 'label']
          var fields = JSON.stringify(fieldsList)
          callReleaseSearchQuery(release.value, 25, 1, fields, ({data}) => {
            this.currentResults = data.search.results
            this.searchLoading = false
          })
        },
        500
      ),
      onBlur () {
        if (this.blurEnabled) {
          this.onChartItemFocus(-1)
        }
      },
      onChartItemFocus (n) {
        this.isVisibleSearch = n !== -1
        this.currentChartItem = n
      },
      valueOf (item) {
        return (item.artistFirstName ? item.artistFirstName + ' ' : '') + item.artistLastName + ' ' + item.title
      },
      setResult (item) {
        let chartItemIndex = this.currentChartItem !== -1 ? this.currentChartItem : this.lastChartItem
        var release = this.currentCharts.releases[chartItemIndex].release
        let releaseResultItem = item.release
        release.result = releaseResultItem
        release.value = this.valueOf(releaseResultItem)
        this.lastChartItem = this.currentChartItem
        this.currentChartItem = -1
      },
      onSaveCharts () {
        this.$store.dispatch('saveChart', {
          charts: JSON.stringify({
            ...this.currentCharts,
            name: this.chartsName
          }),
          artistId: this.artist && this.artist.pk
        }).then(() => {
          this.$emit('charts-saved')
        })
      },
      enableBlur () {
        this.blurEnabled = true
      },
      disableBlur () {
        this.blurEnabled = false
      },
      substituteImageUrl: function (file, response) {
        this.currentCharts.imageUrl = response.url
        this.currentChartsImageUrl = response.url
        this.currentCharts.pk = response.charts_id
      },
      queryCharts () {
        var vm = this
        client.query({
          query: gql`query Chart($artistId: Int) {
            chart(artistId: $artistId) {
               pk
               imageUrl
               artist {
                 pk
                 slug
                 name
               }
               updatedAt
               releases {
                 rank
                 release {
                   pk
                   smallThumbnailUrl: thumbnailUrl(size: 120)
                   artistFirstName
                   artistLastName
                   title
                   label
                 }
               }
            }
        }`,
          variables: {
            artistId: this.artist && this.artist.pk
          }
        }).then(({data}) => {
          var chart = data.chart
          if (chart) {
            for (var i = 0; i < chart['releases'].length; i++) {
              if (chart['releases'][i]) {}
              var item = chart['releases'][i]['release']
              vm.currentCharts['releases'][i]['release'] = {
                result: item,
                value: vm.valueOf(item)
              }
            }
            vm.currentCharts.pk = chart.pk
            vm.currentCharts.imageUrl = chart.imageUrl
            vm.currentChartsImageUrl = chart.imageUrl
            // For some reason the input field is not reactively rendered otherwise
            vm.imageUploadPayload = JSON.stringify({
              target: {
                type: 'charts',
                id: chart.pk
              }
            })
          } else {
            vm.currentCharts = {
              releases: createReleasesList()
            }
          }
        })
      }
    },
    mounted () {
      this.queryCharts()
    }
  }
</script>

<style>
  .my-charts {
    width: 100%;
  }
</style>
