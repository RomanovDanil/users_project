import Axios from 'axios'

//адрес api
const UsersAPI = `http://localhost:5000`

class CountryService{
    get(){
        return Axios
            .get(`${UsersAPI}/api/country/get`)
            .then(responce => {
                return {
                    status:true, 
                    countries: responce.data.countries
                }
            })
            .catch(responce => {
                console.log(responce)
                return {
                    status:false, 
                    data: responce.data
                }
            })
    } 
}

export default new CountryService()
