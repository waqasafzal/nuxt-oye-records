export const getInitialUserProfile = function () {
  return {
    shipping: {
      options: null,
      addresses: []
    },
    billing: {
      addresses: []
    }
  }
}

export const getInitialUser = function () {
  return {
    authenticated: false,
    artists: []
  }
}

export const getInitialCheckout = function () {
  return {
    shipping: {
      address: null,
      confirmed: false,
      option: null
    },
    billing: {
      address: null
    },
    payment: {
      option: null,
      options: null,
      method: null,
      confirmed: false
    },
    unpaidOrder: null,
    guest: null,
    checkoutState: null
  }
}
