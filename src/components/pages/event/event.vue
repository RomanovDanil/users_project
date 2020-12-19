<template>
  <v-app>
    <v-container fluid class="pa-0 ma-0">
      <v-row class="ma-0 pa-0">
        <v-col cols="12" sm="12" md="12" class="ma-0 pa-0">
          <v-card>
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Event</v-toolbar-title>
            </v-toolbar>
            <v-row class="mx-0">
              <v-col cols="12" class="text-left" v-if="event != null">
                <v-card-title>
                  {{ event.event_title }}
                </v-card-title>
                <v-card-subtitle>
                  Start date: {{ event.start_date }}
                  <p>C1 date: {{ event.c_1_date }}</p>
                  <p>C+1 date: {{ event.c_plus_1_date }}</p>
                  <p>Finish date: {{ event.finish_date }}</p></v-card-subtitle
                >

                <v-data-table
                  :headers="headers"
                  :items="event.documents"
                  disable-pagination
                  :hide-default-footer="true"
                >
                  <template v-slot:[`document.state`]="{ document }">
                    <v-btn v-if="!document.signed" @click="sign(document._id)"
                      >Sign</v-btn
                    >
                    <v-card-text v-else>Signed</v-card-text>
                  </template>
                </v-data-table>
              </v-col>
              <v-col cols="12" class="text-left" v-else>
                <v-card-text>Event not found for you)</v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import EventService from "@/services/event_service";
export default {
  name: "Event",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    console.log(this.currentUser);

    this.$store
      .dispatch("event/getCurrentEvent", this.currentUser)
      .then((event) => {
        this.event = event;
      })
      .catch((data) => {
        console.log(data);
      });
  },
  data: () => ({
    headers: [
      { text: "Day", align: "start", sortable: false, value: "title" },
      { text: "Document", value: "description", sortable: false },
      { text: "State", value: "state", sortable: false },
    ],
    event: null,
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    console.log(this.currentUser);
  },
  methods: {
    sign(documentId) {},
  },
};
</script>
