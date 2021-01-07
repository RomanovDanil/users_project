<template>
  <v-app>
    <v-container fluid>
      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="12" sm="12" md="5">
          <v-card>
            <v-row class="mx-0" justify="center">
              <v-col cols="12" md="12" class="text-left">
                <v-form v-model="isValid" align="center">
                  <v-text-field
                    label="Current password"
                    v-model="currentPassword"
                    prepend-icon="lock"
                    :rules="[(v) => !!v || 'Current password is required']"
                    :append-icon="
                      currentPasswordVisible ? 'visibility' : 'visibility_off'
                    "
                    @click:append="
                      () => (currentPasswordVisible = !currentPasswordVisible)
                    "
                    :type="currentPasswordVisible ? 'text' : 'password'"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-text-field>

                  <v-text-field
                    label="New password"
                    v-model="newPassword"
                    prepend-icon="lock"
                    :rules="new_password_rules"
                    :append-icon="
                      newPasswordVisible ? 'visibility' : 'visibility_off'
                    "
                    @click:append="
                      () => (newPasswordVisible = !newPasswordVisible)
                    "
                    :type="newPasswordVisible ? 'text' : 'password'"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-text-field>

                  <v-text-field
                    label="Repeat new password"
                    v-model="newPasswordConfirmation"
                    prepend-icon="lock"
                    :rules="[
                      new_password_confirmation_rules.required,
                      newPasswordConfirmationRule,
                    ]"
                    :append-icon="
                      newPasswordConfirmationVisible
                        ? 'visibility'
                        : 'visibility_off'
                    "
                    @click:append="
                      () =>
                        (newPasswordConfirmationVisible = !newPasswordConfirmationVisible)
                    "
                    :type="newPasswordConfirmationVisible ? 'text' : 'password'"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-text-field>

                  <v-btn
                    color="light-blue lighten-2"
                    @click.native="UpdatePassword()"
                    :disabled="!isValid"
                    :loading="loading"
                  >
                    Update
                  </v-btn>
                </v-form>
              </v-col>
            </v-row>
          </v-card>
          <v-snackbar
            timeout="6000"
            bottom="bottom"
            :color="color"
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
import { mapGetters, mapActions } from "vuex";
export default {
  name: "UpdatePassword",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    newPasswordConfirmationRule: function() {
      return () =>
        this.newPassword === this.newPasswordConfirmation ||
        "Passwords must match";
    },
  },
  created() {
    this.$store.dispatch("pages/setPageName", "Update login information");
  },
  data: () => ({
    snackbar: false,
    message: "",
    color: "red lighten-1",
    selectedItem: 0,
    isValid: true,
    loading: false,
    currentPassword: "",
    currentPasswordVisible: false,
    newPassword: "",
    newPasswordVisible: false,
    newPasswordConfirmation: "",
    newPasswordConfirmationVisible: false,
    new_password_rules: [
      (v) => !!v || "New password is required",
      (v) => (v && v.length >= 5) || "New password must have 5+ characters",
      (v) => /(?=.*\d)/.test(v) || "Must have one number",
      (v) => /([!@$%])/.test(v) || "Must have one special character [!@#$%]",
    ],
    new_password_confirmation_rules: {
      required: (v) => !!v || "Password is required",
    },
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    async UpdatePassword() {
      this.loading = true;
      await this.$store
        .dispatch("user/updatePassword", {
          user: this.currentUser,
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          newPasswordConfirmation: this.newPasswordConfirmation,
        })
        .then(() => {
          this.message = "Password was been updated";
          this.color = "success";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            this.message = error.response.data.message;
          } else {
            this.message = error.message;
          }
          this.color = "red lighten-1";
          this.snackbar = true;
        });
      this.loading = false;
    },
  },
};
</script>
