<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        Sign document
        <v-spacer> </v-spacer>
        <v-btn @click="close" :disabled="loadingSign" icon>
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-col cols="12" md="12" xl="12" sm="12">
        <v-form v-model="isValid">
          <v-text-field
            label="PIN"
            v-model="pin"
            prepend-icon="lock"
            :rules="pin_rules"
            :type="pinVisible ? 'text' : 'password'"
            :append-icon="pinVisible ? 'visibility' : 'visibility_off'"
            @click:append="() => (pinVisible = !pinVisible)"
            :maxlength="4"
            color="light-blue lighten-1"
            required
          ></v-text-field>
          <v-btn text @click="sign" :disabled="!isValid" :loading="loadingSign"
            >Sign</v-btn
          >
        </v-form>
      </v-col>
    </v-card>
    <v-snackbar
      timeout="6000"
      bottom="bottom"
      :color="snackbar_color"
      v-model="snackbar"
    >
      {{ snackbar_message }}
    </v-snackbar>
  </v-dialog>
</template>

<script>
export default {
  props: ["dialog", "document", "userId", "currentUser", "documents"],
  created() {},
  data: () => ({
    pin: "",
    snackbar: false,
    snackbar_message: "",
    snackbar_color: "red lighten-1",
    loadingSign: false,
    pinVisible: false,
    isValid: false,
    pin_rules: [
      (v) => !!v || "PIN is required",
      (v) => (v && v.length == 4) || "PIN must have 4 numbers",
      (v) => /([0-9])/.test(v) || "PIN must have only numbers",
    ],
  }),
  methods: {
    async sign() {
      this.loadingSign = true;
      await this.$store
        .dispatch("document/sign", {
          currentUser: this.currentUser,
          documentId: this.document._id,
          userId: this.userId,
          pin: this.pin,
        })
        .then((data) => {
          this.snackbar_message = "Document successfully signed";
          this.snackbar_color = "success";
          this.snackbar = true;
          this.document.readers.push(this.userId);
          this.$emit("update:document", this.document);
          if (this.documents != null || this.documents != undefined) {
            const documentId = this.documents.findIndex(
              (doc) => doc._id == this.document._id
            );
            this.documents[documentId] = this.document;
            this.$emit("update:documents", this.documents);
          }
          this.close();
        })
        .catch((error) => {
          if (error.response) {
            this.snackbar_message = error.response.data.message;
          } else {
            if (error.message) {
              this.snackbar_message = error.message;
            } else {
              this.snackbar_message = error;
            }
          }
          this.snackbar_color = "red lighten-1";
          this.snackbar = true;
        });
      this.loadingSign = false;
    },
    close() {
      this.$emit("update:dialog", false);
    },
  },
};
</script>
