import * as types from '../store/types'
export default function ({isServer, store}) {
  // If nuxt generate, pass this middleware
  if (isServer) return

  let unpaidOrder = store.getters.getUnpaidOrder
  if (!unpaidOrder) {
    let unpaid = window.localStorage.getItem('unpaid')
    if (unpaid) {
      store.commit(types.SET_UNPAID_ORDER, JSON.parse(unpaid))
    }
  }
}
