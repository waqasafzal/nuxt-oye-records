/**
 * Created by tillkolter on 18/03/17.
 */

import VueCookie from 'vue-cookie'

export default {
  name: 'DjangoCsrfToken',
  install: function (Vue) {
    Vue.use(VueCookie)
    var csrfToken = Vue.cookie.get('csrftoken')

    Vue.component('django-csrf-token', {
      template: '<input type="hidden" name="csrfmiddlewaretoken" :value="csrfToken"/>',
      data: function () {
        return {
          csrfToken: csrfToken
        }
      }
    })
  }
}
