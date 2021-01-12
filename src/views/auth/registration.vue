<template>
  <v-app>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="12" md="5">
          <v-card class="elevation-12">
            <v-app-bar flat>
              <v-toolbar-title class="title grey--text">
                Registration
              </v-toolbar-title>
            </v-app-bar>

            <v-row class="mx-0 my-0">
              <v-col cols="4">
                <v-img
                  height="250"
                  contain
                  aspect-ratio="1"
                  v-if="imageBase64 == null"
                  :src="`http://localhost:5000/user_images/` + `default.jpg`"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-img
                  height="250"
                  v-else
                  contain
                  aspect-ratio="1"
                  :src="imageBase64.image"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-row class="space-between">
                  <v-col class="mx-0" cols="12" md="6" sm="12">
                    <v-btn color="success" text @click="$refs.file.click()"
                      >upload</v-btn
                    >
                  </v-col>
                  <v-col class="mx-0" cols="12" md="6" sm="12">
                    <v-btn
                      color="error"
                      text
                      @click.native="deleteImage()"
                      v-if="imageBase64 != null"
                      >delete</v-btn
                    >
                  </v-col>
                  <input
                    style="display: none"
                    type="file"
                    id="file"
                    ref="file"
                    name="file"
                    accept="image/jpeg, image/gif, image/png"
                    @change="handleUploadImage"
                  />
                </v-row>
              </v-col>
              <v-col cols="8">
                <v-row class="flex-column mr-0">
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
                        registratePasswordVisible
                          ? 'visibility'
                          : 'visibility_off'
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

                    <v-text-field
                      label="Password confirmation"
                      v-model="passwordConfirmation"
                      prepend-icon="lock"
                      :rules="[
                        password_confirmation_rules.required,
                        passwordConfirmationRule,
                      ]"
                      :append-icon="
                        registratePasswordConfirmationVisible
                          ? 'visibility'
                          : 'visibility_off'
                      "
                      @click:append="
                        () =>
                          (registratePasswordConfirmationVisible = !registratePasswordConfirmationVisible)
                      "
                      :type="
                        registratePasswordConfirmationVisible
                          ? 'text'
                          : 'password'
                      "
                      color="light-blue lighten-1"
                      required
                    >
                    </v-text-field>

                    <v-text-field
                      label="First name"
                      v-model="firstName"
                      prepend-icon="account_box"
                      :rules="[(v) => !!v || 'First name is required']"
                      color="light-blue lighten-1"
                      required
                    >
                    </v-text-field>

                    <v-text-field
                      label="Second name"
                      v-model="secondName"
                      prepend-icon="account_box"
                      :rules="[(v) => !!v || 'Second name is required']"
                      color="light-blue lighten-1"
                      required
                    >
                    </v-text-field>

                    <v-text-field
                      label="Third name"
                      v-model="thirdName"
                      prepend-icon="account_box"
                      :rules="[(v) => !!v || 'Third name is required']"
                      color="light-blue lighten-1"
                      required
                    >
                    </v-text-field>

                    <v-select
                      label="Country"
                      v-model="country"
                      :persistent-hint="countryHint"
                      :hint="`${country.name}, ${country.abbreviatedName}`"
                      :items="countries"
                      :disabled="countryDisable"
                      item-text="name"
                      item-value="_id"
                      return-object
                      prepend-icon="map"
                      :rules="[(v) => !!v || 'Country is required']"
                      color="light-blue lighten-1"
                      required
                    >
                    </v-select>
                  </v-form>
                </v-row>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="12">
                <v-btn
                  color="light-blue lighten-1 white--text"
                  @click.native="Registrate()"
                  :disabled="!isValid"
                  :loading="loading"
                  >Sign Up</v-btn
                >
              </v-col>

              <v-col cols="12">
                <div class="text-body text-center">
                  <router-link :to="'/login'">Sign In</router-link>
                </div>
              </v-col>
            </v-row>
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
import CountryService from "@/services/country_service";
export default {
  name: "Registration",
  computed: {
    passwordConfirmationRule: function() {
      return () =>
        this.password === this.passwordConfirmation || "Passwords must match";
    },
  },
  created() {
    this.loadCountries();
  },
  data: () => ({
    imageBase64: null,
    snackbar: false,
    isValid: true,
    loading: false,
    countries: [],
    registratePasswordVisible: false,
    registratePasswordConfirmationVisible: false,
    email: "",
    password: "",
    passwordConfirmation: "",
    firstName: "",
    secondName: "",
    thirdName: "",
    message: "",
    country: {},
    countryDisable: true,
    countryHint: false,
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
    image_rules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!",
    ],
    password_confirmation_rules: {
      required: (v) => !!v || "Password is required",
    },
  }),
  mounted() {},
  methods: {
    deleteImage() {
      this.imageBase64 = null;
    },
    async handleUploadImage(event) {
      if (event.target.files[0]) {
        const reader = new FileReader();
        const image = event.target.files[0];
        const imageName = event.target.files[0].name;
        reader.onload = (e) => {
          this.imageBase64 = {
            image: e.target.result,
            name: imageName,
          };
        };
        reader.readAsDataURL(image);
        this.$refs.file.value = null;
      }
    },
    async loadCountries() {
      await CountryService.get().then(
        (data) => {
          this.countries = data.countries;
          if (this.countries.length > 0) {
            this.country = this.countries[0];
            this.countryDisable = false;
            this.countryHint = true;
          } else {
            this.message = "The list of countries is empty";
            this.snackbar = true;
          }
        },
        (error) => {
          this.snackbar = true;
          this.message = error.message;
        }
      );
    },
    async Registrate() {
      this.loading = true;
      await this.$store
        .dispatch("auth/registrate", {
          email: this.email,
          password: this.password,
          passwordConfirmation: this.passwordConfirmation,
          firstName: this.firstName,
          secondName: this.secondName,
          thirdName: this.thirdName,
          country: this.country._id,
          imageBase64: this.imageBase64,
        })
        .then(() => {
          this.$router.push("/login");
        })
        .catch((error) => {
          let errorMessage = "";
          if (error.response) {
            errorMessage = error.response.data.message;
            if (error.response.data.errors) {
              errorMessage += ": ";
              const errors = error.response.data.errors;
              for (let i = 0; i < errors.length; i++) {
                errorMessage += errors[i].msg + "; ";
              }
            }
          } else {
            if (error.message) errorMessage = error.message;
            else errorMessage = error;
          }
          this.message = errorMessage;
          this.snackbar = true;
        });
      this.loading = false;
    },
  },
};
</script>
