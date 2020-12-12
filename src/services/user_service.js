import axios from 'axios';
import authHeader from './auth_header';

const UsersAPI = `http://${window.location.hostname}:5000`

class UserService {
  getPublicContent() {
    return axios.get(UsersAPI + '/all');
  }

  getUserBoard() {
    return axios.get(UsersAPI + '/user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(UsersAPI + '/mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(UsersAPI + '/admin', { headers: authHeader() });
  }
}

export default new UserService();