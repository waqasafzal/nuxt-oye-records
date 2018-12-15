/**
 * Created by tillkolter on 26/04/17.
 */

import store from '../../store'

export const addCartAlertMessage = function(
  message,
  level,
  showCart,
  timeout = 2000
) {
  var buttons = []
  if (showCart) {
    buttons.push({
      title: 'View Cart',
      route: {
        name: 'cart'
      }
    })
  }
  store
    .dispatch('addAlert', {
      message: message,
      level: level,
      buttons: buttons,
      timeout: timeout
    })
    .then(data => {})
}
