import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import ProfilePage from '@/components/ProfilePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: ProfilePage
    }
  ]
})
