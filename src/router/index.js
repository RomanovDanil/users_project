import Vue from "vue";
import VueRouter from "vue-router";
//components
import Registration from "@/components/pages/registration/registration";
import Login from "@/components/pages/login/login";
import Profile from "@/components/pages/profile/profile";
import Event from "@/components/pages/event/event";
import ChangeProfileInformation from "@/components/pages/profile/changeProfileInformation";
import ChangePassword from "@/components/pages/profile/changePassword";
import SetPin from "@/components/pages/profile/setPin";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/registration",
      name: "Registration",
      component: Registration,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
    },
    {
      path: "/event",
      name: "Event",
      component: Event,
    },
    {
      path: "/profile/changeProfileInformation",
      name: "ChangeProfileInformation",
      component: ChangeProfileInformation,
    },
    {
      path: "/profile/changePassword",
      name: "ChangePassword",
      component: ChangePassword,
    },
    {
      path: "/profile/setPin",
      name: "SetPin",
      component: SetPin,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authRequired = to.path != "/registration" && to.path != "/login";
  const loggedIn = localStorage.getItem("user");

  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    if (to.path == "/") {
      next("/event");
    }
    next();
  }
});

export default router;
