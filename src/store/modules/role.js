import RoleService from "@/services/role_service";

export default {
  namespaced: true,
  actions: {
    get: async (context, payload) => {
      return await RoleService.get(payload.currentUser).then(
        (response) => {
          return Promise.resolve(response.data);
        },
        (error) => {
          //console.log(error);
          return Promise.reject(error);
        }
      );
    },
  },
};
