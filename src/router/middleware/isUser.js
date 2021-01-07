export default function isUser({ next, store }) {
  if (store.getters["auth/isAdmin"]) {
    return next("/home");
  }
  return next();
}
