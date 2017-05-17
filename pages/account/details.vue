<template>
  <div class="row">
    <div class="col-12">
      <div class="page__header">Account</div>
      {{ user.name }}
      <div class="account__artists__section" v-if="user.artists && user.artists.length > 0">
        <h3>Your Artists</h3>
        <div class="account__artists row">
          <div class="account__artist col-md-6" v-for="artist in user.artists">
            <nuxt-link :to="{name: 'account-artists-slug', params: {slug: artist.slug}}">
              <img :src="artist.thumbnailUrl" />
              {{ artist.name }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="account__staff_section">
        <h3>Your Staff Settings</h3>
        <div v-if="user.canPublishCharts">
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
            <template v-if="!currentCharts.imageUrl">
              <dropzone v-if="!currentCharts.imageUrl" :maxNumberOfFiles=1
                        id="myVueDropzone"
                        width="75%"
                        height="208px"
                        url="/oye/image/" v-on:vdropzone-success="substituteImageUrl">
                <input type="hidden" name="payload" :value="imageUploadPayload">
              </dropzone>
            </template>
            <template v-else>
              <img :src="currentCharts.imageUrl"/>
            </template>
            <div class="row">
              <div class="charts__form col-8">
                <form>
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
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import * as types from '../../store/types'
  import client from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import { callReleaseSearchQuery } from '../../components/search/queries'
  import LoadingSpinner from '../../components/shared/LoadingSpinner'
  import { addCartAlertMessage } from '../../components/shared/utils'
  import { getCurrentMonth } from '../../utils/date'

  import Vue from 'vue'
  import NuxtLink from '../../.nuxt/components/nuxt-link'

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

  export default {
    components: {NuxtLink, LoadingSpinner},
    name: 'AccountDetails',
    middleware: 'authenticated',
    data: function () {
      var releases = []
      for (var i = 0; i < 10; i++) {
        releases.push({
          release: {
            value: ''
          }
        })
      }
      return {
        editChartsMode: false,
        currentCharts: {
          releases: releases
        },
        currentChartItem: -1,
        lastChartItem: -1,
        currentResults: [],
        searchLoading: false,
        currentMonth: getCurrentMonth().name,
        isVisibleSearch: false,
        blurEnabled: true,
        uploadUrl: __API__ + '/oye/image/',
        imageUploadPayload: null
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      },
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
        console.log(this.currentChartItem)
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
        client.mutate({
          mutation: gql`mutation ($charts: JSONString!) {
            saveCharts(charts: $charts) {
                ok
            }
        }`,
          variables: {
            charts: JSON.stringify(this.currentCharts)
          }
        }).then(({data}) => {
          addCartAlertMessage('Charts were successfully saved.', 'info')
        })
      },
      enableBlur () {
        this.blurEnabled = true
      },
      disableBlur () {
        this.blurEnabled = false
      },
      substituteImageUrl: function (file, response) {
        this.currentCharts.imageUrl
      }
    },
    mounted () {
      var vm = this
      client.query({
        query: gql`query Chart {
            chart {
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
                   smallThumbnailUrl: thumbnailUrl(size: 100)
                   artistFirstName
                   artistLastName
                   title
                   label
                 }
               }
            }
        }`
      }).then(({data}) => {
        var chart = data.chart
        for (var i = 0; i < chart['releases'].length; i++) {
          var item = chart['releases'][i]['release']
          vm.currentCharts['releases'][i]['release'] = {
            result: item,
            value: vm.valueOf(item)
          }
        }
        vm.currentCharts.pk = chart.pk
        vm.currentCharts.imageUrl = chart.imageUrl
        // For some reason the input field is not reactively rendered otherwise
        vm.imageUploadPayload = JSON.stringify({
          target: {
            type: 'charts',
            id: chart.pk
          }
        })
      })

      client.query({
        query: gql`query Account($month: Int!) {
          account {
            artists {
              name
              slug
              thumbnailUrl(width: 610, height: 208)
              charts(month: $month) {
                edges {
                  node {
                    releases {
                      release {
                        artistFirstName
                        artistLastName
                        title
                        label
                      }
                    }
                  }
                }
              }
            }
          }
        }
        `,
        variables: {
          month: getCurrentMonth().value
        }
      }).then(({data}) => {
        vm.$store.commit(types.SET_USER_ARTISTS, {
          artists: data.account.artists
        })
      })
    }
  }
</script>

<style lang="scss">
  .save-charts-button {
    height: 32px;
    width: 200px;
    &:hover:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 0.1;
    }
  }
</style>
