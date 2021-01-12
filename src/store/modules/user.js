import UserService from "@/services/user_service";

const user = JSON.parse(localStorage.getItem("user"));

export default {
  namespaced: true,
  state: user,
  actions: {
    setPIN: async (context, payload) => {
      return await UserService.setPIN(payload.user, payload.pin).then(
        () => {
          return Promise.resolve({ status: true, message: "success" });
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },

    updatePassword: async (context, payload) => {
      return await UserService.updatePassword(
        payload.currentUser,
        payload.userId,
        payload.currentPassword,
        payload.newPassword,
        payload.newPasswordConfirmation
      ).then(
        () => {
          return Promise.resolve({ status: true, message: "success" });
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },

    updateUserData: async (context, payload) => {
      return await UserService.updateUserData(
        payload.currentUser,
        payload.firstName,
        payload.secondName,
        payload.thirdName,
        payload.countryId,
        payload.about
      ).then(
        () => {
          return Promise.resolve({ status: true, message: "success" });
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },

    uploadImage: async (context, payload) => {
      return await UserService.uploadImage(
        payload.currentUser,
        payload.imageBase64
      ).then(
        () => {
          return Promise.resolve({ status: true, message: "success" });
        },
        (error) => {
          console.log(error);
          return Promise.reject(data);
        }
      );
    },

    deleteImage: async (context, payload) => {
      return await UserService.deleteImage(payload.user).then(
        () => {
          return Promise.resolve({ status: true, message: "success" });
        },
        (error) => {
          console.log(error);
          return Promise.reject(error);
        }
      );
    },

    create: async (context, payload) => {
      return await UserService.create(
        payload.currentUser,
        payload.userData
      ).then(
        () => {
          return Promise.resolve({ status: true, message: "success" });
        },
        (error) => {
          //console.log(error);
          return Promise.reject(error);
        }
      );
    },

    delete: async (context, payload) => {
      return await UserService.delete(payload.currentUser, payload.userId).then(
        (responce) => {
          return Promise.resolve({ status: true, message: "success" });
        },
        (error) => {
          //console.log(error);
          return Promise.reject(error);
        }
      );
    },

    getById: async (context, payload) => {
      return await UserService.getById(
        payload.currentUser,
        payload.userId
      ).then(
        (response) => {
          return Promise.resolve(response.data);
        },
        (error) => {
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
      return state.initialState.status;
    },
  },
};
