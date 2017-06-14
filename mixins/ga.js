/* eslint-disable no-undef */

export default {
  methods: {
    trackEvent (category, action = null, label = null, value = null) {
      // if (!window['ga']) {
      //   console.warn('google analytics is not available')
      //   return
      // }
      ga('send', 'event', category, action, label, value)
    }
  }
}
