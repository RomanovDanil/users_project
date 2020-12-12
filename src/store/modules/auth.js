import AuthService from '@/services/auth_service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    LOGIN: async (context, user) => {
      return await AuthService.login(user).then(
        user => {
            context.commit('loginSuccess', user);
            return Promise.resolve(user);
        },
        error => {
            context.commit('loginFailure');
            return Promise.reject(error);
        }
      );
    },
    LOGOUT: (context) => {
        AuthService.logout();
        context.commit('logout');
    },
    REGISTRATE: async (context, user) => {
      return await AuthService.register(user).then(
        response => {
            context.commit('registerSuccess');
            return Promise.resolve(response.data);
        },
        error => {
            context.commit('registerFailure');
            return Promise.reject(error);
        }
      );
    }
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
    }
  },
  getters: {
    LOGGEDIN: state => {
      return state.initialState.status
    }
  }
}