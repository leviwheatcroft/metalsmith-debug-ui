require('./styles/index.css')
const Vue = require('vue')
const { default: App } = require('./components/App')

new Vue({
  render (h) { return h(App) }
}).$mount('#app')
