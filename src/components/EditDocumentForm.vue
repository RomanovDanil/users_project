<template>
  <v-row class="flex-column ma-0">
    <v-card class="pa-3" v-if="edit">
      <v-card-title>
        Edit document
        <v-spacer> </v-spacer>
        <v-btn @click="close" v-if="isDialog" :disabled="loadingEdit" icon>
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-col cols="12" md="12" xl="12" sm="12" v-if="command == 'delete'">
        <v-card-title class="justify-center">
          Do you really want to delete the document?
        </v-card-title>
        <v-col cols="12" md="12" sm="12" xl="12">
          <v-btn
            text
            :disabled="!isValid"
            :loading="loadingEdit"
            color="error"
            @click.native="remove()"
          >
            Delete
          </v-btn>
        </v-col>
      </v-col>
      <v-form ref="form" v-else>
        <v-text-field
          label="Title"
          v-model="editedItem.title"
          prepend-icon="article"
          :rules="[(v) => !!v || 'Title is required']"
          required
          color="light-blue lighten-1"
        >
        </v-text-field>

        <v-select
          label="Day"
          :items="days"
          v-model="editedItem.day"
          item-text="name"
          return-object
          prepend-icon="article"
          :rules="[(v) => !!v || 'Day is required']"
          required
          color="light-blue lighten-1"
        >
        </v-select>

        <v-textarea
          name="content"
          label="Content"
          required
          prepend-icon="article"
          v-model="editedItem.content"
        ></v-textarea>

        <v-radio-group
          v-model="editedItem.for_role"
          label="For"
          prepend-icon="supervisor_account"
        >
          <v-radio
            v-for="role in roles"
            :key="role._id"
            :label="role.name"
            :value="role._id"
          ></v-radio>
        </v-radio-group>

        <v-row>
          <v-col cols="12" md="12">
            <v-btn
              text
              :disabled="!isValid"
              :loading="loadingEdit"
              color="primary"
              @click.native="update()"
              v-if="command == 'update'"
            >
              Update
            </v-btn>
            <v-btn
              text
              :disabled="!isValid"
              :loading="loadingEdit"
              color="primary"
              @click.native="create()"
              v-if="command == 'create'"
            >
              Create
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-snackbar
      timeout="3000"
      bottom="bottom"
      :color="snackbar_color"
      v-model="snackbar"
    >
      {{ snackbar_message }}
    </v-snackbar>
  </v-row>
</template>

<script>
export default {
  name: "CreateDocument",
  props: ["event", "edit", "editedItem", "isDialog", "roles", "command"],
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    isValid() {
      return !(
        this.isEmpty(this.editedItem.for_role) ||
        this.isEmpty(this.editedItem.content) ||
        this.isEmpty(this.editedItem.title) ||
        this.isEmpty(this.editedItem.day)
      );
    },
    days() {
      let date_start = new Date(this.event.start_date);
      let date_c_1 = new Date(this.event.c_1_date);
      let date_c_plus_1 = new Date(this.event.c_plus_1_date);
      let date_finish = new Date(this.event.finish_date);

      const initial_stage = (date_c_1 - date_start) / 1000 / 86400;
      const main_stage = (date_c_plus_1 - date_c_1) / 1000 / 86400;
      const final_stage = (date_finish - date_c_plus_1) / 1000 / 86400;

      let arr_dates = [];
      //start stage
      for (let d = 0; d < initial_stage; d++) {
        let date = new Date(date_start);
        date.setDate(date_start.getDate() + d);
        arr_dates.push({
          date: date.toISOString(),
          stage: "initial",
          name: `C-${initial_stage - d}`,
        });
      }
      //main stage
      for (let d = 0; d < main_stage; d++) {
        let date = new Date(date_c_1);
        date.setDate(date_c_1.getDate() + d);
        arr_dates.push({
          date: date.toISOString(),
          stage: "main",
          name: `C${d + 1}`,
        });
      }
      //final stage
      for (let d = 0; d <= final_stage; d++) {
        let date = new Date(date_c_plus_1);
        date.setDate(date_c_plus_1.getDate() + d);
        arr_dates.push({
          date: date.toISOString(),
          stage: "final",
          name: `C+${d + 1}`,
        });
      }
      return arr_dates;
    },
  },
  data: () => ({
    snackbar: false,
    snackbar_message: "",
    snackbar_color: "red lighten-1",
    loadingEdit: false,
  }),
  methods: {
    isEmpty(val) {
      return val == null || val == undefined || val == "";
    },

    async create() {
      this.loadingEdit = true;
      await this.$store
        .dispatch("document/create", {
          currentUser: this.currentUser,
          eventId: this.event._id,
          title: this.editedItem.title,
          for_role: this.editedItem.for_role,
          content: this.editedItem.content,
          day: this.editedItem.day.name,
          date: this.editedItem.day.date,
          stage: this.editedItem.day.stage,
        })
        .then((data) => {
          const document = data.document;
          document.for_role = this.roles.find(
            (role) => role._id === document.for_role
          );
          if (
            this.event.documents != null &&
            this.event.documents != undefined
          ) {
            this.event.documents.push(document);
            this.$emit("update:event", this.event);
          }
          this.$emit("update:editedItem", this.editedItem);
          this.snackbar_color = "success";
          this.snackbar_message = "Document success created";
          this.snackbar = true;
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
      this.loadingEdit = false;
    },

    async update() {
      this.loadingEdit = true;
      await this.$store
        .dispatch("document/update", {
          currentUser: this.currentUser,
          documentId: this.editedItem.documentId,
          eventId: this.event._id,
          title: this.editedItem.title,
          for_role: this.editedItem.for_role,
          content: this.editedItem.content,
          day: this.editedItem.day.name,
          date: this.editedItem.day.date,
          stage: this.editedItem.day.stage,
        })
        .then((data) => {
          let document = data.document;
          if (
            this.event.documents != null &&
            this.event.documents != undefined
          ) {
            let index = this.event.documents.findIndex(
              (doc) => doc._id === this.editedItem.documentId
            );
            this.event.documents[index] = document;
            this.$emit("update:event", this.event);
          }
          this.$emit("update:editedItem", this.editedItem);
          this.snackbar_color = "success";
          this.snackbar_message = "Document success updated";
          this.snackbar = true;
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
      this.loadingEdit = false;
    },

    async remove() {
      this.loadingEdit = true;
      await this.$store
        .dispatch("document/delete", {
          currentUser: this.currentUser,
          documentId: this.editedItem.documentId,
          eventId: this.event._id,
        })
        .then((data) => {
          if (
            this.event.documents != null &&
            this.event.documents != undefined
          ) {
            let index = this.event.documents.findIndex(
              (doc) => doc._id === this.editedItem.documentId
            );
            this.event.documents.splice(index, 1);
            this.$emit("update:event", this.event);
          }
          this.$emit("update:editedItem", null);
          this.snackbar_color = "success";
          this.snackbar_message = "Document success deleted";
          this.snackbar = true;
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
      this.loadingEdit = false;
    },

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    close() {
      this.$emit("update:edit", false);
    },
  },
};
</script>
