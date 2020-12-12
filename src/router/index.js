import Vue from 'vue'
import VueRouter from 'vue-router'
//components
import Registration from '@/components/pages/registration/registration'
import Login from '@/components/pages/login/login'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/registration',
      name: 'Registration',
      component: Registration
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    next()
  } else {
    router.push('/login')
  }
})

export default router
