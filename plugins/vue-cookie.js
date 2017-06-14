import Vue from 'vue'
import VueCookie from 'vue-cookie'

Vue.use(VueCookie)

export default ({app}) => {
  app.cookie = VueCookie
  Vue.cookie = VueCookie
}
