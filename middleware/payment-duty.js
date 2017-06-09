
export default function (context) {
  // If nuxt generate, pass this middleware
  console.log('call for payment-duty')
  if (context.route.name === 'checkout') return
  // if (context.isServer) return
  let unpaidOrder = context.store.state.unpaidOrder
  console.log('unpaidOrder' + unpaidOrder)
  if (unpaidOrder) {
    context.redirect('/checkout')
  }
}
