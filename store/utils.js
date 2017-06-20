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
      changed: false,
      confirmed: false,
      option: null
    },
    billing: {
      address: null,
      changed: false
    },
    payment: {
      option: null,
      options: null,
      method: null,
      confirmed: false
    },
    unpaidOrder: null,
    guest: null,
    checkoutState: null,
    register: false,
    focussedInput: null
  }
}

export const getInitialUserForm = function () {
  return {
    name: null,
    password: null,
    passwordConfirmation: null,
    email: null
  }
}

