/**
 * Created by tillkolter on 26/04/17.
 */

import store from '../../store'

export const addCartAlertMessage = function (message, level, showCart) {
  var buttons = []
  if (showCart) {
    buttons.push({
      title: 'View Cart',
      route: {
        name: 'CartPage'
      }
    })
  }
  store.dispatch('addAlert', {
    message: message,
    level: level,
    buttons: buttons
  }).then(data => {
  })
}
