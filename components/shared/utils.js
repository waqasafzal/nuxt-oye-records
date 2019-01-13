/**
 * Created by tillkolter on 26/04/17.
 */

// import store from '../../store'

export const addCartAlertMessage = function(
  dispatch,
  message,
  level,
  showCart,
  timeout = 2000
) {
  const buttons = []
  if (showCart) {
    buttons.push({
      title: 'View Cart',
      route: {
        name: 'cart'
      }
    })
  }
  dispatch('addAlert', {
      message: message,
      level: level,
      buttons: buttons,
      timeout: timeout
    })
    .then(data => {})
}
