
export default function (context) {
  // If nuxt generate, pass this middleware
  if (context.route.name === 'checkout') return
  if (context.isServer) return
  const unpaidOrder = context.store.state.unpaidOrder
  if (unpaidOrder) {
    context.redirect('/checkout')
  }
}
