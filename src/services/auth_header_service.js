export default {
  authHeader() {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user && user.accessToken) {
      return { "x-access-token": user.token };
    } else {
      return {};
    }
  },
  authHeadersWithImage() {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user && user.accessToken) {
      return {
        "x-access-token": user.token,
        "Content-Type": "multipart/form-data",
      };
    } else {
      return {};
    }
  },
};
