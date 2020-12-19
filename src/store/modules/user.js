import UserService from "@/services/user_service";

const user = JSON.parse(localStorage.getItem("user"));

export default {
  namespaced: true,
  state: user,
  actions: {
    setPIN: async (context, user, pin) => {
      return await UserService.setPIN(user, pin)
        .then((data) => {
          return Promise.resolve({ status: true, message: "success" });
        })
        .catch((data) => {
          console.log(data);
          context.commit("PINSettedFailure");
          return Promise.reject(data);
        });
    },

    updatePassword: async (context, payload) => {
      return await UserService.updatePassword(
        payload.user,
        payload.currentPassword,
        payload.newPassword,
        payload.repeat_newPassword
      )
        .then(() => {
          return Promise.resolve({ status: true, message: "success" });
        })
        .catch(({ response: { data } }) => {
          return Promise.reject(data);
        });
    },

    updateUserData: async (context, user, newUserData) => {
      return await UserService.updateUserData(user, newUserData)
        .then((data) => {
          return Promise.resolve({ status: true, message: "success" });
        })
        .catch((data) => {
          console.log(data);
          return Promise.reject(data);
        });
    },

    uploadImage: async (context, user, image) => {
      return await UserService.uploadImage(user, image)
        .then((data) => {
          return Promise.resolve({ status: true, message: "success" });
        })
        .catch((data) => {
          console.log(data);
          return Promise.reject(data);
        });
    },

    deleteImage: async (context, user) => {
      return await UserService.deleteImage(user)
        .then((data) => {
          return Promise.resolve({ status: true, message: "success" });
        })
        .catch((data) => {
          console.log(data);
          return Promise.reject(data);
        });
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
      return state.initialState.status;
    },
  },
};
