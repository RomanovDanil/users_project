import CountryService from '@/services/country_service';

export default {
    actions:{
        getCountries: async (context) => {
            return await CountryService.get().then(
                data => {
                    console.log(data)
                    context.commit('SET_COUNTRIES', data.countries);
                    context.commit('SET_DEFAULT_COUNTRY');
                },
                error => {
                    console.log(error)
                }
            );
        }
    },
    mutations:{
        SET_COUNTRIES: (state, countries) => {
            state.countries = countries
        },
        SET_DEFAULT_COUNTRY: (state) => {
            state.country = state.countries[0]
        }
    },
    state:{
        countries: [],
        country:{}
    },
    getters:{
        countries: state => {
            return state.countries
        },
        country: state => {
            return state.country
        }
    }
}