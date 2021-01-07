<template>
  <v-app>
    <v-progress-linear
      :active="documentLoading"
      :indeterminate="documentLoading"
      absolute
      bottom
      color="deep-purple accent-4"
    ></v-progress-linear>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="12" md="6" class="ma-0">
          <v-row class="mx-0" v-if="!documentLoading">
            <v-col
              cols="12"
              md="12"
              sm="12"
              xl="12"
              class="text-left"
              v-if="document != null"
            >
              <v-card class="px-3 pt-3 text-left">
                <v-card-title>
                  Document information
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="success"
                    v-if="
                      document.readers.find(
                        (reader) => reader == currentUser.id
                      ) == null
                    "
                    @click.native="sign(document._id)"
                    >Sign</v-btn
                  >
                  <v-chip class="success--text" color="white" v-else>
                    SIGNED
                  </v-chip>
                  <SignDocument
                    v-bind:dialog.sync="signDocumentDialog"
                    v-bind:document.sync="document"
                    v-bind:currentUser="currentUser"
                    v-bind:userId="currentUser.id"
                  />
                </v-card-title>
                <v-divider></v-divider>
                <v-row class="ma-0 px-5">
                  <v-col cols="12" md="12" xs="12" sm="12">
                    <div class="caption grey--text">Title</div>
                    <div>{{ document.title }}</div>
                  </v-col>
                  <v-col cols="12" md="12" xs="12" sm="12">
                    <div class="caption grey--text">Day</div>
                    <div>{{ document.day }}</div>
                  </v-col>
                  <v-col cols="12" md="12" xs="12" sm="12">
                    <div class="caption grey--text">Content</div>
                    <div>{{ document.content }}</div>
                  </v-col>
                  <v-col cols="12" md="12" xs="12" sm="12">
                    <div class="caption grey--text">For</div>
                    <div>{{ document.for_role.name }}</div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" class="text-left" v-else>
              <v-card-text>Document not found</v-card-text>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      timeout="3000"
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
  name: "UserDocument",
  components: { SignDocument },
  props: ["documentId"],
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
    this.loadDocument();
  },
  data: () => ({
    loading: false,
    documentLoading: true,
    successLoaded: false,
    document: null,
    snackbar_color: "red lighten-1",
    snackbar_message: "",
    snackbar: false,
    signDocumentDialog: false,
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    async setPageName() {
      this.$store.dispatch("pages/setPageName", "Event\\Document");
    },
    sign() {
      this.signDocumentDialog = true;
    },
    async loadDocument() {
      await this.$store
        .dispatch("document/getById", {
          currentUser: this.currentUser,
          documentId: this.documentId,
        })
        .then((data) => {
          this.document = data.document;
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
          this.successLoaded = false;
          this.snackbar = true;
        });
      this.documentLoading = false;
    },
  },
};
</script>
