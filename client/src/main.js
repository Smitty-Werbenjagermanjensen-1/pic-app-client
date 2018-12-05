// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import GSignInButton from 'vue-google-signin-button'
Vue.use(GSignInButton)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  data: {
    userExists: false
  },
  methods: {
    authenticate(bool) {
      console.log("at the highest level: ", bool);
      this.userExists = bool;
    }
  },
  template: '<App :userExists="userExists" @userexists="authenticate"/>'
})
