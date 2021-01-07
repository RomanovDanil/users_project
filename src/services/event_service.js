import Axios from "axios";

//адрес api
const UsersAPI = `http://${window.location.hostname}:5000`;

class EventService {
  getUserEvent(currentUser, userId) {
    return Axios.get(`${UsersAPI}/api/event/getByUserId`, {
      headers: { Authorization: "Bearer " + currentUser.token },
      params: { userId: userId },
    });
  }

  getCurrentEvent(currentUser, eventId) {
    return Axios.get(`${UsersAPI}/api/event/getById`, {
      headers: { Authorization: "Bearer " + currentUser.token },
      params: { eventId: eventId },
    });
  }

  getAll(currentUser) {
    return Axios.get(`${UsersAPI}/api/event/getAll`, {
      headers: { Authorization: "Bearer " + currentUser.token },
    });
  }

  getAllWithDocuments(currentUser) {
    return Axios.get(`${UsersAPI}/api/event/getAllWithDocuments`, {
      headers: { Authorization: "Bearer " + currentUser.token },
    });
  }

  getAssignedUsers(currentUser) {
    return Axios.get(`${UsersAPI}/api/event/getAssignedUsers`, {
      headers: { Authorization: "Bearer " + currentUser.token },
    });
  }

  assignUser(currentUser, userId, eventId, roleId) {
    return Axios.post(
      `${UsersAPI}/api/event/assignUser`,
      {
        eventId,
        userId,
        roleId,
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

  removeUser(currentUser, eventId, userId) {
    return Axios.post(
      `${UsersAPI}/api/event/removeUser`,
      {
        eventId,
        userId,
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

  updateDates(
    currentUser,
    eventId,
    start_date,
    c_1_date,
    c_plus_1_date,
    finish_date
  ) {
    return Axios.put(
      `${UsersAPI}/api/event/updateDates`,
      {
        eventId,
        start_date,
        c_1_date,
        c_plus_1_date,
        finish_date,
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

  updateTitle(currentUser, eventId, title) {
    return Axios.put(
      `${UsersAPI}/api/event/updateTitle`,
      {
        eventId,
        title,
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

  delete(currentUser, eventId) {
    return Axios.delete(
      `${UsersAPI}/api/event/delete`,
      {
        eventId,
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

  create(
    currentUser,
    title,
    start_date,
    c_1_date,
    c_plus_1_date,
    finish_date,
    imageBase64
  ) {
    return Axios.post(
      `${UsersAPI}/api/event/create`,
      {
        title,
        start_date,
        c_1_date,
        c_plus_1_date,
        finish_date,
        imageBase64,
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

  uploadImage(currentUser, eventId, imageBase64) {
    return Axios.post(
      `${UsersAPI}/api/event/uploadImage`,
      {
        eventId,
        imageBase64,
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

  deleteImage(currentUser, eventId) {
    return Axios.post(
      `${UsersAPI}/api/event/deleteImage`,
      {
        eventId,
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
}

export default new EventService();
