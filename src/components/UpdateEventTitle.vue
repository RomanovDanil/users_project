<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Update event's title</span>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row class="ma-0 pa-0" justify="center">
            <v-col cols="12" sm="12" md="12">
              <v-form v-model="isValid" align="center">
                <v-text-field
                  label="Title"
                  v-model="title"
                  prepend-icon="account_box"
                  :rules="[(v) => !!v || 'Event Title is required']"
                  color="light-blue lighten-1"
                  required
                >
                </v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click.native="close()"
          :disabled="loading"
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click.native="update()"
          :disabled="loading"
          :loading="loading"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      timeout="6000"
      bottom="bottom"
      color="red lighten-1"
      v-model="snackbar"
    >
      {{ message }}
    </v-snackbar>
  </v-dialog>
</template>

<script>
export default {
  name: "updateEventTitle",
  props: ["event_title", "event_id"],
  data: () => ({
    dialog: false,
    title: "",
    message: "",
    snackbar: false,
    isValid: false,
    loading: false,
  }),
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.title = this.event_title;
  },
  mounted() {},
  beforeUpdate() {},
  updated() {},
  methods: {
    close() {
      this.dialog = false;
    },
    async update() {
      this.loading = true;
      await this.$store
        .dispatch("event/updateTitle", {
          currentUser: this.currentUser,
          title: this.title,
          eventId: this.event_id,
        })
        .then(() => {
          this.$emit("update:event_title", this.title);
          this.dialog = false;
        })
        .catch((error) => {
          if (error.response) this.message = error.response.data.message;
          else this.message = error.message;
          this.snackbar = true;
        });
      this.loading = false;
    },
  },
};
</script>
