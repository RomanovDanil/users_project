export default function isAdmin({ next, store }) {
  if (store.getters["auth/isAdmin"]) {
    return next();
  }
  return next("/user_event");
}
