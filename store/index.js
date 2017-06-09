/**
 * Created by tillkolter on 19/03/17.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as types from './types'

Vue.use(Vuex)

var isAddressComplete = function (address) {
  let complete = (
    address &&
    address.firstName.length > 0 &&
    address.lastName.length > 0 &&
    address.street.length > 0 &&
    (address.number.length > 0 || address.number > 0) &&
    address.zip.length > 0 &&
    address.city.length > 0 &&
    address.country && address.country.length > 0
  )
  return complete
}

const store = new Vuex.Store({

  state: {
    cart: null,
    cartUpdating: false,
    checkoutState: null,
    unpaidOrder: null,
    shippingAddress: null,
    shippingAddressIsComplete: false,
    shippingAddressConfirmed: false,
    paymentOptionConfirmed: false,
    selectedPaymentOption: null,
    billingAddress: null,
    billingAddressIsComplete: false,
    shippingOptions: null,
    shippingOption: null,
    paymentOptions: null,
    checkout: {
      billingAddress: null,
      payment: null,
      guest: null
    },
    user: {
      authenticated: false,
      artists: [],
      shippingAddresses: [],
      billingAddresses: []
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
      loading: 0,
      releases: {
        results: [],
        total: 0
      },
      artists: {
        results: [],
        total: 0
      }
    },
    alerts: null,
    checkoutActive: false
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
        for (var i = 0; i < player.history.length; i++) {
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
        if (pos < player.history.length) {
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
      state.search.loading--
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
    },
    [types.SET_USER_SHIPPING_ADDRESSES]: (state, args) => {
      state.user.shippingAddresses = args.shippingAddresses
      if (!state.shippingAddress && args.shippingAddresses.length > 0) {
        let address = args.shippingAddresses[0]
        state.shippingAddress = address
        let complete = isAddressComplete(address)
        state.shippingAddressIsComplete = complete
        state.shippingAddressConfirmed = complete
      }
    },
    [types.SET_USER_BILLING_ADDRESSES]: (state, args) => {
      state.user.billingAddresses = args.billingAddresses
      if (!state.billingAddress && args.billingAddresses.length > 0) {
        let address = args.billingAddresses[0]
        state.billingAddress = address
        let complete = isAddressComplete(address)
        state.shippingAddressIsComplete = complete
        state.shippingAddressConfirmed = complete
      }
    },
    [types.SET_SHIPPING_ADDRESS]: (state, address) => {
      state.shippingAddress = address
      let complete = isAddressComplete(address)
      state.shippingAddressIsComplete = complete
    },
    [types.SET_BILLING_ADDRESS]: (state, address) => {
      state.billingAddress = address
      let complete = isAddressComplete(address)
      state.billingAddressIsComplete = complete
    },
    [types.SET_USER_PAYMENT_METHODS]: (state, paymentMethods) => {
      state.user.paymentMethods = paymentMethods
    },
    [types.ENTER_CHECKOUT]: (state) => {
      state.checkoutActive = true
    },
    [types.FINISH_CHECKOUT]: (state) => {
      state.checkoutActive = false
    },
    [types.DECREMENT_SEARCH_LOADING]: (state) => {
      state.search.loading--
    },
    [types.INCREMENT_SEARCH_LOADING]: (state) => {
      state.search.loading++
    },
    [types.SET_GUEST_CHECKOUT]: (state) => {
      state.checkout.guest = true
    },
    [types.SET_SHIPPING_OPTIONS]: (state, shippingOptions) => {
      state.shippingOptions = shippingOptions
    },
    [types.SET_SHIPPING_OPTION]: (state, shippingOption) => {
      state.shippingOption = shippingOption
    },
    [types.SET_SHIPPING_ADDRESS_CONFIRMED]: (state) => {
      if (state.shippingAddress && isAddressComplete(state.shippingAddress)) {
        state.shippingAddressConfirmed = true
        state.checkoutState = 3
      }
    },
    [types.SET_CURRENT_CHECKOUT_STATE]: (state, checkoutState) => {
      state.checkoutState = checkoutState
    },
    [types.SET_PAYMENT_OPTIONS]: (state, paymentOptions) => {
      state.paymentOptions = paymentOptions
    },
    [types.SET_PAYMENT_OPTION_CONFIRMED]: (state) => {
      state.paymentOptionConfirmed = true
      state.checkoutState = 4
    },
    [types.SET_UNPAID_ORDER]: (state, unpaidOrder) => {
      state.unpaidOrder = unpaidOrder
    },
    [types.SET_SELECTED_PAYMENT_OPTION]: (state, paymentOption) => {
      state.selectedPaymentOption = paymentOption
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
    },
    cartItemCount (state) {
      return state.cart && state.cart.quantity || 0
    },
    isShippingAddressComplete (state) {
      return state.shippingAddressIsComplete
    },
    isBillingAddressComplete (state) {
      return state.billingAddressIsComplete
    },
    getShippingCountry (state) {
      return state.shippingAddress && state.shippingAddress.country
    },
    getShippingOptions (state) {
      return state.shippingOptions || []
    },
    getShippingAddress (state) {
      return state.shippingAddress ||
        state.user.shippingAddresses && state.user.shippingAddresses.length > 0 && state.user.shippingAddresses[0]
    },
    getBillingAddress (state) {
      return state.billingAddress
    },
    getCheckoutState (state) {
      if (state.unpaidOrder) {
        return 5
      }
      if (state.checkoutState) {
        return state.checkoutState
      }
      var checkoutState = 0
      if (state.checkoutActive) {
        checkoutState = 1
      }
      if (checkoutState === 1 && state.user.authenticated || state.checkout.guest) {
        checkoutState = 2
      }
      if (checkoutState === 2 && state.shippingAddressConfirmed) {
        checkoutState = 3
      }
      if (checkoutState === 3 && state.paymentOptionConfirmed) {
        checkoutState = 4
      }
      return checkoutState
    },
    getMaximumCheckoutState (state) {
      if (state.unpaidOrder) {
        return 5
      }
      var checkoutState = 0
      if (state.checkoutActive) {
        checkoutState = 1
      }
      if (checkoutState === 1 && state.user.authenticated || state.checkout.guest) {
        checkoutState = 2
      }
      if (checkoutState === 2 && state.shippingAddressConfirmed) {
        checkoutState = 3
      }
      if (checkoutState === 3 && state.paymentOptionConfirmed) {
        checkoutState = 4
      }
      return checkoutState
    },
    getPaymentOptions (state) {
      return state.paymentOptions
    },
    getShippingOption (state) {
      return state.shippingOption
    },
    getUnpaidOrder (state) {
      return state.unpaidOrder
    }
  },

  actions
})

export default store
