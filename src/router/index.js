import Vue from "vue";
import VueRouter from "vue-router";

//auth views
import Registration from "@/views/auth/registration";
import Login from "@/views/auth/login";
//users views
import Profile from "@/views/user/profile/profile";
import UpdateProfileInformation from "@/views/user/profile/updateProfileInformation";
import UpdatePassword from "@/views/user/profile/updatePassword";
import UserEvent from "@/views/user/user_event/userEvent";
import UserDocument from "@/views/user/user_event/userDocument";
import SetPin from "@/views/user/profile/setPin";
//admin views
import Home from "@/views/admin/home";
import UsersBrowse from "@/views/admin/users/browse";
import UsersCreate from "@/views/admin/users/create";
import User from "@/views/admin/users/user";
import Events from "@/views/admin/events/browse";
import EventsAssign from "@/views/admin/events/assign";
import Event from "@/views/admin/events/event";
import EventCreate from "@/views/admin/events/create";
import DocumentsBrowse from "@/views/admin/documents/browse";
import Document from "@/views/admin/documents/document";
import DocumentsCreate from "@/views/admin/documents/create";
import DocumentsDownload from "@/views/admin/documents/download";
//vuex store
import store from "@/plugins/vuex";
//middleware
import guest from "./middleware/guest";
import auth from "./middleware/auth";
import isAdmin from "./middleware/isAdmin";
import isUser from "./middleware/isUser";
import middlewarePipeline from "./middlewarePipeline";

Vue.use(VueRouter);

let routes = [
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
    meta: {
      middleware: [guest],
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      middleware: [guest],
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      middleware: [auth],
    },
  },
  {
    path: "/profile/updateProfileInformation",
    name: "UpdateProfileInformation",
    component: UpdateProfileInformation,
    meta: {
      middleware: [auth],
    },
  },
  {
    path: "/profile/updatePassword",
    name: "UpdatePassword",
    component: UpdatePassword,
    meta: {
      middleware: [auth],
    },
  },
  {
    path: "/user_event",
    name: "UserEvent",
    component: UserEvent,
    meta: {
      middleware: [auth, isUser],
    },
  },
  {
    path: "/user_event/documents/:documentId",
    name: "UserEvent.Document",
    component: UserDocument,
    props: true,
    meta: {
      middleware: [auth, isUser],
    },
  },
  {
    path: "/profile/setPin",
    name: "SetPin",
    component: SetPin,
    meta: {
      middleware: [auth, isUser],
    },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      middleware: [auth, isAdmin],
    },
  },
  {
    path: "/",
    redirect: (to) => {
      if (store.getters["auth/loggedIn"]) {
        if (store.getters["auth/isAdmin"]) {
          return "/home";
        } else {
          return "/user_event";
        }
      }
      return "/login";
    },
  },
  //events
  {
    path: "/events",
    name: "Events",
    component: Events,
    meta: {
      middleware: [auth, isAdmin],
    },
    children: [],
  },
  {
    path: "/events/event/:eventId",
    name: "Events.Event",
    component: Event,
    props: true,
    meta: {
      middleware: [auth, isAdmin],
    },
  },
  {
    path: "/events/create",
    name: "Events.Create",
    component: EventCreate,
    meta: {
      middleware: [auth, isAdmin],
    },
  },
  {
    path: "/events/assign",
    name: "Events.Assign",
    component: EventsAssign,
    meta: {
      middleware: [auth, isAdmin],
    },
  },
  //users
  {
    path: "/users",
    name: "Users",
    component: UsersBrowse,
    meta: {
      middleware: [auth, isAdmin],
    },
    children: [],
  },
  {
    path: "/users/create",
    name: "Users.Create",
    component: UsersCreate,
    meta: {
      middleware: [auth, isAdmin],
    },
  },
  {
    path: "/users/user/:userId",
    name: "Users.User",
    component: User,
    props: true,
    meta: {
      middleware: [auth, isAdmin],
    },
  },
  //documents
  {
    path: "/documents",
    name: "DocumentsBrowse",
    component: DocumentsBrowse,
    meta: {
      middleware: [auth, isAdmin],
    },
    children: [],
  },
  {
    path: "/documents/document/:documentId",
    name: "Documents.Document",
    component: Document,
    meta: {
      middleware: [auth, isAdmin],
    },
    props: true,
    children: [],
  },
  {
    path: "/documents/create",
    name: "DocumentsCreate",
    component: DocumentsCreate,
    props: true,
    meta: {
      middleware: [auth, isAdmin],
    },
  },
  {
    path: "/documents/download",
    name: "DocumentsDownload",
    component: DocumentsDownload,
    meta: {
      middleware: [auth, isAdmin],
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next();
  }

  const middleware = to.meta.middleware;
  const context = {
    to,
    from,
    next,
    store,
  };

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  });
});

export default router;
