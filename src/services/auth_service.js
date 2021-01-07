import Axios from "axios";

//адрес api
const UsersAPI = `http://${window.location.hostname}:5000`;

class AuthService {
  registrate(user) {
    return Axios.post(`${UsersAPI}/api/auth/registrate`, user);
  }

  login(user) {
    return Axios.post(`${UsersAPI}/api/auth/login`, user).then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return Promise.resolve(response.data);
    });
  }

  logout() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();
