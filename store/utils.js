export const getInitialUserProfile = function () {
  return {
    shipping: {
      options: null,
      addresses: []
    },
    billing: {
      addresses: []
    },
    orders: null,
    backOrders: null,
    availableOrders: null
  }
}

export const getInitialUser = function () {
  return {
    authenticated: false,
    artists: [],
    orders: null
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
      confirmed: false,
      paypalPaymentUrl: null
    },
    unpaidOrder: null,
    guest: null,
    guestEmail: null,
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
