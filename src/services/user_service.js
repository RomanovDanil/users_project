import axios from "axios";
import authHeader from "./auth_header";

const UsersAPI = `http://${window.location.hostname}:5000`;

class UserService {
  getPublicContent() {
    return axios.get(UsersAPI + "/all");
  }

  getUserBoard() {
    return axios.get(UsersAPI + "/user", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(UsersAPI + "/mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(UsersAPI + "/admin", { headers: authHeader() });
  }

  setPIN(PIN) {
    return axios.post(UsersAPI + "/user/setPIN", {
      headers: authHeader(),
      PIN: PIN,
    });
  }

  updateUserData(userData) {
    return axios.post(UsersAPI + "/user/updateUserData", {
      headers: authHeader(),
      userData,
    });
  }

  uploadImage(image) {
    return axios.post(UsersAPI + "/user/uploadImage", {
      headers: authHeader(),
      image,
    });
  }

  deleteImage() {
    return axios.post(UsersAPI + "/user/deleteImage", {
      headers: authHeader(),
    });
  }

  updatePassword(currentPassword, newPassword, repeat_newPassword) {
    return axios.post(UsersAPI + "/user/updatePassword", {
      headers: authHeader(),
      currentPassword,
      newPassword,
      repeat_newPassword,
    });
  }
}

export default new UserService();
