import Axios from "axios";

//адрес api
const UsersAPI = `http://${window.location.hostname}:5000`;

class EventService {
  getCurrentEvent(user) {
    return Axios.get(`${UsersAPI}/api/event/getByUserId`, {
      headers: { Authorization: "Bearer " + user.token },
      _id: user._id,
    });
  }

  getAllEvents(user) {
    return Axios.get(`${UsersAPI}/api/event/getAllEvents`, {
      headers: { Authorization: "Bearer " + user.token },
    });
  }

  updateEvent(user, eventId, eventData) {
    return Axios.put(`${UsersAPI}/api/event/updateEvent`, {
      headers: { Authorization: "Bearer " + user.token },
      _id: eventId,
      eventData,
    });
  }

  deleteEvent(user, eventId) {
    return Axios.delete(`${UsersAPI}/api/event/deleteEvent`, {
      headers: { Authorization: "Bearer " + user.token },
      _id: eventId,
    });
  }

  createEvent(user) {
    return Axios.post(`${UsersAPI}/api/event/deleteEvent`, {
      headers: { Authorization: "Bearer " + user.token },
      eventData,
    });
  }
}

export default new EventService();
