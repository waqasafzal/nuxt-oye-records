
import Vue from 'vue'

import RavenVue from 'raven-js/plugins/vue'

console.log('installing sentry')

let Raven
if (process.browser) {
  Raven = require('raven-js')
  Raven
    .config('https://d6a8cd5c76354c0f901e5cc2084509f0@sentry.kolter.it/2')
    .addPlugin(RavenVue, Vue)
    .install()
} else {
  Raven = require('raven')
  Raven.config('https://d6a8cd5c76354c0f901e5cc2084509f0@sentry.kolter.it/2')
}

export default Raven
