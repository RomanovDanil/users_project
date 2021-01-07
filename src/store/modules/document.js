import DocumentService from "@/services/document_service";

export const document = {
  namespaced: true,
  actions: {
    getById: async (context, payload) => {
      return await DocumentService.getById(
        payload.currentUser,
        payload.documentId
      ).then(
        (response) => {
          return Promise.resolve(response.data);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },

    getDocumentsByEventId: async (context, payload) => {
      return await DocumentService.getByEventId(
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
      return await DocumentService.getAll(payload.currentUser).then(
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

    update: async (context, payload) => {
      return await DocumentService.update(
        payload.currentUser,
        payload.documentId,
        payload.eventId,
        payload.title,
        payload.day,
        payload.date,
        payload.stage,
        payload.content,
        payload.for_role
      )
        .then((response) => {
          //console.log({ status: "success" });
          return Promise.resolve(response.data);
        })
        .catch((data) => {
          //console.log(data);
          return Promise.reject(data);
        });
    },

    delete: async (context, payload) => {
      return await DocumentService.delete(
        payload.currentUser,
        payload.documentId,
        payload.eventId
      )
        .then((response) => {
          //console.log({ status: "success", data });
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          //console.log(data);
          return Promise.reject(error);
        });
    },

    create: async (context, payload) => {
      return await DocumentService.create(
        payload.currentUser,
        payload.eventId,
        payload.title,
        payload.day,
        payload.date,
        payload.stage,
        payload.content,
        payload.for_role
      )
        .then((response) => {
          //console.log({ status: "success", data });
          //context.commit("successCreated", data.event);
          console.log(response);
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          //console.log(error);
          return Promise.reject(error);
        });
    },

    sign: async (context, payload) => {
      return await DocumentService.sign(
        payload.currentUser,
        payload.documentId,
        payload.userId,
        payload.pin
      )
        .then((response) => {
          return Promise.resolve({ status: true, data: response.data });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },
  },
};
