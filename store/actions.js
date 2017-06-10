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
  let release = args.release
  let quantity = args.quantity
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
      preorder: args.preorder
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
  }).catch(er => reject(er))
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

export const getProfile = ({commit}, args) => new Promise((resolve, reject) => {
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
        commit(types.SET_USER_SHIPPING_ADDRESSES, {
          shippingAddresses: profile.shippingAddresses
        })
      }
      if (profile.billingAddresses && profile.billingAddresses.length > 0) {
        commit(types.SET_USER_BILLING_ADDRESSES, {
          billingAddresses: profile.billingAddresses
        })
      }
      if (profile.paymentMethods && profile.paymentMethods.length > 0) {
        commit(types.SET_USER_PAYMENT_METHODS, {
          paymentMethods: profile.paymentMethods
        })
      }
      if (profile.unpaidOrder) {
        commit(types.SET_UNPAID_ORDER, profile.unpaidOrder)
      }
    }
  })
})

export const enterCheckout = (store, args) => new Promise((resolve, reject) => {
  store.dispatch('getProfile', args)
  store.commit(types.ENTER_CHECKOUT)
})
