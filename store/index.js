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
      authenticated: false,
      artists: []
    },
    player: {
      history: [],
      position: 0,
      nextTrack: null,
      currentTrack: null,
      playing: false,
      playlistVisible: false
    },
    search: {
      query: null,
      fields: null,
      loading: false,
      releases: {
        results: [],
        total: 0
      },
      artists: {
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
      let player = state.player
      let changing = player.currentTrack !== track
      var position = -1
      if (track && changing) {
        for (var i = 0; player.history.length; i++) {
          if (player.history[i] === track) {
            position = i
            break
          }
        }
        if (position === -1) {
          player.history.push(track)
          position = player.history.length - 1
        }
      }
      player.playing = true
      player.currentTrack = track
      if (changing) {
        player.position = position
      }
    },
    [types.PAUSE_TRACK]: (state) => {
      if (state.player) {
        state.player.playing = false
      }
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
        } else {
          player.playing = false
        }
      }
    },
    [types.SET_SEARCH_RESULTS]: (state, args) => {
      let type = args.type
      state.search.loading = false
      if (type === 'releases') {
        let search = args.search
        state.search.releases.results = search.results
        state.search.releases.total = search.total
      } else if (type === 'artists') {
        let search = args.search
        state.search.artists.results = search.results
        state.search.artists.total = search.total
      }
    },
    [types.ADD_SEARCH_RESULTS]: (state, args) => {
      let type = args.type
      state.search.loading = false
      if (type === 'releases') {
        let results = state.search.releases.results
        let search = args.search
        state.search.releases.results = results.concat(search.results)
        state.search.releases.total = search.total
      }
    },
    [types.SET_QUERY]: (state, {query, fields}) => {
      state.search.query = query
      state.search.fields = fields
    },
    [types.SET_SEARCH_LOADING]: (state) => {
      state.search.loading = true
    },
    [types.SET_USER_ARTISTS]: (state, {artists}) => {
      state.user.artists = artists
    },
    [types.UPDATE_USER_ARTIST]: (state, {artist}) => {
      var userArtists = state.user.artists
      var updated = false
      for (var i = 0; i < userArtists.length; i++) {
        if (userArtists[i].slug === artist.slug) {
          userArtists[i] = artist
          updated = true
        }
      }
      if (!updated) {
        userArtists.push(artist)
      }
    },
    [types.SET_PLAYLIST_VISIBLE]: (state, isVisible) => {
      state.player.playlistVisible = isVisible
    }
  },

  getters: {
    isAuthenticated (state) {
      return state.user && state.user.authenticated
    },
    loggedUser (state) {
      return state.user
    },
    artists (state) {
      return state.user && state.user.authenticated && state.user.artists
    }
  },

  actions
})

export default store
