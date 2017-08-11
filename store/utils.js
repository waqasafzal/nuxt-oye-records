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
      address: getInitialAddress(),
      changed: false,
      confirmed: false,
      option: null,
      validation: getInitialAddress()
    },
    billing: {
      address: getInitialAddress(),
      changed: false,
      validation: getInitialAddress()
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
    focussedInput: null,
    isVatExcluded: false,
    vat: 19.0
  }
}

export const getInitialUserForm = function () {
  return {
    name: null,
    firstName: null,
    lastName: null,
    password: null,
    passwordConfirmation: null,
    email: null
  }
}

export const getInitialAddress = function () {
  return {
    firstName: '',
    lastName: '',
    street: '',
    number: '',
    zip: '',
    city: '',
    country: ''
  }
}
