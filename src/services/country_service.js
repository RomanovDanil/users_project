import Axios from "axios";

//адрес api
const UsersAPI = `http://localhost:5000`;

class CountryService {
  get() {
    return Axios.get(`${UsersAPI}/api/country/get`).then((responce) => {
      return Promise.resolve(responce.data);
    });
  }
}

export default new CountryService();
