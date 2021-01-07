<template>
  <v-app>
    <v-container fluid>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        bottom
        color="deep-purple accent-4"
      ></v-progress-linear>
      <v-row justify="center">
        <v-col cols="12" sm="12" md="6" class="ma-0">
          <v-row class="mx-0">
            <v-col cols="12">
              <v-select
                :items="events"
                v-model="event"
                label="Event"
                item-text="title"
                return-object
              />
            </v-col>
          </v-row>
          <v-row class="mx-0">
            <v-col cols="12">
              <EditDocumentForm
                v-bind:event.sync="event"
                v-bind:command="command"
                v-bind:edit.sync="edit"
                v-bind:isDialog="false"
                v-bind:editedItem.sync="editedItem"
                v-bind:roles="roles"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import EditDocumentForm from "@/components/EditDocumentForm";
export default {
  name: "CreateDocument",
  components: { EditDocumentForm },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    loading() {
      return this.loadedRoles && this.loadedEvents;
    },
    edit() {
      return this.event != null;
    },
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.setPageName();
    this.loadEvents();
    this.loadRoles();
  },
  data: () => ({
    event: null,
    events: [],
    command: "create",
    type: "",
    editedItem: {
      title: "",
      day: {
        name: "",
        data: "",
        stage: "",
      },
      content: "",
      for_role: null,
    },
    roles: [],
    loadedRoles: false,
    loadedEvents: false,
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    async setPageName() {
      this.$store.dispatch("pages/setPageName", "Create document");
    },
    async loadEvents() {
      await this.$store
        .dispatch("event/getAll", { currentUser: this.currentUser })
        .then((data) => {
          this.events = data.events;
        });
      this.loadedEvents = true;
    },
    async loadRoles() {
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
  },
};
</script>
