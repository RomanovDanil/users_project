export default {
    actions:{
        GET_COUNTRIES: (context) => {
            const {data} = Axios.get(`http://${window.location.hostname}:5000/api/country/get`);
            if (data.status == 200) {
                context.commit('SET_COUNTRIES', payroad)
            } else {
                console.log('Error with a load countries')
            }
        }
    },
    mutations:{
        SET_COUNTRIES: (state, countries) => {
            state.countries = countries
        }
    },
    state:{
        countries: []
    },
    getters:{
        COUNTRIES: state => {
            return state.countries
        }
    }
}