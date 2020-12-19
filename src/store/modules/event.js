import EventService from "@/services/event_service";

export const event = {
  namespaced: true,
  state: { events: null },
  actions: {
    getCurrentEvent: async (context, user) => {
      return await EventService.getCurrentEvent(user)
        .then((data) => {
          return Promise.resolve(data);
        })
        .catch((data) => {
          return Promise.reject(data);
        });
    },
    getAllEvents: async (context, user) => {
      return await EventService.getAllEvents(user)
        .then((data) => {
          return Promise.resolve(data);
        })
        .catch((data) => {
          console.log(data);
          //context.commit("");
          return Promise.reject(data);
        });
    },
    updateEvent: async (context, user, eventId, index) => {
      return await EventService.updateEvent(user, eventId)
        .then((data) => {
          console.log({ status: "success", data });
          context.commit("successUpdated", data.event, index);
          return Promise.resolve(data.event);
        })
        .catch((data) => {
          console.log(data);
          return Promise.reject(data);
        });
    },
    deleteEvent: async (context, user, eventId, index) => {
      return await EventService.deleteEvent(user, eventId)
        .then((data) => {
          console.log({ status: "success", data });
          context.commit("successDeleted", data.event, index);
          return Promise.resolve(data.event);
        })
        .catch((data) => {
          console.log(data);
          return Promise.reject(data);
        });
    },
    createEvent: async (context, user, eventData) => {
      return await EventService.deleteEvent(user, eventData)
        .then((data) => {
          console.log({ status: "success", data });
          context.commit("successCreated", data.event);
          return Promise.resolve(data.event);
        })
        .catch((data) => {
          console.log(data);
          return Promise.reject(data);
        });
    },
  },

  mutations: {
    successCreated(event) {
      state.events.push(event);
    },
    successUpdated(event, index) {
      try {
        state.events[index] = event;
      } catch (e) {
        console.log(e);
      }
    },
    successDeleted(index) {
      try {
        state.events.splice(index, 1);
      } catch (e) {
        console.log(e);
      }
    },
  },

  getters: {
    getEvents: (state) => {
      return state.events;
    },
  },
};
