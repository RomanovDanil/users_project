import EventService from "@/services/event_service";

export const event = {
  namespaced: true,
  state: { events: null },
  actions: {
    getUserEvent: async (context, payload) => {
      return await EventService.getUserEvent(
        payload.currentUser,
        payload.userId
      ).then(
        (response) => {
          return Promise.resolve(response.data);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },

    getCurrentEvent: async (context, payload) => {
      return await EventService.getCurrentEvent(
        payload.currentUser,
        payload.eventId
      ).then(
        (response) => {
          return Promise.resolve(response.data);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },

    getAll: async (context, payload) => {
      return await EventService.getAll(payload.currentUser).then(
        (response) => {
          //context.commit("successLoaded", data.events);
          return Promise.resolve(response.data);
        },
        (error) => {
          console.log(error);
          //context.commit("");
          return Promise.reject(error);
        }
      );
    },

    getAllWithDocuments: async (context, payload) => {
      return await EventService.getAllWithDocuments(payload.currentUser).then(
        (response) => {
          //context.commit("successLoaded", data.events);
          return Promise.resolve(response.data);
        },
        (error) => {
          console.log(error);
          //context.commit("");
          return Promise.reject(error);
        }
      );
    },

    updateDates: async (context, payload) => {
      return await EventService.updateDates(
        payload.currentUser,
        payload.eventId,
        payload.start_date,
        payload.c_1_date,
        payload.c_plus_1_date,
        payload.finist_date
      )
        .then((data) => {
          //console.log({ status: "success" });
          //context.commit("successUpdated", data.event, payload.index);
          return Promise.resolve(data);
        })
        .catch((data) => {
          console.log(data);
          return Promise.reject(data);
        });
    },

    updateTitle: async (context, payload) => {
      return await EventService.updateTitle(
        payload.currentUser,
        payload.eventId,
        payload.title
      )
        .then((data) => {
          //console.log({ status: "success" });
          //context.commit("successUpdated", data.event, payload.index);
          return Promise.resolve(data);
        })
        .catch((data) => {
          console.log(data);
          return Promise.reject(data);
        });
    },

    delete: async (context, payload) => {
      return await EventService.delete(payload.currentUser, payload.eventId)
        .then((response) => {
          //console.log({ status: "success", data });
          //context.commit("successDeleted", data.event, payload.index);
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          //console.log(data);
          return Promise.reject(error);
        });
    },

    assign: async (context, payload) => {
      return await EventService.assignUser(
        payload.currentUser,
        payload.userId,
        payload.eventId,
        payload.roleId
      )
        .then((response) => {
          //console.log({ status: "success", data });
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          //console.log({ status: "success", error });
          return Promise.reject(error);
        });
    },

    remove: async (context, payload) => {
      return await EventService.removeUser(
        payload.currentUser,
        payload.eventId,
        payload.userId
      )
        .then((response) => {
          //console.log({ status: "success", data });
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          //console.log({ status: "success", error });
          return Promise.reject(error);
        });
    },

    create: async (context, payload) => {
      return await EventService.create(
        payload.currentUser,
        payload.start_date,
        payload.c_1_date,
        payload.c_plus_1_date,
        payload.finist_date,
        payload.imageBase64
      )
        .then((response) => {
          //console.log({ status: "success", data });
          //context.commit("successCreated", data.event);
          return Promise.resolve({ status: true });
        })
        .catch((error) => {
          console.log(error);
          return Promise.reject(error);
        });
    },

    uploadImage: async (context, payload) => {
      return await EventService.uploadImage(
        payload.currentUser,
        payload.eventId,
        payload.imageBase64
      )
        .then((response) => {
          //console.log({status: true}, response.data);
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          return Promise.reject(error);
        });
    },

    deleteImage: async (context, payload) => {
      return await EventService.deleteImage(
        payload.currentUser,
        payload.eventId
      )
        .then((response) => {
          //console.log({status: true}, response.data);
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          return Promise.reject(error);
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
    successLoaded(events) {
      state.events = events;
    },
  },

  getters: {
    getEvents: (state) => {
      return state.events;
    },
    getEvent: (state) => (index) => {
      return state.events[index];
    },
  },
};
