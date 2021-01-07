import AuthService from "@/services/auth_service";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

const roles = {
  // admin: {
  //   id: "5fc28e769dfae7123fcf8ee6",
  //   name: "Admin",
  // },
  expert: {
    id: "5fc28e859dfae7123fcf8ee7",
    name: "Expert",
  },
  competitor: {
    id: "5fc28e9f9dfae7123fcf8ee8",
    name: "Competitor",
  },
};

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login: async (context, user) => {
      return await AuthService.login(user).then(
        (user) => {
          console.log({ status: "success", user });
          context.commit("loginSuccess", user);
          return Promise.resolve(user);
        },
        (error) => {
          console.log(error);
          context.commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    logout: (context) => {
      AuthService.logout();
      context.commit("logout");
    },
    registrate: async (context, user) => {
      return await AuthService.registrate(user).then(
        (response) => {
          console.log("success");
          context.commit("registerSuccess");
          return Promise.resolve({ status: true });
        },
        (error) => {
          console.log(error);
          context.commit("registerFailure");
          return Promise.reject(error);
        }
      );
    },
  },

  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
  },

  getters: {
    loggedIn: (state) => {
      return state.status.loggedIn;
    },
    isAdmin: (state) => {
      return state.user.isAdmin;
    },
  },
};
