import axios from "axios";
const UsersAPI = `http://localhost:5000/api`;
class UserService {
  setPIN(user, pin) {
    return axios
      .post(
        UsersAPI + "/user/setPIN",
        {
          pin,
          userDataId: user.userData._id,
        },
        {
          headers: { Authorization: "Bearer " + user.token },
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      )
      .then((response) => {
        if (response.data) {
          user.userData.pin = pin;
          localStorage.setItem("user", JSON.stringify(user));
        }
        return Promise.resolve(response.data);
      });
  }

  updateUserData(
    currentUser,
    firstName,
    secondName,
    thirdName,
    countryId,
    about
  ) {
    return axios
      .post(
        UsersAPI + "/user/updateUserData",
        {
          firstName,
          secondName,
          thirdName,
          countryId,
          about,
          userDataId: currentUser.userData._id,
        },
        {
          headers: { Authorization: "Bearer " + currentUser.token },
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      )
      .then((response) => {
        if (response.data.userData) {
          currentUser.userData = response.data.userData;
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
        return Promise.resolve(response.data);
      });
  }

  uploadImage(currentUser, imageBase64) {
    return axios
      .post(
        UsersAPI + "/user/uploadImage",
        {
          userDataId: currentUser.userData._id,
          imageBase64: imageBase64,
        },
        {
          headers: {
            Authorization: "Bearer " + currentUser.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.image) {
          currentUser.userData.image = response.data.image;
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
        return Promise.resolve(response.data);
      });
  }

  deleteImage(currentUser) {
    return axios
      .post(
        UsersAPI + "/user/deleteImage",
        {
          userDataId: currentUser.userData._id,
        },
        {
          headers: {
            Authorization: "Bearer " + currentUser.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status) {
          currentUser.userData.image = "";
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
        return Promise.resolve(response.data);
      });
  }

  updatePassword(
    currentUser,
    currentPassword,
    newPassword,
    newPasswordConfirmation
  ) {
    return axios.put(
      UsersAPI + "/user/updatePassword",
      {
        currentPassword,
        newPassword,
        newPasswordConfirmation,
        _id: user.id,
      },
      {
        headers: {
          Authorization: "Bearer " + currentUser.token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  //for admin
  getAll(currentUser) {
    return axios.get(UsersAPI + "/user/getAll", {
      headers: {
        Authorization: "Bearer " + currentUser.token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  getById(currentUser, userId) {
    return axios.get(UsersAPI + "/user/getById", {
      headers: {
        Authorization: "Bearer " + currentUser.token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      params: { userId: userId },
    });
  }

  create(currentUser, userData) {
    return axios.post(UsersAPI + "/user/create", userData, {
      headers: {
        Authorization: "Bearer " + currentUser.token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
}

export default new UserService();
