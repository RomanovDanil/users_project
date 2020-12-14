import Vue from 'vue'
import VueRouter from 'vue-router'
//components
import Registration from '@/components/pages/registration/registration'
import Login from '@/components/pages/login/login'
import Profile from '@/components/pages/profile/profile'

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
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authRequired = to.path != '/registration' && to.path != '/login';
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
