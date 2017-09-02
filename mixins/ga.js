/* eslint-disable no-undef */

export default {
  methods: {
    trackEvent (category, action = null, label = null, value = null) {
      if (process.browser) {
        ga('send', 'event', category, action, label, value)
      }
    }
  }
}
