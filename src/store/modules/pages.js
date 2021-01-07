export default {
  namespaced: true,
  state: {
    page_name: "",
  },
  actions: {
    setPageName: async (context, page_name) => {
      context.commit("setPageName", page_name);
    },
  },
  mutations: {
    setPageName(state, page_name) {
      state.page_name = page_name;
    },
  },
  getters: {
    pageName: (state) => {
      return state.page_name;
    },
  },
};
