/**
 * Created by tillkolter on 19/03/17.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as types from './types'

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    cart: null,
    cartUpdating: false,
    user: {
      authenticated: false
    },
    player: {
      history: [],
      position: 0,
      nextTrack: null,
      currentTrack: null
    },
    search: {
      query: '',
      releases: {
        results: [],
        total: 0
      }
    },
    alerts: null
  },

  mutations: {
    [types.SET_CART]: (state, cart) => {
      state.cart = cart
    },
    [types.CART_UPDATING]: (state, loading) => {
      state.cartUpdating = loading
    },
    [types.SET_USER]: (state, user) => {
      state.user = user
    },
    [types.ADD_ALERT]: (state, alert) => {
      if (!state.alerts) {
        state.alerts = []
      }
      state.alerts.push(alert)
    },
    [types.LOGOUT_USER]: (state) => {
      state.user = null
    },
    [types.ADD_TRACK]: (state, track) => {
      state.player.history.push(track)
      if (!state.player.currentTrack) {
        state.player.currentTrack = track
      }
    },
    [types.PLAY_TRACK]: (state, track) => {
      if (track) {
        state.player.history.push(track)
      }
      state.player.currentTrack = track
      state.player.position = state.player.history.length - 1
    },
    [types.PLAY_BACKWARD]: (state, track) => {
      var player = state.player
      if (player) {
        let pos = player.position
        if (pos > 0) {
          player.position = player.position - 1
          player.currentTrack = player.history[player.position]
        }
      }
    },
    [types.PLAY_FORWARD]: (state, track) => {
      let player = state.player
      if (player) {
        let pos = player.position
        if (pos < player.history.length - 1) {
          player.position = player.position + 1
        }
        if (player.position < player.history.length) {
          player.currentTrack = player.history[player.position]
        }
      }
    },
    [types.SET_SEARCH_RESULTS]: (state, args) => {
      let type = args.type
      if (type === 'releases') {
        let search = args.search
        state.search.releases.results = search.results
        state.search.releases.total = search.total
      }
    },
    [types.ADD_SEARCH_RESULTS]: (state, args) => {
      let type = args.type
      if (type === 'releases') {
        let results = state.search.releases.results
        let search = args.search
        state.search.releases.results = results.concat(search.results)
        state.search.releases.total = search.total
      }
    },
    [types.SET_QUERY]: (state, query) => {
      state.search.query = query
    }
  },
  actions
})

export default store
