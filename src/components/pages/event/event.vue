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
              <v-col
                cols="12"
                class="text-left"
                v-if="!(documents.length == 0)"
              >
                <v-card-title>
                  Event #1
                </v-card-title>
                <v-data-table
                  :headers="headers"
                  :items="documents"
                  disable-pagination
                  :hide-default-footer="true"
                >
                  <template v-slot:[`item.state`]="{ item }">
                    <v-btn v-if="!item.signed" @click="sign(item.id)"
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
export default {
  name: "Event",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  data: () => ({
    headers: [
      { text: "Day", align: "start", sortable: false, value: "title" },
      { text: "Document", value: "description", sortable: false },
      { text: "State", value: "state", sortable: false },
    ],
    documents: [],
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    console.log(this.currentUser);
  },
  methods: {},
};
</script>
