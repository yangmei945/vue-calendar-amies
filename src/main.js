import Vue from 'vue'
import App from './App.vue'
import vueCalendarAmies from './lib/index.js'
Vue.use(vueCalendarAmies)

new Vue({
  el: '#app',
  render: h => h(App)
})
