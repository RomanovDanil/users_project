<template>
  <v-app>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="12" md="8">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text>
              <v-form v-model="isValid">
                <v-text-field
                  label="Email"
                  v-model="email"
                  prepend-icon="alternate_email"
                  :rules="email_rules"
                  required
                  color="light-blue lighten-1"
                >
                </v-text-field>

                <v-text-field
                  label="Password"
                  v-model="password"
                  prepend-icon="lock"
                  :rules="password_rules"
                  :append-icon="
                    registratePasswordVisible ? 'visibility' : 'visibility_off'
                  "
                  @click:append="
                    () =>
                      (registratePasswordVisible = !registratePasswordVisible)
                  "
                  :type="registratePasswordVisible ? 'text' : 'password'"
                  color="light-blue lighten-1"
                  required
                >
                </v-text-field>

                <v-btn
                  color="light-blue lighten-1"
                  @click.native="submitLogin()"
                  :disabled="!isValid"
                  :loading="loading"
                >
                  Login
                </v-btn>
              </v-form>
            </v-card-text>

            <v-col cols="12">
              <div class="text-body text-center">
                <router-link :to="'/registration'">Регистрация</router-link>
              </div>
            </v-col>
          </v-card>

          <v-snackbar
            timeout="6000"
            bottom="bottom"
            color="red lighten-1"
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
//импорт функциональных опций
import authService from "@/services/auth_service";

export default {
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  data: () => ({
    snackbar: false,
    isValid: true,
    loading: false,
    registratePasswordVisible: false,
    password_rules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 5) || "Password must have 5+ characters",
      (v) => /(?=.*[A-Z])/.test(v) || "Must have one uppercase character",
      (v) => /(?=.*\d)/.test(v) || "Must have one number",
      (v) => /([!@$%])/.test(v) || "Must have one special character [!@#$%]",
    ],
    email_rules: [
      (v) => !!v || "Email is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    email: "",
    password: "",
    message: "",
  }),
  methods: {
    async submitLogin() {
      this.loading = true;
      await this.$store
        .dispatch("auth/login", {
          email: this.email,
          password: this.password,
        })
        .then((data) => {
          this.$router.push("/");
        })
        .catch((data) => {
          this.message = data.message;
          this.snackbar = true;
        });
      this.loading = false;
    },
  },
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
