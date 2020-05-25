import Vue from 'vue'
import App from './App.vue'
import VueGoogleCharts from 'vue-google-charts'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import { routes } from './routes.js'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import vueCountryRegionSelect from 'vue-country-region-select'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueResource)
// Install BootstrapVue
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.use(VueGoogleCharts)

Vue.use(vueCountryRegionSelect)

Vue.use(VueRouter)

Vue.config.productionTip = false

const router = new VueRouter({
  routes,
  mode: 'history'
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
