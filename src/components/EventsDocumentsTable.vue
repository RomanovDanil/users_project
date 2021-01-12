<template>
  <v-row class="mx-0">
    <v-col cols="12" md="12" sm="12" xs="12" v-if="loadedSuccess">
      <v-card>
        <!-- <v-card-title> </v-card-title> -->
        <v-data-table
          dense
          :headers="headers"
          :items="events"
          :loading="eventsLoading"
          loading-text="Loading... Please wait"
          item-key="title"
          class="elevation-1"
          :hide-default-footer="false"
          show-expand
        >
          <template v-slot:top>
            <v-dialog v-model="edit" persistent max-width="600px">
              <EditDocumentForm
                v-bind:event.sync="event"
                v-bind:command="editDocumentFormCommand"
                v-bind:edit.sync="edit"
                v-bind:isDialog="true"
                v-bind:editedItem.sync="editedItem"
                v-bind:roles="roles"
              />
            </v-dialog>
          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td
              :colspan="headers.length"
              v-if="item.documents.length > 0"
              class="pt-5 pb-5"
            >
              <v-row
                v-for="(document, index) in sortDocuments(item.documents)"
                :key="document._id"
                class="text-left"
                @click="handleRowClick(document, index)"
              >
                <v-col cols="12" md="8" xs="12" sm="12">
                  <div class="caption grey--text">Document</div>
                  <div>{{ document.title }}</div>
                </v-col>
                <v-col cols="12" md="2" xs="12" sm="12">
                  <div class="caption grey--text">Day</div>
                  <div>{{ document.day }}</div>
                </v-col>
                <v-col cols="12" md="2" xs="12" sm="12"
                  ><div class="caption grey--text">For</div>
                  <div>{{ document.for_role.name }}</div>
                </v-col>
                <!-- <v-col cols="12" md="2" xs="0" sm="0">
                  <v-btn icon @click.native="update(document, index, item)">
                    <v-icon> edit </v-icon>
                  </v-btn>
                  <v-btn icon @click.native="remove(document, index, item)">
                    <v-icon>
                      delete
                    </v-icon>
                  </v-btn>
                </v-col> -->
              </v-row>
            </td>
          </template>
          <template v-slot:[`item.event`]="{ item }">
            {{ item.title }}
          </template>
          <!-- <template v-slot:[`item.participants`]="{ item }">
            {{ item.participants.length }}
          </template> -->
          <template v-slot:[`item.action`]="{ item }">
            <v-btn text color="success" @click.native="create(item)">
              Create document
            </v-btn>
          </template>
        </v-data-table>
        <v-snackbar
          timeout="6000"
          bottom="bottom"
          :color="snackbar_color"
          v-model="snackbar"
        >
          {{ snackbar_message }}
        </v-snackbar>
      </v-card>
    </v-col>
    <v-col v-else>
      <v-card-title>
        Event's documents not found
      </v-card-title>
    </v-col>
  </v-row>
</template>

<script>
import EventService from "@/services/event_service";
import EditDocumentForm from "./EditDocumentForm.vue";
export default {
  components: { EditDocumentForm },
  name: "EventsDocuments",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    headers() {
      return [
        {
          text: "Event",
          align: "start",
          value: "event",
          class: "title",
          sortable: false,
        },
        // {
        //   text: "Participants",
        //   value: "participants",
        //   class: "title",
        //   sortable: false,
        // },
        {
          text: "",
          value: "action",
          class: "title",
          align: "end",
          sortable: false,
        },
      ];
    },
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.getRoles();
    this.loadEventsDocuments();
  },
  data: () => ({
    events: [],
    roles: [],
    snackbar: false,
    snackbar_message: "",
    snackbar_color: "",
    loadedSuccess: true,
    eventsLoading: false,
    edit: false,
    event: null,
    editedItem: {},
    editDocumentFormCommand: "",
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    async loadEventsDocuments() {
      this.eventsLoading = true;
      await this.$store
        .dispatch("event/getAllWithDocuments", {
          currentUser: this.currentUser,
        })
        .then((data) => {
          if (data.events.length == 0) {
            this.loadedSuccess = false;
          } else {
            this.events = data.events;
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.data.message)
              this.message = error.response.data.message;
          } else {
            this.snackbar_color = "red lighten-1";
            this.snackbar_message = error.message;
          }
          this.loadedSuccess = false;
          this.snackbar = true;
        });
      this.eventsLoading = false;
    },

    update(document, index, event) {
      this.editDocumentFormCommand = "update";
      this.event = event;
      this.editedItem = this.getFormatDocument(document);
      this.edit = true;
    },

    remove(document, index, event) {
      this.editDocumentFormCommand = "delete";
      this.editedItem = this.getFormatDocument(document);
      this.event = event;
      this.edit = true;
    },

    create(event) {
      this.editDocumentFormCommand = "create";
      this.event = event;
      this.editedItem = this.getFormatDocument(null);
      this.edit = true;
    },

    isEmpty(value) {
      return value === null || value === undefined || value === "";
    },

    async getRoles() {
      await this.$store
        .dispatch("role/get", { currentUser: this.currentUser })
        .then((data) => {
          this.roles = data.roles;
        })
        .catch((error) => {
          this.snackbar_color = "red lighten-1";
          if (error.response) {
            if (error.response.data.message)
              this.snackbar_message = error.response.data.message;
          } else {
            if (error.message) this.snackbar_message = error.message;
            else this.snackbar_message = error;
          }
          this.snackbar = true;
        });
    },

    sortDocuments: function(documents) {
      return documents.slice().sort((a, b) => {
        if (a.stage !== b.stage) {
          if (a.stage === "final") {
            return 1;
          }
          if (a.stage === "main" && b.stage === "initial") {
            return 1;
          } else if (a.stage === "main" && b.stage === "final") {
            return -1;
          }
          if (a.stage === "initial") {
            return -1;
          }
        } else {
          const a_arr = a.day.split("");
          const b_arr = b.day.split("");
          if (a.stage === "final") {
            return a[2] > b[2] ? -1 : 1;
          }
          if (a.stage === "main") {
            return a[1] > b[1] ? -1 : 1;
          }
          if (a.stage === "initial") {
            return a[2] <= b[2] ? -1 : 1;
          }
          return -1;
        }
      });
    },

    getFormatDocument(document) {
      if (this.isEmpty(document)) {
        return {
          title: "",
          day: {
            name: "",
            date: "",
          },
          content: "",
          for_role: "",
        };
      } else {
        return {
          documentId: document._id,
          title: document.title,
          day: {
            name: document.day,
            date: document.date,
            stage: document.stage,
          },
          content: document.content,
          for_role: document.for_role._id,
          event: document.event,
        };
      }
    },

    handleRowClick(document, index) {
      this.$router.push({
        name: "Documents.Document",
        params: { documentId: document._id },
      });
    },
  },
};
</script>
