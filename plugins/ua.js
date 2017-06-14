import Vue from 'vue'
import VueAnalytics from 'vue-ua'
// const router = new VueRouter({routes, mode, linkActiveClass})

Vue.use(VueAnalytics)

export default ({ app, store }) => {
  app.ua = new VueAnalytics({
    appName: 'Oye Kolter', // Mandatory
    appVersion: '1.0', // Mandatory
    trackingId: 'UA-100941329-1', // Mandatory
    debug: true, // Whether or not display console logs debugs (optional)
    vueRouter: app.router // , // Pass the router instance to automatically sync with router (optional)
    // ignoredViews: ['homepage'], // If router, you can exclude some routes name (case insensitive) (optional)
    // globalDimensions: [ // Optional
    //   {dimension: 1, value: 'MyDimensionValue'},
    //   {dimension: 2, value: 'AnotherDimensionValue'}
    // ],
    // globalMetrics: [ // Optional
    //   {metric: 1, value: 'MyMetricValue'},
    //   {metric: 2, value: 'AnotherMetricValue'}
    // ]
  })
}
