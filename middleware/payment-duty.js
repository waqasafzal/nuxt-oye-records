
export default function (context) {
  // If nuxt generate, pass this middleware
  if (context.route.name === 'checkout') return
  if (context.isServer) return
  let unpaidOrder = context.store.getters.getUnpaidOrder
  if (unpaidOrder) {
    context.redirect('/checkout')
  }
}
