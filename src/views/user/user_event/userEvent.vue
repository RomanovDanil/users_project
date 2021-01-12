<template>
  <v-app>
    <v-progress-linear
      :active="eventLoading"
      :indeterminate="eventLoading"
      absolute
      color="deep-purple accent-4"
    ></v-progress-linear>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="12" md="6" class="ma-0">
          <v-row class="mx-0" v-if="!eventLoading">
            <v-col
              cols="12"
              md="12"
              sm="12"
              xl="12"
              class="text-left"
              v-if="event != null"
            >
              <v-card>
                <v-card-title>
                  {{ event.title }}
                </v-card-title>
                <v-row class="ma-0">
                  <v-col cols="12" md="3" xs="12" sm="12" class="">
                    <div class="caption grey--text">Start Date</div>
                    <div>{{ formatDate(event.start_date) }}</div>
                  </v-col>
                  <v-col cols="12" md="3" xs="12" sm="12" class="">
                    <div class="caption grey--text">C1 Date</div>
                    <div>{{ formatDate(event.c_1_date) }}</div>
                  </v-col>
                  <v-col cols="12" md="3" xs="12" sm="12" class="">
                    <div class="caption grey--text">C+1 Date</div>
                    <div>{{ formatDate(event.c_plus_1_date) }}</div>
                  </v-col>
                  <v-col cols="12" md="3" xs="12" sm="12" class="">
                    <div class="caption grey--text">Finish Date</div>
                    <div>{{ formatDate(event.finish_date) }}</div>
                  </v-col>
                </v-row>

                <v-data-table
                  :headers="headers"
                  :items="sortedDocuments"
                  disable-pagination
                  :hide-default-footer="true"
                  :loading="eventLoading"
                  loading-text="Loading... Please wait"
                >
                  <template v-slot:[`item.document`]="{ item }">
                    <router-link
                      :to="{
                        name: 'UserEvent.Document',
                        params: { documentId: item._id },
                      }"
                    >
                      {{ item.title }}
                    </router-link>
                  </template>
                  <template v-slot:[`item.state`]="{ item }">
                    <v-btn
                      text
                      color="success"
                      v-if="
                        item.readers.find(
                          (reader) => reader == currentUser.id
                        ) == null
                      "
                      @click="sign(item)"
                      >Sign</v-btn
                    >
                    <v-chip class="success--text" color="white" v-else>
                      SIGNED
                    </v-chip>
                  </template>
                  <template v-slot:top>
                    <SignDocument
                      v-bind:dialog.sync="signDocumentDialog"
                      v-bind:documents.sync="event.documents"
                      v-bind:document.sync="selectedDocument"
                      v-bind:currentUser="currentUser"
                      v-bind:userId="currentUser.id"
                    />
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
            <v-col cols="12" class="text-left" v-else>
              <v-card-text>Event not found for you)</v-card-text>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      timeout="6000"
      bottom="bottom"
      :color="snackbar_color"
      v-model="snackbar"
    >
      {{ snackbar_message }}
    </v-snackbar>
  </v-app>
</template>

<script>
import SignDocument from "@/components/SignDocument";
export default {
  name: "UserEvent",
  components: { SignDocument },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    loadedSuccess() {
      return event == null || event == undefined;
    },
    sortedDocuments() {
      if (event == null) return [];
      return this.event.documents.slice().sort((a, b) => {
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
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.setPageName();
    this.loadCurrentEvent();
  },
  data: () => ({
    headers: [
      {
        text: "Day",
        align: "start",
        width: "1%",
        sortable: false,
        value: "day",
      },
      { text: "Document", value: "document", sortable: false },
      {
        text: "State",
        width: "1%",
        value: "state",
        sortable: false,
      },
    ],
    event: null,
    eventLoading: false,
    snackbar: false,
    selectedDocument: null,
    snackbar_color: "red lighten-1",
    snackbar_message: "",
    loading: true,
    signDocumentDialog: false,
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    sign(document) {
      this.selectedDocument = document;
      this.signDocumentDialog = true;
    },
    async loadCurrentEvent() {
      this.eventLoading = true;
      await this.$store
        .dispatch("event/getUserEvent", {
          currentUser: this.currentUser,
          userId: this.currentUser.id,
        })
        .then((data) => {
          this.event = data.event;
        })
        .catch((error) => {
          if (error.response.data) {
            this.snackbar_message = error.response.data.message;
          } else if (error.message) {
            this.snackbar_message = error.message;
          } else {
            this.snackbar_message = error;
          }
          this.snackbar_color = "red lighten-1";
          this.snackbar = true;
        });
      this.eventLoading = false;
    },
    async setPageName() {
      this.$store.dispatch("pages/setPageName", "Event");
    },
    formatDate(date) {
      if (!date) return "";
      let arr_date = date.split("T")[0].split("-");
      return `${arr_date[2]}/${arr_date[1]}/${arr_date[0]}`;
    },
  },
};
</script>
