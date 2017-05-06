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
import { callReleaseSearchQuery } from '../components/search/queries'

// const apolloClient = Apollo.defaultClient

export const getCart = ({commit}) => new Promise((resolve, reject) => {
  apolloClient.query({
    query: gql`query OyeCart {
        cart {
            ...OyeCart
        }
    },
    ${oyeCart}`
  })
  .then(({data}) => {
    if (data.cart.cookie) {
      Vue.cookie.set('cart', data.cart.cookie, true)
    }
    commit(types.SET_CART, data.cart)
    const r = data && data.cart
    commit(types.SET_CART, r || null)
    return resolve(r)
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
      commit(types.SET_SEARCH_LOADING)
      callReleaseSearchQuery(query, args.size, args.page || 1, ({data}) => {
        let rearchResults = data.search
        commit(mutationType, {search: rearchResults, type: type})
        resolve({
          search: rearchResults
        })
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
  commit(types.SET_QUERY, query)
})
