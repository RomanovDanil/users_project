import axios from "axios";
const UsersAPI = `http://localhost:5000/api`;
class UserService {
  setPIN(user, PIN) {
    return axios.post(UsersAPI + "/user/setPIN", {
      headers: { Authorization: "Bearer " + user.token },
      PIN,
      _id,
    });
  }

  updateUserData(user) {
    return axios
      .post(UsersAPI + "/user/updateUserData", {
        headers: { Authorization: "Bearer " + user.token },
        newUserData: user.userData,
        userDataId: user.userData._id,
      })
      .then((response) => {
        user.userData = response.data.userData;
        localStorage.setItem("user", JSON.stringify(user));
        return Promise.resolve(response.data);
      })
      .catch(({ response: { data } }) => {
        return Promise.reject(data);
      });
  }

  uploadImage(user, data) {
    return axios
      .post(UsersAPI + "/user/uploadImage", {
        headers: {
          Authorization: "Bearer " + user.token,
          "Content-Type": "multipart/form-data",
        },
        data,
        userDataId: user.userData.id,
      })
      .then((response) => {
        user.userData.image = response.data.imagePath;
        localStorage.setItem("user", JSON.stringify(user));
        return Promise.resolve(response.data);
      })
      .catch(({ response: { data } }) => {
        return Promise.reject(data);
      });
  }

  deleteImage(_id) {
    return axios.post(UsersAPI + "/user/deleteImage", {
      headers: { Authorization: "Bearer " + user.token },
      _id,
    });
  }

  updatePassword(user, currentPassword, newPassword, repeat_newPassword) {
    return axios.put(
      UsersAPI + "/user/updatePassword",
      {
        currentPassword,
        newPassword,
        repeat_newPassword,
        _id: user.id,
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );
  }
}

export default new UserService();
