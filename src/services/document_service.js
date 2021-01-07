import Axios from "axios";

//адрес api
const UsersAPI = `http://${window.location.hostname}:5000`;

class DocumentService {
  getById(currentUser, documentId) {
    return Axios.get(`${UsersAPI}/api/document/getById`, {
      headers: { Authorization: "Bearer " + currentUser.token },
      params: { documentId: documentId },
    });
  }

  getByEventId(currentUser, eventId) {
    return Axios.get(`${UsersAPI}/api/document/getByEventId`, {
      headers: { Authorization: "Bearer " + currentUser.token },
      eventId: eventId,
    });
  }

  getAll(currentUser) {
    return Axios.get(`${UsersAPI}/api/document/getAll`, {
      headers: { Authorization: "Bearer " + currentUser.token },
    });
  }

  update(
    currentUser,
    documentId,
    eventId,
    title,
    day,
    date,
    stage,
    content,
    for_role
  ) {
    return Axios.put(
      `${UsersAPI}/api/document/update`,
      {
        documentId: documentId,
        eventId: eventId,
        title: title,
        day: day,
        date: date,
        stage: stage,
        content: content,
        for_role: for_role,
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

  delete(currentUser, documentId, eventId) {
    return Axios.delete(`${UsersAPI}/api/document/delete`, {
      data: {
        documentId,
        eventId,
      },
      headers: {
        Authorization: "Bearer " + currentUser.token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  create(currentUser, eventId, title, day, date, stage, content, for_role) {
    return Axios.post(
      `${UsersAPI}/api/document/create`,
      {
        eventId,
        title,
        day,
        date,
        stage,
        content,
        for_role,
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

  sign(currentUser, documentId, userId, pin) {
    return Axios.post(
      `${UsersAPI}/api/document/sign`,
      {
        documentId,
        userId,
        pin,
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

export default new DocumentService();
