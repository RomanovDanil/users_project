<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="12" md="6" class="ma-0">
          <v-row class="mx-0">
            <v-col cols="12" class="text-left" v-if="loadedSuccess">
              <v-card-title>
                Event's list
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="create">Create</v-btn>
              </v-card-title>
              <v-data-table
                dense
                :headers="headers"
                :items="events"
                :loading="eventsLoading"
                loading-text="Loading... Please wait"
                item-key="title"
                class="elevation-1"
                :hide-default-footer="false"
                @click:row="handleRowClick"
              >
                <template v-slot:[`item.dates`]="{ item }">
                  {{ formatDate(item.start_date) }} -
                  {{ formatDate(item.finish_date) }}
                </template>
                <template v-slot:[`item.participants_count`]="{ item }">
                  {{ item.participants.length }}
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" class="text-left" v-else>
              <v-card-text>Events not found</v-card-text>
            </v-col>
          </v-row>

          <v-snackbar
            timeout="6000"
            bottom="bottom"
            color="red lighten-1"
            v-model="snackbar"
          >
            {{ message }}
          </v-snackbar>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import EventService from "@/services/event_service";
export default {
  name: "BrowseEvents",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }

    this.setPageName();
    this.loadEvents();
  },
  data: () => ({
    headers: [
      {
        text: "Title",
        align: "start",
        class: "title",
        sortable: true,
        value: "title",
      },
      {
        text: "Dates",
        value: "dates",
        sortable: true,
        class: "title",
      },
      {
        text: "Participants",
        value: "participants_count",
        sortable: true,
        class: "title",
      },
    ],
    events: [],
    eventsLoading: false,
    snackbar: false,
    message: "",
    loadedSuccess: true,
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return "";

      const [year, month, day] = date.split("T")[0].split("-");
      return `${day}/${month}/${year}`;
    },
    async loadEvents() {
      this.eventsLoading = true;
      await this.$store
        .dispatch("event/getAll", { currentUser: this.currentUser })
        .then((data) => {
          this.events = data.events;
          if (this.events.length == 0) this.loadedSuccess = false;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.data.message)
              this.message = error.response.data.message;
          } else {
            this.message = error.message;
          }
          this.loadedSuccess = false;
          this.snackbar = true;
        });
      this.eventsLoading = false;
    },
    async setPageName() {
      this.$store.dispatch("pages/setPageName", "Events");
    },
    handleRowClick(value) {
      //console.log(value._id);
      this.$router.push({
        name: "Events.Event",
        params: { eventId: value._id },
      });
    },
    async create() {
      this.$router.push({
        name: "Events.Create",
      });
    },
  },
};
</script>
