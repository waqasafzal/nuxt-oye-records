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

var isEmptyAddress = function (address) {
  return !address || (
    address.firstName === '' &&
    address.lastName === '' &&
    address.street === '' &&
    address.number === '' &&
    address.zip === '' &&
    address.city === '' &&
    address.country === ''
  )
}

const store = new Vuex.Store({

  state: {
    showMobile: false,
    primaryButtonBar: {
      showContinue: false,
      buttons: [],
      show: false
    },
    accountView: 'Addresses',
    cart: null,
    cartUpdating: false,
    countries: null,
    orders: null,
    checkout: getInitialCheckout(),
    user: getInitialUser(),
    userProfile: getInitialUserProfile(),
    player: {
      history: [],
      position: 0,
      nextTrack: null,
      currentTrack: null,
      playing: false,
      playlistVisible: false,
      visible: false
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
      },
      catnoReleases: {
        results: [],
        total: 0
      },
      labels: {
        results: [],
        total: 0
      }
    },
    alerts: null,
    checkoutActive: false,
    userFormErrors: getInitialUserForm(),
    isMobile: false,
    isSmallScreen: false,
    announcements: []
  },

  mutations: {
    changeMobile (state, isMobile) {
      state.isMobile = isMobile
    },
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
      var position = -1
      let player = state.player
      for (var i = 0; i < player.history.length; i++) {
        if (player.history[i] === track) {
          position = i
        }
      }

      if (position === -1) {
        state.player.history.push(track)
        position = 0
      }

      if (!state.player.currentTrack) {
        player.position = position
        player.currentTrack = track
        player.playing = true
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
      let search = args.search
      if (type === 'releases') {
        state.search.releases.results = search.results
        state.search.releases.total = search.total
      } else if (type === 'artists') {
        state.search.artists.results = search.results
        state.search.artists.total = search.total
      } else if (type === 'labels') {
        state.search.labels.results = search.results
        state.search.labels.total = search.total
      }
    },
    [types.SET_CATNO_RESULTS]: (state, args) => {
      let search = args.search
      state.search.catnoReleases.results = search.results
      state.search.catnoReleases.total = search.total
    },
    [types.ADD_SEARCH_RESULTS]: (state, args) => {
      let type = args.type
      state.search.loading--
      if (type === 'releases') {
        let results = state.search.releases.results
        let search = args.search
        if (args.head) {
          state.search.releases.results = [...search.results, ...results]
        } else {
          state.search.releases.results = results.concat(search.results)
        }
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
      let shippingAddress = state.checkout.shipping.address
      if (args.shippingAddresses.length > 0 && (!shippingAddress || isEmptyAddress(shippingAddress))) {
        let address = args.shippingAddresses[0]
        state.checkout.shipping.address = address
        state.checkout.shipping.confirmed = store.getters.isShippingAddressComplete
      }
    },
    [types.SET_USER_BILLING_ADDRESSES]: (state, args) => {
      state.userProfile.billing.addresses = args.billingAddresses
      let billingAddress = state.checkout.billing.address
      if (args.billingAddresses.length > 0 && (!billingAddress || isEmptyAddress(billingAddress))) {
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
      state.checkout.checkoutState = null
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
      if (shippingOptions.length > 0 && !state.checkout.shipping.option) {
        state.checkout.shipping.option = shippingOptions[0]
      }
    },
    [types.SET_SHIPPING_OPTION]: (state, shippingOption) => {
      state.checkout.shipping.option = shippingOption
    },
    [types.SET_SHIPPING_ADDRESS_CONFIRMED]: (state) => {
      let address = state.checkout.shipping.address
      if (address && isAddressComplete(address)) {
        state.checkout.shipping.confirmed = true
        store.commit(types.SET_CURRENT_CHECKOUT_STATE, 3)
      }
    },
    [types.SET_CURRENT_CHECKOUT_STATE]: (state, checkoutState) => {
      state.checkout.checkoutState = checkoutState
      state.primaryButtonBar.show = state.checkout.checkoutState === 4
    },
    [types.SET_PAYMENT_OPTIONS]: (state, paymentOptions) => {
      state.checkout.payment.options = paymentOptions
    },
    [types.SET_PAYMENT_OPTION_CONFIRMED]: (state) => {
      state.checkout.payment.confirmed = true
      store.commit(types.SET_CURRENT_CHECKOUT_STATE, 4)
    },
    [types.SET_UNPAID_ORDER]: (state, unpaidOrder) => {
      state.checkout.unpaidOrder = unpaidOrder
      if (unpaidOrder && unpaidOrder.shippingCountry) {
        state.shippingCountry = unpaidOrder.shippingCountry
      }
    },
    [types.SET_SELECTED_PAYMENT_OPTION]: (state, paymentOption) => {
      state.checkout.payment.option = paymentOption
      // if the payment option is cash reset the payment method
      if (paymentOption.id === 'cash') {
        let options = state.userProfile.shipping.options
        for (var i = 0; i < options.length; i++) {
          let shipping = options[i]
          if (shipping.id === '-1') {
            state.checkout.shipping.option = shipping
            break
          }
        }
      }
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
    [types.SET_USER_FORM_FIRST_NAME_ERROR]: (state, error) => {
      state.userFormErrors.firstName = error
    },
    [types.SET_USER_FORM_LAST_NAME_ERROR]: (state, error) => {
      state.userFormErrors.lastName = error
    },
    [types.CHANGE_PAYMENT_METHOD]: (state) => {
      state.checkout.focussedInput = 'paymentMethod'
      store.commit(types.SET_CURRENT_CHECKOUT_STATE, 3)
    },
    [types.CHANGE_BILLING]: (state) => {
      state.checkout.focussedInput = 'billingAddress'
      store.commit(types.SET_CURRENT_CHECKOUT_STATE, 2)
    },
    [types.CHANGE_SHIPPING]: (state) => {
      state.checkout.focussedInput = 'shippingAddress'
      store.commit(types.SET_CURRENT_CHECKOUT_STATE, 2)
    },
    [types.CHANGE_SHIPPING_OPTION]: (state) => {
      state.checkout.focussedInput = 'shippingOption'
      store.commit(types.SET_CURRENT_CHECKOUT_STATE, 2)
    },
    [types.SET_VAT_EXCLUDED]: (state, isVatExcluded) => {
      state.checkout.isVatExcluded = isVatExcluded
    },
    [types.SET_CURRENT_ACCOUNT_VIEW]: (state, viewName) => {
      state.accountView = viewName
    },
    [types.SET_PURCHASES]: (state, orders) => {
      state.userProfile.orders = orders
    },
    [types.SET_BACK_ORDERS]: (state, orders) => {
      state.userProfile.backOrders = orders
    },
    [types.SET_AVAILABLE_ORDERS]: (state, orders) => {
      state.userProfile.availableOrders = orders
    },
    [types.SET_MOBILE_NAV]: (state, showMobileNav) => {
      state.showMobile = showMobileNav
    },
    [types.SET_MOBILE]: (state, isMobile) => {
      state.isMobile = isMobile
    },
    [types.SET_SMALL_SCREEN]: (state, isSmall) => {
      state.isSmallScreen = isSmall
    },
    [types.SET_BUTTON_BAR_CONTINUE]: (state, showContinue) => {
      state.primaryButtonBar.showContinue = showContinue
    },
    [types.SET_BUTTON_BAR_BUTTONS]: (state, buttons) => {
      state.primaryButtonBar.buttons = buttons
    },
    [types.SET_BUTTON_BAR_SHOW]: (state, show) => {
      state.primaryButtonBar.show = show
    },
    [types.SET_PAYPAL_PAYMENT_URL]: (state, paymentUrl) => {
      state.checkout.payment.paypalPaymentUrl = paymentUrl
    },
    [types.DELETE_PAYMENT_METHOD]: (state, method) => {
      var options = state.checkout.payment.options
      var optionsCopy = []
      for (var i = 0; i < options.length; i++) {
        let option = Object.assign({}, options[i])
        let methods = option.methods
        if (methods && methods.includes(method)) {
          option.methods = methods.filter(item => item !== method)
          // break
        }
        optionsCopy.push(option)
      }
      state.checkout.payment.options = optionsCopy
    },
    [types.SET_GUEST_EMAIL]: (state, email) => {
      state.checkout.guestEmail = email
    },
    [types.SET_TERMS_AGREED]: (state, agreed) => {
      state.checkout.termsAgreed = agreed
    },
    [types.SET_USER_EMAIL]: (state, email) => {
      state.user.email = email
    },
    [types.SET_ANNOUNCEMENTS]: (state, announcements) => {
      state.announcements = announcements
    },
    [types.REMOVE_ANNOUNCEMENT]: (state, announcement) => {
      state.announcements = state.announcements.filter(item => item.message !== announcement.message)
    },
    [types.SET_PLAYER_VISIBLE]: (state, visible) => {
      state.player.visible = visible
    }
  },

  getters: {
    isMobile: state => state.isMobile,
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
    reservationCount (state) {
      return state.cart && state.cart.preorderLines.length
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
      return state.checkout.billing.address ||
        state.userProfile.billing.addresses && state.userProfile.billing.addresses.length > 0 && state.userProfile.billing.addresses[0]
    },
    getBillingAddressValidation (state) {
      return state.checkout.billing.validation
    },
    getShippingAddressValidation (state) {
      return state.checkout.shipping.validation
    },
    getBillingCountry (state) {
      let address = store.getters.getBillingAddress
      return address && address.country
    },
    getCheckoutState (state, getters) {
      let order = getters.getUnpaidOrder
      let currentState = state.checkout.checkoutState

      if (currentState !== null && currentState < 6 && order && !order.isPaid) {
        return 5
      }

      if (currentState) {
        return currentState
      }

      var checkoutState = 0

      if (state.checkoutActive) {
        checkoutState = 1
      }

      if (checkoutState === 1 && state.user.authenticated || state.checkout.register) {
        checkoutState = 2
      }

      if (checkoutState === 2 && getters.isShippingAddressConfirmed || getters.isOnlyPresale && checkoutState > 1) {
        checkoutState = 3
      }

      if (checkoutState === 3 && getters.isPaymentOptionConfirmed || state.checkoutActive && getters.isOnlyPresale && checkoutState > 1) {
        checkoutState = 4
      }

      return checkoutState
    },
    getMaximumCheckoutState (state, getters) {
      if (getters.getUnpaidOrder) {
        return 5
      }
      var checkoutState = 0
      if (state.checkoutActive) {
        checkoutState = 1
      }
      if (checkoutState === 1 && state.user.authenticated || state.checkout.guest || state.checkout.register) {
        checkoutState = 2
      }
      if (checkoutState === 2 && getters.isShippingAddressConfirmed) {
        checkoutState = 3
      }
      if (checkoutState === 3 && getters.isPaymentOptionConfirmed) {
        checkoutState = 4
      }
      return checkoutState
    },
    getPaymentOptions (state) {
      return state.checkout.payment.options
    },
    getShippingOption (state) {
      let option = state.checkout.shipping.option
      let options = store.getters.getShippingOptions
      return option || options && options[0]
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
    getUserFormLastNameError (state) {
      return state.userFormErrors.lastName
    },
    getUserFormFirstNameError (state) {
      return state.userFormErrors.firstName
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
    },
    getVat (state) {
      var cart = store.getters.getCart
      return cart && cart.vat
    },
    isVatExcluded (state) {
      return state.checkout.isVatExcluded
    },
    getLogos (state) {
      return paymentType => {
        let options = store.getters.getPaymentOptions
        if (options) {
          for (var i = 0; i < options.length; i++) {
            if (options[i].id === paymentType) {
              let variantLogos = options[i].logos
              let logos = []
              for (var j = 0; j < variantLogos.length; j++) {
                logos.push(variantLogos[j].logo)
              }
              return logos
            }
          }
        }
        return []
      }
    },
    getCart (state) {
      return state.cart
    },
    getPurchases (state) {
      return state.userProfile.orders || []
    },
    getBackOrders (state) {
      return state.userProfile.backOrders || []
    },
    getAvailableOrders (state) {
      return state.userProfile.availableOrders || []
    },
    hasMobileMenu (state) {
      return state.isMobile || state.isSmallScreen
    },
    announcements: state => state.announcements,
    isEmptyCart: (state, getters) => {
      return getters.getCart &&
        (getters.getCart.lines.length === 0 && getters.getCart.preorderLines === 0)
    },
    isOnlyPresale: (state, getters) => {
      let cart = getters.getCart
      return cart && cart.lines.length === 0 && cart.preorderLines.length > 0
    },
    termsAgreed: (state, getters) => state.checkout.termsAgreed,
    showAudioPlayer: (state) => state.player.visible
  },

  actions
})

export default store
