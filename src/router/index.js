import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Terms from '@/views/Terms'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/terms',
      name: 'Terms',
      component: Terms
    }
  ]
})
