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
import { callArtistSearchQuery, callReleaseSearchQuery } from '../components/search/queries'
import { addressFragment } from '~/components/graphql/user'
import { cardDataFragment } from '../components/graphql/payments'
import { validateEmail } from '../utils/forms'
import { setToken } from '../utils/auth/index'
import { addressEquals } from '../utils/address'
import { callSaveAddress } from '../components/graphql/user'

export const getCart = ({commit}) => new Promise((resolve, reject) => {
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
    commit(types.SET_CART, cart)
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

export const addToCart = ({commit}, args) => new Promise((resolve, reject) => {
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

    const r = data && data.addToCart.cart
    Vue.cookie.set('cart', data.addToCart.cart.cookie, true)
    commit(types.SET_CART, r || null)
    return resolve(r)
  }).catch(er => reject(er))
})

export const updateCart = ({commit}, args) => new Promise((resolve, reject) => {
  commit(types.CART_UPDATING, true)
  let line = args.line
  let release = line.release
  let preorder = line.preorder
  let quantity = line.quantity
  apolloClient.mutate({
    mutation: gql`mutation ($releasePk: ID!, $quantity: Int! $preorder: Boolean) {
        updateCart(releasePk: $releasePk, quantity: $quantity, preorder: $preorder) {
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
      preorder: preorder
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

    const r = data && data.updateCart.cart
    Vue.cookie.set('cart', data.updateCart.cart.cookie, true)
    commit(types.SET_CART, r || null)
    return resolve(r)
  }).catch(er => {
    reject(er)
  })
})

export const removeCartLine = ({commit}, args) => new Promise((resolve, reject) => {
  apolloClient.mutate({
    mutation: gql`mutation ($releasePk: ID!, $preorder: Boolean) {
        removeRelease(releasePk: $releasePk, preorder: $preorder) {
            cart {
                ...OyeCart
            }
        }
    }
    ${oyeCart}`,
    variables: {
      releasePk: args.pk,
      preorder: args.preorder
    }
  }).then(({data}) => {
    addCartAlertMessage('Article successfully removed from cart.', 'info')

    const r = data && data.removeRelease.cart
    Vue.cookie.set('cart', data.removeRelease.cart.cookie, true)
    commit(types.SET_CART, r || null)
    return resolve(r)
  }).catch(er => reject(er))
})

export const playRelease = ({commit}, args) => new Promise((resolve, reject) => {
  var release = args.release
  if (release) {
    for (var i = 0; i < release.tracks.length; i++) {
      var track = release.tracks[i]
      if (i === 0) {
        commit(types.PLAY_TRACK, track)
        resolve(track)
      } else {
        commit(types.ADD_TRACK, track)
      }
    }
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
        let rearchResults = data.search
        commit(mutationType, {search: rearchResults, type: type})
        resolve({
          search: rearchResults
        })
        commit(types.DECREMENT_SEARCH_LOADING)
      }, () => {
        commit(types.DECREMENT_SEARCH_LOADING)
      })
    } else if (type === 'artists') {
      callArtistSearchQuery(query, args.size, ({data}) => {
        let rearchResults = data.search
        commit(mutationType, {search: rearchResults, type: type})
        resolve({
          search: rearchResults
        })
        commit(types.DECREMENT_SEARCH_LOADING)
      }, () => {
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
                price
                porto
                paymentType
                shippingAddress {
                    country
                }
            }
        }
    }
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
      if (profile.unpaidOrder) {
        store.commit(types.SET_UNPAID_ORDER, profile.unpaidOrder)
        if (profile.unpaidOrder && profile.unpaidOrder.shippingAddress) {
          let country = profile.unpaidOrder.shippingAddress.country
          store.dispatch('setShippingCountry', {
            country: country
          })
          store.dispatch('getPaymentOptions', {
            country: country
          })
        }
      }
    }
  })
})

export const enterCheckout = (store, args) => new Promise((resolve, reject) => {
  store.dispatch('getProfile', args)
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
  if (!user.name) {
    commit(types.SET_USER_FORM_NAME_ERROR, 'Username should not be empty')
    ok = false
  } else {
    commit(types.SET_USER_FORM_NAME_ERROR, null)
  }

  let password = user.password
  if (!password || password.length < 8) {
    commit(types.SET_USER_FORM_PWD_ERROR, 'Password should have at least 8 characters')
    ok = false
  } else if (password.search(/[!#$%^&+=?]/) < 0 || password.search(/[0-9]/) < 0) {
    commit(types.SET_USER_FORM_PWD_ERROR, 'Password must contain at least one digit and one of these special chars: !#$%^&+=?')
    ok = false
  } else {
    commit(types.SET_USER_FORM_PWD_ERROR, null)
  }
  if (password && password !== user.passwordConfirm) {
    commit(types.SET_USER_FORM_PWD_CONFIRM_ERROR, 'Password confirmation does not match')
    ok = false
  } else {
    commit(types.SET_USER_FORM_PWD_CONFIRM_ERROR, null)
  }
  if (!user.email) {
    commit(types.SET_USER_FORM_EMAIL_ERROR, 'Email should not be empty')
    ok = false
  } else {
    var valid = validateEmail(user.email)
    if (!valid) {
      commit(types.SET_USER_FORM_EMAIL_ERROR, 'Email pattern is not valid')
      ok = false
    } else {
      commit(types.SET_USER_FORM_EMAIL_ERROR, null)
    }
  }
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
      console.log(data.registerUser.errorStatus)
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
    if (address.firstName.length === 0) {
      stateAddressValidation.firstName = 'Required field'
      valid = false
    } else {
      stateAddressValidation.firstName = ''
    }

    if (address.lastName.length === 0) {
      stateAddressValidation.lastName = 'Required field'
      valid = false
    } else {
      stateAddressValidation.lastName = ''
    }

    if (address.street.length === 0) {
      stateAddressValidation.street = 'Required field'
      valid = false
    } else {
      stateAddressValidation.street = ''
    }

    if (address.number.length === 0) {
      stateAddressValidation.number = 'Required field'
      valid = false
    } else {
      stateAddressValidation.number = ''
    }

    if (address.zip.length === 0) {
      stateAddressValidation.zip = 'Required field'
      valid = false
    } else {
      stateAddressValidation.zip = ''
    }

    if (address.city.length === 0) {
      stateAddressValidation.city = 'Required field'
      valid = false
    } else {
      stateAddressValidation.city = ''
    }

    if (address.country.length === 0) {
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
  }).catch((err) => {
    console.log(JSON.stringify(err))
    for (var i = 0; i < err.graphQLErrors.length; i++) {
      commit(types.ADD_ALERT, {
        message: err.graphQLErrors[0].message,
        level: 'error'
      })
    }
  })
})
