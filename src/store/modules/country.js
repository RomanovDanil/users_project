import CountryService from "@/services/country_service";

export default {
  actions: {
    getCountries: async (context) => {
      return await CountryService.get().then(
        (data) => {
          console.log(data);
          context.commit("SET_COUNTRIES", data.countries);
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
  mutations: {
    SET_COUNTRIES: (state, countries) => {
      state.countries = countries;
    },
  },
  state: {
    countries: [],
  },
  getters: {
    countries: (state) => {
      return state.countries;
    },
  },
};
