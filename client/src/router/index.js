import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import ProfilePage from '@/components/ProfilePage'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home/:username',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: ProfilePage
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    }
  ]
})
