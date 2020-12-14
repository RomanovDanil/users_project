import AuthService from '@/services/auth_service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login: async (context, user) => {
      return await AuthService.login(user)
      // .then(
      //   user => {
      //       context.commit('loginSuccess', user);
      //       return Promise.resolve(user);
      //   },
      //   error => {
      //       context.commit('loginFailure');
      //       return Promise.reject(error);
      //   }
      // )
      .then(data => {
            console.log({status:"success", data})
            context.commit('loginSuccess', data);
            return Promise.resolve(data);
        }
      )
      .catch(data => {
            console.log(data)
            context.commit('loginFailure');
            return Promise.reject(data);
        }
      )
    },
    logout: (context) => {
        AuthService.logout();
        context.commit('logout');
    },
    registrate: async (context, user) => {
      return await AuthService.registrate(user)
      .then(response => {
            console.log("success")
            context.commit('registerSuccess');
            return Promise.resolve(response.data);
        }
      )
      .catch(({response: {data}}) => {
            console.log(data)
            context.commit('registerFailure');
            return Promise.reject(data);
        }
      )
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
    loggedIn: state => {
      return state.initialState.status
    }
  }
}