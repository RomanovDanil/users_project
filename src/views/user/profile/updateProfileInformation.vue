<template>
  <v-app>
    <v-container fluid>
      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="12" sm="12" md="5">
          <v-card>
            <v-row class="mx-0" justify="center">
              <v-col cols="12" class="text-left">
                <v-form v-model="isValid" align="center">
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
                    :hint="
                      `${currentUser.userData.country.name}, ${currentUser.userData.country.abbreviatedName}`
                    "
                    :items="countries"
                    item-text="name"
                    return-object
                    prepend-icon="map"
                    :rules="[(v) => !!v || 'Country is required']"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-select>

                  <v-textarea
                    label="About"
                    v-model="about"
                    prepend-icon="account_box"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-textarea>
                  <v-btn
                    color="light-blue lighten-2"
                    @click.native="ChangeProfileInformation()"
                    :disabled="!isValid"
                    :loading="loading"
                  >
                    Change
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
  name: "ChangeProfileInformation",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.country = this.currentUser.userData.country;
    this.firstName = this.currentUser.userData.firstName;
    this.secondName = this.currentUser.userData.secondName;
    this.thirdName = this.currentUser.userData.thirdName;
    this.about = this.currentUser.userData.about;

    this.$store.dispatch("pages/setPageName", "Update profile information");
    this.loadCountries();
  },
  data: () => ({
    selectedItem: 0,
    isValid: true,
    loading: false,
    color: "red lighten-1",
    message: "",
    snackbar: false,
    firstName: "",
    secondName: "",
    thirdName: "",
    country: null,
    countries: [],
    about: "",
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    console.log(this.currentUser);
  },
  methods: {
    async loadCountries() {
      this.$store
        .dispatch("country/getCountries")
        .then((countries) => {
          this.countries = countries;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.message) {
            let messageError = error.response.data.message;
            if (error.response.data.errors) {
              const errors = error.response.data.errors;
              messageError += ": ";
              for (let i = 0; i < errors.length; i++)
                messageError += "\n" + errors[i] + "; ";
            }
            this.message = messageError;
          } else {
            this.message = error.message;
          }
          this.color = "red lighten-1";
          this.snackbar = true;
        });
    },
    async ChangeProfileInformation() {
      this.loading = true;
      await this.$store
        .dispatch("user/updateUserData", {
          currentUser: this.currentUser,
          firstName: this.firstName,
          secondName: this.secondName,
          thirdName: this.thirdName,
          about: this.about,
          countryId: this.country._id,
        })
        .then(() => {
          this.message = "User's data was been updated";
          this.color = "success";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.message) {
            let messageError = error.response.data.message;
            if (error.response.data.errors) {
              const errors = error.response.data.errors;
              messageError += ": ";
              for (let i = 0; i < errors.length; i++)
                messageError += "\n" + errors[i] + "; ";
            }
            this.message = messageError;
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
