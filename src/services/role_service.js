import Axios from "axios";

//адрес api
const UsersAPI = `http://localhost:5000`;

class RoleService {
  get(currentUser) {
    return Axios.get(`${UsersAPI}/api/role/get`, {
      headers: {
        Authorization: "Bearer " + currentUser.token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
}

export default new RoleService();
