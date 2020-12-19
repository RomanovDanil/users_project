<template>
  <v-app>
    <v-container fluid class="pa-0 ma-0">
      <v-row class="ma-0 pa-0">
        <v-col cols="12" sm="12" md="12" class="ma-0 pa-0">
          <v-card>
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Update login information</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
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
                    v-model="repeat_newPassword"
                    prepend-icon="lock"
                    :rules="[
                      repeat_new_password_rules.required,
                      newPasswordConfirmationRule,
                    ]"
                    :append-icon="
                      repeatNewPasswordVisible ? 'visibility' : 'visibility_off'
                    "
                    @click:append="
                      () =>
                        (repeatNewPasswordVisible = !repeatNewPasswordVisible)
                    "
                    :type="repeatNewPasswordVisible ? 'text' : 'password'"
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
        this.password === this.repeatPassword || "Passwords must match";
    },
  },
  data: () => ({
    selectedItem: 0,
    isValid: true,
    loading: false,
    currentPassword: "",
    newPassword: "",
    repeat_newPassword: "",
    repeatNewPasswordVisible: false,
    newPasswordVisible: false,
    currentPasswordVisible: false,
    new_password_rules: [
      (v) => !!v || "New password is required",
      (v) => (v && v.length >= 5) || "New password must have 5+ characters",
      (v) => /(?=.*\d)/.test(v) || "Must have one number",
      (v) => /([!@$%])/.test(v) || "Must have one special character [!@#$%]",
    ],
    repeat_new_password_rules: {
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
          repeat_newPassword: this.repeat_newPassword,
        })
        .then(() => {})
        .catch((data) => {
          console.log(data);
        });
      this.loading = false;
    },
  },
};
</script>
