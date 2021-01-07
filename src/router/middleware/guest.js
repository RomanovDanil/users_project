export default function guest({ next, store }) {
  if (store.getters["auth/loggedIn"]) {
    if (store.getters["auth/isAdmin"]) {
      return next("/home");
    } else {
      return next("/user_event");
    }
  }
  return next();
}
