import Vue from 'vue'
import store from '@/plugins/vuex'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'
import VueCookie from 'vue-cookie'

Vue.use(VueCookie)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
