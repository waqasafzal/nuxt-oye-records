/**
 * Created by tillkolter on 19/03/17.
 */

/**
 *
 * @param {String} commit
 * @returns {Promise}
 */

import * as types from './types'
import Vue from 'vue'
import gql from 'graphql-tag'
import apolloClient from '../plugins/apollo'
import { oyeCart } from '../components/graphql/cart'

import { addCartAlertMessage } from '../components/shared/utils'
import { callArtistSearchQuery, callLabelSearchQuery, callReleaseSearchQuery } from '../components/search/queries'
import { addressFragment } from '~/components/graphql/user'
import { cardDataFragment } from '../components/graphql/payments'
import { validateEmail } from '../utils/forms'
import { setToken } from '../utils/auth/index'
import { addressEquals } from '../utils/address'
import { callSaveAddress } from '../components/graphql/user'

function runEmailValidation (email, commit) {
  var ok = true
  if (!email) {
    commit(types.SET_USER_FORM_EMAIL_ERROR, 'Email should not be empty')
    ok = false
  } else {
    var valid = validateEmail(email)
    if (!valid) {
      commit(types.SET_USER_FORM_EMAIL_ERROR, 'Email pattern is not valid')
      ok = false
    } else {
      commit(types.SET_USER_FORM_EMAIL_ERROR, null)
    }
  }
  return ok
}

function runPasswordValidation (commit, password, passwordConfirm) {
  var ok = true
  if (!password || password.length < 8) {
    commit(types.SET_USER_FORM_PWD_ERROR, 'Password should have at least 8 characters')
    ok = false
  } else if (password.search(/[!#$%^&+=?]/) < 0 || password.search(/[0-9]/) < 0) {
    commit(types.SET_USER_FORM_PWD_ERROR, 'Password must contain at least one digit and one of these special chars: !#$%^&+=?')
    ok = false
  } else {
    commit(types.SET_USER_FORM_PWD_ERROR, null)
  }
  if (password && password !== passwordConfirm) {
    commit(types.SET_USER_FORM_PWD_CONFIRM_ERROR, 'Password confirmation does not match')
    ok = false
  } else {
    commit(types.SET_USER_FORM_PWD_CONFIRM_ERROR, null)
  }
  return ok
}

export const getCart = ({commit, dispatch}) => new Promise((resolve, reject) => {
  apolloClient.mutate({
    mutation: gql`mutation OyeCart {
        syncCart {
            cart {
                ...OyeCart
            }
            removedItems {
                quantity
                release {
                    slug
                    title
                    name
                }
            }
            addedItems {
                quantity
                release {
                    title
                    name
                }
            }
        }
    },
    ${oyeCart}`,
    fetchPolicy: 'network-only'
  })
  .then(({data}) => {
    let cart = data.syncCart.cart
    if (cart.cookie) {
      Vue.cookie.set('cart', cart.cookie, true)
    }
    dispatch('setCart', {cart: cart})
    let addedItems = data.syncCart.addedItems
    if (addedItems) {
      for (let i = 0; i < addedItems.length; i++) {
        let item = addedItems[i]
        let release = item.release
        commit(types.ADD_ALERT, {
          level: 'warning',
          message: `Release '${release.name} - ${release.title}' is on stock again. Added ${item.quantity} item${item.quantity > 1 ? 's' : ''} to order.`
        })
      }
    }
    let removedItems = data.syncCart.removedItems
    if (removedItems) {
      for (let i = 0; i < removedItems.length; i++) {
        let item = removedItems[i]
        let release = item.release
        commit(types.ADD_ALERT, {
          level: 'warning',
          message: `Release '${release.name} - ${release.title}' does not have enough items on stock. Moved ${item.quantity} item${item.quantity > 1 ? 's' : ''} for preorder.`
        })
      }
    }
    return resolve(cart)
  })
  .catch(er => reject(er))
})

export const addToCart = ({commit, dispatch}, args) => new Promise((resolve, reject) => {
  apolloClient.mutate(
    {
      mutation: gql`mutation ($releasePk: ID!, $quantity: Int!) {
          addToCart(releasePk: $releasePk, quantity: $quantity) {
              cart {
                  ...OyeCart
              }
          }
      },
      ${oyeCart}`,
      variables: {
        releasePk: args.pk,
        quantity: args.quantity
      },
      updateQueries: {
        'OyeCart': (previousQueryResult, r) => {
          let addToCart = r.mutationResult.data.addToCart
          return {
            cart: addToCart.cart
          }
        }
      }
    }
  ).then(({data}) => {
    addCartAlertMessage('Article successfully added to cart.', 'info', true)

    const cart = data && data.addToCart.cart
    Vue.cookie.set('cart', data.addToCart.cart.cookie, true)
    dispatch('setCart', {cart: cart || null})
    return resolve(cart)
  }).catch(er => reject(er))
})

export const updateCart = ({commit, dispatch}, args) => new Promise((resolve, reject) => {
  commit(types.CART_UPDATING, true)
  let line = args.line
  let quantity = args.value
  let release = line.release
  let backorder = line.backorder
  apolloClient.mutate({
    mutation: gql`mutation ($releasePk: ID!, $quantity: Int! $backorder: Boolean) {
        updateCart(releasePk: $releasePk, quantity: $quantity, backorder: $backorder) {
            cart {
                ...OyeCart
            }
            quantity
            reorderQuantity
        }
    },
    ${oyeCart}`,
    variables: {
      releasePk: release.pk,
      quantity: quantity,
      backorder: backorder
    }
  }).then(({data}) => {
    // dispatch an info that everything was correct
    commit(types.CART_UPDATING, false)
    let addedQuantity = data.updateCart.quantity
    let reorderQuantity = data.updateCart.reorderQuantity
    let absAdded = Math.abs(addedQuantity)
    if (absAdded) {
      let itemStr = absAdded > 1 ? 'items' : 'item'
      if (absAdded !== 0) {
        if (addedQuantity > 0) {
          addCartAlertMessage(`Added ${addedQuantity} ${itemStr} to cart.`, 'info')
        } else if (addedQuantity < 0) {
          addCartAlertMessage(`Removed ${-1 * addedQuantity} ${itemStr} from cart.`, 'info')
        }
      }
    }
    if (reorderQuantity > 0) {
      addCartAlertMessage(`Added ${reorderQuantity} items for preorder.`, 'warning')
    } else if (reorderQuantity < 0) {
      addCartAlertMessage(`Removed ${-1 * reorderQuantity} items from preorder.`, 'warning')
    }

    const cart = data && data.updateCart.cart
    Vue.cookie.set('cart', data.updateCart.cart.cookie, true)
    dispatch('setCart', {cart: cart || null})
    return resolve(cart)
  }).catch(er => {
    reject(er)
  })
})

export const removeCartLine = ({commit, dispatch}, args) => new Promise((resolve, reject) => {
  apolloClient.mutate({
    mutation: gql`mutation ($releasePk: ID!, $backorder: Boolean) {
        removeRelease(releasePk: $releasePk, backorder: $backorder) {
            cart {
                ...OyeCart
            }
        }
    }
    ${oyeCart}`,
    variables: {
      releasePk: args.pk,
      backorder: args.backorder
    }
  }).then(({data}) => {
    if (args.backorder) {
      addCartAlertMessage('Article was removed from pre/back order.', 'info')
    } else {
      addCartAlertMessage('Article was removed from cart.', 'info')
    }

    const r = data && data.removeRelease.cart
    Vue.cookie.set('cart', data.removeRelease.cart.cookie, true)
    dispatch('setCart', {cart: r || null})
    return resolve(r)
  }).catch(er => reject(er))
})

export const playRelease = ({commit}, args) => new Promise((resolve, reject) => {
  var release = args.release
  var play = typeof args.play === 'undefined' || args.play
  if (release) {
    for (var i = 0; i < release.tracks.length; i++) {
      var track = release.tracks[i]
      if (i === 0 && play) {
        commit(types.PLAY_TRACK, track)
      } else {
        commit(types.ADD_TRACK, track)
      }
    }
    resolve(release)
  }
})

export const playTrack = ({commit}, args) => new Promise((resolve, reject) => {
  let track = args.track
  commit(types.PLAY_TRACK, track)
  return resolve(track)
})

export const nextTrack = ({commit}) => new Promise((resolve, reject) => {
  commit(types.PLAY_FORWARD)
})

export const prevTrack = ({commit}) => new Promise((resolve, reject) => {
  commit(types.PLAY_BACKWARD)
})

export const setUser = ({commit}, args) => new Promise((resolve, reject) => {
  commit(types.SET_USER, args.user)
})

export const addAlert = ({commit}, args) => new Promise((resolve, reject) => {
  commit(types.ADD_ALERT, args)
})

export const search = ({commit}, args) => new Promise((resolve, reject) => {
  let type = args.type
  let mutationType = args.append ? types.ADD_SEARCH_RESULTS : types.SET_SEARCH_RESULTS
  let query = args.query

  if (query) {
    commit(types.INCREMENT_SEARCH_LOADING)
    if (type === 'releases') {
      if (!args.append) {
        commit(types.SET_SEARCH_RESULTS, {
          type: 'releases',
          search: {
            total: 0,
            results: []
          }
        })
      }
      callReleaseSearchQuery(query, args.size, args.page || 1, args.fields, ({data}) => {
        let searchResults = data.search
        commit(mutationType, {search: searchResults, type: type})
        resolve({
          search: searchResults
        })
        commit(types.DECREMENT_SEARCH_LOADING)
      }, () => {
        commit(types.DECREMENT_SEARCH_LOADING)
      })
      callReleaseSearchQuery(query, args.size, 1, JSON.stringify(['cat_no']), ({data}) => {
        let searchResults = data.search
        commit(types.SET_CATNO_RESULTS, {search: searchResults, type: type, head: true})
      })
    } else if (type === 'artists') {
      callArtistSearchQuery(query, args.size, ({data}) => {
        let searchResults = data.search
        commit(mutationType, {search: searchResults, type: type})
        resolve({
          search: searchResults
        })
        commit(types.DECREMENT_SEARCH_LOADING)
      }, () => {
        commit(types.DECREMENT_SEARCH_LOADING)
      })
    } else if (type === 'labels') {
      callLabelSearchQuery(query, args.size, ({data}) => {
        let searchResults = data.search
        commit(mutationType, {search: searchResults, type: type})
        resolve({search: searchResults})
        commit(types.DECREMENT_SEARCH_LOADING)
      })
    }
  } else {
    commit(mutationType, {
      search: {
        results: [],
        total: 0
      },
      type: type
    })
  }
  commit(types.SET_QUERY, {query})
})

export const getProfile = (store, args) => new Promise((resolve, reject) => {
  apolloClient.query({
    query: gql`query Profile {
        profile {
            firstName
            lastName
            email
            shippingAddresses {
                ...Address
            }
            billingAddresses {
                ...Address
            }
            paymentMethods {
                id
                reference
                ... on CardMethodType {
                    cardData {
                        ...CardData
                    }
                }
            }
            unpaidOrder {
                id
                pk
                price
                porto
                paymentType
                shippingAddress {
                    country
                }
                cart {
                    ...OyeCart
                }
            }
        }
        announcements {
            priority
            message
        }
    }
    ${oyeCart}
    ${addressFragment}
    ${cardDataFragment}
    `,
    fetchPolicy: 'network-only'
  }).then(({data}) => {
    let profile = data.profile
    if (profile) {
      if (profile.shippingAddresses && profile.shippingAddresses.length > 0) {
        store.commit(types.SET_USER_SHIPPING_ADDRESSES, {
          shippingAddresses: profile.shippingAddresses
        })
      }
      if (profile.billingAddresses && profile.billingAddresses.length > 0) {
        store.commit(types.SET_USER_BILLING_ADDRESSES, {
          billingAddresses: profile.billingAddresses
        })
      }
      if (profile.paymentMethods && profile.paymentMethods.length > 0) {
        store.commit(types.SET_USER_PAYMENT_METHODS, {
          paymentMethods: profile.paymentMethods
        })
      }
      if (profile.email) {
        store.commit(types.SET_USER_EMAIL, profile.email)
      }
    }
    let announcements = data.announcements
    if (announcements && announcements.length > 0) {
      let readAnnouncements = window.localStorage.getItem('announcements')
      let msgList = readAnnouncements ? JSON.parse(readAnnouncements) : []
      store.commit(types.SET_ANNOUNCEMENTS, announcements.filter(info => !msgList.includes(info.message)))
    }
    resolve(profile)
  })
})

export const enterCheckout = (store, args) => new Promise((resolve, reject) => {
  store.dispatch('getProfile', args)
  store.commit(types.SET_CURRENT_CHECKOUT_STATE, null)
  store.commit(types.ENTER_CHECKOUT)
})

export const setShippingCountry = (store, args) => new Promise((resolve, reject) => {
  apolloClient.query({
    query: gql`query CartShippingOption($countryName: String) {
        cart {
            shippingOptions(countryName: $countryName) {
                isVatExcluded
                options {
                    id
                    price
                    name
                }
            }
        }
    }`,
    variables: {
      countryName: args.country
    }
  }).then(({data}) => {
    // resolve(data.cart.shippingOptions)
    // let cart = data.cart
    // vm.shippingOptions = cart.shippingOptions
    store.commit(types.SET_SHIPPING_OPTIONS, data.cart.shippingOptions.options)
    store.commit(types.SET_VAT_EXCLUDED, data.cart.shippingOptions.isVatExcluded)
  })
})

export const getPaymentOptions = ({commit}, args) => new Promise((resolve, reject) => {
  apolloClient.query({
    query: gql`query PaymentMethods($country: String) {
        paymentOptions(country: $country) {
            id
            name
            logos {
                logo
                variant
            }
            methods {
                id
                reference
                variant
                ... on CardMethodType {
                    cardData {
                        number
                        expiryMonth
                        expiryYear
                        holderName
                    }
                }
            }
        }
    }
    `,
    variables: {
      country: args.country
    }
  }).then(({data}) => {
    commit(types.SET_PAYMENT_OPTIONS, data.paymentOptions)
    resolve(data.paymentOptions)
  })
})

export const validateUserForm = ({commit}, args) => new Promise((resolve, reject) => {
  let user = args.user
  let ok = true
  if (typeof user.name !== 'undefined' && user.name === '') {
    commit(types.SET_USER_FORM_NAME_ERROR, 'Username should not be empty')
    ok = false
  } else {
    commit(types.SET_USER_FORM_NAME_ERROR, null)
  }

  if (typeof user.firstName !== 'undefined') {
    if (user.firstName === '') {
      commit(types.SET_USER_FORM_FIRST_NAME_ERROR, 'First name should not be empty!')
      ok = false
    } else {
      commit(types.SET_USER_FORM_FIRST_NAME_ERROR, null)
    }
  }
  if (typeof user.lastName !== 'undefined') {
    if (user.lastName === '') {
      commit(types.SET_USER_FORM_LAST_NAME_ERROR, 'Last name should not be empty!')
      ok = false
    } else {
      commit(types.SET_USER_FORM_LAST_NAME_ERROR, null)
    }
  }

  ok = ok && runPasswordValidation(commit, user.password, user.passwordConfirm)
  ok = ok && runEmailValidation(user.email, commit)

  return resolve(ok)
})

export const createNewUser = ({commit}, args) => new Promise((resolve, reject) => {
  let user = args.user
  let shippingAddress = args.shippingAddress
  let billingAddress = args.billingAddress

  apolloClient.mutate({
    mutation: gql`mutation RegisterUser($email: String!,$username: String!, $password: String!, $shippingAddress: AddressInputType, $billingAddress: AddressInputType) {
        registerUser(email: $email, username: $username, password: $password, shippingAddress: $shippingAddress, billingAddress: $billingAddress) {
            errorStatus
            userProfile {
                firstName
                lastName
            }
            token
        }
    }`,
    variables: {
      username: user.name,
      email: user.email,
      password: user.password,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress
    }
  }).then(({data}) => {
    if (data.registerUser.errorStatus) {
      console.error(`Can not register user ${data.registerUser.errorStatus}`)
    } else {
      setToken(data.registerUser.token)
      resolve(data.registerUser)
    }
  })
})

export const saveAddresses = (store, args) => new Promise((resolve, reject) => {
  let shippingAddress = store.getters.getShippingAddress
  let billingAddress = store.getters.getBillingAddress
  let billingChanged = store.getters.hasBillingChanged
  let shippingChanged = store.getters.hasShippingChanged

  let addressDict = {}

  var addressId

  if (billingChanged && shippingChanged) {
    if (addressEquals(shippingAddress, billingAddress)) {
      addressDict = Object.assign({}, shippingAddress)
      addressDict['isBilling'] = true
      addressDict['isShipping'] = true
      callSaveAddress(shippingAddress.id, addressDict, ({data}) => {
        // this.billingAddressChanged = false
        // this.shippingAddressChanged = false
        store.commit(types.SET_SHIPPING_ADDRESS_ID, data.saveAddress.address.id)
        store.commit(types.SET_BILLING_ADDRESS_ID, data.saveAddress.address.id)
        store.dispatch('addAlert', {
          message: 'Shipping and billing address have been saved.'
        })
      })
    } else {
      addressDict = Object.assign({}, shippingAddress)
      addressDict['isBilling'] = false
      addressDict['isShipping'] = true
      callSaveAddress(shippingAddress.id, addressDict, ({data}) => {
        // this.shippingAddressChanged = false
        store.commit(types.SET_SHIPPING_ADDRESS_ID, data.saveAddress.address.id)
        store.dispatch('addAlert', {
          message: 'Shipping address has been saved.'
        })
      })

      addressDict = Object.assign({}, billingAddress)
      addressDict['isShipping'] = false
      addressDict['isBilling'] = true
      addressId = billingAddress.id !== shippingAddress.id ? billingAddress.id : undefined
      callSaveAddress(addressId, addressDict, ({data}) => {
        // this.billingAddressChanged = false
        store.commit(types.SET_BILLING_ADDRESS_ID, data.saveAddress.address.id)
        store.dispatch('addAlert', {
          message: 'Billing address has been saved.'
        })
      })
    }
  } else if (shippingChanged) {
    addressDict = Object.assign({}, shippingAddress)
    addressDict['isBilling'] = false
    addressDict['isShipping'] = true
    callSaveAddress(shippingAddress.id, addressDict, ({data}) => {
      // this.shippingAddressChanged = false
      store.commit(types.SET_SHIPPING_ADDRESS_ID, data.saveAddress.address.id)
      store.dispatch('addAlert', {
        message: 'Shipping address has been saved.'
      })
    })
  } else if (billingChanged) {
    addressDict = Object.assign({}, billingAddress)
    addressDict['isShipping'] = false
    addressDict['isBilling'] = true
    addressId = billingAddress.id !== shippingAddress.id ? billingAddress.id : undefined
    callSaveAddress(addressId, addressDict, ({data}) => {
      // this.billingAddressChanged = false
      store.commit(types.SET_BILLING_ADDRESS_ID, data.saveAddress.address.id)
      store.dispatch('addAlert', {
        message: 'Billing address has been saved.'
      })
    })
  }
  // store.commit(types.SET_SHIPPING_ADDRESS_CONFIRMED)
})

export const validateAddress = (store, args) => new Promise((resolve, reject) => {
  let address = args.address
  let addressType = args.type
  let valid = true

  let stateAddressValidation
  switch (addressType) {
    case 'billing':
      stateAddressValidation = store.state.checkout.billing.validation
      break
    case 'shipping':
      stateAddressValidation = store.state.checkout.shipping.validation
      break
  }

  if (stateAddressValidation) {
    if (!address.firstName || address.firstName.length === 0) {
      stateAddressValidation.firstName = 'Required field'
      valid = false
    } else {
      stateAddressValidation.firstName = ''
    }

    if (!address.lastName || address.lastName.length === 0) {
      stateAddressValidation.lastName = 'Required field'
      valid = false
    } else {
      stateAddressValidation.lastName = ''
    }

    if (!address.street || address.street.length === 0) {
      stateAddressValidation.street = 'Required field'
      valid = false
    } else {
      stateAddressValidation.street = ''
    }

    if (!address.number || address.number.length === 0) {
      stateAddressValidation.number = 'Required field'
      valid = false
    } else {
      stateAddressValidation.number = ''
    }

    if (!address.zip || address.zip.length === 0) {
      stateAddressValidation.zip = 'Required field'
      valid = false
    } else {
      stateAddressValidation.zip = ''
    }

    if (!address.city || address.city.length === 0) {
      stateAddressValidation.city = 'Required field'
      valid = false
    } else {
      stateAddressValidation.city = ''
    }

    if (!address.country || address.country.length === 0) {
      stateAddressValidation.country = 'Required field'
      valid = false
    } else {
      stateAddressValidation.country = ''
    }
    resolve(valid)
  }
})

export const saveChart = ({commit}, args) => new Promise((resolve, reject) => {
  apolloClient.mutate({
    mutation: gql`mutation ($charts: JSONString!, $artistId: Int) {
        saveCharts(charts: $charts, artistId: $artistId) {
            ok
        }
    }`,
    variables: {
      charts: args.charts,
      artistId: args.artistId
    }
  }).then(({data}) => {
    addCartAlertMessage('Charts were successfully saved.', 'info')
    resolve(data)
  }).catch((err) => {
    for (var i = 0; i < err.graphQLErrors.length; i++) {
      commit(types.ADD_ALERT, {
        message: err.graphQLErrors[0].message,
        level: 'error'
      })
    }
  })
})

export const cancelOrder = ({commit, dispatch}, args) => new Promise((resolve, reject) => {
  apolloClient.mutate({
    mutation: gql`mutation ($orderId: ID!) {
        cancelOrder(orderId: $orderId) {
            cart {
                ...OyeCart
            }
        }
    }
    ${oyeCart}
    `,
    variables: {
      orderId: args.id
    }
  }).then(
    ({data}) => {
      commit(types.SET_UNPAID_ORDER, null)
      dispatch('setCart', {cart: data.cancelOrder.cart})
      commit(types.SET_CURRENT_CHECKOUT_STATE, 4)
      resolve()
    }
  )
})

export const setCart = ({commit}, args) => new Promise((resolve, reject) => {
  var cart = args.cart
  commit(types.SET_CART, cart)
  if (cart && cart.shippingOptions) {
    let options = cart.shippingOptions.options
    commit(types.SET_SHIPPING_OPTIONS, options)
    if (options.length > 0) {
      commit(types.SET_SHIPPING_OPTION, options[0])
    }
    commit(types.SET_VAT_EXCLUDED, cart.shippingOptions.isVatExcluded)
  }
})

export const emailValidation = ({commit}, args) => new Promise((resolve, reject) => {
  resolve(runEmailValidation(args.email, commit))
})

export const passwordValidation = ({commit}, args) => new Promise((resolve, reject) => {
  resolve(runPasswordValidation(commit, args.password, args.passwordConfirm))
})

export const getCountries = ({commit, state}, args) => new Promise((resolve, reject) => {
  if (!state.countries) {
    apolloClient.query({
      query: gql`query Country {
          countries {
              name
          }
      }
      `
    }).then(({data}) => {
      commit(types.SET_COUNTRIES, data.countries)
      resolve(data.coutries)
    })
  } else {
    resolve(state.countries)
  }
})

export const removeBackOrder = ({commit, state}, args) => new Promise((resolve, reject) => {
  apolloClient.mutate({
    mutation: gql`mutation RemoveBackOrder($id: ID!, $orderType: String!) {
        removeBackorder(id: $id, orderType: $orderType) {
            ok
        }
    }`,
    variables: {
      id: args.pk,
      orderType: args.type
    }
  }).then((response) => {
    commit(types.ADD_ALERT, {
      message: 'Deleted back order item'
    })
    resolve(response.data.removeBackorder)
  })
})

export const removeReservation = ({commit, state}, args) => new Promise((resolve, reject) => {
  apolloClient.mutate({
    mutation: gql`mutation RemoveReservation($id: ID!) {
        removeReservation(id: $id) {
            ok
        }
    }`,
    variables: {
      id: args.pk
    }
  }).then((response) => {
    commit(types.ADD_ALERT, {
      message: 'Deleted reservation'
    })
    resolve(response.data.removeReservation)
  })
})

export const subscribeNewsletter = ({commit}, args) => new Promise((resolve, reject) => {
  apolloClient.mutate({
    mutation: gql`mutation ($email: String!) {
        registerNewsletter(email: $email) {
            ok
        }
    }`,
    variables: {
      email: args.email
    }
  }).then(
    ({data}) => {
      resolve(data.registerNewsletter.ok)
    }
  )
})

export const updateUser = ({commit, dispatch}, args) => new Promise((resolve, reject) => {
  apolloClient.mutate({
    mutation: gql`mutation UpdateUser($email: String) {
        updateUser(email: $email) {
            ok
        }
    }`,
    variables: args
  }).then(
    result => {
      if (result.data.updateUser.ok) {
        resolve(true)
        dispatch('addAlert', {
          message: 'Saved customer data'
        })
      }
    }
  )
})
