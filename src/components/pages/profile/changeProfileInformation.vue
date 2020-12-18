<template>
  <v-app>
    <v-container fluid class="pa-0 ma-0">
      <v-row class="ma-0 pa-0">
        <v-col cols="12" sm="12" md="12" class="ma-0 pa-0">
          <v-card>
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Change profile information</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-row class="mx-0" justify="center">
              <v-col cols="12" class="text-left">
                <v-form v-model="isValid" align="center">
                  <v-text-field
                    label="First name"
                    v-model="currentUser.userData.firstName"
                    prepend-icon="account_box"
                    :rules="[(v) => !!v || 'First name is required']"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-text-field>

                  <v-text-field
                    label="Second name"
                    v-model="currentUser.userData.secondName"
                    prepend-icon="account_box"
                    :rules="[(v) => !!v || 'Second name is required']"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-text-field>

                  <v-text-field
                    label="Third name"
                    v-model="currentUser.userData.thirdName"
                    prepend-icon="account_box"
                    :rules="[(v) => !!v || 'Third name is required']"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-text-field>

                  <v-select
                    label="Country"
                    v-model="currentUser.userData.country"
                    :hint="
                      `${currentUser.userData.country.name}, ${currentUser.userData.country.abbreviatedName}`
                    "
                    :items="countries"
                    item-text="name"
                    item-value="_id"
                    return-object
                    prepend-icon="map"
                    :rules="[(v) => !!v || 'Country is required']"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-select>

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
    ...mapGetters(["countries"]),
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.getCountries();
  },
  data: () => ({
    selectedItem: 0,
    isValid: true,
    loading: false,
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    console.log(this.currentUser);
  },
  methods: {
    ...mapActions(["getCountries"]),
    ChangeProfileInformation() {},
  },
};
</script>
