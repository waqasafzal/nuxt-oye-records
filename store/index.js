/**
 * Created by tillkolter on 19/03/17.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as types from './types'
import { getInitialUserProfile, getInitialUser, getInitialCheckout, getInitialUserForm } from './utils'
import { addressEquals } from '../utils/address'

Vue.use(Vuex)

var isAddressComplete = function (address) {
  let complete = (
    address &&
    address.firstName.length > 0 &&
    address.lastName.length > 0 &&
    address.street.length > 0 &&
    (address.number && (address.number.length > 0 || address.number > 0)) &&
    (address.zip && (address.zip.length > 0 || address.zip > 0)) &&
    address.city.length > 0 &&
    address.country && address.country.length > 0
  )
  return complete
}

const store = new Vuex.Store({

  state: {
    cart: null,
    cartUpdating: false,
    countries: null,
    checkout: getInitialCheckout(),
    user: getInitialUser(),
    userProfile: getInitialUserProfile(),
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
    checkoutActive: false,
    userFormErrors: getInitialUserForm()
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
      state.userProfile.shipping.addresses = args.shippingAddresses
      if (!state.checkout.shipping.address && args.shippingAddresses.length > 0) {
        let address = args.shippingAddresses[0]
        state.checkout.shipping.address = address
        state.checkout.shipping.confirmed = store.getters.isShippingAddressComplete
      }
    },
    [types.SET_USER_BILLING_ADDRESSES]: (state, args) => {
      state.userProfile.billing.addresses = args.billingAddresses
      if (!state.checkout.billing.address && args.billingAddresses.length > 0) {
        let address = args.billingAddresses[0]
        state.checkout.billing.address = address
        let complete = isAddressComplete(address)
        state.checkout.shipping.confirmed = complete
      }
    },
    [types.SET_SHIPPING_ADDRESS]: (state, address) => {
      let formerAddress = state.checkout.shipping.address
      state.checkout.shipping.address = address
      if (!addressEquals(address, formerAddress)) {
        if (formerAddress) {
          state.checkout.shipping.changed = true
        }
      }
      // state.checkout.shipping.address.complete = store.getters.isShippingAddressComplete
    },
    [types.SET_BILLING_ADDRESS]: (state, address) => {
      let formerAddress = state.checkout.billing.address
      state.checkout.billing.address = address
      if (!addressEquals(address, formerAddress)) {
        if (formerAddress) {
          state.checkout.billing.changed = true
        }
      }
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
      state.userProfile.shipping.options = shippingOptions
    },
    [types.SET_SHIPPING_OPTION]: (state, shippingOption) => {
      state.checkout.shipping.option = shippingOption
    },
    [types.SET_SHIPPING_ADDRESS_CONFIRMED]: (state) => {
      let address = state.checkout.shipping.address
      if (address && isAddressComplete(address)) {
        state.checkout.shipping.confirmed = true
        state.checkout.checkoutState = 3
      }
    },
    [types.SET_CURRENT_CHECKOUT_STATE]: (state, checkoutState) => {
      state.checkout.checkoutState = checkoutState
    },
    [types.SET_PAYMENT_OPTIONS]: (state, paymentOptions) => {
      state.checkout.payment.options = paymentOptions
    },
    [types.SET_PAYMENT_OPTION_CONFIRMED]: (state) => {
      state.checkout.payment.confirmed = true
      state.checkout.checkoutState = 4
    },
    [types.SET_UNPAID_ORDER]: (state, unpaidOrder) => {
      state.checkout.unpaidOrder = unpaidOrder
      window.localStorage.setItem('unpaid', JSON.stringify(unpaidOrder))
      if (unpaidOrder && unpaidOrder.shippingCountry) {
        state.shippingCountry = unpaidOrder.shippingCountry
      }
    },
    [types.SET_SELECTED_PAYMENT_OPTION]: (state, paymentOption) => {
      state.checkout.payment.option = paymentOption
    },
    [types.SET_COUNTRIES]: (state, countries) => {
      state.countries = countries
    },
    [types.SET_SELECTED_PAYMENT_METHOD]: (state, method) => {
      state.checkout.payment.method = method
    },
    [types.RESET_USER_DATA]: (state) => {
      state.user = getInitialUser()
      state.userProfile = getInitialUserProfile()
      state.checkout = getInitialCheckout()
      state.cart = null
      window.localStorage.removeItem('unpaid')
    },
    [types.SET_SHIPPING_ADDRESS_ID]: (state, id) => {
      if (state.checkout.shipping.address) {
        state.checkout.shipping.address.id = id
        state.checkout.shipping.changed = false
      }
    },
    [types.SET_BILLING_ADDRESS_ID]: (state, id) => {
      if (state.checkout.billing.address) {
        state.checkout.billing.address.id = id
        state.checkout.billing.changed = false
      }
    },
    [types.SET_CHECKOUT_REGISTER_USER]: (state) => {
      state.checkout.register = true
    },
    [types.SET_USER_FORM_NAME_ERROR]: (state, error) => {
      state.userFormErrors.name = error
    },
    [types.SET_USER_FORM_PWD_ERROR]: (state, error) => {
      state.userFormErrors.password = error
    },
    [types.SET_USER_FORM_PWD_CONFIRM_ERROR]: (state, error) => {
      state.userFormErrors.passwordConfirmation = error
    },
    [types.SET_USER_FORM_EMAIL_ERROR]: (state, error) => {
      state.userFormErrors.email = error
    },
    [types.CHANGE_PAYMENT_METHOD]: (state) => {
      state.checkout.focussedInput = 'paymentMethod'
      state.checkout.checkoutState = 3
    },
    [types.CHANGE_BILLING]: (state) => {
      state.checkout.focussedInput = 'billingAddress'
      state.checkout.checkoutState = 2
    },
    [types.CHANGE_SHIPPING]: (state) => {
      state.checkout.focussedInput = 'shippingAddress'
      state.checkout.checkoutState = 2
    },
    [types.CHANGE_SHIPPING_OPTION]: (state) => {
      state.checkout.focussedInput = 'shippingOption'
      state.checkout.checkoutState = 2
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
      let address = state.checkout.shipping.address
      return address && isAddressComplete(address)
    },
    isBillingAddressComplete (state) {
      let address = state.checkout.billing.address
      return address && isAddressComplete(address)
    },
    isShippingAddressConfirmed (state) {
      return state.checkout.shipping.address && state.checkout.shipping.confirmed
    },
    isPaymentOptionConfirmed (state) {
      return state.checkout.payment.confirmed
    },
    getShippingCountry (state) {
      let address = store.getters.getShippingAddress
      return address && address.country
    },
    getShippingOptions (state) {
      return state.userProfile.shipping.options || []
    },
    getShippingAddress (state) {
      return state.checkout.shipping.address ||
        state.userProfile.shipping.addresses && state.userProfile.shipping.addresses.length > 0 && state.userProfile.shipping.addresses[0]
    },
    getBillingAddress (state) {
      return state.checkout.billing.address
    },
    getBillingCountry (state) {
      let address = store.getters.getBillingAddress
      return address && address.country
    },
    getCheckoutState (state) {
      if (store.getters.getUnpaidOrder) {
        return 5
      }
      if (state.checkout.checkoutState) {
        return state.checkout.checkoutState
      }
      var checkoutState = 0
      if (state.checkoutActive) {
        checkoutState = 1
      }
      if (checkoutState === 1 && state.user.authenticated || state.checkout.guest || state.checkout.register) {
        checkoutState = 2
      }
      if (checkoutState === 2 && store.getters.isShippingAddressConfirmed) {
        checkoutState = 3
      }
      if (checkoutState === 3 && store.getters.isPaymentOptionConfirmed) {
        checkoutState = 4
      }
      return checkoutState
    },
    getMaximumCheckoutState (state) {
      if (store.getters.getUnpaidOrder) {
        return 5
      }
      var checkoutState = 0
      if (state.checkoutActive) {
        checkoutState = 1
      }
      if (checkoutState === 1 && state.user.authenticated || state.checkout.guest || state.checkout.register) {
        checkoutState = 2
      }
      if (checkoutState === 2 && store.getters.isShippingAddressConfirmed) {
        checkoutState = 3
      }
      if (checkoutState === 3 && store.getters.isPaymentOptionConfirmed) {
        checkoutState = 4
      }
      return checkoutState
    },
    getPaymentOptions (state) {
      return state.checkout.payment.options
    },
    getShippingOption (state) {
      return state.checkout.shipping.option
    },
    getUnpaidOrder (state) {
      return state.checkout.unpaidOrder
    },
    getSelectedPaymentOption (state) {
      return state.checkout.payment.option
    },
    getSelectedPaymentMethod (state) {
      return state.checkout.payment.method
    },
    isRegisterCheckout (state) {
      return state.checkout.register
    },
    getUserFormNameError (state) {
      return state.userFormErrors.name
    },
    getUserFormPasswordError (state) {
      return state.userFormErrors.password
    },
    getUserFormPasswordConfirmationError (state) {
      return state.userFormErrors.passwordConfirmation
    },
    getUserFormEmailError (state) {
      return state.userFormErrors.email
    },
    getCheckoutFocussedInput (state) {
      return state.checkout.focussedInput
    },
    hasBillingChanged (state) {
      return state.checkout.billing.changed
    },
    hasShippingChanged (state) {
      return state.checkout.shipping.changed
    },
    hasChangedAddresses (state) {
      return store.getters.hasShippingChanged || store.getters.hasBillingChanged
    }
  },

  actions
})

export default store
