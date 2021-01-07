<template>
  <v-app>
    <v-progress-linear
      :indeterminate="loadDocumentProgress"
      :active="show"
    ></v-progress-linear>
    <v-container fluid v-if="!loadDocumentProgress">
      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="12" sm="12" md="5">
          <v-row class="mx-0" v-if="document != null && document != undefined">
            <v-col cols="12" md="12" sm="12" xl="12">
              <v-card class="px-3 pt-3 text-left">
                <v-dialog v-model="edit" persistent max-width="600px">
                  <EditDocumentForm
                    v-bind:command="editDocumentFormCommand"
                    v-bind:edit.sync="edit"
                    v-bind:isDialog="true"
                    v-bind:editedItem.sync="document"
                    v-bind:roles="roles"
                    v-bind:event="document.event"
                  />
                </v-dialog>
                <v-card-title>
                  Document information
                  <v-spacer></v-spacer>
                  <v-btn icon @click="update">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-row class="ma-0 pl-5">
                  <v-col cols="12" md="12" xs="12" sm="12" class="">
                    <div class="caption grey--text">Title</div>
                    <div>{{ document.title }}</div>
                  </v-col>
                  <v-col cols="12" md="12" xs="12" sm="12" class="">
                    <div class="caption grey--text">Day</div>
                    <div>{{ document.day.name }}</div>
                  </v-col>
                  <v-col cols="12" md="12" xs="12" sm="12" class="">
                    <div class="caption grey--text">Content</div>
                    <div>{{ document.content }}</div>
                  </v-col>
                  <v-col cols="12" md="12" xs="12" sm="12" class="">
                    <div class="caption grey--text">For</div>
                    <div>
                      {{
                        roles.find((role) => role._id === document.for_role)
                          .name
                      }}
                    </div>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" text @click="remove">
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mx-0" v-else>
            Document not found
          </v-row>
        </v-col>
      </v-row>

      <v-snackbar
        timeout="6000"
        bottom="bottom"
        :color="snackbar_color"
        v-model="snackbar"
      >
        {{ snackbar_message }}
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script>
import EditDocumentForm from "@/components/EditDocumentForm";
export default {
  name: "CurrentDocument",
  components: { EditDocumentForm },
  props: ["documentId"],
  computed: {},
  data: () => ({
    snackbar: false,
    snackbar_message: "",
    snackbar_color: "red lighten-1",
    editDocumentFormCommand: "",
    document: null,
    event: null,
    edit: false,
    loadDocumentProgress: true,
    show: true,
    loading: false,
    imageDisabled: false,
    roles: [],
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
    this.setPageName();
    this.getRoles();
    this.loadCurrentDocument();
  },
  methods: {
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
    async loadCurrentDocument() {
      await this.$store
        .dispatch("document/getById", {
          currentUser: this.currentUser,
          documentId: this.documentId,
        })
        .then((data) => {
          const document = data.document;
          if (this.isEmpty(document)) {
            this.document = document;
          } else {
            this.document = this.getFormatDocument(document);
          }
        })
        .catch((error) => {
          if (error.response)
            this.snackbar_message = error.response.data.message;
          else this.snackbar_message = error.message;
          this.snackbar_color = "red lighten-1";
          this.snackbar = true;
        });
      this.loadDocumentProgress = false;
      this.show = false;
    },

    async remove() {
      this.editDocumentFormCommand = "delete";
      this.edit = true;
    },

    isEmpty(value) {
      return value === null || value === undefined || value === "";
    },

    async update() {
      this.editDocumentFormCommand = "update";
      this.edit = true;
    },

    getFormatDocument(document) {
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
    },

    async setPageName() {
      this.$store.dispatch("pages/setPageName", "Document");
    },
  },
};
</script>
