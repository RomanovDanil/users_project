import CountryService from "@/services/country_service";

export default {
  namespaced: true,
  actions: {
    getCountries: async (context) => {
      return await CountryService.get().then(
        (data) => {
          return Promise.resolve(data.countries);
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
};
